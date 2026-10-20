import database from "../services/database.js";
import {
  ScanCommand,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import preferencesSchema from "../models/preferences.js";

async function getAllPreferences(req, res, next) {
  try {
    const params = {
      TableName: "Preferences",
    };
    const command = new ScanCommand(params);
    const result = await database.send(command);
    res.status(200).json(result.Items);
  } catch (err) {
    next(err);
  }
}

async function createPreferences(req, res, next) {
  try {
    const uuid = uuidv4();
    req.body.id = uuid;
    const { error, value } = preferencesSchema.validate(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    const { id, score, maximum_score, rating, digital_preferences, eligible_preferences, recommendations } = value;

    const params = {
      TableName: "Preferences",
      Item: {
        id,
        score,
        maximum_score, 
        rating, 
        digital_preferences,
        eligible_preferences,
        recommendations
      },
    };

    const command = new PutCommand(params);

    await database.send(command);

    res
      .status(201)
      .json({ message: "Successfully created communication preferences for customer:", data: params.Item });
  } catch (error) {
    next(error);
  }
}

async function getPreferencesById(req, res, next) {
  const customerId = req.params.id;
  try {
    const params = {
      TableName: "Preferences",
      Key: { id: customerId },
    };
    const command = new GetCommand(params);
    const result = await database.send(command);
    if (!result.Item) {
      return res.status(404).json({ message: "No preference found" });
    }
    res.status(200).json(result.Item);
  } catch (err) {
    next(err);
  }
}


async function updatePreferencesById(req, res, next) {
  try {
    const customerId = req.params.id;
    req.body.id = customerId;
    const { error, value } = preferencesSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { score, maximum_score, rating, digital_preferences, eligible_preferences, recommendations } = value;

    // Get the preferences record from DynamoDB
    const getParams = {
      TableName: "Preferences",
      Key: { id: customerId},
    };

    const getCommand = new GetCommand(getParams);

    const result = await database.send(getCommand);

    const preference = result.Item;

    if (!preference) {
      return res.status(404).json({ message: "No preferences found" });
    }

    // Update the account in DynamoDB
    const updateParams = {
      TableName: "Preferences",
      Key: { id: customerId },
      UpdateExpression:
        "set #score = :score, #maximum_score = :maximum_score, #rating = :rating, #digital_preferences = :digital_preferences, #eligible_preferences = :eligible_preferences, #recommendations = :recommendations",
      ExpressionAttributeNames: {
        "#score": "score",
        "#maximum_score": "maximum_score",
        "#rating": "rating",
        "#digital_preferences": "digital_preferences",
        "#eligible_preferences": "eligible_preferences",
        "#recommendations": "recommendations",
      },
      ExpressionAttributeValues: {
        ":score": score,
        ":maximum_score": maximum_score,
        ":rating": rating,
        ":digital_preferences": digital_preferences,
        ":eligible_preferences": eligible_preferences,
        ":recommendations": recommendations,
      },
      ReturnValues: "ALL_NEW",
    };
    const updateCommand = new UpdateCommand(updateParams);
    const updatedPreferences = await database.send(updateCommand);

    res.status(200).json(updatedPreferences.Attributes);
  } catch (err) {
    next(err);
  }
}

async function deletePreferencesById(req, res, next) {
  const  customerId = req.params.id;

  try {
    const params = {
      TableName: "Preferences",
      Key: { id: customerId },
    };
    const command = new DeleteCommand(params);
    await database.send(command);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export default {
  getAllPreferences,
  createPreferences,
  getPreferencesById,
  updatePreferencesById,
  deletePreferencesById,
};

/*
function getAllPreferences(req, res) {
    res.send(
      "🤖 Preferences Route with GET method - this endpoint will get all of the preferences from the database"
    );
  }
  
function createPreference(req, res) {
    res.send(
      "🤖 Preferences Route with POST method - this endpoint will create a new preference in the database"
    );
  }

function updatePreferenceById(req, res) {
    const accountId = req.params.id;
    res.send(
      "🤖 Preferences Route with PATCH method - this endpoint will update a  document preference in the database.  The account is:" + accountId
    );
  }

function deletePreferenceById(req, res) {
    const accountId = req.params.id;
    res.send(
      "🤖 Preferences Route with DELETE method - this endpoint will delete  document preference in the database. The account is:" + accountId 
    );
  }
  
  export default {
    getAllPreferences,
    createPreference,
    updatePreferenceById,
    deletePreferenceById,
  };*/