import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/callback',
        name: 'Callback',
        component: () => import('../views/Callback.vue')
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { requereixAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Guàrdia de navegació global (Navigation Guard)
router.beforeEach((to, from, next) => {
    const magatzemAuth = useAuthStore()

    // Si la ruta requereix autenticació i no estem autenticats -> Login
    if (to.meta.requereixAuth && !magatzemAuth.estaAutenticat) {
        next('/login')
    } else {
        next()
    }
})

export default router
