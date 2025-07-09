// src/config/configuration.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);
  constructor(private readonly configService: ConfigService) {}

  get appSecret(): string {
    return this.configService.getOrThrow<string>("APP_SECRET");
  }

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV", "development");
  }

  get isProduction(): boolean {
    /**
     * TODO: enable verifying environment
     */
    return this.nodeEnv === "production";
  }

  get dbHost(): string {
    return this.configService.getOrThrow<string>("DATABASE_HOST");
  }

  get dbPort(): number {
    return this.configService.getOrThrow<number>("DATABASE_PORT") || 5432;
  }

  get dbUser(): string {
    return this.configService.getOrThrow<string>("DATABASE_USER");
  }

  get dbPassword(): string {
    return this.configService.getOrThrow<string>("DATABASE_PASS");
  }

  get dbName(): string {
    return this.configService.getOrThrow<string>("DATABASE_NAME");
  }

  get redisURL(): string {
    return this.configService.getOrThrow<string>("REDIS_URL");
  }

  get redisHost(): string {
    return this.configService.getOrThrow<string>("REDIS_HOST");
  }

  get redisPort(): number {
    return (
      parseInt(this.configService.getOrThrow<string>("REDIS_PORT")) || 6379
    );
  }

  get redisPassword(): string {
    return this.configService.getOrThrow<string>("REDIS_PASSWORD");
  }
  get redisSSL(): boolean {
    const redisSSL = this.configService.getOrThrow<string>("REDIS_SSL");
    return redisSSL.toLowerCase() === "true";
  }
}
