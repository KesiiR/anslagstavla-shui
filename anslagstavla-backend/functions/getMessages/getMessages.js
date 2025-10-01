import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-north-1" });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET",
  };

  try {
    // sortOrder från query parameters
    const sortOrder = event.queryStringParameters?.sortOrder || "newest";

    // Hämta alla meddelanden från DynamoDB
    const command = new ScanCommand({
      TableName: "Messages",
    });

    const result = await dynamodb.send(command);

    // Sortera meddelanden på createdAt.
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
        message: "Meddelanden hämtade!",
        data: messages,
        count: messages.length,
        sortedBy: sortOrder,
      }),
    };
  } catch (error) {
    console.error("Error:", error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Kunde inte hämta meddelanden",
        details: error.message,
      }),
    };
  }
};
