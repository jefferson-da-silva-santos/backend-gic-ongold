import ItemService from "../service/ItemService.js";
import ReportService from "../service/ReportService.js";
import logger from "../utils/logger.js";

export const getReport = async (req, res, next) => {
  try {
    const item = new ItemService();
    const result = await item.getReport();
    if (!result) { 
      logger.error('Nenhum dado do relatório encontrado.');
      throw new Error('Nenhum dado do relatório encontrado.');
    };
    const report = new ReportService();
    const pdfBuffer = await report.generatePdf(result);
    res.setHeader("Content-Disposition", 'attachment; filename="relatorio.pdf"');
    res.setHeader("Content-Type", "application/pdf");
    res.end(pdfBuffer);
  } catch (error) {
    logger.error('Erro no controlador ao tentar gerar o relatório:', error.message);
    next(error);
  }
};

