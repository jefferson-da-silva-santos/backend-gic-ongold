````js
import { Op } from "sequelize";
import Ncm from "../models/ncm.js";

async function buscarNcmPorCodigo(parteDoCodigo) {
  try {
    const resultados = await Ncm.findAll({
      where: {
        codncm: {
          [Op.like]: `%${parteDoCodigo}%`, // Busca qualquer valor que contenha parteDoCodigo
        },
      },
    });

    console.log(resultados);
    return resultados;
  } catch (error) {
    console.error("Erro ao buscar NCM:", error);
    throw error;
  }
}

// Exemplo de uso
buscarNcmPorCodigo("0101");
```
