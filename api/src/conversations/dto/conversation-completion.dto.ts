import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class MessageDto {
    @IsString()
    role: "USER" | "AGENT";

    @IsString()
    content: string;

    @IsOptional()
    @IsEnum(['answer','clarification','escalate'])
    intent?: 'answer' | 'clarification' | 'escalate'

}

export class ConversationCompletionDto {

    @IsNumber()
    helpDeskId: number;

    @IsString()
    projectName: string;
    
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=> MessageDto)
    messages: MessageDto[];
}

