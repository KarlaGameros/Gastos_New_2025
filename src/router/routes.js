const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/inicio",
        name: "inicio",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "/misSolicitudes",
        name: "misSolicitudes",
        component: () => import("../modules/mis_Solicitudes/pages/IndexPage"),
      },
      {
        path: "/solicitudesArea",
        name: "solicitudesArea",
        component: () =>
          import("../modules/solicitudes_Area_General/pages/IndexPage.vue"),
      },
      {
        path: "/solicitudesRecursosFinancieros",
        name: "solicitudesRecFinancieros",
        component: () =>
          import("../modules/solicitudes_RF_General/pages/IndexPage.vue"),
      },
      {
        path: "/administracion",
        name: "administracion",
        component: () =>
          import("../modules/administracion_General/pages/IndexPage.vue"),
      },
      {
        path: "/notificaciones",
        name: "notificaciones",
        component: () =>
          import("../modules/notificaciones/pages/IndexPage.vue"),
      },
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("../modules/dashboard/pages/IndexPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
