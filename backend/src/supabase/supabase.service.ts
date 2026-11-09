import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable()
export class SupabaseService {
  readonly client: SupabaseClient | null;

  constructor(config: ConfigService) {
    const url = config.get<string>("SUPABASE_URL");
    const secretKey =
      config.get<string>("SUPABASE_SECRET_KEY") ?? config.get<string>("SUPABASE_SERVICE_ROLE_KEY");

    this.client = url && secretKey
      ? createClient(url, secretKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
          },
        })
      : null;
  }
}
