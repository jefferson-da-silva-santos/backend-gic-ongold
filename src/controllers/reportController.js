import ItemService from "../service/ItemService.js";
import ReportService from "../service/ReportService.js";

export const getReport = async (req, res, next) => {
  try {
    const item = new ItemService();
    const result = await item.getReport();
    if (!result) throw new Error("Nenhum dado encontrado.");
    const report = new ReportService();
    const pdfBuffer = await report.generatePdf(result);
    res.setHeader("Content-Disposition", 'attachment; filename="relatorio.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

