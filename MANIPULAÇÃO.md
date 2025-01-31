Ótima pergunta! Agora que sua conexão com o banco está funcionando, podemos criar um **CRUD completo** (Create, Read, Update, Delete) para interagir com as tabelas usando o **Sequelize ORM**. 🚀

---

## 🏗️ **1. Métodos CRUD com Sequelize**
Para interagir com o banco, usaremos os métodos principais do **Sequelize**:

| Operação  | Método do Sequelize |
|-----------|---------------------|
| Criar     | `Model.create()`    |
| Buscar um | `Model.findOne()`   |
| Buscar todos | `Model.findAll()` |
| Atualizar | `Model.update()`    |
| Deletar   | `Model.destroy()`   |

Vamos aplicar isso no nosso projeto! 🔥

---

## 📌 **2. Criando um Controller para `tb_itens`**
Crie o arquivo **`/src/controllers/itemController.js`** e adicione o seguinte código:

```javascript
const { Item } = require("../models");

// 🟢 Criar um novo item
const createItem = async (req, res) => {
  try {
    const novoItem = await Item.create(req.body);
    res.status(201).json(novoItem);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar item", error });
  }
};

// 🔍 Buscar todos os itens
const getAllItems = async (req, res) => {
  try {
    const itens = await Item.findAll();
    res.status(200).json(itens);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar itens", error });
  }
};

// 🔍 Buscar um item por ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item não encontrado" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar item", error });
  }
};

// 🔄 Atualizar um item
const updateItem = async (req, res) => {
  try {
    const atualizado = await Item.update(req.body, {
      where: { id: req.params.id },
    });
    if (atualizado[0] === 0) return res.status(404).json({ message: "Item não encontrado" });
    res.status(200).json({ message: "Item atualizado com sucesso!" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar item", error });
  }
};

// ❌ Deletar um item
const deleteItem = async (req, res) => {
  try {
    const deletado = await Item.destroy({ where: { id: req.params.id } });
    if (!deletado) return res.status(404).json({ message: "Item não encontrado" });
    res.status(200).json({ message: "Item deletado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar item", error });
  }
};

module.exports = { createItem, getAllItems, getItemById, updateItem, deleteItem };
```

---

## 🔗 **3. Criando as Rotas para `tb_itens`**
Agora, crie o arquivo **`/src/routes/itemRoutes.js`**:

```javascript
const express = require("express");
const { createItem, getAllItems, getItemById, updateItem, deleteItem } = require("../controllers/itemController");

const router = express.Router();

router.post("/", createItem);       // Criar item
router.get("/", getAllItems);       // Buscar todos os itens
router.get("/:id", getItemById);    // Buscar item por ID
router.put("/:id", updateItem);     // Atualizar item
router.delete("/:id", deleteItem);  // Deletar item

module.exports = router;
```

---

## 🚀 **4. Integrando as Rotas no `server.js`**
Agora, edite **`server.js`** e adicione a nova rota:

```javascript
const express = require("express");
const config = require("./src/config/config");
const sequelize = require("./src/database/connection");
const itemRoutes = require("./src/routes/itemRoutes");

const app = express();
const PORT = config.app.port;

app.use(express.json());
app.use("/item", itemRoutes); // 👈 Adicionando a rota de itens

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("🔥 Conexão com o banco bem-sucedida!");
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  } catch (error) {
    console.error("❌ Erro ao conectar ao banco:", error);
  }
});
```

---

## 🔥 **5. Testando a API com Postman ou Insomnia**
Agora que o CRUD está pronto, podemos testar os endpoints!

### 🟢 **Criar um item (`POST /item`)**
- **URL:** `http://localhost:3000/item`
- **Body (JSON):**
  ```json
  {
    "valor_unitario": 99.90,
    "descricao": "Produto de Teste",
    "taxa_icms_entrada": 18.5,
    "ncm": "12345678",
    "cst": "10",
    "cfop": 1001,
    "ean": "1234567890123"
  }
  ```
- **Resposta Esperada:**
  ```json
  {
    "id": 1,
    "valor_unitario": 99.90,
    "descricao": "Produto de Teste",
    "taxa_icms_entrada": 18.5,
    "ncm": "12345678",
    "cst": "10",
    "cfop": 1001,
    "ean": "1234567890123"
  }
  ```

### 🔍 **Buscar todos os itens (`GET /item`)**
- **URL:** `http://localhost:3000/item`
- **Resposta:** Lista com todos os itens.

### 🔍 **Buscar um item por ID (`GET /item/:id`)**
- **URL:** `http://localhost:3000/item/1`
- **Resposta:** O item com ID 1.

### 🔄 **Atualizar um item (`PUT /item/:id`)**
- **URL:** `http://localhost:3000/item/1`
- **Body (JSON):**
  ```json
  {
    "descricao": "Produto Atualizado"
  }
  ```
- **Resposta:** `{ "message": "Item atualizado com sucesso!" }`

### ❌ **Deletar um item (`DELETE /item/:id`)**
- **URL:** `http://localhost:3000/item/1`
- **Resposta:** `{ "message": "Item deletado com sucesso!" }`

---

## 🎯 **Conclusão**
Agora você tem um CRUD completo para a tabela `tb_itens`! 🚀

📌 **O que fizemos?**
✅ Criamos métodos para **inserir, buscar, atualizar e deletar** itens no banco  
✅ Usamos **Sequelize ORM** para interagir com o MySQL  
✅ Configuramos **rotas e controllers** para gerenciar os dados  
✅ Testamos tudo via Postman ou Insomnia  

Se precisar adicionar o CRUD para outras tabelas (`tb_cfop`, `tb_csticms`, `tb_ncm`), me avise! 🔥🔥🔥