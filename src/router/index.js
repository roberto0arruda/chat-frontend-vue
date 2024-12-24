import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

// layouts
import Admin from '@/layouts/Admin.vue'
import Auth from '@/layouts/Auth.vue'

// views for Admin layout

// views for Auth layout
import Login from '@/views/auth/LoginView.vue'
import Register from '@/views/auth/RegisterView.vue'

// views without layouts

// routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/auth',
      redirect: '/auth/login',
      component: Auth,
      children: [
        {
          path: '/auth/login',
          name: 'login',
          component: Login,
        },
        {
          path: '/auth/register',
          component: Register,
        },
      ],
    },
    {
      path: '/',
      redirect: '/chat',
      component: Admin,
      children: [
        {
          path: '/chat',
          name: 'chat',
          component: () => import('../views/ChatView.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: '/bids',
          name: 'bids',
          component: () => import('../views/BidView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.loggedIn) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router
