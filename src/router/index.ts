// src/router/index.ts
import { createRouter, createWebHashHistory } from "vue-router";
import layout from "../layouts/AppLayouts.vue";
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("../views/login/LoginView.vue"),
    },
    {
      path: "/",
      component: layout,
      children: [
        {
          path: "home",
          name: "home",
          component: () => import("../views/home/HomeView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const token = localStorage.getItem("token");

  if (to.name !== "login" && !token) {
    console.error("xx")
    return { name: "login" };
  }
});
