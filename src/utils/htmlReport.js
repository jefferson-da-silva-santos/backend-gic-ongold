import { convertCurrency } from "./convertCurrency.js";

export const getHtmlReport = (data) => {
  return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
     body {
          font-family: Arial, sans-serif;
            padding: 20px;
        }
        .container {
          border-radius: 5px;
          padding-bottom: 2rem;
        }

        h1 {
          font-weight: 600;
          text-align: center;
          text-transform: uppercase;
        }

        table {
          min-width: 100%;
          padding: 10px;
          border-collapse: collapse;
          text-align: center;
          background-color: #bdd7ee;
        }

        thead {
          background-color: #305496;
          color: white;
        }
        th {
          font-weight: 400;
          text-transform: uppercase;
          padding: 5px;
          border: 1px solid rgb(134, 207, 255);
        }
        td {
          border: 1px solid #aecde9;
        }
        tr:nth-child(2n) {
          background-color: #ddebf7;
        }

        h2 {
          text-transform: uppercase;
          margin-top: 3rem;
          font-weight: 600;
        }

        span {
          color: #305496;
          font-weight: 600;
          font-size: 1.2rem;
          font-family: monospace;
        }

        ul {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

    </style>
</head>
<body>
    <h1>Relatório Geral do Gestor de Itens Comerciais</h1>
     <p>Aqui estão os dez itens mais caros registrados no sistema. Esses itens possuem alto valor devido às suas características exclusivas, demanda no mercado. Confira:</p>

    <table>
      <thead>
        <tr>
          <th>ID do Item</th>
          <th>Nome do Item</th>
          <th>Preço Unitário</th>
        </tr>
      </thead>
      <tbody>
        ${data.tenMostExpensiveItems.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.descricao}</td>
            <td>${convertCurrency(item.valor_unitario)}</td>
          </tr>`).join('')}
      </tbody>
    </table>

    <h2> Relatório Geral de Estoque</h2>
    <ul>
      <li>Quantidade total de itens cadastrados (incluindo os excluídos): <span>${data.totalItems} itens</span></li>
      <li>Valor total estimado do estoque: <span>${convertCurrency(data.valueStock)}</span></li>
      <li>Quantidade de itens ativos disponíveis: <span>${data.totalItemsAvailable} itens</span></li>
      <li>Quantidade de itens movidos para a lixeira e aguardando exclusão definitiva ou a restauração: <span>${data.totalItemsDeleteds} itens</span></li>
    </ul>
</body>
</html>`;
};