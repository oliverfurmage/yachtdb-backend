import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const dynamodb = new DynamoDB.DocumentClient();
const FIELD_CONFIG_TABLE = process.env.FIELD_CONFIG_TABLE!;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

interface FieldDefinition {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'textarea' | 'select';
  label: string;
  required: boolean;
  options?: string[];
}

interface FieldConfiguration {
  userId: string;
  fields: FieldDefinition[];
  updatedAt: string;
}

// Get field configuration
export const get = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt.claims.sub as string;

    const result = await dynamodb.get({
      TableName: FIELD_CONFIG_TABLE,
      Key: { userId }
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          userId,
          fields: [],
          updatedAt: new Date().toISOString()
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting field config:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get field configuration' })
    };
  }
};

// Update field configuration
export const update = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.requestContext.authorizer?.jwt.claims.sub as string;
    const { fields } = JSON.parse(event.body || '{}') as { fields: FieldDefinition[] };

    if (!Array.isArray(fields)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Fields must be an array' })
      };
    }

    const item: FieldConfiguration = {
      userId,
      fields,
      updatedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: FIELD_CONFIG_TABLE,
      Item: item
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Error updating field config:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update field configuration' })
    };
  }
};
