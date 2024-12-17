<template>
  <div class="row">
    <div class="col">
      <q-table
        :rows="
          props.tipo == 'comisiones'
            ? solicitudes_filtro
            : props.tipo == 'gc'
            ? solicitudes_filtro_DD.filter((x) => x.tipo_Solicitud_Gasto == 1)
            : solicitudes_filtro_DD.filter((x) => x.tipo_Solicitud_Gasto == 0)
        "
        :columns="props.tipo == 'comisiones' ? columns_Comisiones : columns_DD"
        :filter="filter"
        :pagination="pagination"
        :loading="is_loading"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        :rows-per-page-options="[5, 10, 15, 20, 25, 50]"
        no-data-label="No hay registros"
        class="my-sticky-last-column-table"
      >
        <template v-slot:top-left>
          <div class="text-h6 text-bold text-purple-ieen">
            {{
              buscar_Por == "año"
                ? `Solicitudes del año: ${yearFiltro}`
                : `Solicitudes por rango de fecha: ${
                    textoFecha == null ? "" : textoFecha
                  }`
            }}
          </div>
        </template>
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
          <q-btn
            color="purple-ieen"
            icon-right="archive"
            label="Exportar a Excel"
            no-caps
            @click="exportTable"
          />
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="verDetalle(props.row)"
                >
                  <q-tooltip>ver registro</q-tooltip>
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
                      : col.value == 'Cancelado'
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
                        : col.value == 'Cancelado'
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
              <label
                v-else-if="
                  col.name == 'monto_Asignado' ||
                  col.name == 'monto_Utilizado' ||
                  col.name == 'monto_Reintegro' ||
                  col.name == 'saldo' ||
                  col.name == 'monto_Aprobado' ||
                  col.name == 'monto_Saldo'
                "
                >${{
                  col.value != null ? col.value.toLocaleString("en-US") : ""
                }}</label
              >
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>
<script setup>
import { useQuasar, QSpinnerFacebook, exportFile } from "quasar";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useDashboardStore } from "../../../stores/dashboard-store";
import { useDistribucionStore } from "../../../stores/distribuciones-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";

//-----------------------------------------------------------

const $q = useQuasar();
const dasboardStore = useDashboardStore();
const misSolictudesStore = useMisSolicitudesStore();
const distribucionStore = useDistribucionStore();
const comprobacionStore = useComprobarStore();
const solicitudesRFStore = useSolicitudesRFStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturasStore = useFacturasStore();
const evidenciasStore = useEvidenciaStore();
const {
  solicitudes_filtro,
  solicitudes_filtro_DD,
  is_loading,
  yearFiltro,
  textoFecha,
} = storeToRefs(dasboardStore);
const props = defineProps({
  buscar_Por: { type: String },
  tipo: { type: String },
});

//-----------------------------------------------------------

const verDetalle = async (row) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  if (props.tipo == "comisiones") {
    await misSolictudesStore.load_Solicitud(row.id);
    await solicitudesRFStore.load_Solicitud_Id_RF(row.id);
    await distribucionStore.load_Distribuciones(row.id);
    await comprobacionStore.load_Informe(row.id);
    await comprobacionStore.load_Evidencias(row.id);
    comprobacionStore.actualizarConcluir(true);
    comprobacionStore.actualizarModal(true);
    misSolictudesStore.actualizarVisualizar(true);
  } else {
    await devengarDevengadoStore.load_Solicitud_DD(row.id);
    await facturasStore.load_Facturas_Bysolicitud(row.id);
    await evidenciasStore.load_Evidencias_DD(row.id);
    devengarDevengadoStore.actualizarVisualizar(true);
    if (row.tipo_Solicitud_Gasto == 1) {
      devengarDevengadoStore.actualizarModalDevengar(true);
    } else {
      devengarDevengadoStore.actualizarModalDevengado(true);
    }
  }

  $q.loading.hide();
};

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

const exportTable = () => {
  let columns = props.tipo == "comisiones" ? columns_Comisiones : columns_DD;
  let list =
    props.tipo == "comisiones"
      ? solicitudes_filtro.value
      : solicitudes_filtro_DD.value;
  const content = [columns.map((col) => wrapCsvValue(col.label))]
    .concat(
      list.map((row) =>
        columns
          .map((col) =>
            wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
              row
            )
          )
          .join(",")
      )
    )
    .join("\r\n");
  const bom = "\uFEFF";
  const status = exportFile(
    `Solicitudes_${
      props.tipo == "comisiones"
        ? "GastosComprobar"
        : "PorDevengar_y_Devengados"
    }-${yearFiltro.value}`,
    bom + content,
    "text/csv;charset=utf-8"
  );
  if (status !== true) {
    $q.notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
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
};

//-----------------------------------------------------------

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const columns_Comisiones = [
  {
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
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
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
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
    name: "fecha_Salida",
    align: "center",
    label: "Fecha salida",
    field: "fecha_Salida",
    sortable: true,
  },
  {
    name: "fecha_LLegada",
    align: "center",
    label: "Fecha llegada",
    field: "fecha_LLegada",
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
    name: "monto_Utilizado",
    align: "center",
    label: "Monto utilizado",
    field: "monto_Utilizado",
    sortable: true,
  },
  {
    name: "monto_Reintegro",
    align: "center",
    label: "Monto reintegro",
    field: "monto_Reintegro",
    sortable: true,
  },
  {
    name: "saldo",
    align: "center",
    label: "Saldo",
    field: "saldo",
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

const columns_DD = [
  {
    name: "folio",
    align: "center",
    label: "Folio",
    field: "folio",
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
    name: "area",
    align: "center",
    label: "Área",
    field: "area",
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
    name: "monto_Reintegro",
    align: "center",
    label: "Monto reintegro",
    field: "monto_Reintegro",
    sortable: true,
  },
  {
    name: "monto_Saldo",
    align: "center",
    label: "Saldo",
    field: "monto_Saldo",
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
