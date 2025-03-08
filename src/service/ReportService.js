import puppeteer from "puppeteer";
import { getHtmlReport } from "../utils/htmlReport.js";

class ReportService {
    static async generatePdf(data) {
        const html = getHtmlReport(data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        return pdfBuffer;
    }
}

export default ReportService;