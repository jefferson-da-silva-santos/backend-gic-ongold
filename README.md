# BackEnd do GIC (Desafio Técnico Ongold Tech)
BackEnd do GIC (Gestor de Itens Comerciais): Uma aplicação desenvolvida para gerenciar o cadastro, edição e exclusão de itens com informações tributárias e comerciais, seguindo boas práticas de desenvolvimento e organizando as operações de maneira eficiente.

Aqui está a estrutura do seu backend usando **Node.js**, **Express**, **Sequelize** e **MySQL**. O projeto seguirá princípios do **SOLID** e terá **separação de camadas** para facilitar a manutenção.

---

## 📁 **Estrutura do Projeto**
```
/backend
│── /src
│   │── /config
│   │   ├── database.js          # Configuração do Sequelize
│   │── /models
│   │   ├── index.js             # Inicialização do Sequelize
│   │   ├── Item.js              # Modelo da tabela 'tb_itens'
│   │   ├── Ncm.js               # Modelo da tabela 'tb_ncm'
│   │   ├── Cst.js               # Modelo da tabela 'tb_csticms'
│   │   ├── Cfop.js              # Modelo da tabela 'tb_cfop'
│   │── /controllers
│   │   ├── ItemController.js    # CRUD de itens
│   │── /services
│   │   ├── ItemService.js       # Lógica de negócios para itens
│   │── /routes
│   │   ├── itemRoutes.js        # Rotas para CRUD de itens
│   │── /middlewares
│   │   ├── validateItem.js      # Middleware de validação
│   │── /database
│   │   ├── migrations           # Migrations Sequelize
│   │   ├── seeders              # Dados iniciais
│── .env                         # Variáveis de ambiente
│── server.js                     # Entrada da aplicação
│── package.json                  # Dependências do projeto
```

---

## 🚀 **Passo 1: Criando o Projeto**
```bash
mkdir backend && cd backend
npm init -y
npm install express sequelize mysql2 dotenv cors body-parser
npm install --save-dev nodemon sequelize-cli
```

Configurar `package.json` para rodar o servidor:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## ⚙ **Passo 2: Configurar Sequelize**
### Criando a configuração do banco:
```bash
npx sequelize-cli init
```

Isso criará a pasta **`/config`** e o arquivo `config/database.js`. Atualize para usar `.env`:
```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "mysql"
  }
};
```
Adicione um arquivo `.env`:
```
DB_USER=root
DB_PASS=senha
DB_NAME=nome_do_banco
DB_HOST=localhost
PORT=3001
```

---

## 📌 **Passo 3: Criar os Modelos Sequelize**
### Criando os modelos:
```bash
npx sequelize-cli model:generate --name Item --attributes valor_unitario:decimal,descricao:string,taxa_icms_entrada:decimal,taxa_icms_saida:decimal,comissao:decimal,ncm:string,cst:string,cfop:integer,ean:string,excluido:boolean,criado_em:date
npx sequelize-cli model:generate --name Ncm --attributes codncm:string,nomencm:text,aliquota:integer
npx sequelize-cli model:generate --name Cst --attributes codcst:string,descricao:string
npx sequelize-cli model:generate --name Cfop --attributes codcfop:integer,descricaocfop:string
```
Agora, edite `Item.js` para adicionar relacionamentos:
```javascript
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    valor_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    descricao: { type: DataTypes.STRING, allowNull: false },
    taxa_icms_entrada: { type: DataTypes.DECIMAL(5, 2) },
    taxa_icms_saida: { type: DataTypes.DECIMAL(5, 2) },
    comissao: { type: DataTypes.DECIMAL(5, 2) },
    ncm: { type: DataTypes.STRING(8) },
    cst: { type: DataTypes.STRING(10) },
    cfop: { type: DataTypes.INTEGER },
    ean: { type: DataTypes.STRING(13), unique: true },
    excluido: { type: DataTypes.BOOLEAN, defaultValue: false },
    criado_em: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  });

  Item.associate = models => {
    Item.belongsTo(models.Ncm, { foreignKey: "ncm" });
    Item.belongsTo(models.Cst, { foreignKey: "cst" });
    Item.belongsTo(models.Cfop, { foreignKey: "cfop" });
  };

  return Item;
};
```

Depois, rode as **migrations**:
```bash
npx sequelize-cli db:migrate
```

---

## 📌 **Passo 4: Criar Controllers**
Crie `ItemController.js` para gerenciar os itens:
```javascript
const { Item } = require("../models");

const ItemController = {
  async create(req, res) {
    try {
      const exists = await Item.findOne({ where: { ean: req.body.ean } });
      if (exists) return res.status(400).json({ error: "EAN já cadastrado!" });

      const item = await Item.create(req.body);
      return res.status(201).json(item);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async list(req, res) {
    const items = await Item.findAll();
    return res.json(items);
  },

  async update(req, res) {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Item não encontrado!" });

      const diff = new Date() - new Date(item.criado_em);
      if (diff > 36 * 60 * 60 * 1000) {
        return res.status(403).json({ error: "Edição bloqueada após 36h!" });
      }

      await item.update(req.body);
      return res.json(item);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const item = await Item.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: "Item não encontrado!" });

      await item.update({ excluido: true });
      return res.json({ message: "Item excluído logicamente!" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ItemController;
```

---

## 📌 **Passo 5: Criar as Rotas**
Crie `itemRoutes.js`:
```javascript
const express = require("express");
const router = express.Router();
const ItemController = require("../controllers/ItemController");

router.post("/items", ItemController.create);
router.get("/items", ItemController.list);
router.put("/items/:id", ItemController.update);
router.delete("/items/:id", ItemController.delete);

module.exports = router;
```

E **registre as rotas** no `server.js`:
```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const itemRoutes = require("./src/routes/itemRoutes");
app.use("/api", itemRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
```

---

## ✅ **Conclusão**
Agora você tem um **backend estruturado** seguindo boas práticas e princípios do **SOLID**! 🚀 Se precisar de ajustes ou testes, me avise!