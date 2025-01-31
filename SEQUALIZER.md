Aqui está um tutorial completo e detalhado de como configurar e utilizar o **Sequelize** com MySQL em sua API, cobrindo desde a estrutura do projeto até a configuração, modelagem das tabelas, relacionamento e execução de queries.

---

## 🏗️ **1. Estrutura do Projeto**
A estrutura do seu projeto usando **Node.js**, **Express** e **Sequelize** deve seguir o seguinte formato:

```
/api-sequelize-mysql
│── /node_modules
│── /src
│   ├── /config
│   │   ├── config.js
│   ├── /models
│   │   ├── index.js
│   │   ├── cfop.js
│   │   ├── csticms.js
│   │   ├── ncm.js
│   │   ├── item.js
│   ├── /routes
│   │   ├── cfopRoutes.js
│   │   ├── csticmsRoutes.js
│   │   ├── ncmRoutes.js
│   │   ├── itemRoutes.js
│   ├── /controllers
│   │   ├── cfopController.js
│   │   ├── csticmsController.js
│   │   ├── ncmController.js
│   │   ├── itemController.js
│   ├── /database
│   │   ├── connection.js
│   ├── server.js
│── .env
│── package.json
│── .gitignore
│── README.md
```

---

## 🔧 **2. Configuração Inicial**
### **Passo 1: Criar o projeto Node.js**
Primeiro, crie uma pasta para o projeto e inicialize um projeto Node.js:

```sh
mkdir api-sequelize-mysql
cd api-sequelize-mysql
npm init -y
```

### **Passo 2: Instalar dependências**
Instale os pacotes necessários:

```sh
npm install express mysql2 sequelize dotenv
```

E as ferramentas de desenvolvimento:

```sh
npm install --save-dev nodemon
```

---

## 🌍 **3. Configuração do Banco de Dados**
### **Passo 3: Criar um arquivo `.env`**
Crie um arquivo **`.env`** na raiz do projeto e adicione suas credenciais do MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
DB_DIALECT=mysql
DB_PORT=3306
```

### **Passo 4: Configurar a conexão com o banco**
Crie um arquivo em **`/src/database/connection.js`** e configure a conexão:

```javascript
require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false, // Para não poluir o console com logs SQL
  }
);

sequelize
  .authenticate()
  .then(() => console.log("Conectado ao banco de dados com sucesso!"))
  .catch((error) => console.error("Erro ao conectar ao banco:", error));

module.exports = sequelize;
```

---

## 📦 **4. Modelagem das Tabelas no Sequelize**
Agora, vamos criar os modelos Sequelize para cada tabela.

### **Passo 5: Criar o modelo de `tb_cfop`**
Crie um arquivo **`/src/models/cfop.js`**:

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Cfop = sequelize.define(
  "Cfop",
  {
    codcfop: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descricaocfop: { type: DataTypes.STRING(400) },
    comentariocfop: { type: DataTypes.TEXT },
    codcop: { type: DataTypes.STRING(10), allowNull: false },
    codigocta: { type: DataTypes.STRING(255) },
    cfopid: { type: DataTypes.INTEGER },
  },
  { tableName: "tb_cfop", timestamps: false }
);

module.exports = Cfop;
```

### **Passo 6: Criar o modelo de `tb_csticms`**
Crie **`/src/models/csticms.js`**:

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const CstIcms = sequelize.define(
  "CstIcms",
  {
    codcst: { type: DataTypes.STRING(10), primaryKey: true },
    descricao: { type: DataTypes.STRING(255) },
    regime: { type: DataTypes.STRING(1) },
  },
  { tableName: "tb_csticms", timestamps: false }
);

module.exports = CstIcms;
```

### **Passo 7: Criar o modelo de `tb_ncm`**
Crie **`/src/models/ncm.js`**:

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Ncm = sequelize.define(
  "Ncm",
  {
    codncm: { type: DataTypes.STRING(8), primaryKey: true },
    nomencm: { type: DataTypes.TEXT, allowNull: false },
    aliquota: { type: DataTypes.STRING(3) },
  },
  { tableName: "tb_ncm", timestamps: false }
);

module.exports = Ncm;
```

### **Passo 8: Criar o modelo de `tb_itens`**
Crie **`/src/models/item.js`**:

```javascript
const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const Ncm = require("./ncm");
const CstIcms = require("./csticms");
const Cfop = require("./cfop");

const Item = sequelize.define(
  "Item",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    valor_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    descricao: { type: DataTypes.STRING(255), allowNull: false },
    taxa_icms_entrada: { type: DataTypes.DECIMAL(5, 2) },
    taxa_icms_saida: { type: DataTypes.DECIMAL(5, 2) },
    comissao: { type: DataTypes.DECIMAL(5, 2) },
    ncm: { type: DataTypes.STRING(8), references: { model: Ncm, key: "codncm" } },
    cst: { type: DataTypes.STRING(10), references: { model: CstIcms, key: "codcst" } },
    cfop: { type: DataTypes.INTEGER, references: { model: Cfop, key: "codcfop" } },
    ean: { type: DataTypes.STRING(13), unique: true, allowNull: false },
    excluido: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "tb_itens", timestamps: false }
);

module.exports = Item;
```

---

## 🚀 **5. Sincronizar os Modelos com o Banco**
Crie **`/src/models/index.js`** para centralizar os modelos:

```javascript
const sequelize = require("../database/connection");
const Cfop = require("./cfop");
const CstIcms = require("./csticms");
const Ncm = require("./ncm");
const Item = require("./item");

sequelize
  .sync({ alter: true })
  .then(() => console.log("Modelos sincronizados com sucesso!"))
  .catch((error) => console.error("Erro ao sincronizar os modelos:", error));

module.exports = { Cfop, CstIcms, Ncm, Item };
```

---

Agora é só rodar o projeto com:

```sh
node src/models/index.js
```

Se precisar de CRUD para os dados, me avise! 🚀