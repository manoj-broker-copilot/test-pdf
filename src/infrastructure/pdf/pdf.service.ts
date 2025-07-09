import { Injectable } from "@nestjs/common";
import { chromium } from "playwright";
import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";

@Injectable()
export class PdfService {
  async generateTestPDF(): Promise<Buffer> {
    const htmlPath = path.join(__dirname, "templates", "preliminary.hbs"); // Path to your HTML file
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");

    const chromiumPath = path.join(
      __dirname,
      "..",
      "playwright",
      ".cache",
      "ms-playwright",
      "chromium-1179",
      "chrome-linux",
      "chrome"
    );
     const browser = await chromium.launch({
      headless: true,
      executablePath: chromiumPath,
      args: ["--no-sandbox"],
    });
    // const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; background-color: #000000;">
          <span>My Custom Header</span>
        </div>`,
      footerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; background-color: #000000;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      margin: { top: "60px", bottom: "60px" },
    });

    await browser.close();
    return Buffer.from(pdfUint8Array);
  }

  async generatePreliminaryPDF(): Promise<Buffer> {
    const htmlPath = path.join(__dirname, "templates", "preliminary.hbs"); // Path to your HTML file
    const htmlContent = fs.readFileSync(htmlPath, "utf-8");

    const chromiumPath = path.join(
      __dirname,
      "..",
      "playwright",
      ".cache",
      "ms-playwright",
      "chromium-1179",
      "chrome-linux",
      "chrome"
    );

    const browser = await chromium.launch({
      headless: true,
      executablePath: chromiumPath,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "load" });

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; background-color: #000000;">
          <span>My Custom Header</span>
        </div>`,
      footerTemplate: `
        <div style="font-size: 12px; text-align: center; width: 100%; background-color: #000000;">
          <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      margin: { top: "60px", bottom: "60px" },
    });

    await browser.close();
    return Buffer.from(pdfUint8Array);
  }

  async generateBrokerNote(data: any): Promise<Buffer> {
    const htmlPath = path.join(__dirname, "templates", "broker-note.hbs"); // Path to your HTML file
    const rawHtml = fs.readFileSync(htmlPath, "utf-8");

    // 🔸 Register helper before compiling
    handlebars.registerHelper("inc", function (value: number) {
      return value + 1;
    });

    handlebars.registerHelper(
      "default",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (value, fallback) => value || fallback
    );

    handlebars.registerHelper("formatCurrency", function (value: number) {
      if (typeof value !== "number") return value;
      return value.toLocaleString("en-AU"); // or 'en-US' or any locale
    });

    handlebars.registerHelper("eachKeyValue", function (context, options) {
      let result = "";
      for (const key in context) {
        if (Object.prototype.hasOwnProperty.call(context, key)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          result += options.fn({ key, value: context[key] });
        }
      }
      return result;
    });

    handlebars.registerHelper("eq", function (a, b) {
      return a === b;
    });

    const template = handlebars.compile(rawHtml);
    const renderedHtml = template(data);

    // const browser = await puppeteer.launch({
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // });

    const browser = await chromium.launch({
      headless: true, // explicitly set
      args: ["--no-sandbox"], // important for App Service
    });
    const page = await browser.newPage();

    // await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
    await page.setContent(renderedHtml, { waitUntil: "load" });

    const pdfUint8Array = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: { top: "50px", bottom: "50px" },
    });

    await browser.close();
    return Buffer.from(pdfUint8Array);
  }
}
