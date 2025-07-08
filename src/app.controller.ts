import { Controller, Get, Post, Req, Body, Res } from "@nestjs/common";
import { Response } from 'express';
import { AppService } from "./app.service";
import { ApiOperation } from "@nestjs/swagger";
import { ApiBody } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("pdf")
  async generateNotePdf(@Res() res: Response): Promise<any> {
    const pdfBuffer = await this.appService.generatePdf();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=generated.pdf",
      "Content-Length": pdfBuffer.length,
    });

    res.send(pdfBuffer);
  }

  @Post("webhook")
  @ApiOperation({ summary: "Test webhook" })
  @ApiBody({ type: Object })
  getTestWebhook(@Body() body: any) {
    console.log("Body:", body);
    return {
      message: "Test webhook received",
      body: body,
    };
  }
}
