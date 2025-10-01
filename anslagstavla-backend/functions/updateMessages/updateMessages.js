import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "PUT",
  };

  try {
    // Hämta message ID från path parameters
    const messageId = event.pathParameters?.id;

    // Kontrollera att ID finns
    if (!messageId) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Meddelande ID saknas i URL:en",
        }),
      };
    }

    const body = JSON.parse(event.body);
    const { text } = body;

    // Validering av ny text
    if (!text?.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Ny text krävs för att uppdatera meddelandet",
        }),
      };
    }

    // Kontrollera att meddelandet finns först
    const getCommand = new GetCommand({
      TableName: "Messages",
      Key: {
        id: messageId,
      },
    });

    const existingMessage = await dynamodb.send(getCommand);

    if (!existingMessage.Item) {
      return {
        statusCode: 404,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Meddelandet finns inte",
        }),
      };
    }

    // Uppdatera meddelandet
    const updateCommand = new UpdateCommand({
      TableName: "Messages",
      Key: {
        id: messageId,
      },
      UpdateExpression: "SET #text = :text",
      ExpressionAttributeNames: {
        "#text": "text",
      },
      ExpressionAttributeValues: {
        ":text": text.trim(),
      },
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamodb.send(updateCommand);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: "Meddelandet har uppdaterats!",
        data: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Kunde inte uppdatera meddelandet",
        details: error.message,
      }),
    };
  }
};
