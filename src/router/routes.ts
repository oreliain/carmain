import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/AppLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [{ path: '', component: () => import('pages/Index.vue') }],
  },
  {
    path: '/auth',
    component: () => import('layouts/BasicLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('pages/Auth.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('pages/Auth.vue'),
      },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/AppLayout.vue'),
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('pages/user/Profile.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
