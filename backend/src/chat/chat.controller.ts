import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ChatAuthGuard } from "./chat-auth.guard";
import { ChatService } from "./chat.service";
import type { ChatRequest } from "./chat.types";
import { SendChatMessageDto } from "./dto/send-chat-message.dto";

@Controller("chat")
@UseGuards(ChatAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("me")
  profile(@Req() request: ChatRequest) {
    return { id: request.chatUser.id, email: request.chatUser.email, isAdmin: request.chatUser.isAdmin };
  }

  @Get("conversations")
  conversations(@Req() request: ChatRequest) {
    return this.chatService.listConversations(request.chatUser);
  }

  @Post("conversations")
  createConversation(@Req() request: ChatRequest) {
    return this.chatService.createOrGetConversation(request.chatUser);
  }

  @Get("conversations/:id/messages")
  messages(@Param("id", ParseUUIDPipe) id: string, @Req() request: ChatRequest) {
    return this.chatService.listMessages(id, request.chatUser);
  }

  @Post("conversations/:id/messages")
  sendMessage(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: SendChatMessageDto,
    @Req() request: ChatRequest,
  ) {
    return this.chatService.sendMessage(id, dto.body, request.chatUser);
  }
}
