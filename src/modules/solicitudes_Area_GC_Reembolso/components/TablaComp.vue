<template>
  <q-table
    flat
    :rows="
      props.tipo == 'pendientes'
        ? list_Solicitudes_ByArea_GC_Reembolso_Filtro.filter(
            (x) =>
              x.tipo_Solicitud_Gasto == (props.tab == 'gastoComprobar' ? 1 : 0)
          )
        : list_Historial_GC_Reembolso_Filtro.filter(
            (x) =>
              x.tipo_Solicitud_Gasto === (props.tab == 'gastoComprobar' ? 1 : 0)
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
        color="purple-ieen"
        dense
        debounce="300"
        v-model="filter"
        placeholder="Buscar.."
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </template>
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td auto-width>
          <q-btn
            size="sm"
            color="purple-ieen"
            round
            dense
            @click="props.expand = !props.expand"
            :icon="props.expand ? 'remove' : 'add'"
            class="absolute-center"
          />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          <div v-if="col.name == 'color'">
            <q-badge :color="col.value" :label="col.value" />
          </div>
          <div v-if="col.name === 'id'">
            <q-btn
              v-if="modulo.actualizar"
              flat
              round
              color="purple-ieen"
              icon="visibility"
              @click="verSolicitud(props.row)"
            >
              <q-tooltip>Ver registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="modulo.actualizar && tipo == 'pendientes'"
              flat
              round
              color="purple-ieen"
              icon="task_alt"
              @click="aprobarSolicitud(props.row)"
            >
              <q-tooltip>Aprobar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="modulo.actualizar && tipo == 'pendientes'"
              flat
              round
              color="purple-ieen"
              icon="cancel"
              @click="rechazarSolicitud(props.row)"
            >
              <q-tooltip>Rechazar</q-tooltip>
            </q-btn>
          </div>
          <div v-else-if="col.name === 'folio'">
            <label class="text-bold">{{ col.value }}</label>
          </div>
          <div v-else-if="col.name === 'tipo_Solicitud_Gasto'">
            <q-badge color="grey">
              {{ col.value == 1 ? "Gasto a comprobar" : "Reembolso" }}
            </q-badge>
          </div>
          <div v-else-if="col.name === 'estatus'">
            <q-badge
              :color="
                col.value == 'Pendiente'
                  ? 'orange'
                  : col.value == 'Cancelado' ||
                    col.value == 'Rechazado por jefe de area'
                  ? 'red'
                  : 'green'
              "
            >
              {{ col.value }}
              <q-icon
                :name="
                  col.value == 'Pendiente'
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
          <label v-else-if="col.name == 'monto_Solicitado'"
            >${{ col.value == null ? 0 : col.value }}</label
          >
          <label v-else-if="col.name == 'monto_Aprobado'"
            >${{ col.value == null ? 0 : col.value }}</label
          >
          <label v-else-if="col.name == 'monto_Utilizado'"
            >${{ col.value == null ? 0 : col.value }}</label
          >
          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left q-pa-xs">
            <b>Motivo:</b>
            {{ props.row.motivo }}
          </div>
          <div class="text-left q-pa-xs">
            <b>Fecha registro:</b>
            {{ props.row.fecha_Registro }}
          </div>
          <div v-if="props.row.gastos_Representacion" class="text-left q-pa-xs">
            <b>Gastos de representación:</b>
            <q-icon
              size="xs"
              :color="props.row.gastos_Representacion ? 'green' : 'red'"
              :name="
                props.row.gastos_Representacion ? 'check_circle' : 'cancel'
              "
            />
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
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { onBeforeMount, ref } from "vue";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesAreaGCReembolsoStore } from "src/stores/solicitudes-area-gc-reembolso-store";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const facturaStore = useFacturasStore();
const evidenciasStore = useEvidenciaStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const solicitudesAreaGCReembolsoStore = useSolicitudesAreaGCReembolsoStore();
const { modulo } = storeToRefs(authStore);
const {
  loading,
  list_Historial_GC_Reembolso,
  list_Historial_GC_Reembolso_Filtro,
  list_Solicitudes_ByArea_GC_Reembolso,
  list_Solicitudes_ByArea_GC_Reembolso_Filtro,
} = storeToRefs(solicitudesAreaGCReembolsoStore);
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const props = defineProps({
  tipo: {
    type: String,
  },
  tab: { type: String },
});

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
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

const cargarData = async () => {
  loadingShow();
  await solicitudesAreaGCReembolsoStore.load_Solicitudes_Area_Devengar_Devengado();
  await solicitudesAreaGCReembolsoStore.load_Historial_DD();
  $q.loading.hide();
};

const verSolicitud = async (row) => {
  loadingShow();
  await evidenciasStore.load_Evidencias_DD(row.id);
  await devengarDevengadoStore.load_Solicitud_DD(row.id);
  await facturaStore.load_Facturas_Bysolicitud(row.id);
  solicitudesAreaGCReembolsoStore.actualizarModal(true);
  $q.loading.hide();
};

const aprobarSolicitud = async (row) => {
  await facturaStore.load_Facturas_Bysolicitud(row.id);
  if (
    list_Facturas_By_Solicitud.value.length == 0 &&
    row.tipo_Solicitud_Gasto == 0
  ) {
    $q.notify({
      type: "warning",
      message:
        "No podrá aprobar la solictud sin comprobantes, deberá tener minimo uno",
      position: "top-right",
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
    });
  } else {
    Swal.fire({
      title: `Aprobación de solicitud de ${
        row.tipo_Solicitud_Gasto == 0 ? "reembolso" : "gasto a comprobar"
      }`,
      html: `¿Desea aprobar la solicitud con folio <b>${row.folio}</b>?, pasará a recursos financieros`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Aprobar!",
      cancelButtonText: "No, Salir!",
      reverseButtons: true,
      confirmButtonColor: "#26a69a",
      cancelButtonColor: "#f44336",
    }).then(async (result) => {
      if (result.isConfirmed) {
        loadingShow();
        const resp =
          await solicitudesAreaGCReembolsoStore.aprobar_Solicitud_Devengar_Devengado(
            row.id
          );
        if (resp.success) {
          $q.loading.hide();
          solicitudesAreaGCReembolsoStore.actualizarRecargar(true);
          $q.notify({
            type: "positive",
            message: resp.data,
            position: "top-right",
            actions: [
              {
                icon: "close",
                color: "white",
                round: true,
                handler: () => {},
              },
            ],
          });
        } else {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            message: resp.data,
            position: "top-right",
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
      }
    });
  }
};

const rechazarSolicitud = async (row) => {
  Swal.fire({
    title: `Rechazo de solicitud de ${
      row.tipo_Solicitud_Gasto == 0 ? "reembolso" : "gasto a comprobar"
    }`,
    html: `¿Desea rechazar la solicitud con folio <b>${row.folio}</b>?, al cancelar la solicitud no procede`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, Rechazar!",
    cancelButtonText: "No, Salir!",
    reverseButtons: true,
    confirmButtonColor: "#26a69a",
    cancelButtonColor: "#f44336",
  }).then(async (result) => {
    if (result.isConfirmed) {
      loadingShow();
      const resp =
        await solicitudesAreaGCReembolsoStore.rechazar_Solicitud_Devengar_Devengado(
          row.id
        );
      if (resp.success) {
        $q.loading.hide();
        solicitudesAreaGCReembolsoStore.actualizarRecargar(true);
        $q.notify({
          type: "positive",
          message: resp.data,
          position: "top-right",
          actions: [
            {
              icon: "close",
              color: "white",
              round: true,
              handler: () => {},
            },
          ],
        });
      } else {
        $q.loading.hide();
        $q.notify({
          type: "negative",
          message: resp.data,
          position: "top-right",
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
    }
  });
};

//-----------------------------------------------------------

const columns = [
  {
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
    name: "tipo_Evento",
    align: "center",
    label: "Tipo",
    field: "tipo_Evento",
    sortable: true,
  },
  {
    name: "empleado_Solicitante",
    align: "center",
    label: "Solicitante",
    field: "empleado_Solicitante",
    sortable: true,
  },
  {
    name: "fecha_Solicitud",
    align: "center",
    label: "Fecha solictud",
    field: "fecha_Solicitud",
    sortable: true,
  },
  {
    name: "monto_Solicitado",
    align: "center",
    label: "Monto solicitado",
    field: "monto_Solicitado",
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

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
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
