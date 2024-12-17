<template>
  <div class="col-12 q-pt-lg">
    <q-table
      :rows="list_Evidencias"
      :columns="visualizar ? columns2 : columns"
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
                v-if="solicitud.estatus != 'Concluido' && !visualizar"
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
import { useComprobarStore } from "src/stores/comprobar-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { ref } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { list_Evidencias } = storeToRefs(comprobarStore);
const { solicitud, visualizar } = storeToRefs(misSolicitudesStore);

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
    title: "Eliminación de registro",
    message: "¿Está seguro de eliminar el registro?",
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
    const resp = await comprobarStore.delete_Evidencia(id);
    if (resp.success) {
      await comprobarStore.load_Evidencias(solicitud.value.id);
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

const columns2 = [
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
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
