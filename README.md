# 🚀 BackEnd do GIC (Gestor de Itens Comerciais)

Bem-vindo ao **BackEnd do GIC**! Esta API foi desenvolvida para gerenciar o cadastro, edição e exclusão de itens comerciais com informações tributárias, seguindo boas práticas de desenvolvimento e organização eficiente.

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
    │   ├── 🗃️ dump/
    │       ├── 📤 db_gic_routines.sql
    │       ├── 📤 db_gic_tb_cfops.sql
    │       ├── 📤 db_gic_tb_csticms.sql
    │       ├── 📤 db_gic_tb_itens.sql
    │       ├── 📤 db_gic_tb_logs.sql
    │       ├── 📤 db_gic_tb_ncm.sql
    │
    ├── 🔄 dtos/  
    │   ├── ➡️ itemDTO.js
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
    │   ├── 🚏 reportRouter.js
    │
    ├── 💾 repository/ 
    │   ├── 📤 CfopRepository.js
    │   ├── 📤 CstRepository.js
    │   ├── 📤 ItemRepository.js
    │   ├── 📤 NcmRepository.js 
    │
    ├── ⚡ service/  
    │   ├── 🔧 CfopService.js
    │   ├── 🔧 CstService.js
    │   ├── 🔧 ItemService.js
    │   ├── 🔧 NcmService.js
    │   ├── 🔧 ReportService.js
    │
    ├── 🛠️ utils/  
    │   ├── 🪙 convertCurrency.js
    │   ├── 📝 htmlReport.js
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

Ou, se preferir:

```sh
yarn
```

Para rodar o servidor:

```sh
npm run app
```

Ou, se preferir:

```sh
yarn app
```

---

## 🌐 Rotas da API

### 📌 **GET** - Buscar todos os registros
- **`GET /api/gic/items?page=1&limit=2`** → Retorna todos os itens cadastrados paginados + custo total.
- **`GET /api/gic/csts`** → Retorna todas as CSTs cadastradas.
- **`GET /api/gic/ncms`** → Retorna todos os NCMs cadastrados.
- **`GET /api/gic/cfops`** → Retorna todos os CFOPs cadastrados.
- **`GET /api/gic/report`** → Retorna um relatório em PDF do sistema.

### 🔎 **GET** - Buscar itens filtrados
Busca itens por um campo específico:

```sh
GET /api/gic/items/filter?field={field_name}&value={field_value}
```

### 🔎 **GET** - Buscar itens por pesquisa de descrição
Busca itens pela descrição (ou parte dela), e retorna com paginação:

```sh
GET /api/gic/items/search?description={description_text}&page={value_page}&limit={value_limit}
```

### 🔎 **GET** - Buscar itens da lixeira
Busca todos os itens que foram movidos para a lixeira:

```sh
GET /api/gic/items/deleted
```

### ➕ **POST** - Inserir novo item
```sh
POST /api/gic/items
```

**Body:**
```json
{
    "valor_unitario": 99.90,
    "descricao": "Produto Inserido 2",
    "taxa_icms_entrada": 18.5,
    "taxa_icms_saida": 14.9,
    "comissao": 10,
    "ncm_id": 3,
    "cst_id": 4,
    "cfop_id": 3,
    "ean": "1232145432290",
    "excluido": 0
}
```

### 🔎 **PATCH** - Restaurar um Item da Lixeira
Restaura um item específico da lixeira:

```sh
PATCH /api/gic/items/:id/restore
```

### 🔎 **PATCH** - Restaurar Todos os Itens da Lixeira
Restaura todos os itens da lixeira:

```sh
PATCH /api/gic/items/restore
```

### ✏️ **PUT** - Atualizar item
```sh
PUT /api/gic/items/:id
```

**Body:**
```json
{
    "valor_unitario": 99.90,
    "descricao": "Produto Inserido 3",
    "taxa_icms_entrada": 18.5,
    "taxa_icms_saida": 14.9,
    "comissao": 10,
    "ncm_id": 3,
    "cst_id": 4,
    "cfop_id": 3,
    "ean": "1232145432290",
    "excluido": 0
}
```

### 🗑️ **DELETE** - Remover um item para a lixeira
```sh
DELETE /api/gic/items/:id
```

### 🗑️ **DELETE** - Excluir permanentemente os itens da Lixeira
```sh
DELETE /api/gic/items/permanent
```

### 🗑️ **DELETE** - Excluir permanentemente um item da Lixeira
```sh
DELETE /api/gic/items/:id/permanent/
```

---

## 📜 Licença

Este projeto está sob a licença **ISC**.

## 📝 Autor

Projeto desenvolvido por **Jefferson Santos Dev** ✨

[🔗 Repositório no GitHub](https://github.com/jefferson-da-silva-santos/backend-gic)

