import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { SupabaseService } from "../supabase/supabase.service";
import type { ChatRequest } from "./chat.types";

@Injectable()
export class ChatAuthGuard implements CanActivate {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<ChatRequest>();
    const authorization = request.headers.authorization;
    const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
    const client = this.supabase.client;

    if (!client) throw new ServiceUnavailableException("تنظیمات دیتابیس کامل نیست.");
    if (!token) throw new UnauthorizedException("برای ادامه وارد حساب کاربری شو.");

    const { data, error } = await client.auth.getUser(token);
    if (error || !data.user) throw new UnauthorizedException("نشست کاربری معتبر نیست؛ دوباره وارد شو.");

    const email = data.user.email?.toLowerCase() ?? "";
    const adminEmail = this.config.get<string>("CHAT_ADMIN_EMAIL")?.trim().toLowerCase();
    request.chatUser = {
      id: data.user.id,
      email,
      isAdmin: Boolean(adminEmail && email && adminEmail === email),
    };
    return true;
  }
}
