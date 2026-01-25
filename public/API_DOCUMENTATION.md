# IQ Auto Deals API Documentation for Dealers

**Version:** 1.0
**Last Updated:** October 26, 2025
**Base URL:** `https://iqautodeals.com`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Rate Limits](#rate-limits)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Inventory Management](#inventory-management)
   - [Image Upload](#image-upload)
   - [Deal Management](#deal-management)
   - [Reports & Analytics](#reports--analytics)
6. [Data Models](#data-models)
7. [Bulk Operations](#bulk-operations-best-practices)
8. [Webhooks](#webhooks)
9. [Support](#support)

---

## Overview

The IQ Auto Deals API allows dealers with large inventories to programmatically manage their vehicle listings, pricing, images, and deals. This RESTful API supports JSON request/response formats and is designed for high-volume operations.

**Key Features:**
- Add, update, and delete vehicle listings in bulk
- Upload up to 15 photos per vehicle
- Manage customer deal requests and negotiations
- Track sales, test drives, and inventory status
- Access real-time analytics and reports

**Ideal For:**
- Dealerships with 50+ vehicles
- Multi-location dealer groups
- Inventory management system integrations
- Third-party automotive platforms

---

## Authentication

All API requests require authentication using dealer credentials. You must first obtain a session token by logging in.

### Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "dealer@dealership.com",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "dealer@dealership.com",
    "name": "John Smith",
    "userType": "dealer"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

**Important:** Store the `user.id` (dealer ID) securely. You'll need it for all subsequent API calls.

---

## Complete End-to-End Example

Here's a complete workflow showing how to add a vehicle with photos:

```javascript
// STEP 1: Login and get your dealer ID
const loginResponse = await fetch('https://iqautodeals.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'dealer@dealership.com',
    password: 'your_password'
  })
});

const { user } = await loginResponse.json();
const dealerId = user.id;  // SAVE THIS! e.g., "550e8400-e29b-41d4-a716..."
console.log('Logged in! Dealer ID:', dealerId);

// STEP 2: Upload photos for your vehicle
const photoFiles = [file1, file2, file3];  // Your image files
const photoUrls = [];

for (const file of photoFiles) {
  const formData = new FormData();
  formData.append('file', file);

  const uploadResponse = await fetch('https://iqautodeals.com/api/upload', {
    method: 'POST',
    body: formData
  });

  const { url } = await uploadResponse.json();
  photoUrls.push(url);
  console.log('Uploaded photo:', url);
}

// STEP 3: Create the vehicle listing
const carResponse = await fetch('https://iqautodeals.com/api/dealer/cars', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dealerId: dealerId,              // From Step 1
    make: 'Honda',
    model: 'Accord',
    year: 2023,
    vin: '1HGCV1F30JA123456',
    mileage: 8500,
    color: 'Black',
    transmission: 'Automatic',
    salePrice: 28900.00,
    description: 'Certified pre-owned, excellent condition',
    photos: photoUrls,                // From Step 2
    city: 'Los Angeles',
    state: 'CA',
    latitude: 34.0522,                // Your dealership location
    longitude: -118.2437
  })
});

const { car } = await carResponse.json();
console.log('Vehicle added! Car ID:', car.id);

// DONE! Your vehicle is now listed on IQ Auto Deals
```

---

## Rate Limits

Current rate limits per dealer account:

- **Standard Tier:** 1,000 requests per hour
- **Enterprise Tier:** 10,000 requests per hour

**Rate Limit Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1698765432
```

When rate limit is exceeded, you'll receive a `429 Too Many Requests` response.

---

## Error Handling

### Standard Error Response

All errors follow this format:

```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request succeeded |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or missing credentials |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

---

## API Endpoints

### Authentication Endpoints

#### Login
- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Description:** Authenticate and obtain dealer session
- **Auth Required:** No

**Request:**
```json
{
  "email": "dealer@dealership.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "user": {
    "id": "dealer-uuid",
    "email": "dealer@dealership.com",
    "name": "Dealer Name",
    "userType": "dealer"
  }
}
```

---

### Inventory Management

#### Get All Inventory

- **URL:** `/api/dealer/cars?dealerId={dealerId}`
- **Method:** `GET`
- **Description:** Retrieve all vehicles in your inventory
- **Auth Required:** Yes (dealer ID)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dealerId | string | Yes | Your dealer UUID (from login response) |

**Full URL Example:**
```
GET https://iqautodeals.com/api/dealer/cars?dealerId=550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "cars": [
    {
      "id": "car-uuid-1",
      "dealerId": "dealer-uuid",
      "make": "Toyota",
      "model": "Camry",
      "year": 2022,
      "vin": "1HGBH41JXMN109186",
      "mileage": 15000,
      "color": "Silver",
      "transmission": "Automatic",
      "salePrice": 24500.00,
      "description": "Excellent condition, one owner",
      "photos": "[\"https://blob.vercel-storage.com/photo1.jpg\", \"https://blob.vercel-storage.com/photo2.jpg\"]",
      "latitude": 41.8781,
      "longitude": -87.6298,
      "city": "Chicago",
      "state": "IL",
      "status": "active",
      "listingFeePaid": true,
      "createdAt": "2025-10-15T10:30:00Z",
      "acceptedDeals": []
    }
  ],
  "soldCount": 12
}
```

---

#### Add Vehicle to Inventory

- **URL:** `/api/dealer/cars`
- **Method:** `POST`
- **Description:** Add a new vehicle to your inventory
- **Auth Required:** Yes (dealer ID in request body)

**Request Body:**
```json
{
  "dealerId": "dealer-uuid",
  "make": "Honda",
  "model": "Accord",
  "year": 2023,
  "vin": "1HGCV1F30JA123456",
  "mileage": 8500,
  "color": "Black",
  "transmission": "Automatic",
  "salePrice": 28900.00,
  "description": "Certified pre-owned, excellent condition",
  "photos": ["https://blob.vercel-storage.com/honda1.jpg", "https://blob.vercel-storage.com/honda2.jpg"],
  "latitude": 34.0522,
  "longitude": -118.2437,
  "city": "Los Angeles",
  "state": "CA"
}
```

**Field Requirements:**

| Field | Type | Required | Max Length | Notes |
|-------|------|----------|------------|-------|
| dealerId | string | Yes | - | Your dealer UUID |
| make | string | Yes | 50 | Vehicle manufacturer |
| model | string | Yes | 50 | Vehicle model |
| year | integer | Yes | - | 1900-2026 |
| vin | string | Yes | 17 | Must be unique |
| mileage | integer | Yes | - | Current odometer reading |
| color | string | Yes | 30 | Exterior color |
| transmission | string | Yes | 20 | e.g., "Automatic", "Manual" |
| salePrice | float | Yes | - | Your asking price |
| description | string | Yes | 1000 | Vehicle description |
| photos | array | No | 15 URLs | Array of image URLs from /api/upload |
| latitude | float | Yes | - | Vehicle location latitude (use Google Maps or geocoding service) |
| longitude | float | Yes | - | Vehicle location longitude (use Google Maps or geocoding service) |
| city | string | Yes | 100 | Vehicle location city (e.g., "Los Angeles") |
| state | string | Yes | 2 | US state code (e.g., "CA", "TX", "NY") |

**How to Get Latitude & Longitude:**
You can use your dealership's address to get coordinates:
1. **Google Maps**: Right-click your location → Click the coordinates at the bottom
2. **Geocoding API**: Use a service like Google Geocoding API to convert "123 Main St, Los Angeles, CA" to lat/long
3. **Fixed Values**: If all your vehicles are at your dealership, use the same coordinates for all vehicles

**Example Coordinates:**
- Los Angeles, CA: `34.0522, -118.2437`
- New York, NY: `40.7128, -74.0060`
- Chicago, IL: `41.8781, -87.6298`
- Houston, TX: `29.7604, -95.3698`

**Response (200 OK):**
```json
{
  "car": {
    "id": "new-car-uuid",
    "dealerId": "dealer-uuid",
    "make": "Honda",
    "model": "Accord",
    "year": 2023,
    "vin": "1HGCV1F30JA123456",
    "mileage": 8500,
    "color": "Black",
    "transmission": "Automatic",
    "salePrice": 28900.00,
    "description": "Certified pre-owned, excellent condition",
    "photos": "[\"https://blob.vercel-storage.com/honda1.jpg\", \"https://blob.vercel-storage.com/honda2.jpg\"]",
    "latitude": 34.0522,
    "longitude": -118.2437,
    "city": "Los Angeles",
    "state": "CA",
    "status": "active",
    "listingFeePaid": true,
    "createdAt": "2025-10-26T14:22:00Z"
  }
}
```

**Error Responses:**

- **400 Bad Request:** Missing required fields
- **409 Conflict:** VIN already exists
- **500 Internal Server Error:** Database error

---

#### Get Single Vehicle

- **URL:** `/api/dealer/cars/{carId}?dealerId={dealerId}`
- **Method:** `GET`
- **Description:** Retrieve details of a specific vehicle
- **Auth Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| carId | string | Yes | Vehicle UUID (from "Get All Inventory" response) |

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dealerId | string | Yes | Your dealer UUID (from login response) |

**Full URL Example:**
```
GET https://iqautodeals.com/api/dealer/cars/a1b2c3d4-5678-90ab-cdef-1234567890ab?dealerId=550e8400-e29b-41d4-a716-446655440000
```

**Where to Get carId:**
Call "Get All Inventory" first, then use the `id` field from any car in the response.

**Response (200 OK):**
```json
{
  "id": "car-uuid",
  "dealerId": "dealer-uuid",
  "make": "Ford",
  "model": "F-150",
  "year": 2022,
  "vin": "1FTFW1E57KFA12345",
  "mileage": 22000,
  "color": "Blue",
  "transmission": "Automatic",
  "salePrice": 42500.00,
  "description": "4WD, Crew Cab, XLT Package",
  "photos": "[\"https://blob.vercel-storage.com/f150-1.jpg\"]",
  "latitude": 29.7604,
  "longitude": -95.3698,
  "city": "Houston",
  "state": "TX",
  "status": "active",
  "listingFeePaid": true,
  "createdAt": "2025-10-20T08:15:00Z"
}
```

**Error Responses:**
- **404 Not Found:** Vehicle doesn't exist or you don't own it

---

#### Update Vehicle

- **URL:** `/api/dealer/cars/{carId}`
- **Method:** `PUT`
- **Description:** Update vehicle details (price, mileage, photos, etc.)
- **Auth Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| carId | string | Yes | Vehicle UUID to update |

**Request Body:**
```json
{
  "make": "Ford",
  "model": "F-150",
  "year": 2022,
  "vin": "1FTFW1E57KFA12345",
  "mileage": 23000,
  "color": "Blue",
  "transmission": "Automatic",
  "salePrice": 41500.00,
  "description": "4WD, Crew Cab, XLT Package - Price Reduced!",
  "photos": "[\"https://blob.vercel-storage.com/f150-1.jpg\", \"https://blob.vercel-storage.com/f150-2.jpg\", \"https://blob.vercel-storage.com/f150-3.jpg\"]",
  "latitude": 29.7604,
  "longitude": -95.3698,
  "city": "Houston",
  "state": "TX"
}
```

**Note:** All fields in the request body will update the vehicle. Include all fields, not just changed ones.

**Response (200 OK):**
```json
{
  "id": "car-uuid",
  "dealerId": "dealer-uuid",
  "make": "Ford",
  "model": "F-150",
  "year": 2022,
  "vin": "1FTFW1E57KFA12345",
  "mileage": 23000,
  "color": "Blue",
  "transmission": "Automatic",
  "salePrice": 41500.00,
  "description": "4WD, Crew Cab, XLT Package - Price Reduced!",
  "photos": "[\"https://blob.vercel-storage.com/f150-1.jpg\", \"https://blob.vercel-storage.com/f150-2.jpg\", \"https://blob.vercel-storage.com/f150-3.jpg\"]",
  "latitude": 29.7604,
  "longitude": -95.3698,
  "city": "Houston",
  "state": "TX",
  "status": "active",
  "listingFeePaid": true,
  "createdAt": "2025-10-20T08:15:00Z"
}
```

**Common Use Cases:**
- Update pricing
- Add/remove photos
- Update mileage
- Change description

---

#### Delete Vehicle

- **URL:** `/api/dealer/cars/{carId}`
- **Method:** `DELETE`
- **Description:** Remove a vehicle from your inventory
- **Auth Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| carId | string | Yes | Vehicle UUID to delete |

**Response (200 OK):**
```json
{
  "message": "Car deleted successfully"
}
```

**Error Responses:**
- **404 Not Found:** Vehicle doesn't exist
- **500 Internal Server Error:** Deletion failed

**Important:** Deleting a vehicle will also delete all associated data (negotiations, selected cars, etc.) due to cascade delete.

---

### Image Upload

#### Upload Vehicle Photo

- **URL:** `/api/upload`
- **Method:** `POST`
- **Description:** Upload a single vehicle photo to cloud storage
- **Auth Required:** Yes
- **Content-Type:** `multipart/form-data`

**Request:**
```
POST /api/upload
Content-Type: multipart/form-data

file: [binary image data]
```

**Supported Formats:**
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

**File Size Limit:** 10MB per image

**Response (200 OK):**
```json
{
  "url": "https://blob.vercel-storage.com/vehicle-photo-abc123.jpg"
}
```

**Error Responses:**

**400 Bad Request - Invalid file type:**
```json
{
  "error": "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
}
```

**400 Bad Request - File too large:**
```json
{
  "error": "File too large. Maximum size is 10MB"
}
```

**Best Practice for Multiple Photos:**

Upload each photo individually, collect the URLs, then include them in the `photos` array when creating/updating a vehicle:

```javascript
// Example workflow
const photoUrls = [];

for (const file of files) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://iqautodeals.com/api/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  photoUrls.push(data.url);
}

// Now create/update car with photoUrls
await fetch('https://iqautodeals.com/api/dealer/cars', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    // ... other car data
    photos: photoUrls
  })
});
```

---

### Deal Management

#### Get Deal Requests

- **URL:** `/api/dealer/deal-requests?dealerId={dealerId}`
- **Method:** `GET`
- **Description:** Retrieve all customer deal requests for your vehicles
- **Auth Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dealerId | string | Yes | Your dealer UUID (from login response) |

**Full URL Example:**
```
GET https://iqautodeals.com/api/dealer/deal-requests?dealerId=550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "dealLists": [
    {
      "id": "deal-list-uuid",
      "customerId": "customer-uuid",
      "status": "active",
      "createdAt": "2025-10-25T09:00:00Z",
      "customer": {
        "id": "customer-uuid",
        "email": "customer@email.com",
        "name": "Jane Doe",
        "phone": "+1-555-123-4567"
      },
      "selectedCars": [
        {
          "id": "selected-car-uuid",
          "dealListId": "deal-list-uuid",
          "carId": "car-uuid",
          "originalPrice": 28900.00,
          "currentOfferPrice": 27500.00,
          "negotiationCount": 2,
          "status": "pending",
          "createdAt": "2025-10-25T09:00:00Z",
          "car": {
            "id": "car-uuid",
            "make": "Honda",
            "model": "Accord",
            "year": 2023,
            "vin": "1HGCV1F30JA123456",
            "mileage": 8500,
            "salePrice": 28900.00,
            "dealer": {
              "id": "dealer-uuid",
              "businessName": "Quality Auto Sales",
              "name": "John Smith"
            },
            "acceptedDeals": []
          },
          "negotiations": [
            {
              "id": "negotiation-uuid-1",
              "selectedCarId": "selected-car-uuid",
              "dealerId": "dealer-uuid",
              "offeredPrice": 28000.00,
              "createdAt": "2025-10-25T10:15:00Z"
            },
            {
              "id": "negotiation-uuid-2",
              "selectedCarId": "selected-car-uuid",
              "dealerId": "dealer-uuid",
              "offeredPrice": 27500.00,
              "createdAt": "2025-10-25T14:30:00Z"
            }
          ]
        }
      ]
    }
  ]
}
```

**Key Fields Explained:**
- `currentOfferPrice`: Lowest price offered by any dealer (including you)
- `negotiationCount`: Total number of offers from all dealers
- `negotiations`: Your offer history for this car
- `acceptedDeals`: Empty array if no deal accepted yet

---

#### Submit Offer/Bid

- **URL:** `/api/dealer/submit-offer`
- **Method:** `POST`
- **Description:** Submit a competitive offer for a customer's selected car
- **Auth Required:** Yes

**Request Body:**
```json
{
  "selectedCarId": "selected-car-uuid",
  "dealerId": "dealer-uuid",
  "offerPrice": 27500.00
}
```

**Where to Get These Values:**
1. **dealerId**: From your login response (`user.id`)
2. **selectedCarId**: From "Get Deal Requests" response → `dealLists[].selectedCars[].id`
3. **offerPrice**: Your competitive offer price (must be lower than `currentOfferPrice` to be competitive)

**Full Workflow Example:**
```javascript
// Step 1: Get deal requests
const dealsResponse = await fetch('https://iqautodeals.com/api/dealer/deal-requests?dealerId=YOUR_DEALER_ID');
const { dealLists } = await dealsResponse.json();

// Step 2: Find a car you want to bid on
const selectedCar = dealLists[0].selectedCars[0];  // First car in first deal
console.log('Customer wants:', selected Car.car.make, selectedCar.car.model);
console.log('Current lowest offer:', selectedCar.currentOfferPrice);

// Step 3: Submit your competitive offer
await fetch('https://iqautodeals.com/api/dealer/submit-offer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    selectedCarId: selectedCar.id,  // From Step 2
    dealerId: 'YOUR_DEALER_ID',     // From login
    offerPrice: 27500.00             // Your offer (lower than currentOfferPrice)
  })
});
```

**Business Rules:**
- Maximum 3 offers per car per dealer
- Each subsequent offer must be lower than your previous offers
- Customer sees only the lowest offer from all dealers

**Response (200 OK):**
```json
{
  "success": true,
  "negotiation": {
    "id": "negotiation-uuid",
    "selectedCarId": "selected-car-uuid",
    "dealerId": "dealer-uuid",
    "offeredPrice": 27500.00,
    "createdAt": "2025-10-26T15:00:00Z"
  },
  "message": "Offer submitted successfully"
}
```

**Error Responses:**

**400 Bad Request - Maximum offers reached:**
```json
{
  "error": "Maximum 3 offers per car allowed"
}
```

**400 Bad Request - Missing fields:**
```json
{
  "error": "Missing required fields"
}
```

**Strategy Tips:**
- Start with a competitive but profitable offer
- Monitor `currentOfferPrice` to see competing bids
- Use your 3 offers strategically
- Lower offers increase win probability

---

#### Mark Deal as Sold

- **URL:** `/api/dealer/mark-as-sold`
- **Method:** `POST`
- **Description:** Mark an accepted deal as sold after transaction completion
- **Auth Required:** Yes

**Request Body:**
```json
{
  "acceptedDealId": "accepted-deal-uuid",
  "finalPrice": 27300.00
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| acceptedDealId | string | Yes | UUID of the accepted deal (from dealer dashboard or notifications) |
| finalPrice | float | No | Final negotiated price (if different from agreed price) |

**Where to Get acceptedDealId:**
When a customer accepts your offer, you'll receive an AcceptedDeal. You can find these on your dealer dashboard or by checking the `acceptedDeals` array in the "Get Deal Requests" response for cars with `status: "won"`.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Deal marked as sold successfully",
  "deal": {
    "id": "accepted-deal-uuid",
    "customerId": "customer-uuid",
    "carId": "car-uuid",
    "finalPrice": 27300.00,
    "verificationCode": "ABC123",
    "depositReleased": false,
    "customerShowedUp": true,
    "sold": true,
    "deadDeal": false,
    "createdAt": "2025-10-25T16:00:00Z",
    "car": {
      "id": "car-uuid",
      "make": "Honda",
      "model": "Accord",
      "status": "sold"
    }
  }
}
```

**Important:** This action will:
1. Mark the deal as `sold: true`
2. Update car status to "sold"
3. Update final price if provided
4. Trigger analytics tracking

---

#### Mark Deal as Dead

- **URL:** `/api/dealer/dead-deal`
- **Method:** `POST`
- **Description:** Mark a deal as dead/cancelled (customer no-show, financing fell through, etc.)
- **Auth Required:** Yes

**Request Body:**
```json
{
  "acceptedDealId": "accepted-deal-uuid"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Deal marked as dead successfully",
  "deal": {
    "id": "accepted-deal-uuid",
    "deadDeal": true,
    "sold": false
  }
}
```

**Common Reasons to Mark as Dead:**
- Customer no-show for test drive
- Financing not approved
- Customer changed mind
- Better offer found elsewhere

**Important:** Dead deals are excluded from sold count and analytics.

---

### Reports & Analytics

#### Get Outbid Report

- **URL:** `/api/dealer/outbid-report?dealerId={dealerId}`
- **Method:** `GET`
- **Description:** See deals you lost to competitors and by how much
- **Auth Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dealerId | string | Yes | Your dealer UUID (from login response) |

**Full URL Example:**
```
GET https://iqautodeals.com/api/dealer/outbid-report?dealerId=550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "outbids": [
    {
      "selectedCarId": "selected-car-uuid",
      "carDetails": {
        "make": "Toyota",
        "model": "Camry",
        "year": 2022,
        "vin": "1HGBH41JXMN109186"
      },
      "yourLowestOffer": 24000.00,
      "winningOffer": 23500.00,
      "difference": 500.00,
      "offerCount": 3
    }
  ]
}
```

**Use Cases:**
- Analyze competitive pricing
- Adjust bidding strategy
- Identify high-competition vehicles

---

#### Get Dealer Reports

- **URL:** `/api/dealer/reports?dealerId={dealerId}`
- **Method:** `GET`
- **Description:** Comprehensive sales and inventory analytics
- **Auth Required:** Yes

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dealerId | string | Yes | Your dealer UUID (from login response) |

**Full URL Example:**
```
GET https://iqautodeals.com/api/dealer/reports?dealerId=550e8400-e29b-41d4-a716-446655440000
```

**Response (200 OK):**
```json
{
  "totalInventory": 125,
  "activeListings": 118,
  "soldVehicles": 47,
  "pendingDeals": 5,
  "totalRevenue": 1247500.00,
  "averageSalePrice": 26542.55,
  "dealStats": {
    "wonDeals": 47,
    "lostDeals": 23,
    "winRate": 67.14
  },
  "monthlyStats": [
    {
      "month": "2025-10",
      "sold": 12,
      "revenue": 324000.00
    }
  ]
}
```

---

## Data Models

### Car Object

```typescript
{
  id: string;              // UUID
  dealerId: string;        // Your dealer UUID
  make: string;            // e.g., "Toyota"
  model: string;           // e.g., "Camry"
  year: number;            // e.g., 2022
  vin: string;             // 17-character VIN (unique)
  mileage: number;         // Odometer reading
  color: string;           // Exterior color
  transmission: string;    // e.g., "Automatic", "Manual"
  salePrice: number;       // Your asking price (hidden from customers)
  description: string;     // Vehicle description
  photos: string;          // JSON array of photo URLs
  latitude: number;        // Location latitude
  longitude: number;       // Location longitude
  city: string;            // City name
  state: string;           // 2-letter state code
  status: string;          // "active", "sold", "pending"
  listingFeePaid: boolean; // Listing fee status
  createdAt: string;       // ISO 8601 timestamp
}
```

### Deal Request Object

```typescript
{
  id: string;              // DealList UUID
  customerId: string;      // Customer UUID
  status: string;          // "active", "accepted", "cancelled"
  createdAt: string;       // ISO 8601 timestamp
  customer: {
    id: string;
    email: string;
    name: string;
    phone: string;
  };
  selectedCars: SelectedCar[];
}
```

### Selected Car Object

```typescript
{
  id: string;              // SelectedCar UUID
  dealListId: string;      // Parent DealList UUID
  carId: string;           // Car UUID
  originalPrice: number;   // Initial asking price
  currentOfferPrice: number; // Lowest offer from any dealer
  negotiationCount: number;  // Total offers from all dealers
  status: string;          // "pending", "won", "lost"
  createdAt: string;       // ISO 8601 timestamp
  car: Car;                // Full car object
  negotiations: Negotiation[]; // Your offer history
}
```

### Negotiation Object

```typescript
{
  id: string;              // Negotiation UUID
  selectedCarId: string;   // SelectedCar UUID
  dealerId: string;        // Your dealer UUID
  offeredPrice: number;    // Your offered price
  createdAt: string;       // ISO 8601 timestamp
}
```

### Accepted Deal Object

```typescript
{
  id: string;              // AcceptedDeal UUID
  customerId: string;      // Customer UUID
  carId: string;           // Car UUID
  finalPrice: number;      // Agreed price
  verificationCode: string; // 6-digit code for customer
  depositReleased: boolean; // Deposit status
  customerShowedUp: boolean; // Customer arrival status
  sold: boolean;           // Sale completion status
  deadDeal: boolean;       // Deal cancellation status
  createdAt: string;       // ISO 8601 timestamp
  testDrive?: TestDrive;   // Associated test drive if any
}
```

---

## Bulk Operations Best Practices

For dealers managing large inventories (100+ vehicles), follow these best practices:

### 1. Batch API Requests

Instead of making individual requests, batch them:

```javascript
// Good: Parallel requests with rate limiting
const batchSize = 10;
for (let i = 0; i < cars.length; i += batchSize) {
  const batch = cars.slice(i, i + batchSize);
  const promises = batch.map(car => createCar(car));
  await Promise.all(promises);
  await sleep(1000); // Rate limit: wait 1 second between batches
}

// Bad: Sequential requests
for (const car of cars) {
  await createCar(car); // Too slow for large inventories
}
```

### 2. Photo Upload Strategy

Upload photos in parallel but respect rate limits:

```javascript
async function uploadCarWithPhotos(carData, photoFiles) {
  // Upload all photos in parallel
  const photoUrls = await Promise.all(
    photoFiles.map(file => uploadPhoto(file))
  );

  // Create car with photo URLs
  return await createCar({
    ...carData,
    photos: photoUrls
  });
}
```

### 3. Incremental Sync

For inventory syncs, use incremental updates:

```javascript
// Track last sync timestamp
const lastSync = await getLastSyncTimestamp();

// Fetch only updated vehicles from your DMS
const updatedCars = await getUpdatedCars(lastSync);

// Update only changed vehicles
for (const car of updatedCars) {
  await updateCar(car.id, car);
}

// Store new sync timestamp
await setLastSyncTimestamp(Date.now());
```

### 4. Error Handling & Retry Logic

Implement robust error handling:

```javascript
async function createCarWithRetry(carData, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await createCar(carData);
    } catch (error) {
      if (attempt === maxRetries) throw error;

      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await sleep(delay);
    }
  }
}
```

### 5. Monitoring & Logging

Track API usage and errors:

```javascript
const stats = {
  success: 0,
  failed: 0,
  rateLimited: 0
};

for (const car of cars) {
  try {
    await createCar(car);
    stats.success++;
  } catch (error) {
    if (error.status === 429) {
      stats.rateLimited++;
      await sleep(60000); // Wait 1 minute
    } else {
      stats.failed++;
      console.error(`Failed to create ${car.vin}:`, error);
    }
  }
}

console.log('Import complete:', stats);
```

---

## Webhooks

**Status:** Coming Soon (Q1 2026)

Webhooks will notify your system of important events in real-time:

**Planned Events:**
- `deal.created` - New customer interest in your vehicle
- `deal.accepted` - Customer accepted your offer
- `deal.sold` - Deal marked as sold
- `deal.cancelled` - Deal cancelled
- `test_drive.scheduled` - Test drive scheduled
- `car.viewed` - Vehicle detail page viewed

**Webhook Payload Example:**
```json
{
  "event": "deal.accepted",
  "timestamp": "2025-10-26T15:30:00Z",
  "data": {
    "dealId": "accepted-deal-uuid",
    "carId": "car-uuid",
    "customerId": "customer-uuid",
    "finalPrice": 27500.00
  }
}
```

---

## Support

### Technical Support

**For API Integration Issues:**
- Email: support@iqautodeals.com
- Developer Portal: https://developers.iqautodeals.com
- Response Time: 24 hours (business days)

**For Enterprise Plans:**
- Dedicated Account Manager
- Phone Support: 1-800-IQ-AUTOS
- Priority Response: 4 hours

### Resources

- **API Changelog:** https://iqautodeals.com/api/changelog
- **Status Page:** https://status.iqautodeals.com
- **Code Examples:** https://github.com/iqautodeals/api-examples

### Reporting Issues

When reporting API issues, include:
1. Endpoint URL
2. Request method and headers
3. Request body (sanitize sensitive data)
4. Response received
5. Expected behavior
6. Timestamp of request

---

## Versioning

Current API version: **v1**

All endpoints are currently unversioned (`/api/...`). Future versions will use versioned paths (`/api/v2/...`).

**Version Support Policy:**
- Current version: Full support
- Previous version: 12 months after deprecation notice
- Legacy versions: 6 months security patches only

---

## Legal & Compliance

**Data Privacy:**
- All data encrypted in transit (TLS 1.3)
- All data encrypted at rest (AES-256)
- GDPR compliant
- CCPA compliant

**Terms of Service:**
- You own your inventory data
- We retain customer interaction data
- API rate limits enforced fairly
- No reselling of API access

---

**Document Version:** 1.0
**Last Updated:** October 26, 2025
**Next Review:** January 2026

For the latest version of this documentation, visit: https://iqautodeals.com/api-docs
