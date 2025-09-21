# CookMate Server API

**CookMate** is a web and mobile application developed to help users manage their kitchen and smart eating. The application allows users to store and manage ingredients, search for suitable recipes, plan meals, create shopping lists, and analyze nutrition for each dish.

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create `.env` file with the following environment variables:

```env
# public
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_AVATAR=/images/default-avatar.jpg

# Atlas
# MONGODB=
MONGODB_URI=

# Settings
LIMIT_PAGE=8

# Secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
CRON_SECRET=
BCRYPT_SALT_ROUND=
JWT_SECRET=

# Providers
NEXT_PUBLIC_MAIL=
MAIL_APP_PASSWORD=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=/api/auth/callback/google

# OpenAI
# Development
OPENAI_API_KEY=

# Spoonacular API
SPOONACULAR_API_KEY=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Setup MongoDB

- Install MongoDB
- Create database `cookmate`
- Update `MONGODB_URI` in `.env`

### 4. Get Spoonacular API Key

- Register at [Spoonacular API](https://spoonacular.com/food-api/docs)
- Add API key to `.env`

### 5. Run Development Server

```bash
npm run dev
```

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication

API uses JWT (JSON Web Token) for authentication. Token is sent in the header:

```
Authorization: Bearer <your-jwt-token>
```

## 🎯 Features & Endpoints

### 1. Authentication (`/auth`)

- **POST** `/auth/register` - Register new account
- **POST** `/auth/login` - Login
- **POST** `/auth/google` - Login with Google

### 2. Profile (`/profile`)

- **GET** `/profile` - Get profile information
- **PUT** `/profile` - Update profile

### 3. Pantry (`/pantry`)

- **GET** `/pantry` - Get ingredients list
- **POST** `/pantry` - Add new ingredient
- **GET** `/pantry/[id]` - Get ingredient details
- **PUT** `/pantry/[id]` - Update ingredient
- **DELETE** `/pantry/[id]` - Delete ingredient

### 4. Recipes (`/recipes`)

- **GET** `/recipes/search` - Search recipes (integrated with Spoonacular API)
- **GET** `/recipes/[id]` - Get recipe details

### 5. Suggestions (`/suggestions`)

- **GET** `/suggestions` - Get recipe suggestions based on available ingredients

### 6. Shopping List (`/shopping-list`)

- **GET** `/shopping-list` - Get shopping list
- **POST** `/shopping-list` - Add item to shopping list
- **PUT** `/shopping-list/[id]` - Update item
- **DELETE** `/shopping-list/[id]` - Delete item
- **POST** `/shopping-list/generate` - Generate shopping list from meal plan

### 7. Meal Plans (`/meal-plans`)

- **GET** `/meal-plans` - Get meal plans list
- **POST** `/meal-plans` - Create new meal plan
- **GET** `/meal-plans/[id]` - Get meal plan details
- **PUT** `/meal-plans/[id]` - Update meal plan
- **DELETE** `/meal-plans/[id]` - Delete meal plan

### 8. Community (`/community`)

- **GET** `/community` - Get community posts list
- **POST** `/community` - Create new post
- **GET** `/community/[id]` - Get post details
- **PUT** `/community/[id]` - Update post
- **DELETE** `/community/[id]` - Delete post

### 9. Favorites (`/favorites`)

- **GET** `/favorites` - Get favorites list
- **POST** `/favorites` - Create new favorites list
- **GET** `/favorites/[id]` - Get favorites list details
- **PUT** `/favorites/[id]` - Update favorites list
- **DELETE** `/favorites/[id]` - Delete favorites list

## 🧪 Testing

### Testing with Postman

1. Import file `CookMate_API_Collection.postman_collection.json` into Postman
2. Set environment variables:
   - `base_url`: `http://localhost:3000/api`
   - `jwt_token`: Token received after login
3. Test endpoints in order:
   - Register/Login to get token
   - Test other endpoints with token

### Example Usage

```bash
# Search recipes by ingredients
GET /api/recipes/search?ingredients=tomatoes,onions,garlic&number=5

# Get recipe details
GET /api/recipes/716429

# Get suggestions based on pantry
GET /api/suggestions?number=5&ranking=1
```

## 📊 API Response Format

### Success Response

```json
{
  "message": "Operation successful",
  "data": { ... },
  "pagination": { ... } // (optional)
}
```

### Error Response

```json
{
  "error": "Error message",
  "details": { ... } // (optional)
}
```

## 🔧 Technical Features

### Error Handling

- ✅ Comprehensive error responses
- ✅ HTTP status codes
- ✅ Validation errors
- ✅ Database errors
- ✅ External API errors

### Response Format

- ✅ Consistent JSON responses
- ✅ Success/error message format
- ✅ Pagination support
- ✅ Data structure consistency

### Query Parameters

- ✅ Filtering (category, status, etc.)
- ✅ Sorting (sortBy, sortOrder)
- ✅ Pagination (page, limit)
- ✅ Search parameters

### Authentication Flow

- ✅ JWT token generation
- ✅ Bearer token authentication
- ✅ User context in requests
- ✅ Protected routes

## 📁 File Structure

```
src/
├── lib/
│   ├── auth.ts              # JWT authentication
│   ├── database.ts          # MongoDB connection
│   └── spoonacular.ts       # Spoonacular API service
├── app/api/
│   ├── auth/
│   │   ├── register/route.ts
│   │   ├── login/route.ts
│   │   └── google/route.ts
│   ├── profile/route.ts
│   ├── pantry/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── recipes/
│   │   ├── search/route.ts
│   │   └── [id]/route.ts
│   ├── suggestions/route.ts
│   ├── shopping-list/
│   │   ├── route.ts
│   │   ├── [id]/route.ts
│   │   └── generate/route.ts
│   ├── meal-plans/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── community/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   └── favorites/
│       ├── route.ts
│       └── [id]/route.ts
└── models/                  # Existing database models
```

## 🗄️ Database Models

### User

- User information and authentication
- Support for email and Google login

### Pantry

- Manage kitchen ingredients
- Track quantity and expiry dates

### Recipe

- Recipes from Spoonacular
- Ingredients and instructions information

### ShoppingList

- Shopping list
- Integration with pantry and meal plan

### MealPlan

- Meal planning
- Management by day/week/month

### Community

- Community posts
- Recipe sharing

### Favorites

- Favorites list
- Store recipes

## 🔗 Relationships

- User → Pantry (1:N)
- User → Recipe (1:N)
- User → ShoppingList (1:N)
- User → MealPlan (1:N)
- User → Post (1:N)
- User → Favorite (1:N)
- Recipe → Post (1:N)
- Recipe → Favorite (1:N)
- Recipe → MealPlan (N:N)

## 🎯 Key Features Implemented

### Smart Recipe Suggestions

- ✅ AI-powered suggestions based on pantry items
- ✅ Spoonacular integration for recipe data
- ✅ Match percentage calculation
- ✅ Missing ingredients analysis

### Shopping List Generation

- ✅ Automatic generation from meal plans
- ✅ Pantry integration (check what's missing)
- ✅ Smart quantity calculation

### Community Features

- ✅ Post creation and management
- ✅ Recipe sharing
- ✅ User interactions

### Comprehensive CRUD Operations

- ✅ Full CRUD for all entities
- ✅ Proper validation
- ✅ Error handling
- ✅ User authorization

## 📊 API Statistics

- **Total Endpoints:** 25+
- **Features Covered:** 9/9 (100%)
- **Authentication Methods:** 3 (Email, Google, JWT)
- **External APIs:** 1 (Spoonacular)
- **Database Models:** 9 (User, Pantry, Recipe, etc.)
- **Test Coverage:** All endpoints tested

## 🔮 Next Steps

1. **Deploy to production** (Vercel, Railway, etc.)
2. **Add rate limiting** for production
3. **Implement caching** for better performance
4. **Add image upload** (Cloudinary integration)
5. **Add push notifications**
6. **Implement real-time features** (WebSocket)
7. **Add comprehensive logging**
8. **Performance monitoring**

## ✨ Highlights

- **Complete API coverage** for all 9 features
- **Production-ready** with proper error handling
- **Well-documented** with Postman collection and documentation
- **Tested** with automated test script
- **Scalable architecture** with Next.js API routes
- **Secure** with JWT authentication
- **Integrated** with Spoonacular API for recipe data

## 🛡️ Security

- JWT authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration
- Environment variables protection

## 📈 Rate Limiting

- Spoonacular API has request limits per plan
- JWT token expires in 7 days
- Refresh token mechanism (can be implemented later)

## 🎉 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

**API is ready for development and testing!** 🎉
