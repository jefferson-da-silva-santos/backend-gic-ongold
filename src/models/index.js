import sequelize from "../database/connection.js";
import Cfop from "./cfop.js";
import CstIcms from "./csticms.js";
import Ncm from "./ncm.js";
import Item from "./item.js";

sequelize
  .sync({ alter: true })
  .then(() => console.log("Modelos sincronizados com sucesso!"))
  .catch((error) => console.error("Erro ao sincronizar os modelos:", error));

export default { Cfop, CstIcms, Ncm, Item };
