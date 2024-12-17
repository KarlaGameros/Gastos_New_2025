<template>
  <div class="col-12 q-pt-lg">
    <q-table
      :rows="list_Evidencias"
      :columns="columns"
      :filter="filter"
      :pagination="pagination"
      row-key="id"
      rows-per-page-label="Filas por pagina"
      no-data-label="No hay registros"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'id'">
              <q-btn
                v-if="
                  (tipo == 'gastoComprobar' &&
                    solicitud.estatus != 'Concluido' &&
                    solicitud.estatus != 'Pendiente de conclusión' &&
                    solicitud.estatus != 'Pendiente de revisión' &&
                    solicitud.estatus != 'Validado por administración' &&
                    solicitud.terminado == false) ||
                  (tipo == 'reembolso' && !solicitud.aprobado_Repsonsable_Area)
                "
                flat
                round
                color="purple-ieen"
                icon="delete"
                @click="eliminar(col.value)"
              >
                <q-tooltip>{{
                  solicitud.estatus == "Concluido"
                    ? "No se puede eliminar"
                    : "Eliminar registro"
                }}</q-tooltip>
              </q-btn>
            </div>
            <div v-else-if="col.name == 'evidencia_URL'">
              <q-btn
                flat
                round
                color="purple-ieen"
                icon="image"
                @click="verEvidencia(col.value)"
              >
                <q-tooltip>Ver evidencia</q-tooltip>
              </q-btn>
            </div>
            <div v-else-if="col.name == 'descripcion'">
              <label>{{
                col.value == "null" ? "Sin descripción" : col.value
              }}</label>
            </div>
            <label v-else>{{ col.value }}</label>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { ref } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const evidenciasStore = useEvidenciaStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { solicitud, visualizar } = storeToRefs(devengarDevengadoStore);
const { list_Evidencias } = storeToRefs(evidenciasStore);
const props = defineProps({
  tipo: {
    type: String,
    required: true,
  },
});

//-----------------------------------------------------------

const verEvidencia = async (evidencia_URL) => {
  $q.dialog({
    title: ``,
    message: `<img class="rounded-borders" src='${evidencia_URL}' width="auto"
            height="650" />`,
    style: "width: 800px; max-width: 80vw",
    html: true,
    ok: {
      icon: "close",
      color: "red",
      label: "Cerrar",
    },
  });
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminación de evidencia",
    message: "¿Está seguro de eliminar la evidencia?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "delete",
      color: "secondary",
      label: "¡Sí!, Eliminar",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    list_Evidencias.value = [];
    const resp = await evidenciasStore.delete_Evidencia(id);
    if (resp.success) {
      await evidenciasStore.load_Evidencias_DD(solicitud.value.id);
      $q.loading.hide();
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
  });
};

//-----------------------------------------------------------

const columns = [
  {
    name: "evidencia_URL",
    align: "center",
    label: "Evidencia",
    field: "evidencia_URL",
    sortable: true,
  },
  {
    name: "descripcion",
    align: "center",
    label: "Descripción",
    field: "descripcion",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: true,
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
