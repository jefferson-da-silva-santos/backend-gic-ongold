import ItemService from "../service/ItemService.js";
import ReportService from "../service/ReportService.js";

export const getReport = async (req, res, next) => {
  try {
    console.log('Entrou aquiiiiii');
    const item = new ItemService();
    const result = item.getReport();
    if (!result) throw new Error("Nenhum dado encontrado.");
    
    const report = new ReportService();
    const pdfBuffer = await report.generatePdf(result);
    console.log('hjdjdfaf');
    res.setHeader("Content-Disposition", 'attachment; filename="relatorio.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

