# API Documentation

## Base URL

```
https://your-api-id.execute-api.us-east-1.amazonaws.com
```

## Authentication

All endpoints require JWT authentication via AWS Cognito. Include the JWT token in the Authorization header:

```
Authorization: Bearer <jwt-token>
```

## Endpoints

### Field Configuration

#### Get Field Configuration

Get the custom field configuration for the authenticated user.

```http
GET /field-config
```

**Response:**

```json
{
  "userId": "abc123-user-id",
  "fields": [
    {
      "name": "length",
      "type": "number",
      "label": "Length (ft)",
      "required": true
    },
    {
      "name": "condition",
      "type": "select",
      "label": "Condition",
      "required": true,
      "options": ["New", "Used", "Excellent", "Good", "Fair"]
    }
  ],
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

#### Update Field Configuration

Update the custom field configuration.

```http
PUT /field-config
```

**Request Body:**

```json
{
  "fields": [
    {
      "name": "length",
      "type": "number",
      "label": "Length (ft)",
      "required": true
    },
    {
      "name": "year",
      "type": "number",
      "label": "Year Built",
      "required": true
    },
    {
      "name": "description",
      "type": "textarea",
      "label": "Description",
      "required": false
    }
  ]
}
```

**Response:**

```json
{
  "userId": "abc123-user-id",
  "fields": [...],
  "updatedAt": "2025-11-13T10:35:00.000Z"
}
```

### Yachts

#### List All Yachts

Get all yachts for the authenticated user.

```http
GET /yachts
```

**Response:**

```json
[
  {
    "userId": "abc123-user-id",
    "id": "yacht-id-1",
    "name": "Sea Breeze",
    "data": {
      "length": 45,
      "year": 2020,
      "manufacturer": "Beneteau",
      "condition": "Excellent"
    },
    "createdAt": "2025-11-10T08:00:00.000Z",
    "updatedAt": "2025-11-10T08:00:00.000Z"
  }
]
```

#### Get Single Yacht

Get a specific yacht by ID.

```http
GET /yachts/{id}
```

**Parameters:**
- `id` (path) - Yacht ID

**Response:**

```json
{
  "userId": "abc123-user-id",
  "id": "yacht-id-1",
  "name": "Sea Breeze",
  "data": {
    "length": 45,
    "year": 2020,
    "manufacturer": "Beneteau",
    "condition": "Excellent"
  },
  "createdAt": "2025-11-10T08:00:00.000Z",
  "updatedAt": "2025-11-10T08:00:00.000Z"
}
```

**Error Response (404):**

```json
{
  "error": "Yacht not found"
}
```

#### Create Yacht

Create a new yacht listing.

```http
POST /yachts
```

**Request Body:**

```json
{
  "name": "Ocean Explorer",
  "data": {
    "length": 52,
    "year": 2022,
    "manufacturer": "Jeanneau",
    "condition": "New",
    "price": 450000,
    "description": "Beautiful yacht with modern amenities"
  }
}
```

**Response (201):**

```json
{
  "userId": "abc123-user-id",
  "id": "yacht-id-2",
  "name": "Ocean Explorer",
  "data": {
    "length": 52,
    "year": 2022,
    "manufacturer": "Jeanneau",
    "condition": "New",
    "price": 450000,
    "description": "Beautiful yacht with modern amenities"
  },
  "createdAt": "2025-11-13T11:00:00.000Z",
  "updatedAt": "2025-11-13T11:00:00.000Z"
}
```

**Error Response (400):**

```json
{
  "error": "Name and data are required"
}
```

#### Update Yacht

Update an existing yacht.

```http
PUT /yachts/{id}
```

**Parameters:**
- `id` (path) - Yacht ID

**Request Body:**

```json
{
  "name": "Ocean Explorer",
  "data": {
    "length": 52,
    "year": 2022,
    "manufacturer": "Jeanneau",
    "condition": "Used",
    "price": 420000,
    "description": "Beautiful yacht with modern amenities - price reduced!"
  }
}
```

**Response (200):**

```json
{
  "userId": "abc123-user-id",
  "id": "yacht-id-2",
  "name": "Ocean Explorer",
  "data": {
    "length": 52,
    "year": 2022,
    "manufacturer": "Jeanneau",
    "condition": "Used",
    "price": 420000,
    "description": "Beautiful yacht with modern amenities - price reduced!"
  },
  "createdAt": "2025-11-13T11:00:00.000Z",
  "updatedAt": "2025-11-13T12:30:00.000Z"
}
```

**Error Responses:**

```json
// 404 Not Found
{
  "error": "Yacht not found"
}

// 400 Bad Request
{
  "error": "Name and data are required"
}
```

#### Delete Yacht

Delete a yacht listing.

```http
DELETE /yachts/{id}
```

**Parameters:**
- `id` (path) - Yacht ID

**Response (204):**

No content (empty response body)

**Error Response (404):**

```json
{
  "error": "Yacht not found"
}
```

## Field Types

When configuring fields, the following types are supported:

| Type | Description | Example Value |
|------|-------------|---------------|
| `text` | Short text input | "Beneteau" |
| `textarea` | Multi-line text | "Beautiful yacht with..." |
| `number` | Numeric value | 45 |
| `date` | Date value | "2022-01-15" |
| `boolean` | True/false checkbox | true |
| `select` | Dropdown selection | "Excellent" |

## Error Responses

### 400 Bad Request

Invalid request data.

```json
{
  "error": "Name and data are required"
}
```

### 401 Unauthorized

Missing or invalid authentication token.

```json
{
  "message": "Unauthorized"
}
```

### 404 Not Found

Resource not found.

```json
{
  "error": "Yacht not found"
}
```

### 500 Internal Server Error

Server error.

```json
{
  "error": "Failed to create yacht"
}
```

## Rate Limiting

Currently no rate limiting is enforced. In production, consider implementing:
- API Gateway throttling
- Lambda concurrency limits
- DynamoDB capacity limits

## CORS

CORS is configured to allow all origins (`*`). In production, update to specific domain:

```javascript
const headers = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Credentials': true,
};
```

## Testing with cURL

### Get Field Configuration

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api.execute-api.us-east-1.amazonaws.com/field-config
```

### Create Yacht

```bash
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Yacht","data":{"length":40,"year":2021}}' \
  https://your-api.execute-api.us-east-1.amazonaws.com/yachts
```

### List Yachts

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api.execute-api.us-east-1.amazonaws.com/yachts
```

### Delete Yacht

```bash
curl -X DELETE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  https://your-api.execute-api.us-east-1.amazonaws.com/yachts/yacht-id-123
```

## Postman Collection

Import this URL to get started with Postman:

```
Coming soon
```

## Client Libraries

The frontend uses Axios with automatic JWT token injection:

```typescript
import { apiClient } from '@/lib/api'

// Get yachts
const yachts = await apiClient.getYachts()

// Create yacht
const newYacht = await apiClient.createYacht('My Yacht', {
  length: 45,
  year: 2020
})
```

See `admin/src/lib/api.ts` for implementation details.
