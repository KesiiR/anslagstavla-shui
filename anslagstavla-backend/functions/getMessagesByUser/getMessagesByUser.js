import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET",
  };

  try {
    // Hämta username från path parameters
    const username = event.pathParameters?.username;
    
    // Kontrollera att username finns
    if (!username) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: "Användarnamn saknas i URL:en",
        }),
      };
    }

    // Hämta sortOrder från query parameters
    const sortOrder = event.queryStringParameters?.sortOrder || "newest";

    // Hämta meddelanden från specifik användare med GSI
    const command = new QueryCommand({
      TableName: "Messages",
      IndexName: "username-createdAt-index",
      KeyConditionExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    });

    const result = await dynamodb.send(command);

    // Sortera meddelanden på createdAt (samma som getMessages)
    let messages;
    if (sortOrder === "oldest") {
      // Äldst först
      messages = result.Items.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    } else {
      // Nyast först (default)
      messages = result.Items.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `Meddelanden från ${username} hämtade!`,
        data: messages,
        count: messages.length,
        username: username,
        sortedBy: sortOrder,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Kunde inte hämta meddelanden för användaren",
        details: error.message,
      }),
    };
  }
};