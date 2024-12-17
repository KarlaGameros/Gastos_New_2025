<template>
  <q-table
    flat
    :rows="
      props.tipo == 'pendientes'
        ? list_Solicitudes_RF_GC.filter(
            (x) => x.estatus != 'Borrador' && !x.aprobado_Administracion
          )
        : props.tipo == 'aprobados_rf'
        ? list_Solicitudes_RF_GC_Aprobado.filter(
            (x) => x.estatus == 'Aprobado por recursos financieros' || !x.pagado
          )
        : props.tipo == 'pagada'
        ? list_Solicitudes_RF_GC_Aprobado.filter(
            (x) => x.estatus == 'Pagada' && !x.terminado
          )
        : props.tipo == 'concluidas'
        ? list_Solicitudes_RF_GC_Aprobado.filter(
            (x) => x.estatus == 'Concluido'
          )
        : props.tipo == 'validar'
        ? list_Solicitudes_RF_GC_Aprobado.filter(
            (x) =>
              (x.estatus == 'Pendiente de revisión' &&
                x.pagado &&
                x.terminado &&
                !x.validado) ||
              (x.estatus != 'Concluido' &&
                x.estatus != 'Comprobación de gastos generada' &&
                x.terminado &&
                !x.validado)
          )
        : props.tipo == 'pendiente_concluir'
        ? list_Solicitudes_RF_GC_Aprobado.filter(
            (x) =>
              x.estatus != 'Concluido' &&
              x.estatus != 'Aprobado por recursos financieros' &&
              x.estatus != 'Aprobado por jefe de area' &&
              x.estatus != 'Pendiente de revisión' &&
              x.pagado &&
              x.validado
          )
        : list_Solicitudes_RF_GC_Rechazada
    "
    :columns="columns"
    :filter="filter"
    :loading="is_loading"
    :pagination="pagination"
    row-key="id"
    rows-per-page-label="Filas por pagina"
    no-data-label="No hay registros"
    class="my-sticky-last-column-table"
    :visible-columns="visible_columns"
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
          <div v-else-if="col.name == 'ver_mas'">
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
          <div v-if="col.name === 'id'">
            <q-btn
              v-if="modulo.actualizar"
              flat
              round
              color="purple-ieen"
              icon="visibility"
              @click="verSolicitud(col.value)"
            >
              <q-tooltip>Ver registro</q-tooltip>
            </q-btn>
            <q-btn
              v-if="modulo.actualizar && tipo == 'aprobados_rf'"
              flat
              round
              color="purple-ieen"
              icon="paid"
              @click="pagar(props.row)"
            >
              <q-tooltip>Pagar</q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                modulo.actualizar &&
                tipo == 'pendiente_concluir' &&
                props.row.estatus == 'Pendiente de conclusión'
              "
              flat
              round
              color="purple-ieen"
              icon="fact_check"
              @click="concluir(props.row)"
            >
              <q-tooltip>Concluir</q-tooltip>
            </q-btn>
            <q-btn
              v-if="
                modulo.actualizar &&
                (tipo == 'pendiente_concluir' || tipo == 'concluidas') &&
                props.row.reintegro_Url != null
              "
              flat
              round
              color="purple-ieen"
              icon="price_check"
              @click="ver_reintegro(col.value)"
            >
              <q-tooltip>Ver reintegro</q-tooltip>
            </q-btn>
          </div>
          <div v-else-if="col.name === 'folio'">
            <label class="text-bold">{{ col.value }}</label>
          </div>
          <div v-else-if="col.name === 'estatus'">
            <q-badge
              :color="
                col.value == 'Pendiente' ||
                col.value == 'Recibido sin firmas' ||
                col.value == 'Pendiente de conclusión' ||
                col.value == 'Pendiente de revisión'
                  ? 'orange'
                  : col.value == 'Cancelado' ||
                    col.value == 'Rechazado por jefe de area' ||
                    col.value == 'Rechazado por recursos financieros'
                  ? 'red'
                  : 'green'
              "
            >
              {{ col.value }}
              <q-icon
                :name="
                  col.value == 'Pendiente' ||
                  col.value == 'Recibido sin firmas' ||
                  col.value == 'Pendiente de conclusión' ||
                  col.value == 'Pendiente de revisión'
                    ? 'warning'
                    : col.value == 'Cancelado' ||
                      col.value == 'Rechazado por jefe de area' ||
                      col.value == 'Rechazado por recursos financieros'
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
            <b>Aprobado responsable área:</b>
            <q-icon
              size="xs"
              :color="props.row.aprobado_Repsonsable_Area ? 'green' : 'red'"
              :name="
                props.row.aprobado_Repsonsable_Area ? 'check_circle' : 'cancel'
              "
            />
          </div>
          <div class="text-left q-pa-xs">
            <b>Motivo:</b>
            {{ props.row.motivo }}
          </div>
          <div v-if="props.row.observaciones != null" class="text-left q-pa-xs">
            <b>Observaciones:</b>
            {{ props.row.observaciones }}
          </div>
          <div class="text-left q-pa-xs">
            <b>Fecha registro:</b>
            {{ props.row.fecha_Registro }}
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
  <ModalPago />
  <ModalComp :tipo="props.tipo" />
  <ModalReintegro />
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "src/stores/auth-store";
import { usePagoStore } from "src/stores/pago-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { useReintegroStore } from "src/stores/reintegro-store";
import { onBeforeMount, ref } from "vue";
import { useAdministracionStore } from "src/stores/administracion-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
import Swal from "sweetalert2";
import ModalPago from "../components/ModalPago.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalReintegro from "../components/ModalReintegro.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const pagoStore = usePagoStore();
const facturaStore = useFacturasStore();
const reintegroStore = useReintegroStore();
const evidenciasStore = useEvidenciaStore();
const administracionStore = useAdministracionStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const { modulo } = storeToRefs(authStore);
const {
  list_Solicitudes_RF_GC_Aprobado,
  list_Solicitudes_RF_GC_Rechazada,
  list_Solicitudes_RF_GC,
  is_loading,
} = storeToRefs(solicitudesGCReemRFStore);
const props = defineProps({
  tipo: {
    type: String,
  },
});
const visible_columns = ref([]);

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

const cargarData = () => {
  if (props.tipo == "pendiente_concluir" || props.tipo == "pagada") {
    visible_columns.value = [
      "ver_mas",
      "estatus",
      "folio",
      "empleado_Solicitante",
      "dias_Comprobar",
      "fecha_Salida",
      "fecha_LLegada",
      "monto_Solicitado",
      "monto_Aprobado",
      "id",
    ];
  } else {
    visible_columns.value = [
      "ver_mas",
      "estatus",
      "folio",
      "tipo_Evento",
      "empleado_Solicitante",
      "fecha_Solicitud",
      "monto_Solicitado",
      "monto_Aprobado",
      "id",
    ];
  }
};

const verSolicitud = async (id) => {
  loadingShow();
  await evidenciasStore.load_Evidencias_DD(id);
  await devengarDevengadoStore.load_Solicitud_DD(id);
  await facturaStore.load_Facturas_Bysolicitud(id);
  solicitudesGCReemRFStore.actualizarModalDevengar(true);
  $q.loading.hide();
};

const pagar = async (row) => {
  await devengarDevengadoStore.load_Solicitud_DD(row.id);
  if (row.estatus_Recepcion_Administracion == "Pendiente_Recepcion") {
    $q.dialog({
      title: "Recibir solucitud de gasto a comprobar antes de pagar",
      message: `Esta seguro de darle recepción a la solicitud de gasto con folio ${row.folio}?`,
      icon: "Warning",
      persistent: true,
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
            label: "Recibido con firmas",
            value: "opt1",
            color: "purple-ieen",
          },
          {
            label: "Recibido sin firmas",
            value: "opt2",
            color: "purple-ieen",
          },
        ],
      },
    }).onOk(async (opt) => {
      let resp = null;
      if (!row.impreso) {
        $q.notify({
          type: "warning",
          message:
            "El oficio no ha sido impreso por el sistema, no podrá recibirlo",
          position: "top-right",
        });
      } else {
        loadingShow();
        resp = await administracionStore.recibir_Admon_GC_Reem(
          row.id,
          opt == "opt1" ? 1 : 2
        );
        if (resp.success) {
          await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
          pagoStore.actualizarModalPago(true);
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
        $q.loading.hide();
      }
    });
  } else {
    pagoStore.actualizarModalPago(true);
  }
};

const concluir = async (row) => {
  Swal.fire({
    title: "Conclusión de solicitud de gasto a comprobar",
    html: `¿Desea concluir la solicitud con folio <b>${row.folio}</b>?`,
    icon: "Warning",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, Concluir!",
    cancelButtonText: "No, Salir!",
    reverseButtons: true,
    confirmButtonColor: "#26a69a",
    cancelButtonColor: "#f44336",
  }).then(async (result) => {
    if (result.isConfirmed) {
      loadingShow();
      const resp = await solicitudesGCReemRFStore.concluir(row.id);
      if (resp.success) {
        $q.loading.hide();
        await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
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

const ver_reintegro = async (id) => {
  loadingShow();
  await devengarDevengadoStore.load_Solicitud_DD(id);
  await reintegroStore.load_Reintegro_DD(id);
  reintegroStore.actualizarModalReintegro(true);
  $q.loading.hide();
};

//-----------------------------------------------------------

const columns = [
  {
    name: "ver_mas",
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
    label: "Fecha recurso",
    field: "fecha_Solicitud",
    sortable: true,
  },
  {
    name: "monto_Aprobado",
    align: "center",
    label: "Monto aprobado",
    field: "monto_Aprobado",
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
