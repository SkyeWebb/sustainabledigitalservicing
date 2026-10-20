import database from "../services/database.js";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

async function getRecommendationById(req, res, next) {
  try {
    const customerId = req.params.id;

    const params = {
      TableName: "Preferences",
      Key: {
        id: customerId,
      },
    };

    const command = new GetCommand(params);
    const result = await database.send(command);

    if (!result.Item) {
      return res.status(404).json({
        message: "No recommendation found",
      });
    }

    res.status(200).json({
      document_id: result.Item.document_id,
      recommendations: result.Item.recommendations,
    });

  } catch (err) {
    next(err);
  }
}

export default {
  getRecommendationById,
};

/*function getRecommendationById(req, res) {
  const customerID = req.params.id;
  res.send(
      "🤖 Sustainability Recommendations Route with GET method - this endpoint will return improvement options for customers preferences from the database. The preference is:" + customerID
    );
  }
  
export default {
    getRecommendationById,
};*/