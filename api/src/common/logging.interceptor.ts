import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor{
    private readonly logger = new Logger('HTTP');

    intercept(context:ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest()
        const {method, url, body} = request;
        const startedAt = Date.now();

        return next.handle().pipe(
            tap(()=>{
                const duration = Date.now() - startedAt;

                this.logger.log(
                    JSON.stringify({
                        method,
                        url,
                        duration
                    })
                )
            })
        )


    }
}