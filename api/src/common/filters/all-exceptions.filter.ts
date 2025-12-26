import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(AllExceptionsFilter.name);

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest()

        const isHttpException = exception instanceof HttpException;

        const status = isHttpException ? exception.message : HttpStatus.INTERNAL_SERVER_ERROR

        const message = isHttpException ? exception.message : 'Internal Server Error'

        this.logger.error(
            JSON.stringify({
                method: request.method,
                url: request.url,
                status,
                message
            })
        )

        response.status(status).json({
            statusCode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString()
        })

    }
}