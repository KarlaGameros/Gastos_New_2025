<template>
  <q-table
    flat
    :rows="
      propsPage.tipo == 'pendientes'
        ? list_Pendientes_Administracion_Comision.filter(
            (x) =>
              x.aprobado_Recursos_Financieros == true &&
              x.estatus != 'Pendiente' &&
              x.estatus != 'Cancelado' &&
              x.estatus != 'Rechazado por jefe de area'
          )
        : propsPage.tipo == 'recibidas'
        ? list_Recibidas_Administracion_Comision.filter(
            (x) => x.estatus != 'Recibido sin firmas'
          )
        : list_Pendientes_Firmas.filter(
            (x) =>
              x.estatus != 'Cancelado' &&
              x.estatus != 'Pendiente' &&
              x.estatus != 'Rechazado por jefe de area'
          )
    "
    :columns="columns"
    :visible-columns="visible_columns"
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
              @click="verSolicitud(col.value)"
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
          <label v-else>{{ col.value }}</label>
        </q-td>
      </q-tr>
      <q-tr v-show="props.expand" :props="props">
        <q-td colspan="100%">
          <div class="text-left q-pa-xs">
            <b>Pernoctado:</b>
            <q-icon
              size="xs"
              :color="props.row.pernoctado ? 'green' : 'red'"
              :name="props.row.pernoctado ? 'check_circle' : 'cancel'"
            />
          </div>
          <div class="text-left q-pa-xs">
            <b>Destino:</b>
            {{ props.row.destino }}
          </div>
          <div class="text-left q-pa-xs">
            <b>Empleado que realizó el registro:</b>
            {{ props.row.empleado_Registra }}
          </div>
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
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useAdministracionStore } from "../../../stores/administracion-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onBeforeMount, ref, watchEffect } from "vue";
import { useQuasar, QSpinnerFacebook, exportFile } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const distribucionStore = useDistribucionStore();
const administracionStore = useAdministracionStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { modulo } = storeToRefs(authStore);
const {
  list_Pendientes_Administracion_Comision,
  list_Pendientes_Firmas,
  list_Recibidas_Administracion_Comision,
  loading,
} = storeToRefs(administracionStore);
const siglas = "SOLIC-ADMON";
const propsPage = defineProps({
  tipo: {
    type: String,
    required: true,
  },
});
const visible_columns = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

watchEffect(() => {
  if (propsPage.tipo == "pendientes") {
    visible_columns.value = [
      "vermas",
      "estatus",
      "folio",
      "empleado_Solicitante",
      "fecha_Salida",
      "fecha_LLegada",
      "id",
    ];
  } else {
    visible_columns.value = [
      "estatus",
      "folio",
      "empleado_Solicitante",
      "fecha_Salida",
      "fecha_LLegada",
      "empleado_Recibe_Administracion",
      "fecha_Recepcion_Administracion",
      "id",
    ];
  }
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

const verSolicitud = async (id) => {
  loadingShow();
  administracionStore.actualizarModal(true);
  await misSolicitudesStore.load_Solicitud(id);
  await distribucionStore.load_Distribuciones(id);
  distribucionStore.actualizarVisualizar(true);
  if (propsPage.tipo == "pendientes_firmas") {
    administracionStore.actualizarPendienteFirma(true);
  } else {
    administracionStore.actualizarPendienteFirma(false);
  }
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
      title: "Recibir solucitud de comisión",
      message: `Esta seguro de darle recepción a la solicitud de comisión con folio ${row.folio}, pasará a recursos financieros`,
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
          resp = await administracionStore.recibir_Admon(row.id, 1);
          break;
      }
      if (resp.success) {
        await administracionStore.load_Solicitudes_Administracion();
        await administracionStore.load_Recibidas_Administracion();
        await administracionStore.load_Pendientes_Firmas();
        $q.loading.hide();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  } else {
    $q.dialog({
      title: "Recibir solucitud de comisión",
      message: `Esta seguro de darle recepción a la solicitud de comisión con folio ${row.folio}, pasará a recursos financieros`,
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
      switch (opt) {
        case "opt1":
          loadingShow();
          resp = await administracionStore.recibir_Admon(row.id, 1);
          $q.loading.hide();
          break;
        case "opt2":
          loadingShow();
          resp = await administracionStore.recibir_Admon(row.id, 2);
          $q.loading.hide();
          break;
      }
      if (resp.success) {
        await administracionStore.load_Solicitudes_Administracion();
        await administracionStore.load_Recibidas_Administracion();
        await administracionStore.load_Pendientes_Firmas();
        $q.loading.hide();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  }
};

function wrapCsvValue(val, formatFn, row) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val;
  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);
  formatted = formatted.split('"').join('""');
  return `"${formatted}"`;
}

const exportTable = () => {
  let date = new Date().toLocaleDateString();
  let list =
    propsPage.tipo == "pendientes"
      ? list_Pendientes_Administracion_Comision.value.filter(
          (x) =>
            x.aprobado_Recursos_Financieros == true &&
            x.estatus != "Pendiente" &&
            x.estatus != "Cancelado" &&
            x.estatus != "Rechazado por jefe de area"
        )
      : propsPage.tipo == "recibidas"
      ? list_Recibidas_Administracion_Comision.value.filter(
          (x) => x.estatus != "Recibido sin firmas"
        )
      : list_Pendientes_Firmas.value.filter(
          (x) =>
            x.estatus != "Cancelado" &&
            x.estatus != "Pendiente" &&
            x.estatus != "Rechazado por jefe de area"
        );
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
    `${
      propsPage.tipo == "pendientes"
        ? "Pendientes"
        : propsPage.tipo == "recibidas"
        ? "Recibidas"
        : "Pendientes_firma"
    }_${date}`,
    bom + content,
    "text/csv;charset=utf-8"
  );
  if (status !== true) {
    $q.notify({
      message:
        "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
      color: "negative",
      icon: "warning",
    });
  }
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
    name: "empleado_Solicitante",
    align: "center",
    label: "Empleado solicitante",
    field: "empleado_Solicitante",
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
    name: "empleado_Recibe_Administracion",
    align: "center",
    label: "Empleado(a) que recibió",
    field: "empleado_Recibe_Administracion",
    sortable: true,
  },
  {
    name: "fecha_Recepcion_Administracion",
    align: "center",
    label: "Fecha recepción",
    field: "fecha_Recepcion_Administracion",
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
