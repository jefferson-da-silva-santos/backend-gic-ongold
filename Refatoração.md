Para refatorar a API e melhorar sua escalabilidade e organização, podemos aplicar alguns conceitos de design de software como **separação de responsabilidades**, **repositórios**, **uso de DTOs** (Data Transfer Objects), **redução de código repetido**, e **melhoria no padrão de nomenclatura**. A seguir, irei reorganizar a API com base nas boas práticas.

### Estrutura de Diretórios

```plaintext
src/
|-- controllers/
|   |-- itemController.js
|
|-- middlewares/
|   |-- errorHandler.js
|
|-- models/
|   |-- item.js (Modelo ORM)
|
|-- repositories/
|   |-- itemRepository.js
|
|-- services/
|   |-- itemService.js
|
|-- dtos/
|   |-- itemDTO.js
|
|-- utils/
|   |-- logger.js
|   |-- schemaValidator.js
|
|-- routers/
|   |-- itemRouter.js
|
|-- app.js
```

### 1. **Camada Repository**

A camada `repository` é responsável pela interação com o banco de dados. Essa camada é onde o código de acesso ao banco de dados deve ficar, abstraindo a lógica da camada de serviço.

#### **itemRepository.js**
```javascript
import ItemModel from "../models/item.js";
import { Op } from "sequelize";

class ItemRepository {
  async getAllItems(page, limit) {
    const offset = (page - 1) * limit;
    const items = await ItemModel.findAll({
      where: { excluido: 0 },
      limit,
      offset
    });
    const totalItems = await ItemModel.count({
      where: { excluido: 0 }
    });
    return { items, totalItems };
  }

  async getItemByField(field, value) {
    const filters = { [field]: { [Op.eq]: value }, excluido: 0 };
    return await ItemModel.findAll({ where: filters });
  }

  async getItemsByDescription(page, limit, description) {
    const offset = (page - 1) * limit;
    return await ItemModel.findAll({
      where: {
        descricao: {
          [Op.like]: `%${description}%`
        },
        excluido: 0
      },
      limit,
      offset
    });
  }

  async getDeletedItems() {
    return await ItemModel.findAll({ where: { excluido: 1 } });
  }

  async insertItem(data) {
    return await ItemModel.create(data);
  }

  async updateItem(id, data) {
    return await ItemModel.update(data, { where: { id } });
  }

  async deleteItem(id) {
    return await ItemModel.update(
      { excluido: 1, excluido_em: new Date() },
      { where: { id } }
    );
  }

  async deletePermanentItem(id) {
    return await ItemModel.destroy({ where: { id } });
  }

  async restoreItem(id) {
    return await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { id } });
  }

  async restoreAllItems() {
    return await ItemModel.update({ excluido: 0, excluido_em: null }, { where: { excluido: 1 } });
  }
}

export default new ItemRepository();
```

### 2. **Camada Service**

A camada `service` será responsável pela lógica de negócios e intermediação entre o `controller` e o `repository`.

#### **itemService.js**
```javascript
import ItemRepository from "../repositories/itemRepository.js";
import logger from "../utils/logger.js";
import { ItemDTO } from "../dtos/itemDTO.js";

class ItemService {
  async getAllItems(page = 1, limit = 4) {
    try {
      const { items, totalItems } = await ItemRepository.getAllItems(page, limit);
      const totalPages = Math.ceil(totalItems / limit);
      return {
        items: ItemDTO.parse(items),
        totalItems,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      logger.error("Erro ao buscar itens", { error });
      throw error;
    }
  }

  async getItemFillter(field, value) {
    try {
      if (!field || !value) throw new Error("Parâmetros de filtragem vazios");

      const items = await ItemRepository.getItemByField(field, value);
      return ItemDTO.parse(items);
    } catch (error) {
      logger.error("Erro ao buscar itens com filtragem", { error });
      throw error;
    }
  }

  async getItemSearchDescription(page = 1, limit = 10, description) {
    try {
      const items = await ItemRepository.getItemsByDescription(page, limit, description);
      const totalItems = await ItemRepository.getItemsByDescription(page, limit, description);
      const totalPages = Math.ceil(totalItems.length / limit);
      return {
        items: ItemDTO.parse(items),
        totalItems: totalItems.length,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      logger.error("Erro ao buscar itens pela descrição", { error });
      throw error;
    }
  }

  // Métodos para inserir, atualizar, excluir e restaurar itens podem ser reutilizados de forma semelhante
}

export default new ItemService();
```

### 3. **DTO (Data Transfer Object)**

A camada de **DTO** serve para garantir que os dados manipulados no sistema sejam consistentes e para fornecer uma interface clara entre as camadas.

#### **itemDTO.js**
```javascript
class ItemDTO {
  static parse(arr) {
    return arr.map(item => ({
      id: item.id,
      valor_unitario: item.valor_unitario,
      descricao: item.descricao,
      taxa_icms_entrada: item.taxa_icms_entrada,
      taxa_icms_saida: item.taxa_icms_saida,
      comissao: item.comissao,
      ncm: item.ncm,
      cst: item.cst,
      cfop: item.cfop,
      ean: item.ean,
      totalCusto: this.calculateTotalCost(
        item.valor_unitario,
        item.taxa_icms_entrada,
        item.taxa_icms_saida,
        item.comissao
      ),
      criado_em: item.criado_em,
      excluido_em: item.excluido_em
    }));
  }

  static calculateTotalCost(unitValue, entryIcmsRate = 0, exitIcmsRate = 0, commission = 0) {
    const value = parseFloat(unitValue) || 0;
    const entryIcms = parseFloat(entryIcmsRate) || 0;
    const exitIcms = parseFloat(exitIcmsRate) || 0;
    const commissionRate = parseFloat(commission) || 0;

    return parseFloat(((entryIcms / 100) + (exitIcms / 100) + (commissionRate / 100)) * value).toFixed(2);
  }
}

export { ItemDTO };
```

### 4. **Controller**

A camada de **controller** agora é responsável apenas por lidar com as requisições HTTP, validando entradas, chamando os serviços apropriados e retornando respostas.

#### **itemController.js**
```javascript
import ItemService from "../services/itemService.js";
import { shemaFillter, itemSchema, idShema, searchSchema } from "../utils/schemaValidator.js";
import logger from "../utils/logger.js";

class ItemController {
  async getAll(req, res, next) {
    const { page = 1, limit = 10 } = req.params;
    try {
      const result = await ItemService.getAllItems(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getFillter(req, res, next) {
    const { error, value } = shemaFillter.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const result = await ItemService.getItemFillter(value.field, value.value);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getSearchDescription(req, res, next) {
    const { error, value } = searchSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const result = await ItemService.getItemSearchDescription(value.page, value.limit, value.description);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Métodos para outros endpoints (insert, update, delete, restore) são similares a esses
}

export default new ItemController();
```

### 5. **Router**

Agora, a camada de **router** só gerencia as rotas e as liga aos controllers.

#### **itemRouter.js**
```javascript
import express from "express";
import ItemController from "../controllers/itemController.js";

const router = express.Router();

router.get('/items/:page/:limit', ItemController.getAll);
router.get('/items/filter/:field/:value', ItemController.getFillter);
router.get('/items/search/:page/:limit/:description', ItemController.getSearchDescription);

router.post('/items', ItemController.insert);
// Restante das rotas...

export default router;
```

### Conclusão

Refatorando a API dessa maneira, temos:

- **Separation of Concerns**: Cada camada tem uma responsabilidade clara (Repository, Service, Controller, DTO).
- **Escalabilidade**: A estrutura modular facilita a adição de novas funcionalidades e a manutenção do código.
- **Redução de Repetição**: A reutilização dos métodos nas camadas de serviço e repositório reduz duplicação de código.
- **Código Limpo**: A estrutura agora está mais organizada e segue boas práticas de design de software, facilitando a manutenção e testes.

Com isso, sua API se torna mais escalável, limpa e fácil de expandir!

A padronização das rotas é um ponto muito importante para garantir consistência e facilitar a manutenção da API à medida que ela cresce. Para criar rotas padronizadas e escaláveis, você deve seguir algumas boas práticas de RESTful API e garantir que suas rotas sejam claras, intuitivas e consistentes.

Aqui estão algumas diretrizes para padronizar suas rotas:

### 1. **Usar Substantivos no Plural**
As rotas devem usar substantivos no plural para indicar coleções de recursos, em vez de no singular. Isso segue a convenção RESTful.

**Exemplo**:
- `GET /items` para buscar todos os itens.
- `POST /items` para criar um novo item.
- `GET /items/:id` para obter um item específico.

### 2. **Métodos HTTP Corretos**
Use os métodos HTTP corretos para ações diferentes:
- `GET`: Para buscar dados.
- `POST`: Para criar um novo recurso.
- `PUT` ou `PATCH`: Para atualizar um recurso existente.
- `DELETE`: Para excluir um recurso.

### 3. **Recursos e Sub-Recursos**
Quando um recurso estiver relacionado a outro, utilize sub-rotas para representar essa relação.

**Exemplo**:
- `GET /items/:id/restore` (restaurar item específico).
- `DELETE /items/:id` (deletar item específico).

### 4. **Filtragem, Pesquisa e Paginação**
Use parâmetros de consulta (query parameters) para filtragem, busca e paginação. Isso ajuda a manter a URL limpa e facilita a flexibilidade.

**Exemplo**:
- `GET /items?page=1&limit=10` (paginação de itens).
- `GET /items?description=notebook` (pesquisa por descrição).
- `GET /items?field=ncm&value=12345` (filtros personalizados).

### 5. **Utilizar URLs Descritivas**
As URLs devem ser descritivas o suficiente para representar a ação ou o dado que está sendo manipulado.

### 6. **Status de Itens (Ativado, Excluído, etc.)**
Se o recurso possui estados (ex: excluído, ativo), utilize sub-rotas ou query parameters para manipular esses estados.

**Exemplo**:
- `GET /items/deleted` (para buscar itens excluídos).
- `PUT /items/:id/restore` (para restaurar um item excluído).

### Exemplo de Estrutura de Rotas Padronizada

Aqui está uma sugestão de como padronizar suas rotas com base nessas boas práticas.

#### **itemRouter.js**
```javascript
import express from "express";
import ItemController from "../controllers/itemController.js";

const router = express.Router();

// CRUD básico
router.get('/items', ItemController.getAll); // GET todos os itens com paginação e filtros
router.post('/items', ItemController.insert); // POST para criar um item
router.get('/items/:id', ItemController.getById); // GET para buscar um item específico
router.put('/items/:id', ItemController.update); // PUT para atualizar um item
router.delete('/items/:id', ItemController.delete); // DELETE para excluir um item

// Busca com descrição
router.get('/items/search', ItemController.getSearchDescription); // GET para buscar itens por descrição, com filtros

// Filtros gerais
router.get('/items/filter', ItemController.getFillter); // GET para buscar itens com filtros personalizados

// Itens excluídos
router.get('/items/deleted', ItemController.getDeleted); // GET para buscar itens excluídos
router.put('/items/:id/restore', ItemController.restoreItem); // PUT para restaurar item excluído
router.put('/items/restore', ItemController.restoreAllItems); // PUT para restaurar todos os itens

// Excluir permanentemente
router.delete('/items/permanent/:id', ItemController.deletedPermanentItem); // DELETE para excluir item permanentemente
router.delete('/items/permanent', ItemController.deletedPermanentAll); // DELETE para excluir todos os itens permanentemente

export default router;
```

### Explicação das Rotas

1. **CRUD Básico**:
   - `GET /items`: Retorna todos os itens (com suporte a paginação e filtros).
   - `POST /items`: Cria um novo item.
   - `GET /items/:id`: Retorna um item específico, com base no `id`.
   - `PUT /items/:id`: Atualiza um item existente.
   - `DELETE /items/:id`: Exclui um item específico (não permanentemente, apenas marca como excluído).

2. **Busca e Filtros**:
   - `GET /items/search`: Realiza uma busca por descrição de item. Pode usar parâmetros de consulta como `page`, `limit`, e `description`.
   - `GET /items/filter`: Permite filtros customizados (ex: `field=ncm&value=12345`).

3. **Itens Excluídos**:
   - `GET /items/deleted`: Retorna todos os itens excluídos.
   - `PUT /items/:id/restore`: Restaura um item específico.
   - `PUT /items/restore`: Restaura todos os itens excluídos.

4. **Exclusão Permanente**:
   - `DELETE /items/permanent/:id`: Exclui permanentemente um item.
   - `DELETE /items/permanent`: Exclui todos os itens permanentemente.

### 7. **Uso de Query Parameters**
Para permitir maior flexibilidade, você pode usar query parameters para filtrar, ordenar, paginar e buscar por campos específicos.

Exemplo de uso:
- `GET /items?page=1&limit=10&description=notebook`: Retorna os itens com a descrição "notebook", paginados.
- `GET /items/filter?field=ncm&value=12345`: Filtra itens com o campo `ncm` igual a "12345".

### 8. **Mensagens de Erro Consistentes**
Garanta que suas respostas de erro sigam um padrão consistente. Um exemplo seria:
```json
{
  "error": "Item não encontrado",
  "details": "O item com o ID especificado não existe."
}
```

### 9. **Status HTTP**
Utilize os códigos de status HTTP corretos para indicar o sucesso ou falha de cada operação:
- **200 OK**: Para operações bem-sucedidas (GET, PUT, PATCH).
- **201 Created**: Para operações de criação bem-sucedidas (POST).
- **400 Bad Request**: Para erros de validação de parâmetros.
- **404 Not Found**: Quando o recurso não for encontrado.
- **500 Internal Server Error**: Para erros inesperados no servidor.

### Conclusão
Padronizar as rotas, métodos HTTP e parâmetros de consulta ajuda a melhorar a clareza da API e facilita a sua manutenção e expansão. A abordagem RESTful torna a interação com a API mais intuitiva e facilita o entendimento por parte dos desenvolvedores que usarão ou darão manutenção na API no futuro.

Lembre-se de documentar suas rotas para tornar o consumo da API ainda mais simples e eficiente!

Sim, você está certo em questionar a necessidade da camada `Service` em algumas situações. Vamos analisar a camada `Service` com base no código que você forneceu.

A camada `Service` geralmente tem como função encapsular a lógica de negócios e orquestrar interações entre o `Controller` e o `Repository`. No entanto, se a lógica de negócios for simples (ou seja, não houver uma lógica complexa de transformação de dados ou processamento necessário), a camada `Service` pode ser redundante e você pode simplificar as coisas, fazendo com que o `Controller` interaja diretamente com o `Repository`.

### Quando a camada `Service` é útil:
- **Lógica de negócios complexa**: Se a sua aplicação tiver regras de negócios que exigem várias etapas de processamento, validações ou interações complexas com os dados, a camada `Service` é necessária.
- **Abstração e Reuso**: A camada `Service` também pode ser útil para abstrair complexidade de forma que a camada de `Controller` se concentre apenas em lidar com requisições HTTP.

### Quando a camada `Service` pode ser redundante:
- **Ações simples**: Se o controller apenas realiza ações simples, como buscar, criar ou atualizar dados com pouca ou nenhuma transformação, a camada `Service` pode ser desnecessária.
- **Camada `Controller` diretamente com `Repository`**: Se a interação com o banco de dados não envolve lógica complexa ou processamento, podemos realizar isso diretamente no `Controller`, tornando o `Service` redundante.

### Exemplo: Refatoração sem a camada `Service`

Aqui está como você pode simplificar a sua API removendo a camada `Service` e fazendo com que o `Controller` interaja diretamente com o `Repository`.

#### **Controller Refatorado**
Você pode mover a lógica de interação com o `Repository` diretamente para o `Controller`. Isso vai simplificar a estrutura, mas se a lógica de negócios se tornar mais complexa no futuro, você pode optar por reintroduzir a camada `Service`.

```javascript
import ItemRepository from "../repositories/itemRepository.js";
import logger from "../utils/logger.js";
import { ItemDTO } from "../dtos/itemDTO.js";

// Controlador para os itens
class ItemController {
  // Buscar todos os itens
  async getAll(req, res, next) {
    const { page = 1, limit = 10 } = req.params;
    try {
      const { items, totalItems } = await ItemRepository.getAllItems(page, limit);
      const totalPages = Math.ceil(totalItems / limit);
      res.status(200).json({
        items: ItemDTO.parse(items),
        totalItems,
        totalPages,
        currentPage: page
      });
    } catch (error) {
      logger.error("Erro ao buscar itens", { error });
      next(error);
    }
  }

  // Buscar item por filtro
  async getFillter(req, res, next) {
    const { error, value } = shemaFillter.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const items = await ItemRepository.getItemByField(value.field, value.value);
      res.status(200).json(ItemDTO.parse(items));
    } catch (error) {
      logger.error("Erro ao buscar itens com filtragem", { error });
      next(error);
    }
  }

  // Buscar item por descrição
  async getSearchDescription(req, res, next) {
    const { error, value } = searchSchema.validate(req.params);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const { items, totalItems } = await ItemRepository.getItemsByDescription(value.page, value.limit, value.description);
      const totalPages = Math.ceil(totalItems.length / value.limit);
      res.status(200).json({
        items: ItemDTO.parse(items),
        totalItems: totalItems.length,
        totalPages,
        currentPage: value.page
      });
    } catch (error) {
      logger.error("Erro ao buscar itens pela descrição", { error });
      next(error);
    }
  }

  // Inserir um novo item
  async insert(req, res, next) {
    const { error, value } = itemSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const result = await ItemRepository.insertItem(value);
      res.status(201).json(result);
    } catch (error) {
      logger.error("Erro ao inserir item", { error });
      next(error);
    }
  }

  // Atualizar item
  async update(req, res, next) {
    const { error, value } = idShema.validate(req.params);
    if (error) return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });

    const { error: bodyError, value: bodyValue } = itemSchema.validate(req.body);
    if (bodyError) return res.status(400).json({ error: bodyError.details[0].message });

    try {
      const result = await ItemRepository.updateItem(value.id, bodyValue);
      if (result === 0) return res.status(404).json({ error: "Item não encontrado." });
      res.status(200).json({ message: "Item atualizado com sucesso!" });
    } catch (error) {
      logger.error("Erro ao atualizar item", { error });
      next(error);
    }
  }

  // Deletar item (soft delete)
  async delete(req, res, next) {
    const { error, value } = idShema.validate(req.params);
    if (error) return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });

    try {
      const result = await ItemRepository.deleteItem(value.id);
      if (result === 0) return res.status(404).json({ error: "Item não encontrado." });
      res.status(200).json({ message: "Item excluído com sucesso!" });
    } catch (error) {
      logger.error("Erro ao excluir item", { error });
      next(error);
    }
  }
  
  // Excluir item permanentemente
  async deletedPermanentItem(req, res, next) {
    const { error, value } = idShema.validate(req.params);
    if (error) return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });

    try {
      const result = await ItemRepository.deletePermanentItem(value.id);
      if (result === 0) return res.status(404).json({ error: "Item não encontrado." });
      res.status(200).json({ message: "Item excluído permanentemente com sucesso!" });
    } catch (error) {
      logger.error("Erro ao excluir item permanentemente", { error });
      next(error);
    }
  }

  // Restaurar item
  async restoreItem(req, res, next) {
    const { error, value } = idShema.validate(req.params);
    if (error) return res.status(400).json({ error: `ID inválido! ${error.details[0].message}` });

    try {
      const result = await ItemRepository.restoreItem(value.id);
      if (result === 0) return res.status(404).json({ error: "Item não encontrado." });
      res.status(200).json({ message: "Item restaurado com sucesso!" });
    } catch (error) {
      logger.error("Erro ao restaurar item", { error });
      next(error);
    }
  }

  // Restaurar todos os itens
  async restoreAllItems(req, res, next) {
    try {
      const result = await ItemRepository.restoreAllItems();
      res.status(200).json({ message: "Itens restaurados com sucesso!" });
    } catch (error) {
      logger.error("Erro ao restaurar itens", { error });
      next(error);
    }
  }
}

export default new ItemController();
```

### Vantagens de Remover a Camada `Service`:

1. **Redução de complexidade**: O código fica mais simples, com menos camadas para manter.
2. **Menos duplicação de código**: Como as operações estão sendo diretamente chamadas no controller, você não tem a redundância de duplicação de chamadas no `Service`.
3. **Facilidade de implementação**: Se a lógica de negócios for simples e você não precisar de um layer adicional de abstração, o uso direto do `Repository` pode ser vantajoso.

### Quando Reintroduzir o `Service`?

Se no futuro você começar a ter mais complexidade na lógica de negócios, como validações mais complexas, interações com múltiplos repositórios, ou até mesmo integrações com APIs externas, reintroduzir a camada `Service` pode ser uma boa prática. Isso vai ajudar a manter o código organizado e evitar que o controller fique muito sobrecarregado.

### Conclusão

Sim, a camada `Service` pode ser redundante em situações simples como as que você está lidando, e remover ela pode simplificar a arquitetura da sua aplicação. Entretanto, sempre que você encontrar necessidade de lógica de negócios mais complexa, você pode facilmente reintroduzi-la sem complicar a estrutura atual.

