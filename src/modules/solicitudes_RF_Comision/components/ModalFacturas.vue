<template>
  <q-dialog
    v-model="modal_Factura"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="90px" />
        <div class="text-h6 text-gray-ieen-1 text-bold absolute-center">
          COMPROBACIÓN DE GASTO
        </div>
        <q-space />
        <q-btn
          @click="actualizarModal()"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <div class="col-12">
          <q-table
            :rows="list_Comprobaciones"
            :columns="columns"
            :filter="filter"
            :loading="loading"
            :pagination="pagination"
            row-key="id"
            rows-per-page-label="Filas por pagina"
            no-data-label="No hay registros"
          >
            <template v-slot:top-right>
              <q-input
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
              <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                  <div v-if="col.name === 'id'">
                    <q-btn
                      v-if="props.row.xml == 'Si' || props.row.pdf == 'Si'"
                      flat
                      round
                      color="purple-ieen"
                      icon="sim_card_download"
                      @click="descargarComprobantes(col.value, props.row.folio)"
                    >
                      <q-tooltip>Descargar comprobantes</q-tooltip>
                    </q-btn>
                  </div>
                  <label v-else>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { api } from "../../../boot/axios";
import { storeToRefs } from "pinia";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const { modal_Factura, comprobacion, loading, list_Comprobaciones } =
  storeToRefs(comprobarStore);

//-----------------------------------------------------------

const descargarComprobantes = async (id, folio) => {
  try {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    const resp = await api.get(
      `/GastosComprobar/ComprobacionGastos/ZipByComprobacion/${id}`,
      {
        responseType: "blob",
      }
    );
    let blob = new window.Blob([resp.data], { type: "application/zip" });
    const adjunto = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = adjunto;
    link.setAttribute("download", folio);
    document.body.appendChild(link);
    link.click();
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      position: "top-right",
      actions: [
        {
          icon: "close",
          color: "white",
          round: true,
          handler: () => {},
        },
      ],
      type: "negative",
      message:
        "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    });
  }
};

const actualizarModal = () => {
  comprobarStore.actualizarModalFactura(false);
};

//-----------------------------------------------------------

const columns = [
  {
    name: "fecha_Comprobante",
    align: "center",
    label: "Fecha comprobante",
    field: "fecha_Comprobante",
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
    name: "emisor",
    align: "center",
    label: "Emisor",
    field: "emisor",
    sortable: true,
  },
  {
    name: "importe",
    align: "center",
    label: "Importe",
    field: "importe",
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
