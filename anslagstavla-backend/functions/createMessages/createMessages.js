import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { nanoid } from 'nanoid';

const client = new DynamoDBClient({ region: 'eu-north-1' });
const dynamodb = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST'
  };

  try {
    // Parsa request body
    const body = JSON.parse(event.body);
    const { username, text } = body;
    
    // Validering
    if (!username?.trim() || !text?.trim()) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          error: 'Både användarnamn och meddelande krävs' 
        })
      };
    }

    // Skapa meddelande objekt
    const message = {
      id: nanoid(5), 
      username: username.trim(),
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    // Spara i DynamoDB
    const command = new PutCommand({
      TableName: 'Messages',
      Item: message
    });
    
    await dynamodb.send(command);

    return {
      statusCode: 201,
      headers: corsHeaders,
      body: JSON.stringify({ 
        success: true,
        message: 'Meddelande skapat!',
        data: message 
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        error: 'Kunde inte skapa meddelandet',
        details: error.message 
      })
    };
  }
};