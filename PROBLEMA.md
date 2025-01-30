Você já conhece a aplicação GMEX e Gerency Web. Para reforçar o aprendizado de React e SOLID e aprender MySQL e tributação, crie um CRUD de ITENS que contenha esses campos:
 - Valor unitário (obrigatório)
 - Valor unitário (obrigatório)
 - Descrição (obrigatório)
 - Taxa ICMS de entrada em %
 - Taxa ICMS de saída em %
 - Comissão p/ vendedor em %
 - NCM
 - CST
 - CFOP
 - EAN (Cód. barra)

Regras da aplicação

- Na listagem de itens deve aparecer todos os campos acima + o valor total de Custos (somatório de taxas e comissões) em R$ para cada item.
- Na edição de item, NÃO deve permitir editar: NCM, CST, CFOP.
Na edição de item, NÃO deve permitir editar após 36h da criação dele.
- Na exclusão do item, não é para deletar do banco de dados, apenas alterar a flag de excluído (0 ou 1) que define se o usuário vai ou não poder acessar/editar esse item.
- No cadastro de item, dois itens não podem ter o mesmo EAN.

Deve conter:
- Uma tela de listagem de itens
- Um modal de cadastro de item
- Um modal de edição de item
- Toda vez que alterar/excluir um item deve aparecer uma confirmação - na tela se o usuário deseja mesmo fazer isso