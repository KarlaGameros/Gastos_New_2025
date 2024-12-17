<template>
  <div class="row">
    <div class="col">
      <q-table
        flat
        :rows="
          tipo == 'comisiones'
            ? list_Mis_Solicitudes
            : tipo == 'gastoComprobar'
            ? list_Devengar
            : list_Devengado
        "
        :filter="filter"
        :columns="columns"
        :pagination="pagination"
        :visible-columns="visibleColumns"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        class="my-sticky-last-column-table"
        :loading="loading"
        color="blue-grey"
      >
        <template v-slot:top-right>
          <q-input
            outlined
            borderless
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
          <q-tr v-if="tipo == 'comisiones'" :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'vermas'">
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
              <div v-else-if="col.name === 'id'">
                <q-btn
                  v-if="
                    props.row.estatus == 'Cancelado' ||
                    props.row.estatus == 'Aprobado' ||
                    props.row.estatus == 'Aprobado por jefe de area'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verSolicitud(col.value, tipo)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.aprobado_Recursos_Financieros == true &&
                    props.row.estatus == 'Concluido'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verSolicitudComprobacion(col.value)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus != 'Cancelado' &&
                    props.row.aprobado_Recursos_Financieros == true &&
                    props.row.estatus != 'Concluido'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit_square"
                  @click="comprobar(col.value, tipo)"
                >
                  <q-tooltip>Comprobar gasto</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Borrador' ||
                    props.row.estatus == 'Pendiente'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editarSolicitud(col.value)"
                >
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Pendiente' ||
                    props.row.estatus == 'Aprobado por jefe de area' ||
                    props.row.estatus == 'Borrador'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelarSolicitud(props.row)"
                >
                  <q-tooltip>Cancelar solititud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.aprobado_Recursos_Financieros == true &&
                    props.row.estatus != 'Cancelado'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="generarOficio(col.value)"
                >
                  <q-tooltip>Generar oficio</q-tooltip>
                </q-btn>
              </div>
              <div v-else-if="col.name === 'folio'">
                <label class="text-bold">{{ col.value }}</label>
              </div>
              <div v-else-if="col.name === 'dias_Comprobar'">
                <q-badge
                  v-if="
                    (props.row.estatus != 'Cancelado' &&
                      props.row.estatus != 'Rechazado por jefe de area' &&
                      props.row.monto_Asignado != '$0.00' &&
                      props.row.monto_Utilizado != props.row.monto_Asignado &&
                      (props.row.e_Comprobacion_Gasto == false ||
                        props.row.e_Evidencias == false ||
                        props.row.e_Informe_Actividades == false ||
                        props.row.e_Reintegro == false)) ||
                    (props.row.monto_Asignado == '$0.00' &&
                      (props.row.e_Evidencias == false ||
                        props.row.e_Informe_Actividades == false) &&
                      props.row.estatus != 'Cancelado' &&
                      props.row.estatus != 'Rechazado por jefe de area')
                  "
                  :color="
                    col.value == 0 || col.value < 0 ? 'red' : 'purple-ieen'
                  "
                >
                  {{ col.value }}
                  {{
                    col.value == "Comisión por realizar" ||
                    col.value == "Comisión en proceso"
                      ? ""
                      : col.value == 1
                      ? "día"
                      : "días"
                  }}
                  <q-icon
                    v-if="
                      col.value != 'Comisión por realizar' &&
                      col.value != 'Comisión en proceso'
                    "
                    :name="col.value == 0 || col.value < 0 ? 'block' : 'timer'"
                  />
                </q-badge>
              </div>
              <div v-else-if="col.name === 'estatus'">
                <q-badge
                  :color="
                    col.value == 'Pendiente' ||
                    col.value == 'Recibido sin firmas' ||
                    col.value == 'Pendiente de conclusión' ||
                    col.value == 'Pendiente de reintegro'
                      ? 'orange'
                      : col.value == 'Cancelado' ||
                        col.value == 'Rechazado por jefe de area'
                      ? 'red'
                      : col.value == 'Borrador'
                      ? 'purple-ieen'
                      : 'green'
                  "
                >
                  {{ col.value }}
                  <q-icon
                    :name="
                      col.value == 'Pendiente' ||
                      col.value == 'Recibido sin firmas' ||
                      col.value == 'Pendiente de conclusión' ||
                      col.value == 'Pendiente de reintegro'
                        ? 'warning'
                        : col.value == 'Cancelado' ||
                          col.value == 'Rechazado por jefe de area'
                        ? 'close'
                        : col.value == 'Borrador'
                        ? 'drafts'
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
          <q-tr v-else :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name == 'vermas'">
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
              <div v-else-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  v-if="tipo == 'reembolso' && props.row.estatus == 'Borrador'"
                  @click="notificar(col.value)"
                  color="purple-ieen"
                  icon="campaign"
                >
                  <q-tooltip>Enviar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Concluido' ||
                    props.row.estatus == 'Rechazado por recursos financieros' ||
                    props.row.estatus == 'Rechazado por jefe de area' ||
                    props.row.estatus == 'Aprobado por jefe de area' ||
                    (tipo == 'reembolso' &&
                      props.row.estatus != 'Pendiente' &&
                      props.row.estatus != 'Borrador')
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verSolicitud(col.value, tipo)"
                >
                  <q-tooltip>Ver solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus != 'Cancelado' &&
                    props.row.estatus != 'Concluido' &&
                    props.row.estatus != 'Rechazado por recursos financieros' &&
                    props.row.aprobado_Administracion &&
                    props.row.aprobado_Responsable_Area &&
                    tipo == 'gastoComprobar'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit_square"
                  @click="comprobar(col.value, tipo)"
                >
                  <q-tooltip>Comprobar gasto</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Pendiente' ||
                    props.row.estatus == 'Borrador'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="edit"
                  @click="editarSolicitudDD(props.row, tipo)"
                >
                  <q-tooltip>Editar solicitud</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.aprobado_Administracion &&
                    props.row.estatus != 'Rechazado por recursos financieros'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="print"
                  @click="generarOficioDD(props.row)"
                >
                  <q-tooltip>Generar oficio</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="
                    props.row.estatus == 'Pendiente' ||
                    props.row.estatus == 'Borrador'
                  "
                  flat
                  round
                  color="purple-ieen"
                  icon="cancel"
                  @click="cancelarSolicitudDD(props.row)"
                >
                  <q-tooltip>Cancelar solititud</q-tooltip>
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
                    col.value == 'Pendiente de reintegro' ||
                    col.value == 'Pendiente de revisión'
                      ? 'orange'
                      : col.value == 'Cancelado' ||
                        col.value == 'Rechazado por recursos financieros' ||
                        col.value == 'Rechazado por jefe de area'
                      ? 'red'
                      : col.value == 'Borrador'
                      ? 'purple-ieen'
                      : 'green'
                  "
                >
                  {{ col.value }}
                  <q-icon
                    :name="
                      col.value == 'Pendiente' ||
                      col.value == 'Recibido sin firmas' ||
                      col.value == 'Pendiente de conclusión' ||
                      col.value == 'Pendiente de reintegro' ||
                      col.value == 'Pendiente de revisión'
                        ? 'warning'
                        : col.value == 'Cancelado' ||
                          col.value == 'Rechazado por recursos financieros' ||
                          col.value == 'Rechazado por jefe de area'
                        ? 'close'
                        : col.value == 'Borrador'
                        ? 'drafts'
                        : 'done'
                    "
                    color="white"
                    class="q-ml-xs"
                  />
                </q-badge>
              </div>
              <div v-else-if="col.name === 'dias_Comprobar'">
                <q-badge
                  v-if="
                    props.row.estatus != 'Cancelado' &&
                    props.row.estatus != 'Rechazado por jefe de area' &&
                    props.row.estatus != 'Concluido' &&
                    props.row.estatus != 'Borrador'
                  "
                  :color="
                    col.value == 0 || col.value < 0 ? 'red' : 'purple-ieen'
                  "
                >
                  {{ col.value }}
                  <q-icon
                    v-if="
                      col.value.includes('día') || col.value.includes('días')
                    "
                    :name="col.value == 0 || col.value < 0 ? 'block' : 'timer'"
                  />
                  <q-icon v-else name="timer" />
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
              <q-badge
                v-if="
                  props.row.estatus != 'Cancelado' &&
                  propsPage.tipo == 'comisiones'
                "
                :color="
                  props.row.pagado && props.row.monto_Asignado != '$0.00'
                    ? 'green'
                    : props.row.saldo_Cero ||
                      (props.row.aprobado_Recursos_Financieros == true &&
                        props.row.monto_Asignado == '$0.00')
                    ? 'grey'
                    : !props.row.saldo_Cero &&
                      props.row.fecha_Pago == 'Sin registro'
                    ? 'grey'
                    : ''
                "
              >
                {{
                  props.row.pagado && props.row.monto_Asignado != "$0.00"
                    ? "Pagado"
                    : props.row.saldo_Cero ||
                      (props.row.aprobado_Recursos_Financieros == true &&
                        props.row.monto_Asignado == "$0.00")
                    ? "No solicitó recurso"
                    : !props.row.saldo_Cero &&
                      props.row.fecha_Pago == "Sin registro"
                    ? "Pendiente de pago"
                    : ""
                }}
              </q-badge>
              <div class="text-left q-pa-xs">
                <b>Personal solicitante:</b>
                {{ props.row.empleado_Solicitante }}
              </div>
              <div
                v-if="propsPage.tipo == 'comisiones'"
                class="text-left q-pa-xs"
              >
                <b>Destino:</b>
                {{ props.row.destino }}
              </div>
              <div
                v-if="propsPage.tipo == 'comisiones'"
                class="text-left q-pa-xs"
              >
                <b>Empleado que realizó el registro:</b>
                {{ props.row.empleado_Registra }}
              </div>
              <div class="text-left q-pa-xs">
                <b>Responsable de área:</b>
                {{ props.row.responsable_Area }}
              </div>
              <div class="text-left q-pa-xs">
                <b>Aprobado responsable área:</b>
                <q-icon
                  size="xs"
                  :color="props.row.aprobado_Responsable_Area ? 'green' : 'red'"
                  :name="
                    props.row.aprobado_Responsable_Area
                      ? 'check_circle'
                      : 'cancel'
                  "
                />
              </div>
              <div
                v-if="propsPage.tipo == 'comisiones'"
                class="text-left q-pa-xs"
              >
                <b>Aprobado recursos financieros:</b>
                <q-icon
                  size="xs"
                  :color="
                    props.row.aprobado_Recursos_Financieros ? 'green' : 'red'
                  "
                  :name="
                    props.row.aprobado_Recursos_Financieros
                      ? 'check_circle'
                      : 'cancel'
                  "
                />
              </div>
              <div v-else class="text-left q-pa-xs">
                <b>Aprobado recursos financieros:</b>
                <q-icon
                  size="xs"
                  :color="props.row.aprobado_Administracion ? 'green' : 'red'"
                  :name="
                    props.row.aprobado_Administracion
                      ? 'check_circle'
                      : 'cancel'
                  "
                />
              </div>
              <div
                v-if="propsPage.tipo == 'comisiones'"
                class="text-left q-pa-xs"
              >
                <b>Pernoctado:</b>
                <q-icon
                  size="xs"
                  :color="props.row.pernoctado ? 'green' : 'red'"
                  :name="props.row.pernoctado ? 'check_circle' : 'cancel'"
                />
              </div>
              <div
                v-if="propsPage.tipo == 'comisiones'"
                class="text-left q-pa-xs"
              >
                <b>Fecha impresión:</b>
                {{ props.row.fecha_Impresion }}
              </div>
              <div v-else class="text-left q-pa-xs">
                <b>Motivo:</b>
                {{ props.row.motivo }}
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref, watch } from "vue";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useDestinoStore } from "src/stores/destino-store";
import { storeToRefs } from "pinia";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import Swal from "sweetalert2";
import OficioComision from "src/helpers/OficioComision";
import OficioGastoComprobar from "src/helpers/OficioGastoComprobar";
import OficioReembolso from "src/helpers/OficioReembolso";

//-----------------------------------------------------------

const $q = useQuasar();
const misSolicitudesStore = useMisSolicitudesStore();
const destinosStore = useDestinoStore();
const comprobarStore = useComprobarStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturaStore = useFacturasStore();
const evidenciasStore = useEvidenciaStore();
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const { list_Evidencias } = storeToRefs(evidenciasStore);
const { list_Mis_Solicitudes, loading } = storeToRefs(misSolicitudesStore);
const { list_Devengar, list_Devengado, solicitud } = storeToRefs(
  devengarDevengadoStore
);
const monto_Calculado = ref(0);
const visibleColumns = ref([]);
const propsPage = defineProps({
  tipo: {
    type: String,
    required: true,
  },
});

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(propsPage, (val) => {
  if (val.tipo != null) {
    cargarData();
  }
});

watch(list_Facturas_By_Solicitud, (val) => {
  if (val != [] && val.length > 0 && val != null) {
    monto_Calculado.value = val.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
  } else {
    monto_Calculado.value = 0;
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  switch (propsPage.tipo) {
    case "comisiones":
      visibleColumns.value = [
        "vermas",
        "estatus",
        "folio",
        "dias_Comprobar",
        "fecha_Salida",
        "fecha_LLegada",
        "monto_Asignado",
        "id",
      ];
      await misSolicitudesStore.load_Mis_Solicitudes();
      break;
    case "gastoComprobar":
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
      visibleColumns.value = [
        "vermas",
        "estatus",
        "folio",
        "tipo_Evento",
        "fecha_Solicitud",
        "dias_Comprobar",
        "monto_Solicitado",
        "monto_Aprobado",
        "monto_Utilizado",
        "id",
      ];
      break;
    case "reembolso":
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
      visibleColumns.value = [
        "vermas",
        "estatus",
        "folio",
        "tipo_Evento",
        "folio_Solicitud_Gasto_Comprobar",
        "fecha_Solicitud",
        "monto_Solicitado",
        "monto_Aprobado",
        "monto_Utilizado",
        "id",
      ];
      break;
    default:
      break;
  }

  $q.loading.hide();
};

const verSolicitud = async (id, tipo) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (tipo == "comisiones") {
    await misSolicitudesStore.load_Solicitud(id);
    await destinosStore.load_Destinos(id);
    misSolicitudesStore.actualizarVisualizar(true);
    misSolicitudesStore.actualizarModal(true);
  } else {
    if (tipo == "gastoComprobar") {
      devengarDevengadoStore.actualizarModalDevengar(true);
    } else {
      devengarDevengadoStore.actualizarModalDevengado(true);
    }
    await devengarDevengadoStore.load_Solicitud_DD(id);
    await facturaStore.load_Facturas_Bysolicitud(id);
    await evidenciasStore.load_Evidencias_DD(id);
    devengarDevengadoStore.actualizarEditar(false);
    devengarDevengadoStore.actualizarVisualizar(true);
  }
  $q.loading.hide();
};

const verSolicitudComprobacion = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await misSolicitudesStore.load_Solicitud(id);
  await comprobarStore.load_Evidencias(id);
  await comprobarStore.load_Informe(id);
  comprobarStore.actualizarModal(true);
  misSolicitudesStore.actualizarEditar(true);
  misSolicitudesStore.actualizarVisualizar(true);
  $q.loading.hide();
};

const editarSolicitud = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  misSolicitudesStore.actualizarEditar(true);
  misSolicitudesStore.actualizarVisualizar(false);
  await misSolicitudesStore.load_Solicitud(id);
  await destinosStore.load_Destinos(id);
  misSolicitudesStore.actualizarModal(true);
  $q.loading.hide();
};

const editarSolicitudDD = async (row, tipo) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (tipo == "gastoComprobar") {
    devengarDevengadoStore.actualizarModalDevengar(true);
  } else {
    devengarDevengadoStore.actualizarModalDevengado(true);
  }
  devengarDevengadoStore.actualizarEditar(true);
  devengarDevengadoStore.actualizarVisualizar(false);
  await devengarDevengadoStore.load_Solicitud_DD(row.id);
  await facturaStore.load_Facturas_Bysolicitud(row.id);
  await evidenciasStore.load_Evidencias_DD(row.id);

  $q.loading.hide();
};

const cancelarSolicitud = async (row) => {
  if (row.pagado == true) {
    $q.notify({
      type: "warning",
      message:
        "La solicitud ya fue pagada por recursos financieros, no podrá cancelar",
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
      title: "Cancelar la solicitud",
      text: `¿Desea cancelar la solicitud con folio ${row.folio}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, Cancelar solicitud!",
      cancelButtonText: "No, Salir!",
      reverseButtons: true,
      confirmButtonColor: "#26a69a",
      cancelButtonColor: "#f44336",
    }).then(async (result) => {
      if (result.isConfirmed) {
        $q.loading.show({
          spinner: QSpinnerFacebook,
          spinnerColor: "purple-ieen",
          spinnerSize: 140,
          backgroundColor: "purple-3",
          message: "Espere un momento, por favor...",
          messageColor: "black",
        });
        const resp = await misSolicitudesStore.cancelar_Solicitud(row.id);
        if (resp.success) {
          $q.loading.hide();
          await misSolicitudesStore.load_Mis_Solicitudes();
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

const cancelarSolicitudDD = async (row) => {
  Swal.fire({
    title: "Cancelar la solicitud",
    text: `¿Desea cancelar la solicitud con folio ${row.folio}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, Cancelar solicitud!",
    cancelButtonText: "No, Salir!",
    reverseButtons: true,
    confirmButtonColor: "#26a69a",
    cancelButtonColor: "#f44336",
  }).then(async (result) => {
    if (result.isConfirmed) {
      $q.loading.show({
        spinner: QSpinnerFacebook,
        spinnerColor: "purple-ieen",
        spinnerSize: 140,
        backgroundColor: "purple-3",
        message: "Espere un momento, por favor...",
        messageColor: "black",
      });
      const resp = await devengarDevengadoStore.cancelar_Solicitud_DD(row.id);
      if (resp.success) {
        $q.loading.hide();
        await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
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

const comprobar = async (id, tipo) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (tipo == "comisiones") {
    await misSolicitudesStore.load_Solicitud(id);
    await comprobarStore.load_Evidencias(id);
    await comprobarStore.load_Informe(id);
    comprobarStore.actualizarModal(true);
    misSolicitudesStore.actualizarEditar(true);
  } else {
    await devengarDevengadoStore.load_Solicitud_DD(id);
    await facturaStore.load_Facturas_Bysolicitud(id);
    await evidenciasStore.load_Evidencias_DD(id);
    if (tipo == "gastoComprobar") {
      devengarDevengadoStore.actualizarModalDevengar(true);
    } else {
      devengarDevengadoStore.actualizarModalDevengado(true);
    }
    devengarDevengadoStore.actualizarVisualizar(true);
  }

  $q.loading.hide();
};

const generarOficio = (id) => {
  OficioComision(id);
};

const generarOficioDD = async (row) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (propsPage.tipo == "gastoComprobar") {
    await OficioGastoComprobar(row.id);
  } else {
    await OficioReembolso(row.id);
  }
  devengarDevengadoStore.initSolicitudDD();
  facturaStore.initFactura();
  if (!row.impreso && !row.pagado) {
    let resp = await devengarDevengadoStore.imprimir_Gasto(row.id);
    if (resp.success) {
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    }
  }
  $q.loading.hide();
  $q.notify({
    type: "positive",
    message: "Recibo generado con éxito",
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
};

const notificar = async (id) => {
  await devengarDevengadoStore.load_Solicitud_DD(id);
  await facturaStore.load_Facturas_Bysolicitud(id);
  await evidenciasStore.load_Evidencias_DD(id);
  let resp = null;
  if (
    list_Facturas_By_Solicitud.value.length > 0 &&
    list_Evidencias.value.length > 0
  ) {
    $q.dialog({
      title: "¿Ha subido todas sus evidencias y comprobantes?",
      message:
        "Al aceptar se le notificará al responsable de área y ya no podrá agregar más evidencias y/o comprobantes",
      icon: "Warning",
      persistent: true,
      html: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "done",
        color: "secondary",
        label: "Sí! notificar",
      },
      cancel: {
        icon: "close",
        color: "red",
        label: "No, regresar",
      },
    })
      .onOk(async () => {
        solicitud.value.borrador = false;
        solicitud.value.monto_Solicitado = monto_Calculado.value;
        resp = await devengarDevengadoStore.update_Solicitud_DD(
          solicitud.value
        );
        if (resp.success) {
          loading.value = false;
          $q.loading.hide();
          await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
          $q.notify({
            position: "top-right",
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
          devengarDevengadoStore.actualizarModalDevengado(false);
        } else {
          loading.value = false;
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
      })
      .onCancel(async () => {
        loading.value = false;
      });
  } else if (list_Evidencias.value.length == 0) {
    loading.value = false;
    $q.notify({
      type: "warning",
      message:
        "No tiene evidencias, deberá subir evidencias para poder notificar la comprobación",
      position: "top-right",
    });
  } else if (list_Facturas_By_Solicitud.value.length == 0) {
    loading.value = false;
    $q.notify({
      type: "warning",
      message:
        "No tiene comprobantes, deberá subir comprobantes para poder notificar la comprobación",
      position: "top-right",
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
    name: "tipo_Evento",
    align: "center",
    label: "Tipo",
    field: "tipo_Evento",
    sortable: true,
  },
  {
    name: "pagado",
    align: "center",
    label: "Pagado",
    field: "pagado",
    sortable: true,
  },
  {
    name: "dias_Comprobar",
    align: "center",
    label: "Días comprobar",
    field: "dias_Comprobar",
    sortable: true,
  },
  {
    name: "folio_Solicitud_Gasto_Comprobar",
    align: "center",
    label: "Folio comisión",
    field: "folio_Solicitud_Gasto_Comprobar",
    sortable: true,
  },
  {
    name: "fecha_Salida",
    align: "center",
    label: "Fecha de salida",
    field: "fecha_Salida",
    sortable: true,
  },
  {
    name: "fecha_LLegada",
    align: "center",
    label: "Fecha de llegada",
    field: "fecha_LLegada",
    sortable: true,
  },
  {
    name: "fecha_Solicitud",
    align: "center",
    label: `${
      propsPage.tipo == "gastoComprobar" ? "Fecha recurso" : "Fecha actividad"
    }`,
    field: "fecha_Solicitud",
    sortable: true,
  },
  {
    name: "monto_Asignado",
    align: "center",
    label: "Monto asignado",
    field: "monto_Asignado",
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
    name: "monto_Aprobado",
    align: "center",
    label: "Monto aprobado",
    field: "monto_Aprobado",
    sortable: true,
  },
  {
    name: "monto_Utilizado",
    align: "center",
    label: "Monto utilizado",
    field: "monto_Utilizado",
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
  rowsPerPage: 8,
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
