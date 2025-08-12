# Recipe Finder Project

This project consists of two main folders:
- `recipe-finder` (Frontend)
- `recipe-finder-backend` (Backend)

---

## recipe-finder (Frontend)
A React + Vite application for tracking nutrition, viewing recipes, and meal planning.

### Main Files & Folders
- `index.html` - Main HTML file
- `package.json` - Project dependencies and scripts
- `vite.config.js` - Vite configuration
- `README.md` - Frontend documentation
- `public/` - CSS files for various pages
    - base.css, career.css, community.css, contact.css, index.css, login.css, meal-planner.css, Members.css, nutrition.css, NutritionTracker.css, profile.css, RecipeDetail.css, recipes.css
- `src/`
    - `App.jsx`, `main.jsx` - Main React entry points
    - `assets/` - (empty)
    - `Components/` - Reusable React components
        - Footer.jsx, GoalSelector.jsx, HealthCalculatos.jsx, Info.jsx, Login.jsx, Navbar.jsx, NutritionChart.jsx, NutritionTracker.jsx, RecipeCard.jsx, Signup.jsx
    - `Pages/` - Main application pages
        - Career.jsx, Community.jsx, Contact.jsx, Home.jsx, MealPlanner.jsx, Members.jsx, Nutrition.jsx, Profile.jsx, RecipeDetail.jsx, Recipes.jsx

---

## recipe-finder-backend (Backend)
A Node.js/Express backend for handling authentication, nutrition tracking, meal planning, and more.

### Main Files & Folders
- `server.js` - Main Express server
- `package.json` - Backend dependencies and scripts
- `.env` - Environment variables
- `Controllers/` - Route logic for each feature
    - authController.js, careerController.js, communityController.js, contactController.js, feedbackController.js, mealPlannerController.js, memberController.js, nutritionController.js, recipeController.js
- `Models/` - Mongoose models for MongoDB
    - careerApplication.js, ContactMessage.js, feedbackModal.js, MealPlan.js, Member.js, NutritionEntry.js, recipeModal.js, user.js, UserGoals.js
- `Routes/` - API route definitions
    - authRoutes.js, careerRoutes.js, communityRoutes.js, contactRoutes.js, feedbackRoutes.js, index.js, mealPlannerRoutes.js, memberRoutes.js, nutritionRoutes.js, recipeRoutes.js

---

## How to Run

### Frontend
1. Navigate to `recipe-finder` folder
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`

### Backend
1. Navigate to `recipe-finder-backend` folder
2. Install dependencies: `npm install`
3. Start server: `node server.js` (or use nodemon)

---

## Features
- Nutrition tracking with chart and warnings
- Meal suggestions based on macros
- Recipe browsing and details
- Authentication and member management
- Community and feedback pages
- Career application form

---

## License
Specify your license here.

---

## Author
Add your name or team info here.
