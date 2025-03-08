import ItemService from "../service/ItemService.js";
import ReportService from "../service/ReportService.js";

export const getReport = async (req, res, next) => {
  try {
    const result = await ItemService.getReport();
    if (!result) throw new Error("Nenhum dado encontrado.");
    
    const pdfBuffer = await ReportService.generatePdf(result);

    res.setHeader("Content-Disposition", 'attachment; filename="relatorio.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdfBuffer);
  } catch (error) {
    next(error);
  }
};

