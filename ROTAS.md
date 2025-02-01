# Rotas da API
Rotas da minha API
## GET
Rota para pegar um objeto com todos os items do banco + total custo
- **GET**
- ```http://localhost:3000/api/gic/items```

Rota para pegar um objeto com todos os items do banco porém com uma filtragem
- field: nome da coluna da tabela
- value: valor da coluna passada
- **GET**
- ```http://localhost:3000/api/gic/items/{field}/{value}```
## POST

Rota para inserir um novo item
- **POST**
- ```http://localhost:3000/api/gic/items```
- Content-Type: application/json
- Req Body: 
 ```json 
   {
      "valor_unitario": 99.90,
      "descricao": "Produto de Teste",
      "taxa_icms_entrada": 18.5,
      "taxa_icms_saida": 14.9,
      "comissao":10,
      "ncm": "01011010",
      "cst": "010",
      "cfop": 1100,
      "ean": "1234562890123",
      "excluido":0
  }
  ```
