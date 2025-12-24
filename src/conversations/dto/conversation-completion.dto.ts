export class MessageDto {
    role: "USER" | "AGENT";
    content: string;
}

export class ConversationCompletionDto {
    helpDeskId: number;
    projectName: string;
    messages: MessageDto[];
}

