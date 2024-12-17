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
      <q-card-section
        v-if="
          solicitud.estatus != 'Concluido' &&
          solicitud.estatus != 'Cancelado' &&
          perfil_RF == false
        "
      >
        <q-form class="row q-col-gutter-md" @submit="onSubmit" ref="myForm">
          <q-banner
            dense
            inline-actions
            rounded
            class="bg-orange text-white col-12 q-ml-sm"
          >
            <template v-slot:avatar>
              <q-icon name="warning" color="white" />
            </template>
            <div class="text-bold text-subtitle1">
              Subir XML para lectura automática de datos
            </div>
          </q-banner>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <div class="text-bold text-subtitle1">
              Seleccione el tipo de comprobación:
            </div>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12 text-bold text-center">
            <q-radio
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              color="purple-ieen"
              left-label
              v-model="tipo"
              val="factura"
              label="Factura"
              size="lg"
            />
            <q-radio
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              color="purple-ieen"
              left-label
              v-model="tipo"
              val="recibo"
              label="Recibo"
              size="lg"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12" v-if="tipo === 'factura'">
            <q-file
              id="myFileInput"
              name="fileToUpload"
              color="purple-ieen"
              bottom-slots
              v-model="xml"
              label=""
              counter
              accept=".xml"
              max-files="1"
              lazy-rules
              :rules="[(val) => !!val || 'El XML es requerido']"
            >
              <template v-slot:append>
                <q-icon name="attachment" @click.stop />
              </template>
              <template v-slot:hint> XML </template>
            </q-file>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-file
              id="file"
              name="fileToUpload"
              color="purple-ieen"
              bottom-slots
              v-model="comprobacion.pdf"
              label=""
              counter
              accept=".pdf"
              max-files="1"
              lazy-rules
              max-file-size="10485760"
              @rejected="onRejected"
              :rules="[(val) => !!val || 'El PDF es requerido']"
            >
              <template v-slot:append>
                <q-icon name="attachment" @click.stop />
              </template>
              <template v-slot:hint> PDF </template>
            </q-file>
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              color="purple-ieen"
              v-model="comprobacion.fecha_Comprobante"
              ref="fecha_ref"
              stack-label
              type="date"
              label="Fecha del comprobante"
              hint="Seleccione la fecha del comprobante"
              lazy-rules
              :rules="[
                (val) => !!val || 'La fecha del comprobante es requerida',
              ]"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              color="purple-ieen"
              v-model="comprobacion.folio"
              ref="folio_ref"
              label="Folio"
              hint="Ingrese el número de folio del comprobante"
              lazy-rules
              :rules="[
                (val) => !!val || 'El folio del comprobante es requerido',
              ]"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              color="purple-ieen"
              v-model="comprobacion.emisor"
              ref="emisor_ref"
              label="Emisor"
              hint="Ingrese el emisor del comprobante"
              lazy-rules
              :rules="[
                (val) => !!val || 'El folio del comprobante es requerido',
              ]"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              color="purple-ieen"
              prefix="$"
              v-model="comprobacion.importe"
              type="number"
              ref="importe_ref"
              label="Importe"
              hint="Ingrese el importe del comprobante"
              lazy-rules
              :rules="[
                (val) => !!val || 'El importe del comprobante es requerido',
              ]"
            />
          </div>
          <div class="col-12 justify-end q-pt-lg">
            <div class="text-right q-gutter-xs">
              <q-btn
                color="red"
                label="Cancelar"
                @click="limpiar"
                icon="highlight_off"
              />
              <q-btn
                :loading="loading"
                type="submit"
                color="secondary"
                label="Guardar"
                icon="save"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Cargando...
                </template>
              </q-btn>
            </div>
          </div>
        </q-form>
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
            class="my-sticky-last-column-table"
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
                      flat
                      round
                      color="purple-ieen"
                      icon="visibility"
                      @click="verPDF(props.row.pdF_Url)"
                    >
                      <q-tooltip>Ver pdf</q-tooltip>
                    </q-btn>
                    <q-btn
                      v-if="solicitud.estatus != 'Concluido'"
                      flat
                      round
                      color="purple-ieen"
                      icon="delete"
                      @click="eliminar(col.value)"
                    >
                      <q-tooltip>Eliminar registro</q-tooltip>
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
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { ref, watch } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const misSolicitudesStore = useMisSolicitudesStore();
const distribucionStore = useDistribucionStore();
const solictudesRFStore = useSolicitudesRFStore();
const { solicitud } = storeToRefs(misSolicitudesStore);
const { distribucion } = storeToRefs(distribucionStore);
const { modal_Factura, comprobacion, loading, list_Comprobaciones } =
  storeToRefs(comprobarStore);
const { perfil_RF } = storeToRefs(solictudesRFStore);
const fecha_ref = ref(null);
const folio_ref = ref(null);
const emisor_ref = ref(null);
const importe_ref = ref(null);
const xml = ref(null);
const tipo = ref("factura");

//-----------------------------------------------------------

watch(xml, (val) => {
  if (val != null) {
    cargarXML();
  }
});

//-----------------------------------------------------------

const onRejected = () => {
  $q.notify({
    position: "top-right",
    type: "negative",
    message: "El el PDF pesa más de 10 megas",
  });
};

const cargarXML = async () => {
  const bodyFormData = new FormData();
  bodyFormData.append("XML", xml.value);
  await comprobarStore.leer_XML(bodyFormData);
};

const verPDF = (pdf) => {
  $q.dialog({
    title: "Ver PDF",
    style: "width: 800px; max-width: 80vw",
    message: `<iframe
            src="${pdf}"
            width="100%"
            height="650"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
};

const actualizarModal = () => {
  limpiar();
  comprobarStore.actualizarModalFactura(false);
};

const limpiar = () => {
  tipo.value = "factura";
  fecha_ref.value = null;
  folio_ref.value = null;
  emisor_ref.value = null;
  importe_ref.value = null;
  xml.value = null;
  comprobarStore.initComprobacion();
};

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar comprobante",
    message: "¿Desea eliminar el comprobante?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "delete",
      color: "secondary",
      label: "Sí! eliminar",
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
    const resp = await comprobarStore.deleteComprobacion(id);
    if (resp.success) {
      await distribucionStore.load_Distribuciones(solicitud.value.id);
      await comprobarStore.loadComprobaciones(distribucion.value.id);
      await misSolicitudesStore.load_Solicitud(solicitud.value.id);
      await distribucionStore.load_Distribucion_Id(distribucion.value.id);
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

const onSubmit = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  const bodyFormData = new FormData();
  bodyFormData.append(
    "Fecha_Comprobante",
    comprobacion.value.fecha_Comprobante
  );
  bodyFormData.append("Emisor", comprobacion.value.emisor);
  bodyFormData.append("Folio", comprobacion.value.folio);
  bodyFormData.append("Importe", comprobacion.value.importe);
  bodyFormData.append("PDF", comprobacion.value.pdf);
  bodyFormData.append("XML", xml.value);
  const resp = await comprobarStore.create_Comprobacion(
    distribucion.value.id,
    bodyFormData
  );
  if (resp.success == true) {
    limpiar();
    await misSolicitudesStore.load_Solicitud(solicitud.value.id);
    await distribucionStore.load_Distribuciones(solicitud.value.id);
    await comprobarStore.loadComprobaciones(distribucion.value.id);
    await distribucionStore.load_Distribucion_Id(distribucion.value.id);
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
