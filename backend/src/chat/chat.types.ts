export type ChatUser = {
  id: string;
  email: string;
  isAdmin: boolean;
};

export type ChatRequest = Request & { chatUser: ChatUser };
import type { Request } from "express";
