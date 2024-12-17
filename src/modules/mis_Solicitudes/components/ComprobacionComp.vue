<template>
  <div class="row q-pt-lg">
    <div class="col">
      <q-table
        :rows="list_Distribuciones"
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
                  flat
                  round
                  color="purple-ieen"
                  icon="visibility"
                  @click="ver(col.value)"
                >
                  <q-tooltip>Ver</q-tooltip>
                </q-btn>
              </div>
              <label v-else-if="col.name == 'importe'"
                >${{ col.value.toFixed(2) }}</label
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
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { onBeforeMount } from "vue";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const distribucionStore = useDistribucionStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { solicitud } = storeToRefs(misSolicitudesStore);
const { list_Distribuciones } = storeToRefs(distribucionStore);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

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

const cargarData = async () => {
  loading();
  await distribucionStore.load_Distribuciones(solicitud.value.id);
  $q.loading.hide();
};

const ver = async (id) => {
  loading();
  comprobarStore.actualizarModalFactura(true);
  await distribucionStore.load_Distribucion_Id(id);
  await comprobarStore.loadComprobaciones(id);
  $q.loading.hide();
};

//-----------------------------------------------------------

const columns = [
  {
    name: "c_Gasto",
    align: "center",
    label: "C. Gasto",
    field: "c_Gasto",
    sortable: true,
  },
  {
    name: "importe",
    align: "center",
    label: "Importe asignado",
    field: "importe",
    sortable: true,
  },
  {
    name: "importe_Utilizado",
    align: "center",
    label: "Importe utilizado",
    field: "importe_Utilizado",
    sortable: true,
  },
  {
    name: "diferencia",
    align: "center",
    label: "Diferencia",
    field: "diferencia",
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
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
