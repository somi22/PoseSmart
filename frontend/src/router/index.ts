import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginHome from "../views/LoginHome.vue";
import DetectPose from "../views/DetectPose.vue";
import UserResult from "../views/UserResult.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/login",
    name: "LoginHome",
    component: LoginHome,
  },
  {
    path: "/detect",
    name: "DectectPose",
    component: DetectPose,
  },
  {
    path: "/result",
    name: "UserResult",
    component: UserResult,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
