import database from "../services/database.js";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

async function getSustainabilityScoreById(req, res, next) {
  try {
    const id = req.params.id;

    const params = {
      TableName: "Preferences",
      Key: {
        id: id,
      },
    };

    const command = new GetCommand(params);
    const result = await database.send(command);

    if (!result.Item) {
      return res.status(404).json({
        message: "No sustainability record found",
      });
    }

    res.status(200).json({
      document_id: result.Item.document_id,
      score: result.Item.score,
      maximum_score: result.Item.maximum_score,
      rating: result.Item.rating,
    });
  } catch (err) {
    next(err);
  }
}

export default {
  getSustainabilityScoreById,
};


/*function getSustainabilityScoreById(req, res) {
    const customerId = req.params.id;
    res.send(
        "🤖 Sustainability Route with GET method - this endpoint will return a sustainability score and breakdown for customers preferences from the database. The preference is:" + customerId
    );
  }
  
  export default {
    getSustainabilityScoreById,
  };*/