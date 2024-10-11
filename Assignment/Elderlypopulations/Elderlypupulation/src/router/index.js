import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomePage from '../views/HomePage.vue'
import AboutView from '../views/AboutView.vue'
import ServiceView from '../views/ServiceView.vue'
import BlogView from '../views/BlogView.vue'
import ContactUsView from '../views/ContactUsView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import AdminPage from '../views/AdminPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/homepage',
    name: 'Homepage',
    component: HomePage,
    meta: { requiresAuth: true, roles: ['user', 'admin'] }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true }
  },
  {
    path: '/service',
    name: 'Service',
    component: ServiceView,
    meta: { requiresAuth: true }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: BlogView,
    meta: { requiresAuth: true }
  },
  {
    path: '/contact-us',
    name: 'ContactUs',
    component: ContactUsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView
  },
  {
    path: '/admin-page',
    name: 'AdminPage',
    component: AdminPage,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const userRole = store.getters.userRole

  if (to.path === '/login' && isAuthenticated) {
    next('/homepage')
  } 
  else if (to.meta.requiresAuth && !isAuthenticated) {
    next('/access-denied')
  } 
  else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/access-denied')
  } 
  else {
    next()
  }
})

export default router
