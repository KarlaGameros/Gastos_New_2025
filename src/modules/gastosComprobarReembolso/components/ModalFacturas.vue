<template>
  <q-dialog
    v-model="modal_Facturas"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 800px; max-width: 80vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="90px" />
        <div class="text-h6 text-gray-ieen-1 text-bold absolute-center">
          SUBIR FACTURAS
        </div>
        <q-space />
        <q-btn
          @click="actualizarModal(false)"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onSubmit">
          <q-banner
            v-if="tipo == 'factura'"
            dense
            inline-actions
            rounded
            class="bg-orange text-white col-12 q-ma-sm"
          >
            <template v-slot:avatar>
              <q-icon name="warning" color="white" />
            </template>
            <div class="text-bold text-subtitle1">
              Subir XML para lectura automática de datos
            </div>
          </q-banner>
          <div>
            <div class="text-bold text-subtitle1">
              Seleccione el tipo de comprobación:
            </div>
          </div>
          <div
            class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-bold text-center"
          >
            <q-radio
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              color="purple-ieen"
              left-label
              v-model="tipo"
              val="factura"
              label="Factura"
            />
            <q-radio
              checked-icon="task_alt"
              unchecked-icon="panorama_fish_eye"
              color="purple-ieen"
              left-label
              v-model="tipo"
              val="recibo"
              label="Recibo"
            />
          </div>
          <div
            v-if="tipo === 'factura'"
            class="col-lg-6 col-md-6 col-sm-6 col-xs-12"
          >
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
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
          <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
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
                label="Limpiar"
                @click="limpiar"
                icon="cleaning_services"
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
      <!-- <q-card-section>
        <div class="col-12">
          <q-table
            :rows="list_Facturas_By_Solicitud"
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
                      v-if="!props.row.aprobado"
                      flat
                      round
                      color="purple-ieen"
                      icon="delete"
                      @click="eliminar(col.value)"
                    >
                      <q-tooltip>Eliminar registro</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      color="purple-ieen"
                      icon="visibility"
                      @click="verPDF(props.row.pdF_Url)"
                    >
                      <q-tooltip>Ver PDF</q-tooltip>
                    </q-btn>
                  </div>
                  <label v-else-if="col.name == 'importe'"
                    >${{ col.value }}</label
                  >
                  <label v-else>{{ col.value }}</label>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </q-card-section> -->
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturaStore = useFacturasStore();
const evidenciasStore = useEvidenciaStore();
const { list_Evidencias } = storeToRefs(evidenciasStore);
const { list_Facturas_By_Solicitud, loading } = storeToRefs(facturaStore);
const { modal_Facturas, solicitud } = storeToRefs(devengarDevengadoStore);
const { comprobacion } = storeToRefs(comprobarStore);
const xml = ref(null);
const tipo = ref("factura");

//-----------------------------------------------------------

watch(xml, (val) => {
  if (val != null) {
    cargarXML();
  }
});

watch(tipo, (val) => {
  if (val != null) {
    xml.value = null;
    comprobarStore.initComprobacion();
  }
});

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  limpiar();
  // list_Facturas_By_Solicitud.value = [];
  // devengarDevengadoStore.initSolicitudDD();
  devengarDevengadoStore.actualizarModalFacturas(valor);
};

const limpiar = () => {
  xml.value = null;
  tipo.value = "factura";
  comprobarStore.initComprobacion();
};

const cargarXML = async () => {
  const bodyFormData = new FormData();
  bodyFormData.append("XML", xml.value);
  let resp = await comprobarStore.leer_XML(bodyFormData);
  if (resp.repetido == true) {
    //xml.value = null;
    $q.notify({
      position: "top-right",
      type: "warning",
      message: resp.data,
    });
  }
};

const onRejected = () => {
  $q.notify({
    position: "top-right",
    type: "negative",
    message: "El PDF pesa más de 10 megas",
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
  bodyFormData.append("Fecha_Comprobnte", comprobacion.value.fecha_Comprobante);
  bodyFormData.append("Emisor", comprobacion.value.emisor);
  bodyFormData.append("Folio", comprobacion.value.folio);
  bodyFormData.append("Importe", comprobacion.value.importe);
  bodyFormData.append("PDF", comprobacion.value.pdf);
  bodyFormData.append("XML", xml.value);
  const resp = await facturaStore.create_Factura(
    solicitud.value.id,
    bodyFormData
  );
  let respUpdate = null;
  if (resp.success == true) {
    limpiar();
    await facturaStore.load_Facturas_Bysolicitud(solicitud.value.id);
    if (
      solicitud.value.tipo_Solicitud_Gasto == 0 &&
      solicitud.value.borrador == true
    ) {
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
            respUpdate = await devengarDevengadoStore.update_Solicitud_DD(
              solicitud.value
            );
            if (respUpdate.success) {
              await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
              devengarDevengadoStore.actualizarModalDevengado(false);
            }
          })
          .onCancel(async () => {
            solicitud.value.borrador = true;
            respUpdate = await devengarDevengadoStore.update_Solicitud_DD(
              solicitud.value
            );
            if (respUpdate.success) {
              await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
            }
          });
      } else {
        solicitud.value.borrador = true;
        respUpdate = await devengarDevengadoStore.update_Solicitud_DD(
          solicitud.value
        );
        if (respUpdate.success) {
          await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
        }
      }
    }
    devengarDevengadoStore.actualizarModalFacturas(false);
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
