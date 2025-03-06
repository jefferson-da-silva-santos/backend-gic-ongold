# BackEnd do GIC (Gestor de Itens Comerciais) 🚀

Bem-vindo ao **BackEnd do GIC**! Essa API foi desenvolvida para gerenciar o cadastro, edição e exclusão de itens comerciais com informações tributárias, seguindo boas práticas de desenvolvimento e organização eficiente.

---
## 📌 Tecnologias Utilizadas

- **Node.js** + **Express**
- **Sequelize** + **MySQL**
- **Validação com Joi**
- **Log com Winston e Morgan**
- **Arquitetura baseada nos princípios SOLID**

---
## 📁 Estrutura do Projeto

```
📂 backend-gic/
│
├── 📦 node_modules/
├── 📜 .gitignore
├── 🚀 app.js
├── 📜 LICENSE
├── 📦 package.json
├── 📖 README.md
│
└── 📁 src/  
    │
    ├── ⚙️ config/  
    │   ├── 🛠️ config.js
    │
    ├── 🗄️ database/  
    │   ├── 🔌 connection.js
    │   ├── 🗃️ shema.sql
    │
    ├── 🛡️ middleware/  
    │   ├── 🚨 errorHandler.js
    │
    ├── 🎮 controllers/  
    │   ├── 📜 cfopController.js
    │   ├── 📜 cstController.js
    │   ├── 📜 itemsController.js
    │   ├── 📜 ncmController.js
    │
    ├── 🏛️ models/  
    │   ├── 🏷️ cfop.js
    │   ├── 🏷️ csticms.js
    │   ├── 🏷️ index.js
    │   ├── 🏷️ item.js
    │   ├── 🏷️ logs.js
    │   ├── 🏷️ ncm.js
    │
    ├── 🛤️ router/  
    │   ├── 🚏 cfopRouter.js
    │   ├── 🚏 cstRouter.js
    │   ├── 🚏 itemRouter.js
    │   ├── 🚏 ncmRouter.js
    │
    ├── ⚡ service/  
    │   ├── 🔧 Cfop.js
    │   ├── 🔧 Cst.js
    │   ├── 🔧 Item.js
    │   ├── 🔧 Ncm.js
    │
    ├── 🛠️ utils/  
    │   ├── 📢 logger.js
    │   ├── 📑 shemasValidate.js
    │
    ├── 📜 log/  # Logs de aplicação
    │   ├── 📄 combined.log

```

---
## ⚙️ Configuração do Ambiente

Antes de iniciar a API, configure suas variáveis de ambiente criando um arquivo `.env` na raiz do projeto com os seguintes valores:

```js
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_DIALECT=mysql
DB_PORT=3306
```

Instale as dependências:

```sh
npm install
```
ou se preferir:
```sh
yarn
```

Para rodar o servidor:
```sh
npm run app
```
ou se preferir:
```sh
yarn app
```

---
## 🌐 Rotas da API

### 📌 **GET** - Buscar todos os registros
- `GET /api/gic/items?page=1&limit=2` → Retorna todos os itens cadastrados páginados + custo total.
- `GET /api/gic/csts` → Retorna todas as CSTs cadastradas.
- `GET /api/gic/ncms` → Retorna todos os NCMs cadastrados.
- `GET /api/gic/cfops` → Retorna todos os CFOPs cadastrados.

### 🔎 **GET** - Buscar itens filtrados
Busca itens por um campo específico:
```
GET /api/gic/items/filter?field={field_name}&value={field_value}
```
### 🔎 **GET** - Buscar itens por pesquisa de descrição
Busca itens pela descrição (ou parte dela), e retorna com paginação
```
GET /api/gic/items/search?description={desciption_text}&page={value_page}&limit={value_limit}
```

### 🔎 **GET** - Buscar itens da lixeira
Busca todos os itens que foram movidos para a lixeira
```
GET /api/gic/items/deleted
```

### ➕ **POST** - Inserir novo item
```
POST /api/gic/items
```
**Body:**
```json
{
    "valor_unitario": 99.90,
    "descricao": "Produto de Teste",
    "taxa_icms_entrada": 18.5,
    "taxa_icms_saida": 14.9,
    "comissao": 10,
    "ncm": "01011010",
    "cst": "010",
    "cfop": 1100,
    "ean": "1234562890123",
    "excluido": 0
}
```

### 🔎 **PATCH** - Restaurar um Item da Lixeira
Restaura um item especifico da lixeira
```
PATCH /api/gic/items/:id/restore
```

### 🔎 **PATCH** - Restaurar Todos os Itens da Lixeira
Restaura todos os itens da lixeira
```
PATCH /api/gic/items/restore
```


### ✏️ **PUT** - Atualizar item
```
PUT /api/gic/items/:id
```
**Body:**
```json
{
    "valor_unitario": 99.90,
    "descricao": "Maquina",
    "taxa_icms_entrada": 18.5,
    "taxa_icms_saida": 14.9,
    "comissao": 10,
    "ncm": "01011010",
    "cst": "010",
    "cfop": 1100,
    "ean": "1234562122013",
    "excluido": false
}
```

### 🗑️ **DELETE** - Remover um item para Lixeira
```
DELETE /api/gic/items/:id
```
### 🗑️ **DELETE** - Excluir permanentemente os itens da Lixeira
```
DELETE /api/gic/items/permanent
```
### 🗑️ **DELETE** - Excluir permanentemente um item da Lixeira
```
DELETE /api/gic/items/:id/permanent/
```

## 📜 Licença

Este projeto está sob a licença **ISC**.

## 📝 Autor

Projeto desenvolvido por **Jefferson Santos Dev** ✨

[🔗 Repositório no GitHub](https://github.com/jefferson-da-silva-santos/backend-gic)
