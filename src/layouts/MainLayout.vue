<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-purple-ieen">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title> Gastos a comprobar Nuevo</q-toolbar-title>
        <q-badge rounded :color="onLine == true ? 'green' : 'red'" />
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="no_notificaciones > 0" color="red" floating>{{
            no_notificaciones > 5 ? "5+" : no_notificaciones
          }}</q-badge>
          <q-menu>
            <q-list style="min-width: 100px">
              <div
                class="q-pl-md q-pt-sm q-pb-sm q-pr-md text-bold text-h6 text-grey-9"
              >
                Notificaciones
              </div>
              <div>
                <q-item
                  style="max-width: 420px"
                  v-for="notificacion in notificaciones"
                  :key="notificacion.id"
                  clickable
                  v-ripple
                  @click="detalle(notificacion)"
                >
                  <q-item-section>
                    <q-item-label>{{ notificacion.titulo }}</q-item-label>
                    <q-item-label caption lines="3">
                      {{ notificacion.mensaje }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    {{ notificacion.fecha_Registro }}
                    <q-badge
                      v-if="notificacion.leido == false"
                      color="blue"
                      rounded
                      class="q-mr-sm"
                    />
                  </q-item-section>
                </q-item>
              </div>
              <q-card
                class="text-center no-shadow no-border q-pa-sm"
                v-if="notificaciones.length == 0"
              >
                <div class="text-indigo-8 text-purple-ieen">
                  Sin notificaciones
                </div>
              </q-card>
              <q-separator />
              <q-card class="text-center no-shadow no-border q-pa-sm">
                <q-btn
                  label="Marcar todo como leido"
                  color="purple-ieen"
                  flat
                  class="text-indigo-8"
                  @click="marcarLeido"
                ></q-btn>
                <q-btn
                  flat
                  label="Ver todos"
                  color="purple-ieen"
                  class="text-indigo-8"
                  @click="toNotificaciones"
                ></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense icon="apps" @click="show" />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="300"
      :breakpoint="1024"
    >
      <q-img
        class="absolute-top"
        src="~assets/FondoIEEN.png"
        style="height: 160px"
      >
        <div class="bg-transparent">
          <div class="text-weight-bold text-black">
            <br />
            Bienvenido(a)
            <br />
            {{ usuario }}
          </div>
        </div>
      </q-img>
      <q-scroll-area
        style="
          height: calc(100% - 150px);
          margin-top: 150px;
          border-right: 1px solid #ddd;
        "
      >
        <q-list padding class="margin top">
          <q-item
            clickable
            v-ripple
            class="text-grey-8 text-bold"
            :to="{ name: 'inicio' }"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>

            <q-item-section> Inicio </q-item-section>
          </q-item>
          <q-item
            v-if="catalagosList.some((element) => element == 'DASHBOARD')"
            :to="{ name: 'dashboard' }"
            :content-inset-level="2"
            :header-inset-level="2"
            clickable
            v-ripple
            class="text-grey-8 text-bold"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="analytics" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="catalagosList.some((element) => element == 'MIS-SOLIC')"
            :content-inset-level="2"
            :header-inset-level="2"
            clickable
            v-ripple
            class="text-grey-8 text-bold"
            :to="{ name: 'misSolicitudes' }"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="person" />
            </q-item-section>
            <q-item-section>Mis solicitudes</q-item-section>
          </q-item>
          <q-item
            v-if="catalagosList.some((element) => element == 'SOLIC-AREA')"
            clickable
            v-ripple
            class="text-grey-8 text-bold"
            :to="{ name: 'solicitudesArea' }"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="groups" />
            </q-item-section>
            <q-item-section> Solicitudes área </q-item-section>
            <q-item-section side>
              <q-badge color="purple-ieen">
                {{
                  list_Solicitudes_ByArea.concat(
                    list_Solicitudes_ByArea_GC_Reembolso
                  ).length
                }}</q-badge
              >
            </q-item-section>
          </q-item>
          <q-item
            v-if="catalagosList.some((element) => element == 'SOLIC-RF')"
            class="text-grey-8 text-bold"
            :to="{ name: 'solicitudesRecFinancieros' }"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="currency_exchange" />
            </q-item-section>
            <q-item-section>Solicitudes recursos financieros</q-item-section>
            <q-item-section side>
              <q-badge color="purple-ieen">
                {{ list_Solicitudes_RF.length }}
              </q-badge>
            </q-item-section>
          </q-item>
          <q-item
            v-if="catalagosList.some((element) => element == 'SOLIC-ADMON')"
            clickable
            v-ripple
            class="text-grey-8 text-bold"
            :to="{ name: 'administracion' }"
            active-class="text-purple-ieen"
          >
            <q-item-section avatar>
              <q-icon name="paid" />
            </q-item-section>
            <q-item-section>Administración</q-item-section>
            <q-item-section side>
              <q-badge color="purple-ieen">
                {{
                  list_Pendientes_Administracion_Comision
                    .filter(
                      (x) =>
                        x.aprobado_Recursos_Financieros == true &&
                        x.estatus != "Pendiente" &&
                        x.estatus != "Cancelado" &&
                        x.estatus != "Rechazado por jefe de area"
                    )
                    .concat(
                      list_Pendientes_Administracion_GC_Reem.filter(
                        (x) =>
                          x.estatus_Recepcion_Administracion ==
                            "Pendiente_Recepcion" &&
                          x.estatus != "Pendiente" &&
                          x.estatus != "Cancelado" &&
                          x.estatus != "Rechazado por jefe de area"
                      )
                    ).length
                }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer reveal bordered class="bg-purple-ieen">
      <q-toolbar>
        <q-toolbar-title>
          <div>&#169; Unidad Técnica de Informática y Estadística</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { EncryptStorage } from "storage-encryption";
import { useNotifications } from "../helpers/signalRService";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotificacionStore } from "../stores/notificaciones-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { useAdministracionStore } from "src/stores/administracion-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useSolicitudesAreaStore } from "src/stores/solicitudes-area-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
import { useSolicitudesAreaGCReembolsoStore } from "src/stores/solicitudes-area-gc-reembolso-store";

//----------------------------------------------------------

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const notificacionStore = useNotificacionStore();
const solicitudesRFStore = useSolicitudesRFStore();
const administracionStore = useAdministracionStore();
const misSolicitudesStore = useMisSolicitudesStore();
const solicitudesAreasStore = useSolicitudesAreaStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const solicitudesAreaGCReembolsoStore = useSolicitudesAreaGCReembolsoStore();
const { modulos, apps, sistemas } = storeToRefs(authStore);
const { list_Solicitudes_ByArea } = storeToRefs(solicitudesAreasStore);
const { notificaciones, no_notificaciones } = storeToRefs(notificacionStore);
const { list_Solicitudes_ByArea_GC_Reembolso } = storeToRefs(
  solicitudesAreaGCReembolsoStore
);
const { list_Solicitudes_RF } = storeToRefs(solicitudesRFStore);
const {
  list_Pendientes_Administracion_GC_Reem,
  list_Pendientes_Administracion_Comision,
} = storeToRefs(administracionStore);
const { startConnection, onReceiveNotification, onLine } = useNotifications();
const usuario = ref("");
const catalagosList = ref([]);
const leftDrawerOpen = ref(false);

//----------------------------------------------------------

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

//----------------------------------------------------------

onBeforeMount(async () => {
  loading();
  if (route.query.key) {
    encryptStorage.encrypt("key", route.query.key);
    validarToken();
  }
  if (route.query.sistema) {
    encryptStorage.encrypt("sistema", route.query.sistema);
  }
  if (route.query.usr) {
    encryptStorage.encrypt("usuario", route.query.usr);
  }
  if (route.query.userNameL) {
    encryptStorage.encrypt("userNameL", route.query.userNameL);
  }
  loadMenu();
  cargarNotificaciones();
  conectar_signalr();
  cargarData();
  $q.loading.hide();
});

//----------------------------------------------------------

const loading = () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
};

const validarToken = async () => {
  loading();
  const resp = await authStore.validarToken(
    route.query.key,
    route.query.sistema
  );
  $q.loading.hide();
  if (resp.success == false) {
    encryptStorage.remove("key");
    window.location = "http://sistema.ieenayarit.org:9171?return=false";
  }
};

const cargarNotificaciones = async () => {
  await notificacionStore.loadNotificaciones();
  await notificacionStore.loadNotificacionesAll();
};

const cargarData = async () => {
  usuario.value = encryptStorage.decrypt("usuario");
  if (catalagosList.value.some((element) => element == "SOLIC-AREA")) {
    await solicitudesAreasStore.load_Solicitudes_Area();
    await solicitudesAreaGCReembolsoStore.load_Solicitudes_Area_Devengar_Devengado();
  }
  if (catalagosList.value.some((element) => element == "SOLIC-RF")) {
    await solicitudesRFStore.load_Solicitudes_RF();
    await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
    await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
    await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
  }
  if (catalagosList.value.some((element) => element == "SOLIC-ADMON")) {
    await administracionStore.load_Solicitudes_Administracion();
    await administracionStore.load_Pendientes_Recepcion_Devengar_Devengado();
  }
  if (catalagosList.value.some((element) => element == "DASHBOARD")) {
  }
  await misSolicitudesStore.load_Mis_Solicitudes();
  await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
};

const conectar_signalr = async () => {
  await startConnection();
  onReceiveNotification();
};

const loadMenu = async () => {
  loading();
  await authStore.loadSistemas();
  await authStore.loadModulos();
  modulos.value.forEach((element) => {
    switch (element.siglas_Modulo) {
      case "MIS-SOLIC":
        catalagosList.value.push("MIS-SOLIC");
        break;
      case "SOLIC-AREA":
        catalagosList.value.push("SOLIC-AREA");
        break;
      case "SOLIC-RF":
        catalagosList.value.push("SOLIC-RF");
        break;
      case "SOLIC-ADMON":
        catalagosList.value.push("SOLIC-ADMON");
        break;
      case "DASHBOARD":
        catalagosList.value.push("DASHBOARD");
        break;
    }
  });

  $q.loading.hide();
};

const toNotificaciones = () => {
  router.push({
    name: "notificaciones",
  });
};

const detalle = async (row) => {
  loading();
  let resp = await notificacionStore.leerNotificacion(row.id);
  if (resp.success == true) {
    await notificacionStore.loadNotificaciones();
  }
  let url = sistemas.value.find((x) => x.value == row.sistema_Id);
  if (row.sistema_Id == encryptStorage.decrypt("sistema")) {
    router.push({
      name: "misSolicitudes",
    });
  } else {
    window.location =
      url.url +
      `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
        row.sistema_Id
      }&usr=${encryptStorage.decrypt("usuario")}`;
  }
  $q.loading.hide();
};

const marcarLeido = async () => {
  loading();
  let resp = await notificacionStore.leerTodas();
  if (resp.success) {
    $q.notify({
      position: "top-right",
      type: "positive",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
    await notificacionStore.loadNotificaciones();
    await notificacionStore.loadNotificacionesAll();
  } else {
    $q.notify({
      position: "top-right",
      type: "negative",
      message: resp.data,
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
  }
  $q.loading.hide();
};

const show = () => {
  $q.bottomSheet({
    message: "Aplicaciones",
    grid: true,
    actions: apps.value,
  }).onOk((action) => {
    if (action.label == "Cerrar sesión") {
      localStorage.clear();
      sessionStorage.clear();
      encryptStorage.remove("key");
      encryptStorage.remove("usuario");
      encryptStorage.remove("sistema");
      window.location = "http://sistema.ieenayarit.org:9171?return=false";
    } else if (action.label == "Ir a universo") {
      window.location = "http://sistema.ieenayarit.org:9171?return=true";
    } else {
      window.location =
        action.url +
        `/#/?key=${encryptStorage.decrypt("key")}&sistema=${
          action.id
        }&usr=${encryptStorage.decrypt("usuario")}`;
    }
  });
};
</script>
<style lang="scss">
.text-purple-ieen {
  color: #673e84 !important;
}
.bg-purple-ieen {
  background: #673e84 !important;
}
.text-purple-ieen-1 {
  color: #863399 !important;
}
.bg-purple-ieen-1 {
  background: #863399 !important;
}
.text-purple-ieen-2 {
  color: #a25eb5 !important;
}
.bg-purple-ieen-2 {
  background: #a25eb5 !important;
}
.text-purple-ieen-3 {
  color: #bb83ca !important;
}
.bg-purple-ieen-3 {
  background: #bb83ca !important;
}
.text-pink-ieen-1 {
  color: #b32572 !important;
}
.bg-pink-ieen-1 {
  background: #b32572 !important;
}
.text-pink-ieen-2 {
  color: #cc5599 !important;
}
.bg-pink-ieen-2 {
  background: #cc5599 !important;
}
.text-pink-ieen-3 {
  color: #dd85ba !important;
}
.bg-pink-ieen-3 {
  background: #dd85ba !important;
}
.text-gray-ieen-1 {
  color: #76777a !important;
}
.bg-gray-ieen-1 {
  background: #76777a !important;
}
.text-gray-ieen-2 {
  color: #98989a !important;
}
.bg-gray-ieen-2 {
  background: #98989a !important;
}
.text-gray-ieen-3 {
  color: #b1b1b1 !important;
}
.bg-gray-ieen-3 {
  background: #b1b1b1 !important;
}
</style>
