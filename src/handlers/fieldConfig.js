const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const FIELD_CONFIG_TABLE = process.env.FIELD_CONFIG_TABLE;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// Get field configuration
module.exports.get = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;

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
module.exports.update = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const { fields } = JSON.parse(event.body);

    if (!Array.isArray(fields)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Fields must be an array' })
      };
    }

    const item = {
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
