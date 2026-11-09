import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ContactsModule } from "./contacts/contacts.module";
import { ChatModule } from "./chat/chat.module";
import { HealthModule } from "./health/health.module";
import { SupabaseModule } from "./supabase/supabase.module";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SupabaseModule, HealthModule, ContactsModule, ChatModule],
})
export class AppModule {}
