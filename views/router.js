import express from "express";
import preferencesController from "../controllers/preferencesController.js";
import sustainabilityController from "../controllers/sustainabilityController.js";
import recommendationController from "../controllers/recommendationController.js"
import healthController from "../controllers/healthController.js";

const Router = express.Router();

Router.route("/preferences")
  .get(preferencesController.getAllPreferences)
  .post(preferencesController.createPreferences)

Router.route("/preferences/:id")
  .get(preferencesController.getPreferencesById)   
  .put(preferencesController.updatePreferencesById)
  .delete(preferencesController.deletePreferencesById);

Router.route("/sustainability/:id")
  .get(sustainabilityController.getSustainabilityScoreById);

Router.route("/recommendation/:id")
  .get(recommendationController.getRecommendationById);

Router.route("/health")
  .get(healthController.getHealth);

export default Router;