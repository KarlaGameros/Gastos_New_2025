<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <div class="flotante">
        <q-card-section class="row">
          <q-img src="../../../assets/IEEN300.png" width="90px" />
          <div
            class="text-h6 text-center text-gray-ieen-1 text-bold absolute-center"
          >
            {{
              solicitud.tipo_Solicitud_Gasto == 1
                ? "VER SOLICITUD DE GASTO A COMPROBAR"
                : "VER SOLICITUD DE REEMBOLSO"
            }}
            <br />
            <div class="text-center text-bold text-h6 text-purple-ieen">
              {{ solicitud.folio }}
            </div>
          </div>
          <q-space />
          <q-btn
            icon="close"
            @click="actualizarModal(false)"
            flat
            round
            dense
            v-close-popup
          />
        </q-card-section>
      </div>
      <q-card-section>
        <q-card>
          <q-tabs
            v-model="tab"
            align="justify"
            class="text-grey flotante-tab"
            active-color="purple-ieen"
            indicator-color="purple-ieen"
            inline-label
          >
            <q-tab icon="menu" name="general" label="Datos generales" />
            <q-tab
              v-if="
                !solicitud.aprobado_Administracion &&
                solicitud.tipo_Solicitud_Gasto == 0
              "
              icon="menu"
              name="evidencias"
              label="Evidencias"
            />
            <q-tab
              v-if="
                !solicitud.aprobado_Administracion &&
                solicitud.tipo_Solicitud_Gasto == 0
              "
              icon="edit_note"
              name="comprobacion"
              label="Comprobación"
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="general" class="row q-col-gutter-xs">
              <div class="col-12">
                <q-input readonly label="Área" v-model="solicitud.area">
                  <template v-slot:prepend>
                    <q-icon name="apartment" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <q-input
                  color="purple-ieen"
                  v-model="solicitud.empleado_Solicitante"
                  label="Solicitante"
                  readonly
                  class="text-bold"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-12">
                <q-input
                  v-model="solicitud.responsable_Area"
                  label="Responsable"
                  readonly
                  color="purple-ieen"
                  class="text-bold"
                >
                  <template v-slot:prepend>
                    <q-icon name="supervisor_account" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  v-model="solicitud.tipo_Evento"
                  label="Tipo de solictud"
                  readonly
                  color="purple-ieen"
                  class="text-bold"
                >
                  <template v-slot:prepend>
                    <q-icon name="format_list_numbered" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  class="text-bold"
                  readonly
                  color="purple-ieen"
                  v-model="solicitud.fecha_Solicitud"
                  label="Fecha en que se requiere el recurso"
                  lazy-rules
                  mask="date"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <div
                v-if="solicitud.tipo_Solicitud_Gasto == 1"
                class="col-lg-3 col-md-3 col-xs-12"
              >
                <q-input
                  readonly
                  v-model="solicitud.monto_Solicitado"
                  label="Monto solicitado"
                  color="purple-ieen"
                  class="text-bold"
                  type="number"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
              <div v-else class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  readonly
                  v-model="monto_Calculado"
                  label="Monto calculado"
                  color="purple-ieen"
                  class="text-bold"
                  type="number"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  readonly
                  v-model="solicitud.monto_Aprobado"
                  label="Monto aprobado"
                  color="purple-ieen"
                  class="text-bold"
                  type="number"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  counter
                  readonly
                  color="purple-ieen"
                  v-model="solicitud.motivo"
                  label="Justificación de la solicitud"
                  type="textarea"
                  class="text-bold"
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  counter
                  class="text-bold"
                  color="purple-ieen"
                  readonly
                  v-model="solicitud.observaciones"
                  label="Observaciones"
                  type="textarea"
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" />
                  </template>
                </q-input>
              </div>
              <div
                v-if="solicitud.gastos_Representacion"
                class="col-6 text-center"
              >
                <q-toggle
                  disable
                  checked-icon="check"
                  unchecked-icon="clear"
                  size="lg"
                  left-label
                  class="text-bold text-suntitle1"
                  label="Gastos de representación"
                  v-model="solicitud.gastos_Representacion"
                  color="purple-ieen"
                />
              </div>
            </q-tab-panel>
            <q-tab-panel name="evidencias" class="row q-col-gutter-xs">
              <div
                class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
              >
                <q-icon name="label_important" />
                Evidencias
              </div>
              <div class="col-12 justify-end">
                <div class="text-right q-gutter-xs">
                  <q-btn
                    v-if="
                      list_Evidencias.length > 0 &&
                      list_Facturas_By_Solicitud.length > 0 &&
                      list_Facturas_By_Solicitud.some(
                        (element) => element.estatus === 'Pendiente'
                      ) == false
                    "
                    color="purple-ieen"
                    label="Imprimir evidencias"
                    @click="imprimir_Evidencias"
                    icon-right="print"
                  />
                </div>
              </div>
              <div class="col-12 q-pt-lg">
                <q-table
                  :rows="list_Evidencias"
                  :columns="columnsEvidencias"
                  :filter="filter"
                  :pagination="pagination"
                  row-key="id"
                  rows-per-page-label="Filas por pagina"
                  no-data-label="No hay registros"
                >
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
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
            </q-tab-panel>
            <q-tab-panel name="comprobacion" class="row q-col-gutter-xs">
              <div
                class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
              >
                <q-icon name="label_important" />
                Comprobación de gastos
              </div>
              <div class="col-12 justify-end">
                <div class="text-right q-gutter-xs">
                  <q-btn
                    v-if="
                      list_Facturas_By_Solicitud.length > 0 &&
                      list_Facturas_By_Solicitud.some(
                        (element) => element.estatus === 'Pendiente'
                      ) == false
                    "
                    color="purple-ieen"
                    label="Imprimir comprobación"
                    @click="imprimirComprobacion"
                    icon-right="print"
                  />
                  <q-btn
                    v-if="solicitud.reintegro_Url != null"
                    color="purple-ieen"
                    label="Ver reintegro"
                    @click="abrirReintegro"
                    icon-right="visibility"
                  />
                </div>
              </div>
              <div class="col-12 q-pt-md">
                <q-card class="col-12 q-mb-xs text-center">
                  <q-card-section>
                    <div class="text-subtitle1 text-bold text-gray-ieen-1">
                      IMPORTE SOLICITADO: ${{ solicitud.monto_Solicitado }}
                    </div>
                  </q-card-section>
                </q-card>
                <q-card class="col-12 q-pt-mdmy-card text-center">
                  <q-card-section>
                    <div class="text-subtitle1 text-bold text-gray-ieen-1">
                      IMPORTE APROBADO: ${{
                        solicitud.monto_Aprobado == null
                          ? 0
                          : solicitud.monto_Aprobado
                      }}
                      - IMPORTE NO APROBADO: $
                      {{ monto_No_Aprobado }}
                      = DIFERENCIA: ${{
                        monto_Calculado -
                        (solicitud.monto_Aprobado == null
                          ? monto_Aprobado
                          : solicitud.monto_Aprobado) -
                        monto_No_Aprobado
                      }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 q-pt-md q-pb-lg">
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
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td
                        v-for="col in props.cols"
                        :key="col.name"
                        :props="props"
                      >
                        <div v-if="col.name === 'id'">
                          <q-btn
                            v-if="
                              props.row.estatus == 'Pendiente' &&
                              solicitud.estatus == 'Pendiente'
                            "
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
                        <div v-else-if="col.name == 'estatus'">
                          <q-icon
                            size="sm"
                            :name="
                              col.value == 'Aprobado por recursos financieros'
                                ? 'check_circle'
                                : col.value == 'Pendiente'
                                ? 'warning'
                                : 'close'
                            "
                            :color="
                              col.value == 'Aprobado por recursos financieros'
                                ? 'green'
                                : col.value == 'Pendiente'
                                ? 'orange'
                                : 'red'
                            "
                          >
                            <q-tooltip>{{ col.value }}</q-tooltip>
                          </q-icon>
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
              <br /><br />
              <div class="col-lg-6 col-md-6 col-sm-12">
                <q-icon name="warning" color="orange" />
                Comprobantes no han sido validados por recursos financieros
                <br />
                <q-icon name="check_circle" color="green" />
                Comprobantes validados por recursos financieros
                <br />
                <q-icon name="close" color="red" />
                Comprobantes rechazados por recursos financieros
                <br />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-card-section>
      <div class="flotanteFooter">
        <q-card-section>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                color="red"
                label="Cerrar"
                @click="actualizarModal(false)"
                icon="close"
              />
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/facturas-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useSolicitudesAreaGCReembolsoStore } from "src/stores/solicitudes-area-gc-reembolso-store";
import GeneraEvidencias from "src/helpers/GeneraEvidencias";
import GeneraComprobacionDD from "src/helpers/GeneraComprobacionDD";

//-----------------------------------------------------------

const $q = useQuasar();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturaStore = useFacturasStore();
const evidenciasStore = useEvidenciaStore();
const solicitudesAreaGCReembolsoStore = useSolicitudesAreaGCReembolsoStore();
const { modal } = storeToRefs(solicitudesAreaGCReembolsoStore);
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { list_Evidencias } = storeToRefs(evidenciasStore);
const tab = ref("general");
const loading = ref(false);
const monto_Calculado = ref(0);
const monto_Aprobado = ref(0);
const monto_No_Aprobado = ref(0);

//-----------------------------------------------------------

watch(list_Facturas_By_Solicitud, (val) => {
  if (val != [] && val.length > 0 && val != null) {
    let list_Filtro = val.filter((x) => x.aprobado == true);
    let list_Filtro_False = val.filter(
      (x) => x.aprobado == false && x.estatus != "Pendiente"
    );
    monto_Aprobado.value = list_Filtro.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
    monto_No_Aprobado.value = list_Filtro_False.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
    monto_Calculado.value = val.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
  } else {
    monto_Calculado.value = 0;
  }
});

//-----------------------------------------------------------

const eliminar = async (id) => {
  $q.dialog({
    title: "¿Está seguro de eliminar la factura?",
    message: "Si se borra no se podrá recuperar la factura",
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
    const resp = await facturaStore.delete_Factura(id);
    if (resp.success) {
      await facturaStore.load_Facturas_Bysolicitud(solicitud.value.id);
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

const actualizarModal = (valor) => {
  tab.value = "general";
  monto_Calculado.value = 0;
  devengarDevengadoStore.initSolicitudDD();
  solicitudesAreaGCReembolsoStore.actualizarModal(valor);
};

const abrirReintegro = async () => {
  $q.dialog({
    title: "Ver PDF",
    style: "width: 800px; max-width: 80vw",
    message: `<iframe
            src="${solicitud.value.reintegro_Url}"
            width="100%"
            height="650"
          ></iframe>`,
    html: true,
    ok: "Cerrar",
  });
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

const imprimir_Evidencias = async () => {
  GeneraEvidencias(solicitud.value, list_Evidencias.value);
};

const imprimirComprobacion = async () => {
  GeneraComprobacionDD(solicitud.value, list_Facturas_By_Solicitud.value);
};

//-----------------------------------------------------------

const columns = [
  {
    name: "estatus",
    align: "center",
    label: "Estatus",
    field: "estatus",
    sortable: true,
  },
  {
    name: "fecha_Comprobante",
    align: "center",
    label: "Fecha comprobante",
    field: "fecha_Comprobante",
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
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: true,
  },
];

const columnsEvidencias = [
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
  rowsPerPage: 25,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>
<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
.flotante-tab {
  position: sticky;
  top: 84px;
  z-index: 999;
  background-color: white;
}
.flotanteFooter {
  margin-top: auto;
  width: 100%;
  position: sticky;

  bottom: 0;
  padding: 10px;
  background-color: white;
}
.my-sticky-last-column-table td:last-child {
  position: sticky;
  right: 0;
  z-index: 1;
}
</style>
