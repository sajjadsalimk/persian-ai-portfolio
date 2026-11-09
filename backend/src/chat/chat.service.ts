import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { SupabaseService } from "../supabase/supabase.service";
import type { ChatUser } from "./chat.types";

type Conversation = {
  id: string;
  user_id: string;
  user_email: string;
  created_at: string;
  updated_at: string;
};

@Injectable()
export class ChatService {
  constructor(private readonly supabase: SupabaseService) {}

  private get client() {
    if (!this.supabase.client) throw new ServiceUnavailableException("اتصال پایگاه داده تنظیم نشده است.");
    return this.supabase.client;
  }

  async listConversations(user: ChatUser) {
    const query = this.client
      .from("chat_conversations")
      .select("id,user_id,user_email,created_at,updated_at")
      .order("updated_at", { ascending: false });
    const { data, error } = user.isAdmin ? await query : await query.eq("user_id", user.id);
    if (error) throw new ServiceUnavailableException("گفت‌وگوها بارگذاری نشدند.");
    return { conversations: (data ?? []) as Conversation[] };
  }

  async createOrGetConversation(user: ChatUser) {
    if (user.isAdmin) throw new ForbiddenException("حساب مدیر نمی‌تواند گفت‌وگوی جدید بسازد.");
    const client = this.client;
    const { data: existing, error: lookupError } = await client
      .from("chat_conversations")
      .select("id,user_id,user_email,created_at,updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    if (lookupError) throw new ServiceUnavailableException("گفت‌وگو بارگذاری نشد.");
    if (existing) return { conversation: existing as Conversation };

    const { data, error } = await client
      .from("chat_conversations")
      .insert({ user_id: user.id, user_email: user.email })
      .select("id,user_id,user_email,created_at,updated_at")
      .single();
    if (!error && data) return { conversation: data as Conversation };

    // A second request from the same user may create the conversation at the same time.
    if (error?.code === "23505") {
      const { data: raced } = await client
        .from("chat_conversations")
        .select("id,user_id,user_email,created_at,updated_at")
        .eq("user_id", user.id)
        .single();
      if (raced) return { conversation: raced as Conversation };
    }
    throw new ServiceUnavailableException("ساخت گفت‌وگو انجام نشد.");
  }

  async listMessages(conversationId: string, user: ChatUser) {
    await this.assertCanAccess(conversationId, user);
    const { data, error } = await this.client
      .from("chat_messages")
      .select("id,conversation_id,sender_id,sender_role,body,created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new ServiceUnavailableException("پیام‌ها بارگذاری نشدند.");
    return { messages: (data ?? []).reverse() };
  }

  async sendMessage(conversationId: string, body: string, user: ChatUser) {
    await this.assertCanAccess(conversationId, user);
    const client = this.client;
    const message = body.trim();
    if (!message) throw new ForbiddenException("متن پیام خالی است.");

    const { data, error } = await client
      .from("chat_messages")
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        sender_role: user.isAdmin ? "admin" : "user",
        body: message,
      })
      .select("id,conversation_id,sender_id,sender_role,body,created_at")
      .single();
    if (error || !data) throw new ServiceUnavailableException("ارسال پیام انجام نشد.");

    const { error: updateError } = await client
      .from("chat_conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
    if (updateError) throw new ServiceUnavailableException("پیام ارسال شد، اما به‌روزرسانی گفت‌وگو انجام نشد.");
    return { message: data };
  }

  private async assertCanAccess(conversationId: string, user: ChatUser) {
    const { data, error } = await this.client
      .from("chat_conversations")
      .select("id,user_id")
      .eq("id", conversationId)
      .maybeSingle();
    if (error) throw new ServiceUnavailableException("گفت‌وگو بررسی نشد.");
    if (!data) throw new NotFoundException("گفت‌وگو پیدا نشد.");
    if (!user.isAdmin && data.user_id !== user.id) throw new ForbiddenException("به این گفت‌وگو دسترسی نداری.");
  }
}
