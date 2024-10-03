import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import HomePage from '../views/HomePage.vue'
import AboutView from '../views/AboutView.vue'
import ServiceView from '../views/ServiceView.vue'
import BlogView from '../views/BlogView.vue'
import ContactUsView from '../views/ContactUsView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import AdminPage from '../views/AdminPage.vue'
import { auth } from '../firebase' // 从 firebase.js 导入 Firebase 认证

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

router.beforeEach(async (to, from, next) => {
  const currentUser = auth.currentUser

  if (currentUser) {
    const token = await currentUser.getIdTokenResult()
    const userRole = token.claims.role || 'user'

    if (to.meta.requiresAuth) {
      if (to.meta.roles && !to.meta.roles.includes(userRole)) {
        next('/access-denied')
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    if (to.meta.requiresAuth) {
      next('/access-denied')
    } else {
      next()
    }
  }
})

export default router
