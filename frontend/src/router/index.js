import {createRouter, createWebHistory} from 'vue-router';

// Pages components
import Home from '../views/pages/Home.vue'
import SingleItem from '../views/pages/SingleItem.vue'
import SignIn from '../views/pages/SignIn.vue'
import Signup from '../views/pages/SignUp.vue'
import Profile from '../views/pages/Profile.vue'
import CreateItem from '../views/pages/CreateItem.vue'
import PublicProfile from '../views/pages/PublicProfile.vue'

import auth from '../lib/authentication.js'


// Application routes configuration
const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/item/:id',
    component: SingleItem
  },
  {
    path: '/signin',
    component: SignIn
  },
  {
    path: '/signup', component: Signup
  },
  {
    path: '/profile',
    component: Profile, beforeEnter: auth.ifAuthenticated
  },
  
  {
  path: '/users/:id',
  component: PublicProfile
},

  {
    path: '/create',
    component: CreateItem,beforeEnter: auth.ifAuthenticated
  }
]

// Create and configure Vue Router instance
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

