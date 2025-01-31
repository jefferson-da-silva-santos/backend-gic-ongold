import Joi from "joi";

export const idShema = Joi.object({
  id: Joi.number().positive().required()
});