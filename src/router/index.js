import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '@/pages/MainPage';
import ProductPage from '@/pages/ProductPage';
import NotFoundPage from '@/pages/NotFoundPage';
import CartPage from '@/pages/CartPage';
import OrderPage from '@/pages/OrderPage';
import OrderInfoPage from '@/pages/OrderInfoPage';

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage
  },
    {
        path: '/product/:id',
        name: 'product',
        component: ProductPage,
    },
    {
        path: '/cart',
        name: 'cart',
        component: CartPage,
    },
    {
        path: '/order',
        name: 'order',
        component: OrderPage,
    },
    {
        path: '/orderInfo/:id',
        name: 'orderInfo',
        component: OrderInfoPage,
    },
    {
        path: '/notfound',
        name: '(.*)',
        component: NotFoundPage,
    },
    ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
