## 📁 Models đã tạo

### 1. **User.ts**

- Quản lý người dùng
- Authentication (local, google)
- Preferences (language, dietary)

### 2. **Pantry.ts**

- Quản lý nguyên liệu trong bếp
- Categories: vegetables, fruits, meat, dairy, grains, spices, other
- Tracking expiry date

### 3. **Recipe.ts**

- Công thức nấu ăn
- Ingredients và steps
- Rating system
- Categories: appetizer, main-course, dessert, beverage, snack

### 4. **ShoppingList.ts**

- Danh sách mua sắm
- Items với quantity và unit
- Status: draft, active, completed

### 5. **MealPlan.ts**

- Kế hoạch ăn uống
- Day plans với meals
- Status: draft, active, completed

### 6. **Community.ts**

- Posts cộng đồng
- Comments và likes
- Categories: recipe-share, cooking-tip, food-photo, question

### 7. **Favorite.ts**

- Công thức yêu thích
- Categories: favorites, to-cook, cooked
- Rating system

## 🚀 Cách sử dụng

```typescript
import { User, Pantry, Recipe } from '@/models'
import connectDB from '@/lib/database'

// Connect to database
await connectDB()

// Create user
const user = new User({
  email: 'user@example.com',
  name: 'John Doe',
  authType: 'google',
})

// Find recipes
const recipes = await Recipe.find({ isPublic: true }).populate('author', 'name avatar')

// Get user's pantry
const pantry = await Pantry.find({ userId: userId })
```

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

## 📊 Features

- ✅ Timestamps (createdAt, updatedAt)
- ✅ References với populate
- ✅ Validation
- ✅ Indexes cho performance
- ✅ Simple và dễ hiểu
