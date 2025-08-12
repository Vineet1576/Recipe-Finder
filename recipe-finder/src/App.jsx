import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Login from './Components/Login'
import Home from './Pages/Home'
import Footer from './Components/Footer'
import Recipes from './Pages/Recipes'
import MealPlanner from './Pages/MealPlanner'
import Nutrition from './Pages/Nutrition'
import Community from './Pages/Community'
import Contact from './Pages/Contact'
import Career from './Pages/Career'
import Profile from './Pages/Profile'
import Signup from './Components/Signup'
import Members from './Pages/Members'
import RecipeDetail from './Pages/RecipeDetail'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<><Navbar /><Home /><Footer /></>} />
        <Route path='/recipes' element={<><Navbar /><Recipes /><Footer /></>} />
        <Route path='/recipes/:id' element={<><Navbar /><RecipeDetail /><Footer /></>} />
        <Route path='/meal-planner' element={<><Navbar /><MealPlanner /><Footer /></>} />
        <Route path='/nutrition' element={<><Navbar /><Nutrition /><Footer /></>} />
        <Route path='/community' element={<><Navbar /><Community /><Footer /></>} />
        <Route path='/contact' element={<><Navbar /><Contact /><Footer /></>} />
        <Route path='/login' element={<><Navbar /><Login /></>} />
        <Route path='/signup' element={<><Navbar /><Signup /></>} />
        <Route path='/career' element={<><Navbar /><Career /><Footer /></>} />
        <Route path='/profile' element={<><Profile /></>} />
        <Route path='/members' element={<><Navbar /><Members /><Footer /></>} />
        <Route path='/recipedetail' element={<><Navbar /><RecipeDetail /><Footer /></>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
