<template>
  <q-table
    :rows="
      propsPage.tipo == 'pendientes'
        ? list_Pendientes_Administracion_GC_Reem.filter(
            (x) =>
              x.estatus_Recepcion_Administracion == 'Pendiente_Recepcion' &&
              x.estatus != 'Pendiente' &&
              x.estatus != 'Cancelado' &&
              x.estatus != 'Rechazado por jefe de area' &&
              x.tipo_Solicitud_Gasto ==
                (propsPage.tabGeneral == 'gastoComprobar' ? 1 : 0)
          )
        : propsPage.tipo == 'recibidas'
        ? list_Solicitudes_RF_Reembolso_Aprobado
            .concat(list_Solicitudes_RF_GC_Aprobado)
            .filter(
              (x) =>
                x.estatus_Recepcion_Administracion == 'Recibido_Con_Firmas' &&
                x.tipo_Solicitud_Gasto ==
                  (propsPage.tabGeneral == 'gastoComprobar' ? 1 : 0)
            )
        : list_Pendientes_Administracion_GC_Reem.filter(
            (x) =>
              x.estatus_Recepcion_Administracion == 'Recibido_Sin_Firmas' &&
              x.tipo_Solicitud_Gasto ==
                (propsPage.tabGeneral == 'gastoComprobar' ? 1 : 0)
          )
    "
    :columns="columns"
    :filter="filter"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    rows-per-page-label="Filas por pagina"
    no-data-label="No hay registros"
    class="my-sticky-last-column-table"
  >
    <template v-slot:top-right>
      <q-input
        outlined
        class="q-pr-sm"
        borderless
        dense
        debounce="300"
        v-model="filter"
        placeholder="Buscar..."
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.name == 'color'">
            <q-badge :color="col.value" :label="col.value" />
          </div>
          <div v-if="col.name === 'id'">
            <q-btn
              v-if="modulo == null ? false : modulo.leer"
              flat
              round
              color="purple-ieen"
              icon="visibility"
              @click="verSolicitud(props.row)"
            >
              <q-tooltip>Ver registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                modulo == null
                  ? false
                  : modulo.actualizar &&
                    propsPage.tipo != 'recibidas' &&
                    props.row.estatus != 'Cancelado'
              "
              flat
              round
              type="button"
              color="purple-ieen"
              icon="task_alt"
              @click="recibir(props.row, propsPage.tipo)"
            >
              <q-tooltip>Recibir</q-tooltip>
            </q-btn>
          </div>
          <div v-else-if="col.name === 'folio'">
            <label class="text-bold">{{ col.value }}</label>
          </div>
          <div v-else-if="col.name === 'estatus'">
            <q-badge
              :color="
                col.value == 'Pendiente' ||
                col.value == 'Pendiente de conclusión' ||
                col.value == 'Borrador' ||
                col.value == 'Recibido sin firmas'
                  ? 'orange'
                  : col.value == 'Cancelado' ||
                    col.value == 'Rechazado por jefe de area' ||
                    col.value == 'Recibido sin firmas'
                  ? 'red'
                  : 'green'
              "
            >
              {{ col.value }}
              <q-icon
                :name="
                  col.value == 'Pendiente' ||
                  col.value == 'Pendiente de conclusión' ||
                  col.value == 'Borrador' ||
                  col.value == 'Recibido sin firmas'
                    ? 'warning'
                    : col.value == 'Cancelado' ||
                      col.value == 'Rechazado por jefe de area'
                    ? 'close'
                    : 'done'
                "
                color="white"
                class="q-ml-xs"
              />
            </q-badge>
          </div>
          <div v-else-if="col.name == 'vermas'">
            <q-btn
              size="sm"
              color="purple-ieen"
              round
              dense
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'remove' : 'add'"
              class="absolute-center"
            />
          </div>
          <label
            class="text-purple-ieen text-bold"
            v-else-if="col.name == 'tipo_Solicitud_Gasto'"
            >{{ col.value == 1 ? "GASTO A COMPROBAR" : "REEMBOLSO" }}</label
          >
          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left q-pa-xs">
            <b>Responsable de área:</b>
            {{ props.row.responsable_Area }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { onBeforeMount, ref } from "vue";
import { useAdministracionStore } from "../../../stores/administracion-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const facturaStore = useFacturasStore();
const administracionStore = useAdministracionStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const { modulo } = storeToRefs(authStore);
const {
  list_Solicitudes_RF_GC_Aprobado,
  list_Solicitudes_RF_Reembolso_Aprobado,
} = storeToRefs(solicitudesGCReemRFStore);
const { list_Pendientes_Administracion_GC_Reem, loading } =
  storeToRefs(administracionStore);
const siglas = "SOLIC-ADMON";
const propsPage = defineProps({
  tipo: {
    type: String,
    required: true,
  },
  tabGeneral: {
    type: String,
    required: true,
  },
});

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const loadingShow = () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
};

const leerPermisos = async () => {
  loadingShow();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const verSolicitud = async (row) => {
  loadingShow();
  await devengarDevengadoStore.load_Solicitud_DD(row.id);
  await facturaStore.load_Facturas_Bysolicitud(row.id);
  devengarDevengadoStore.actualizarVisualizar(true);
  administracionStore.actualizarModalDD(true);
  $q.loading.hide();
};

const alertNotify = (position, type, resp) => {
  $q.notify({
    position: position,
    type: type,
    message: resp,
    actions: [
      {
        icon: "close",
        color: "black",
        round: true,
        handler: () => {},
      },
    ],
  });
};

const recibir = async (row, tipo) => {
  if (tipo == "pendientes_firmas") {
    $q.dialog({
      title: `Recibir solucitud de ${
        row.tipo_Solicitud_Gasto == 0 ? "reembolso" : "gasto a comprobar"
      }`,
      message: `¿Está seguro de darle recepción a la solicitud con folio <b>${row.folio}</b>?`,
      icon: "Warning",
      persistent: true,
      html: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "check_circle",
        color: "secondary",
        label: "Sí! continuar",
      },
      cancel: {
        icon: "cancel",
        color: "red",
        label: "Cancelar",
      },
      options: {
        type: "radio",
        model: "opt1",
        isValid: (val) => val !== null,
        items: [
          {
            label: "Recibir con firmas",
            value: "opt1",
            color: "purple-ieen",
          },
        ],
      },
    }).onOk(async (opt) => {
      let resp = null;
      switch (opt) {
        case "opt1":
          loadingShow();
          resp = await administracionStore.recibir_Admon_GC_Reem(row.id, 1);
          $q.loading.hide();
          break;
      }
      if (resp.success) {
        await administracionStore.load_Pendientes_Recepcion_Devengar_Devengado();
        $q.loading.hide();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  } else {
    $q.dialog({
      title: `Recibir solucitud de ${
        row.tipo_Solicitud_Gasto == 0 ? "reembolso" : "gasto a comprobar"
      }`,
      message: `Esta seguro de darle recepción a la solicitud con folio <b>${row.folio}</b>, pasará a recursos financieros`,
      icon: "Warning",
      persistent: true,
      html: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "check_circle",
        color: "secondary",
        label: "Sí! continuar",
      },
      cancel: {
        icon: "cancel",
        color: "red",
        label: "Cancelar",
      },
      options: {
        type: "radio",
        model: "opt1",
        isValid: (val) => val !== null,
        items: [
          {
            label: "Recibir con firmas",
            value: "opt1",
            color: "purple-ieen",
          },
          {
            label: "Recibir sin firmas",
            value: "opt2",
            color: "purple-ieen",
          },
        ],
      },
    }).onOk(async (opt) => {
      let resp = null;
      if (!row.impreso) {
        alertNotify(
          "top-right",
          "warning",
          "El oficio no ha sido impreso por el sistema, no podrá recibirlo"
        );
      } else {
        loadingShow();
        resp = await administracionStore.recibir_Admon_GC_Reem(
          row.id,
          opt == "opt1" ? 1 : 2
        );
        if (resp.success) {
          await administracionStore.load_Pendientes_Recepcion_Devengar_Devengado();
          alertNotify("top-right", "positive", resp.data);
        } else {
          alertNotify("top-right", "negative", resp.data);
        }
        $q.loading.hide();
      }
    });
  }
};

//-----------------------------------------------------------

const columns = [
  {
    name: "vermas",
    align: "center",
    label: "Ver más",
    sortable: true,
  },
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  {
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
    sortable: true,
  },
  {
    name: "tipo_Solicitud_Gasto",
    align: "center",
    label: "Tipo solicitud",
    field: "tipo_Solicitud_Gasto",
    sortable: true,
  },
  {
    name: "tipo_Evento",
    align: "center",
    label: "Tipo de evento",
    field: "tipo_Evento",
    sortable: true,
  },
  {
    name: "empleado_Solicitante",
    align: "center",
    label: "Empleado solicitante",
    field: "empleado_Solicitante",
    sortable: true,
  },
  {
    name: "fecha_Solicitud",
    align: "center",
    label: "Fecha actividad",
    field: "fecha_Solicitud",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: false,
  },
];

const filter = ref("");

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});
</script>
<style lang="sass">
.my-sticky-last-column-table
  thead tr:last-child th:last-child
    background-color: white

  td:last-child
    background-color: white

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
