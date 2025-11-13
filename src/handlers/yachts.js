const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const YACHTS_TABLE = process.env.YACHTS_TABLE;

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

// List all yachts for a user
module.exports.list = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;

    const result = await dynamodb.query({
      TableName: YACHTS_TABLE,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Items)
    };
  } catch (error) {
    console.error('Error listing yachts:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to list yachts' })
    };
  }
};

// Get a single yacht
module.exports.get = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const { id } = event.pathParameters;

    const result = await dynamodb.get({
      TableName: YACHTS_TABLE,
      Key: { userId, id }
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Yacht not found' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.Item)
    };
  } catch (error) {
    console.error('Error getting yacht:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to get yacht' })
    };
  }
};

// Create a new yacht
module.exports.create = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const { name, data } = JSON.parse(event.body);

    if (!name || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and data are required' })
      };
    }

    const item = {
      userId,
      id: uuidv4(),
      name,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: YACHTS_TABLE,
      Item: item
    }).promise();

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Error creating yacht:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create yacht' })
    };
  }
};

// Update a yacht
module.exports.update = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const { id } = event.pathParameters;
    const { name, data } = JSON.parse(event.body);

    if (!name || !data) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and data are required' })
      };
    }

    // First check if the yacht exists and belongs to the user
    const existing = await dynamodb.get({
      TableName: YACHTS_TABLE,
      Key: { userId, id }
    }).promise();

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Yacht not found' })
      };
    }

    const item = {
      ...existing.Item,
      name,
      data,
      updatedAt: new Date().toISOString()
    };

    await dynamodb.put({
      TableName: YACHTS_TABLE,
      Item: item
    }).promise();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(item)
    };
  } catch (error) {
    console.error('Error updating yacht:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update yacht' })
    };
  }
};

// Delete a yacht
module.exports.delete = async (event) => {
  try {
    const userId = event.requestContext.authorizer.jwt.claims.sub;
    const { id } = event.pathParameters;

    // First check if the yacht exists
    const existing = await dynamodb.get({
      TableName: YACHTS_TABLE,
      Key: { userId, id }
    }).promise();

    if (!existing.Item) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Yacht not found' })
      };
    }

    await dynamodb.delete({
      TableName: YACHTS_TABLE,
      Key: { userId, id }
    }).promise();

    return {
      statusCode: 204,
      headers,
      body: ''
    };
  } catch (error) {
    console.error('Error deleting yacht:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to delete yacht' })
    };
  }
};
