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
            <div v-if="col.name == 'evidencia_URL'">
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
import { ref } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useComprobarStore } from "src/stores/comprobar-store";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const { list_Evidencias } = storeToRefs(comprobarStore);

//-----------------------------------------------------------

const verEvidencia = async (evidencia_URL) => {
  $q.dialog({
    title: ``,
    message: `<img class="rounded-borders" src='${evidencia_URL}'  width="100%"
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
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
