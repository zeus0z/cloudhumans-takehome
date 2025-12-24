import { Type } from "class-transformer";
import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";

export class MessageDto {
    @IsString()
    role: "USER" | "AGENT";

    @IsString()
    content: string;
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

