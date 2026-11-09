import { Module } from "@nestjs/common";
import { ChatAuthGuard } from "./chat-auth.guard";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
  controllers: [ChatController],
  providers: [ChatAuthGuard, ChatService],
})
export class ChatModule {}
