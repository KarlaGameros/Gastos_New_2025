<template>
  <q-dialog
    v-model="modalDevengar"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <div class="flotante">
        <q-card-section class="row">
          <q-img src="../../../assets/IEEN300.png" width="90px" />
          <div class="text-h6 text-gray-ieen-1 text-bold absolute-center">
            SOLICITUD DE GASTO A COMPROBAR<br />
            <div class="text-center text-purple-ieen">
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
                (props.tipo == 'pendiente_concluir' ||
                  props.tipo == 'concluidas' ||
                  props.tipo == 'validar') &&
                list_Evidencias.length > 0
              "
              icon="menu"
              name="evidencias"
              label="Evidencias"
            />
            <q-tab
              v-if="
                (props.tipo == 'pendiente_concluir' ||
                  props.tipo == 'concluidas' ||
                  props.tipo == 'validar') &&
                list_Facturas_By_Solicitud.length > 0
              "
              icon="edit_note"
              name="comprobacion"
              label="Comprobación"
            />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="general" class="row q-col-gutter-xs">
              <div class="col-12">
                <q-input v-model="solicitud.area" label="Área" readonly>
                  <template v-slot:prepend>
                    <q-icon name="apartment" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  v-model="solicitud.empleado_Solicitante"
                  label="Solicitante"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  v-model="solicitud.responsable_Area"
                  label="Responsable"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="supervisor_account" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <q-input
                  v-model="solicitud.tipo_Evento"
                  label="Tipo de solictud"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="format_list_numbered" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
                <q-input
                  class="text-bold"
                  readonly
                  color="purple-ieen"
                  v-model="solicitud.fecha_Solicitud"
                  label="Fecha en que se requiere el recurso"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
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
                class="q-pt-lg col-12 text-h5 text-purple-ieen text-bold text-center"
              >
                INFORMACIÓN FINANCIERA
              </div>
              <br />
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  v-model="solicitud.monto_Solicitado"
                  label="Monto solictado"
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                <q-input
                  :readonly="solicitud.aprobado_Administracion"
                  color="purple-ieen"
                  type="number"
                  v-model="solicitud.monto_Aprobado"
                  label="Monto aprobado"
                  lazy-rules
                  hint="Ingrese el monto aprobado"
                  :rules="[(val) => !!val || 'El monto aprobado es requerido']"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_money" />
                  </template>
                </q-input>
              </div>
            </q-tab-panel>
            <q-tab-panel name="evidencias" class="row q-col-gutter-xs">
              <div
                class="col-12 text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
              >
                <q-icon name="label_important" />
                Evidencias
              </div>
              <div class="col-12 justify-end">
                <div class="text-right q-gutter-xs">
                  <q-btn
                    v-if="
                      (props.tipo == 'pendiente_concluir' ||
                        props.tipo == 'concluidas') &&
                      list_Evidencias.length > 0
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
              <div class="col-12 justify-end">
                <div class="text-right q-gutter-xs">
                  <q-btn
                    v-if="
                      (props.tipo == 'pendiente_concluir' ||
                        props.tipo == 'concluidas') &&
                      list_Facturas_By_Solicitud.length > 0
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
                    <div class="row" v-if="solicitud.reintegro_Url != null">
                      <q-icon name="task_alt" size="sm" color="green" />
                      <div class="text-subtitle1 text-bold text-green">
                        Reintegro generado
                      </div>
                    </div>
                    <div class="text-subtitle1 text-bold text-gray-ieen-1">
                      IMPORTE APROBADO: ${{ solicitud.monto_Aprobado }} -
                      IMPORTE UTILIZADO: ${{ monto_Calculado }}
                      {{
                        solicitud.reintegro_Url != null
                          ? `- REINTEGRO: $${solicitud.monto_Reintegro}`
                          : ""
                      }}
                      = DIFERENCIA: ${{
                        solicitud.monto_Saldo == null
                          ? solicitud.monto_Aprobado - monto_Calculado
                          : solicitud.monto_Saldo
                      }}
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 q-pt-md">
                <q-table
                  :rows="list_Facturas_By_Solicitud"
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
                          <q-btn
                            v-if="props.row.estatus == 'Pendiente'"
                            flat
                            round
                            color="purple-ieen"
                            icon="task_alt"
                            @click="aprobarFactura(props.row)"
                          >
                            <q-tooltip>Aprobar</q-tooltip>
                          </q-btn>
                          <q-btn
                            v-if="props.row.estatus == 'Pendiente'"
                            flat
                            round
                            color="purple-ieen"
                            icon="cancel"
                            @click="rechazarFactura(props.row)"
                          >
                            <q-tooltip>Rechazar</q-tooltip>
                          </q-btn>
                          <q-btn
                            v-if="props.row.observaciones != null"
                            flat
                            round
                            color="purple-ieen"
                            icon="search"
                            @click="verObservaciones(props.row.observaciones)"
                          >
                            <q-tooltip>Ver observaciones</q-tooltip>
                          </q-btn>
                        </div>
                        <div v-else-if="col.name === 'estatus'">
                          <q-badge
                            :color="
                              col.value == 'Pendiente'
                                ? 'orange'
                                : col.value ==
                                  'Rechazado por recursos financieros'
                                ? 'red'
                                : 'green'
                            "
                          >
                            {{
                              col.value == "Rechazado por recursos financieros"
                                ? "Rechazada"
                                : col.value ==
                                  "Aprobado por recursos financieros"
                                ? "Aprobado"
                                : col.value
                            }}
                            <q-icon
                              :name="
                                col.value == 'Pendiente'
                                  ? 'warning'
                                  : col.value ==
                                    'Rechazado por recursos financieros'
                                  ? 'close'
                                  : 'done'
                              "
                              color="white"
                              class="q-ml-xs"
                            />
                          </q-badge>
                        </div>
                        <label
                          v-else-if="col.name == 'importe'"
                          class="text-bold"
                        >
                          ${{ col.value }}
                        </label>
                        <label v-else>{{ col.value }}</label>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </div>
              <div
                v-if="
                  !solicitud.validado &&
                  list_Facturas_By_Solicitud.length > 0 &&
                  list_Facturas_By_Solicitud.some(
                    (element) => element.estatus === 'Pendiente'
                  ) == false
                "
                class="col-12 text-right q-pt-lg"
              >
                <q-btn
                  label="Notificar comprobación"
                  color="purple-ieen"
                  icon-right="send"
                  @click="validarComprobacion"
                />
              </div>
              <br />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </q-card-section>
      <br /><br />
      <div v-if="!solicitud.aprobado_Administracion" class="flotanteFooter">
        <q-card-section>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                color="red"
                label="Rechazar"
                @click="rechazar"
                icon="cancel"
              />
              <q-btn
                :loading="loading"
                color="secondary"
                label="Aprobar"
                icon="task_alt"
                @click="aprobar"
              />
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { usePagoStore } from "src/stores/pago-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { useReintegroStore } from "src/stores/reintegro-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { onBeforeMount, ref, watch } from "vue";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
import GeneraComprobacionDD from "src/helpers/GeneraComprobacionDD";
import GeneraEvidencias from "src/helpers/GeneraEvidencias";

//-----------------------------------------------------------

const $q = useQuasar();
const pagoStore = usePagoStore();
const facturaStore = useFacturasStore();
const reintegroStore = useReintegroStore();
const evidenciasStore = useEvidenciaStore();
const distribucionStore = useDistribucionStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { list_Evidencias } = storeToRefs(evidenciasStore);
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const { modalDevengar, aprobarInporte } = storeToRefs(solicitudesGCReemRFStore);
const motivo = ref(null);
const props = defineProps({
  tipo: {
    type: String,
  },
});
const loading = ref(false);
const tab = ref("general");
const monto_Validar = ref(0);
const monto_Calculado = ref(0);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(list_Facturas_By_Solicitud, (val) => {
  if (val != [] && val.length > 0 && val != null) {
    let list = val.filter((x) => x.aprobado == true);
    monto_Calculado.value = list.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
    monto_Validar.value = val.reduce(
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

const cargarData = async () => {
  loadingShow();
  await distribucionStore.load_Gastos();
  await pagoStore.load_Formas_Pago();
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  tab.value = "general";
  devengarDevengadoStore.initSolicitudDD();
  devengarDevengadoStore.actualizarVisualizar(false);
  solicitudesGCReemRFStore.actualizarModalDevengar(valor);
};

const imprimirComprobacion = async () => {
  GeneraComprobacionDD(solicitud.value, list_Facturas_By_Solicitud.value);
};

const imprimir_Evidencias = async () => {
  GeneraEvidencias(solicitud.value, list_Evidencias.value);
};

const aprobar = async () => {
  if (
    solicitud.value.monto_Aprobado == 0 ||
    solicitud.value.monto_Aprobado == null
  ) {
    $q.dialog({
      title: "No asignó recurso",
      message: "Deberá asignar recurso para seguir con la solicitud",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: false,
      cancel: {
        color: "red",
        label: "Regresar",
      },
    });
  } else if (
    solicitud.value.monto_Aprobado > solicitud.value.monto_Solicitado
  ) {
    $q.dialog({
      title: "Monto aprobado mayor al solicitado",
      message: "No podrá aprobar un monto mayor al solicitado",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: false,
      cancel: {
        color: "red",
        label: "Regresar",
      },
    });
  } else {
    $q.dialog({
      title: "Aprobación de solicitud de gasto a comprobar",
      message: `¿Desea aprobar la solicitud con folio <b>${solicitud.value.folio}</b> con un monto aprobado de <b>$${solicitud.value.monto_Aprobado}</b>?`,
      html: true,
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Sí! aprobar",
        icon: "task_alt",
      },
      cancel: {
        color: "red",
        label: "Cancelar",
      },
    }).onOk(async () => {
      loadingShow();
      aprobarInporte.value.importe = solicitud.value.monto_Aprobado;
      const resp = await solicitudesGCReemRFStore.aprobar_RF(
        solicitud.value.id,
        aprobarInporte.value
      );
      if (resp.success) {
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
        await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
        await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
        actualizarModal(false);
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
  }
};

const rechazar = async () => {
  $q.dialog({
    title: "Rechazo de solicitud de gasto a comprobar",
    message: `¿Desea rechazar la solicitud con folio <b>${solicitud.value.folio}</b>?, al cancelar la solicitud no procede`,
    icon: "Warning",
    html: true,
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Sí! rechazar",
      icon: "cancel",
    },
    cancel: {
      color: "red",
      label: "No, Salir",
    },
  }).onOk(async () => {
    loadingShow();
    const resp = await solicitudesGCReemRFStore.rechazar_RF(solicitud.value.id);
    if (resp.success) {
      await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
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
      actualizarModal(false);
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

const aprobarFactura = async (row) => {
  $q.dialog({
    title: "Aprobar factura",
    message: `¿Desea aprobar la factura por <b>$${row.importe}</b>?`,
    icon: "Warning",
    html: true,
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Sí! aprobar",
      icon: "task_alt",
    },
    cancel: {
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    loadingShow();
    const resp = await facturaStore.aprobar_Factura(row.id);
    if (resp.success) {
      await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
      await facturaStore.load_Facturas_Bysolicitud(row.solicitud_Gasto_Id);
      await devengarDevengadoStore.load_Solicitud_DD(row.solicitud_Gasto_Id);
      if (
        list_Facturas_By_Solicitud.value.some(
          (element) => element.estatus === "Pendiente"
        ) == false
      ) {
        validarComprobacion();
      }
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

const rechazarFactura = async (row) => {
  $q.dialog({
    title: "¿Esta seguro de rechazar la factura?",
    message: "Especifique motivo",
    prompt: {
      model: motivo.value,
      type: "text",
    },
    cancel: true,
    persistent: true,
  }).onOk(async (data) => {
    if (data == null || data == "") {
      $q.notify({
        type: "warning",
        message: "El motivo es obligatorio",
        position: "top-right",
        actions: [
          {
            icon: "close",
            color: "black",
            round: true,
            handler: () => {},
          },
        ],
      });
    } else {
      loadingShow();
      const resp = await facturaStore.rechazar_Factura(row.id, data);
      if (resp.success) {
        await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
        await facturaStore.load_Facturas_Bysolicitud(row.solicitud_Gasto_Id);
        await devengarDevengadoStore.load_Solicitud_DD(row.solicitud_Gasto_Id);
        if (
          list_Facturas_By_Solicitud.value.filter(
            (x) =>
              x.estatus == "Pendiente" ||
              x.estatus == "Aprobado por recursos financieros"
          ).length == 0
        ) {
          $q.notify({
            type: "warning",
            message:
              "La solicitud ha sido rechazada porque los comprobantes fueron rechazados",
            position: "top-right",
          });
          let rechazar = await solicitudesGCReemRFStore.rechazar_RF(
            row.solicitud_Gasto_Id
          );
          if (rechazar.success) {
            await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
            await devengarDevengadoStore.load_Solicitud_DD(
              row.solicitud_Gasto_Id
            );
            actualizarModal(false);
            $q.loading.hide();
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
        } else {
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
        }
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
    }
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

const verObservaciones = (observacion) => {
  $q.dialog({
    title: "Observaciones",
    message: `${observacion}`,
    ok: "Cerrar",
    persistent: true,
  });
};

const abrirReintegro = async () => {
  await reintegroStore.load_Reintegro_DD(solicitud.value.id);
  reintegroStore.actualizarModalReintegro(true);
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

const validarComprobacion = () => {
  $q.dialog({
    title: "¿Desea notificar la comprobación?",
    message: `Se le notificará al solicitante que se han validado los comprobantes de la solicitud con folio <b>${solicitud.value.folio}</b>`,
    html: true,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Sí! notificar",
      icon: "task_alt",
    },
    cancel: {
      color: "red",
      label: "Cerrar",
    },
  }).onOk(async () => {
    loadingShow();
    const resp = await devengarDevengadoStore.validar_Comprobacion(
      solicitud.value.id
    );
    if (resp.success) {
      await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
      await devengarDevengadoStore.load_Solicitud_DD(solicitud.value.id);
      actualizarModal(false);
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

const columns = [
  {
    name: "fecha_Comprobante",
    align: "center",
    label: "Fecha comprobante",
    field: "fecha_Comprobante",
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
</style>
