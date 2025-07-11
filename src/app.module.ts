import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PdfModule } from "./infrastructure/pdf/pdf.module";
import { ConfigurationModule } from "./config/config.module";

@Module({
  imports: [ConfigurationModule, PdfModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
