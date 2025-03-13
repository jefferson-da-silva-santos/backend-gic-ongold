import puppeteer from "puppeteer";
import { getHtmlReport } from "../utils/htmlReport.js";

class ReportService {
    async generatePdf(data) {
        console.log('Teste 9090');
      try {
        const html = getHtmlReport(data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return pdfBuffer;
      } catch (error) {
        console.log(error);
      }
    }
}

export default ReportService;