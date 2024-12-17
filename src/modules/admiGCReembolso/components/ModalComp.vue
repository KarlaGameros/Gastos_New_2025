<template>
  <q-dialog
    v-model="modalDD"
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
                ? "SOLICITUD DE GASTO A COMPROBAR"
                : "SOLICITUD DE REEMBOLSO"
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
              v-if="solicitud.tipo_Solicitud_Gasto == 0"
              icon="edit_note"
              name="comprobacion"
              label="Comprobación"
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="general" class="row q-col-gutter-xs">
              <div class="col-12">
                <q-input disable label="Área" v-model="solicitud.area">
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
                  disable
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
                  disable
                  color="purple-ieen"
                  class="text-bold"
                >
                  <template v-slot:prepend>
                    <q-icon name="supervisor_account" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-xs-12">
                <q-input
                  v-model="solicitud.tipo_Evento"
                  label="Tipo de solictud"
                  disable
                  color="purple-ieen"
                  class="text-bold"
                >
                  <template v-slot:prepend>
                    <q-icon name="format_list_numbered" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-xs-12">
                <q-input
                  class="text-bold"
                  disable
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
                class="col-lg-4 col-md-4 col-xs-12"
              >
                <q-input
                  disable
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
              <div v-else class="col-lg-4 col-md-4 col-xs-12">
                <q-input
                  disable
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
              <div class="col-12">
                <q-input
                  counter
                  disable
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
                  disable
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
            <q-tab-panel name="comprobacion" class="row q-col-gutter-xs">
              <div
                class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
              >
                <q-icon name="label_important" />
                Comprobación de gastos
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
              <q-btn
                type="button"
                color="secondary"
                label="Recibir"
                icon="task_alt"
                @click="recibir"
              />
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/facturas-store";
import { useAdministracionStore } from "src/stores/administracion-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const facturaStore = useFacturasStore();
const administracionStore = useAdministracionStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { modalDD } = storeToRefs(administracionStore);
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const tab = ref("general");
const loading = ref(false);
const monto_Calculado = ref(0);

//-----------------------------------------------------------

watch(list_Facturas_By_Solicitud, (val) => {
  if (val != [] && val.length > 0 && val != null) {
    monto_Calculado.value = val.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
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

const actualizarModal = (valor) => {
  tab.value = "general";
  devengarDevengadoStore.initSolicitudDD();
  administracionStore.actualizarModalDD(valor);
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

const recibir = async () => {
  if (solicitud.value.tipo_Solicitud_Gasto == "Pendiente_Recepcion") {
    $q.dialog({
      title: `Recibir solucitud de ${
        solicitud.value.tipo_Solicitud_Gasto == 0
          ? "gasto a comprobar"
          : "reembolso"
      }`,
      message: `¿Está seguro de darle recepción a la solicitud con folio <b>${solicitud.value.folio}</b>?`,
      icon: "Warning",
      html: true,
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
          resp = await administracionStore.recibir_Admon_GC_Reem(
            solicitud.value.id,
            1
          );
          $q.loading.hide();
          break;
      }
      if (resp.success) {
        await administracionStore.load_Pendientes_Recepcion_Devengar_Devengado();
        actualizarModal(false);
        $q.loading.hide();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  } else {
    $q.dialog({
      title: `Recibir solucitud de ${
        solicitud.value.tipo_Solicitud_Gasto == 0
          ? "gasto a comprobar"
          : "reembolso"
      }`,
      message: `¿Está seguro de darle recepción a la solicitud con folio <b>${solicitud.value.folio}</b>?`,
      icon: "Warning",
      html: true,
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
          resp = await administracionStore.recibir_Admon_GC_Reem(
            solicitud.value.id,
            1
          );
          $q.loading.hide();
          break;
        case "opt2":
          loadingShow();
          resp = await administracionStore.recibir_Admon_GC_Reem(
            solicitud.value.id,
            2
          );
          $q.loading.hide();
          break;
      }
      if (resp.success) {
        await administracionStore.load_Pendientes_Recepcion_Devengar_Devengado();
        actualizarModal(false);
        $q.loading.hide();
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  }
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
