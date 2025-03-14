import puppeteer from "puppeteer";
import { getHtmlReport } from "../utils/htmlReport.js";
import logger from "../utils/logger.js";

class ReportService {
    async generatePdf(data) {
      try {
        const html = getHtmlReport(data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return pdfBuffer;
      } catch (error) {
        logger.error(`Erro no serviço ao gerar PDF: ${error.message}`);
        throw new Error(`Erro no serviço ao gerar PDF: ${error.message}`);
      }
    }
}

export default ReportService;