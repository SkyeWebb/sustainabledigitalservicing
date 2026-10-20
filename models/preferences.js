import joi from "joi";

const preferencesSchema = joi.object({
  id: joi.string().required(),
  score: joi.number().required(),
  maximum_score: joi.number().required(),
  rating: joi.string().required(),
  digital_preferences: joi.number().required(),
  eligible_preferences: joi.number().required(),
  recommendations: joi.array().required(),
});

export default preferencesSchema;