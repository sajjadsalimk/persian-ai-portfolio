import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { CreateContactDto } from "./dto/create-contact.dto";
import { SupabaseService } from "../supabase/supabase.service";

@Injectable()
export class ContactsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async accept(contact: CreateContactDto) {
    const client = this.supabaseService.client;
    if (!client) {
      throw new ServiceUnavailableException("اتصال پایگاه داده تنظیم نشده است.");
    }

    const { error } = await client.from("contact_messages").insert({
      name: contact.name.trim(),
      email: contact.email.trim().toLowerCase(),
      subject: contact.subject.trim(),
      message: contact.message.trim(),
    });

    if (error) {
      throw new ServiceUnavailableException("ذخیرهٔ پیام انجام نشد؛ اتصال پایگاه داده را بررسی کنید.");
    }

    return {
      accepted: true,
      message: "پیام شما با موفقیت ذخیره شد.",
      receivedAt: new Date().toISOString(),
    };
  }
}
