import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "persian-ai-portfolio-api",
      timestamp: new Date().toISOString(),
    };
  }
}
