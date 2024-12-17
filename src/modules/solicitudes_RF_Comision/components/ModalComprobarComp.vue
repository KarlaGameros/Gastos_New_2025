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
          <div class="text-h5 text-gray-ieen-1 text-bold absolute-center">
            SOLICITUD DE COMISIÓN <br />
            <div class="text-center text-purple-ieen">
              {{ solicitud.folio }}
            </div>
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
            <q-tab icon="menu" name="generales" label="Datos generales" />
            <q-tab
              icon="edit_note"
              name="reporte"
              label="Reporte de actividades"
              v-if="solicitud.e_Informe_Actividades"
            />
            <q-tab
              icon="image"
              name="evidencias"
              label="Evidencias"
              v-if="solicitud.e_Evidencias"
            />
            <q-tab
              icon="paid"
              name="comprobacion"
              label="Comprobación de gastos"
              v-if="
                solicitud.e_Comprobacion_Gasto && solicitud.saldo_Cero == false
              "
            />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="generales" class="row q-col-gutter-xs">
              <div class="col-12">
                <q-input
                  v-model="solicitud.area"
                  label="Área"
                  hint="Área de la cual se esta realizando la solicitud"
                  disable
                >
                  <template v-slot:prepend>
                    <q-icon name="apartment" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  v-model="solicitud.empleado_Solicitante"
                  label="Solicitante"
                  hint="Empleado que realiza la solicitud"
                  disable
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  v-model="solicitud.responsable_Area"
                  label="Responsable"
                  hint="Empleado responsable de área"
                  disable
                >
                  <template v-slot:prepend>
                    <q-icon name="supervisor_account" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  disable
                  v-model="solicitud.actividad"
                  label="Actividad a realizar"
                  type="textarea"
                />
              </div>
              <div class="col-12">
                <q-input
                  v-model="solicitud.destino_String"
                  label="Destinos"
                  disable
                />
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  disable
                  v-model="solicitud.fecha_Salida"
                  label="Fecha de salida"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  disable
                  v-model="solicitud.fecha_LLegada"
                  label="Fecha de llegada"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  v-model="solicitud.no_Dias"
                  type="number"
                  label="No. días"
                  disable
                />
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  v-model="solicitud.no_Noches"
                  type="number"
                  label="No. noches"
                  disable
                />
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  v-model="solicitud.medio_Transporte"
                  label="Medio de transporte"
                  disable
                />
              </div>
              <div
                v-if="solicitud.medio_Transporte != 'Ninguno'"
                class="col-lg-3 col-md-3 col-xs-12"
              >
                <q-input
                  v-model="solicitud.medio_Transporte_Especifico"
                  label="Tipo de medio de transporte"
                  disable
                />
              </div>
              <div
                class="col-lg-3 col-md-3 col-xs-12"
                v-if="
                  solicitud.medio_Transporte_Especifico == 'Vehículo oficial'
                "
              >
                <q-input
                  v-model="solicitud.rol"
                  label="Tipo de medio de transporte"
                  disable
                />
              </div>
              <div
                class="col-lg-3 col-md-3 col-xs-12"
                v-if="
                  solicitud.medio_Transporte_Especifico == 'Vehículo oficial' &&
                  solicitud.rol == 'Chofer'
                "
              >
                <q-input
                  v-model="solicitud.vehiculo"
                  label="Vehículo oficial"
                  disable
                />
              </div>
              <div class="col-12"></div>
              <div class="col-lg-4 col-md-4 col-xs-12 text-center">
                <q-toggle
                  disable
                  v-model="solicitud.pernoctado"
                  checked-icon="other_houses"
                  color="purple-ieen"
                  label="¿Pernoctado?"
                  unchecked-icon="clear"
                  size="lg"
                  left-label
                  class="text-bold text-suntitle1"
                />
              </div>
              <div class="col-lg-4 col-md-4 col-xs-12 text-center">
                <q-toggle
                  disable
                  checked-icon="check"
                  unchecked-icon="clear"
                  size="lg"
                  left-label
                  class="text-bold text-suntitle1"
                  label="¿Guardar como borrador?"
                  v-model="solicitud.borrador"
                  color="purple-ieen"
                />
              </div>
              <div class="col-lg-4 col-md-4 col-xs-12 text-center">
                <q-toggle
                  disable
                  checked-icon="money_off"
                  unchecked-icon="clear"
                  size="lg"
                  left-label
                  class="text-bold text-suntitle1"
                  color="purple-ieen"
                  name="¿Solicitar recurso?"
                  v-model="solicitud.saldo_Cero"
                  label="No solicitar recurso"
                  lazy-rules
                  :rules="[
                    (val) => !!val || 'Especifique si desea solicitar recurso',
                  ]"
                />
              </div>
              <div class="col-12">
                <q-input
                  color="purple-ieen"
                  disable
                  v-model="solicitud.observaciones"
                  label="Observaciones"
                  hint="Ingrese observaciones que necesita que administración verifique"
                  type="textarea"
                />
              </div>
              <div class="col-12" v-if="solicitud.saldo_Cero == false">
                <q-input
                  color="purple-ieen"
                  disable
                  v-model="solicitud.gastos_Viaje"
                  hint="Gastos de viaje"
                  type="textarea"
                  placeholder="Los viáticos y gastos de hospedaje serán asignados conforme a tabulador vigente. En caso de requerir gastos de viaje (transporte terrestre, transporte aéreo, traslados, gasolina, peajes, entre otros) favor de enlistar el tipo de gasto de viaje y el monto solicitado en este espacio."
                />
              </div>
              <div class="col-12">
                <q-input
                  color="purple-ieen"
                  disable
                  v-model="solicitud.itinerario"
                  label="Itinerario"
                  hint="En espacio para indicar el itinerario a seguir durante la comisión"
                  type="textarea"
                />
              </div>
              <div
                v-if="props.tipo == 'aprobados_rf'"
                class="col-12 text-h5 text-purple-ieen text-bold text-center"
              >
                <br />
                INFORMACIÓN FINANCIERA
              </div>
              <br />
              <q-form
                v-if="props.tipo == 'aprobados_rf'"
                class="row q-col-gutter-xs"
                @submit="agregar_Distribucion"
              >
                <div class="col-lg-3 col-md-6 col-xs-12">
                  <q-input
                    v-model="solicitud.monto_Asignado"
                    label="Monto calculado"
                    disable
                  />
                </div>
                <div class="col-lg-3 col-md-6 col-xs-12">
                  <q-input
                    v-model="monto_Real"
                    prefix="$"
                    label="Monto asignado"
                    disable
                  />
                </div>
                <div class="col-lg-3 col-md-6 col-xs-12">
                  <q-select
                    color="purple-ieen"
                    ref="gasto_ref"
                    v-model="gasto_Id"
                    :options="list_Gastos"
                    label="Gasto"
                    hint="Seleccione el gasto"
                    lazy-rules
                    :rules="[(val) => !!val || 'El gasto es requerido']"
                  />
                </div>
                <div class="col-lg-3 col-md-6 col-xs-12">
                  <q-input
                    color="purple-ieen"
                    type="number"
                    ref="importe_ref"
                    v-model="distribucion.importe"
                    label="Monto"
                    lazy-rules
                    :rules="[(val) => !!val || 'El monto es requerido']"
                  />
                </div>
                <div class="col-12 justify-end q-pb-md">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      color="red"
                      label="limpiar"
                      @click="limpiarDistribucion"
                      icon="cleaning_services"
                    />
                    <q-btn
                      color="secondary"
                      :label="is_Editar ? 'Editar' : 'Agregar'"
                      type="submit"
                      icon="add"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <TablaDistribucion />
                </div>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="reporte">
              <q-form @submit="reporte" class="row q-col-gutter-xs">
                <div class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="
                        solicitud.e_Informe_Actividades == true &&
                        list_Evidencias.length > 0 &&
                        informe.id != null
                      "
                      color="purple-ieen"
                      label="Imprimir reporte"
                      @click="imprimir_Reporte_Act"
                      icon-right="print"
                    />
                  </div>
                </div>
                <div class="col-12 col-xs-12 col-md-12">
                  <div
                    class="text-subtitle1 text-bold text-purple-ieen q-pl-xs"
                  >
                    Actividad realizada
                  </div>
                  <q-input
                    :disable="visualizar"
                    color="purple-ieen"
                    v-model="informe.actividad_Realizada"
                    label="Actividad realizada"
                    hint="Describa la actividad que realizó"
                    type="textarea"
                    lazy-rules
                    :rules="[
                      (val) => !!val || 'La actividad a realizada es requerida',
                    ]"
                  />
                </div>
                <div class="col-12 col-xs-12 col-md-12">
                  <div
                    class="text-subtitle1 text-bold text-purple-ieen q-pl-xs q-pt-xs"
                  >
                    Conclusión y/o resultados obtenidos
                  </div>
                  <q-input
                    :disable="visualizar"
                    color="purple-ieen"
                    v-model="informe.conclusion"
                    label="Conclusión y/o resultados obtenidos"
                    hint="Describa la conclusión y los resultados obtenidos"
                    type="textarea"
                    lazy-rules
                    :rules="[
                      (val) =>
                        !!val ||
                        'La conclusión y resultados obtenidos son requeridos',
                    ]"
                  />
                </div>
                <div class="col-12">
                  <q-separator />
                  <br />
                </div>
              </q-form>
            </q-tab-panel>
            <q-tab-panel name="evidencias" class="row">
              <div class="col-12 justify-end">
                <div class="text-right q-gutter-xs">
                  <q-btn
                    v-if="list_Evidencias.length > 0 && informe.id != null"
                    color="purple-ieen"
                    label="Generar evidencias"
                    @click="imprimir_Reporte_Act"
                    icon-right="print"
                  />
                </div>
              </div>
              <TablaEvidenciasComp />
            </q-tab-panel>
            <q-tab-panel name="comprobacion">
              <div class="row">
                <div class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="
                        solicitud.estatus == 'Pendiente de conclusión' ||
                        solicitud.estatus == 'Concluido' ||
                        solicitud.estatus == 'Pendiente de reintegro'
                      "
                      color="purple-ieen"
                      label="Imprimir comprobación"
                      @click="imprimirComprobacion"
                      icon-right="print"
                    />
                    <q-btn
                      v-if="
                        solicitud.monto_Asignado != solicitud.monto_Utilizado &&
                        solicitud.e_Reintegro == true
                      "
                      color="purple-ieen"
                      label="Ver reintegro
                      "
                      @click="abrirReintegro"
                      icon-right="visibility
                      "
                    />
                  </div>
                </div>
                <div class="col-12 q-pt-md">
                  <q-card class="my-card text-center">
                    <q-card-section>
                      <div class="row" v-if="solicitud.e_Reintegro == true">
                        <q-icon name="task_alt" size="sm" color="green" />
                        <div class="text-subtitle1 text-bold text-green">
                          Reintegro generado
                        </div>
                      </div>
                      <div class="text-subtitle1 text-bold text-gray-ieen-1">
                        IMPORTE EROGADO: {{ solicitud.monto_Asignado }} -
                        IMPORTE UTILIZADO: {{ solicitud.monto_Utilizado }}
                        {{
                          solicitud.e_Reintegro
                            ? `- REINTEGRO: ${solicitud.monto_Reintegro}`
                            : ""
                        }}
                        = DIFERENCIA: ${{ solicitud.monto_Saldo }}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
              <ComprobacionComp />
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
                icon="highlight_off"
              />
              <q-btn
                v-if="
                  solicitud.estatus == 'Pendiente de conclusión' &&
                  concluir == true
                "
                type="button"
                color="secondary"
                label="Concluir"
                icon="fact_check"
                @click="concluirComprobacion"
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
import { useReintegroStore } from "src/stores/reintegro-store";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import GeneraInforme from "src/helpers/GeneraInforme";
import ComprobacionComp from "./ComprobacionComp.vue";
import TablaDistribucion from "../components/TablaDistribucion.vue";
import GeneraComprobacion from "src/helpers/GeneraComprobacion";
import TablaEvidenciasComp from "../components/TablaEvidenciasComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const loading = ref(false);
const comprobarStore = useComprobarStore();
const misSolicitudesStore = useMisSolicitudesStore();
const reintegroStore = useReintegroStore();
const solictudesRFStore = useSolicitudesRFStore();
const distribucionStore = useDistribucionStore();
const {
  modal,
  informe,
  list_Evidencias,
  list_Comprobaciones_Solicitud,
  concluir,
} = storeToRefs(comprobarStore);
const { visualizar, solicitud } = storeToRefs(misSolicitudesStore);
const { list_Distribuciones, distribucion, list_Gastos, is_Editar } =
  storeToRefs(distribucionStore);
const monto_Real = ref(0);
const gasto_Id = ref(null);
const tab = ref("generales");
const props = defineProps({
  tipo: {
    type: String,
  },
});

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(list_Distribuciones, (val) => {
  if (val != [] && val != null) {
    monto_Real.value = list_Distribuciones.value.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
  }
});

watch(distribucion.value, (val) => {
  if (val.id != null && is_Editar.value == true) {
    if (gasto_Id.value == null) {
      let gastoFiltrado = list_Gastos.value.find(
        (x) => x.value == val.c_Gasto_Id
      );
      gasto_Id.value = gastoFiltrado;
    }
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
  $q.loading.hide();
};

const limpiarDistribucion = () => {
  gasto_Id.value = null;
  distribucionStore.initDistribucion();
};

const agregar_Distribucion = async () => {
  loadingShow();
  loading.value = true;
  let resp = null;
  distribucion.value.c_Gasto_Id = parseInt(gasto_Id.value.value);
  if (is_Editar.value == true) {
    resp = await distribucionStore.update_Distribucion(distribucion.value);
  } else {
    resp = await distribucionStore.create_Distribucion(
      solicitud.value.id,
      distribucion.value
    );
  }
  if (resp.success) {
    limpiarDistribucion();
    await distribucionStore.load_Distribuciones(solicitud.value.id);
    loading.value = false;
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
    $q.loading.hide();
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
    $q.loading.hide();
    loading.value = false;
  }
};

const actualizarModal = (valor) => {
  monto_Real.value = 0;
  tab.value = "generales";
  comprobarStore.initInforme();
  comprobarStore.initComprobacion();
  misSolicitudesStore.initSolicitud();
  comprobarStore.actualizarModal(valor);
  comprobarStore.actualizarConcluir(false);
  misSolicitudesStore.actualizarEditar(false);
  misSolicitudesStore.actualizarVisualizar(false);
};

const abrirReintegro = async () => {
  loadingShow();
  await misSolicitudesStore.load_Solicitud(solicitud.value.id);
  if (solicitud.value.e_Reintegro) {
    await reintegroStore.load_Reintegro(solicitud.value.id);
    reintegroStore.actualizarVisualizar(true);
  }
  reintegroStore.actualizarModal(true);
  $q.loading.hide();
};

const reporte = async () => {
  $q.dialog({
    title: "Informe de actividades",
    message:
      informe.value.borrador == true
        ? `¿Desea guardar el informe de actividades de la solicitud con folio ${solicitud.value.folio} como borrador?`
        : `¿Desea guardar el informe de actividades de la solicitud con folio ${solicitud.value.folio} pasará a revisión?`,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "save",
      color: "secondary",
      label: "Sí! continuar",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    loadingShow();
    let resp = null;
    if (informe.value.id === null) {
      resp = await comprobarStore.create_Informe(
        solicitud.value.id,
        informe.value
      );
    } else {
      resp = await comprobarStore.update_Informe(informe.value);
    }
    if (resp.success) {
      await misSolicitudesStore.load_Solicitud(solicitud.value.id);
      await comprobarStore.load_Informe(solicitud.value.id);
      await misSolicitudesStore.load_Mis_Solicitudes();
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

const imprimir_Reporte_Act = async () => {
  if (
    solicitud.value.e_Informe_Actividades == false ||
    solicitud.value.e_Evidencias == false
  ) {
    loadingShow();
    const resp = await misSolicitudesStore.imprimir_ReporteAct(
      solicitud.value.id
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
      GeneraInforme(solicitud.value, informe.value, list_Evidencias.value);
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
    $q.loading.hide();
  } else {
    GeneraInforme(solicitud.value, informe.value, list_Evidencias.value);
  }
};

const imprimir_comprobacion = async () => {
  loadingShow();
  await comprobarStore.loadComprobacionesBySolicitud(solicitud.value.id);
  GeneraComprobacion(solicitud.value, list_Comprobaciones_Solicitud.value);
  $q.loading.hide();
};

const imprimirComprobacion = async () => {
  if (solicitud.value.e_Comprobacion_Gasto == true) {
    imprimir_comprobacion();
  } else {
    $q.dialog({
      title: "Impresión de comprobación de gastos",
      message: `¿Desea imprimir el formato de comprobación de gastos del folio <b>${solicitud.value.folio}</b>?, afectará el estatus de su sulicitud`,
      icon: "Warning",
      persistent: true,
      html: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Sí! continuar",
      },
      cancel: {
        color: "red",
        label: "Cancelar",
      },
    }).onOk(async () => {
      const resp = await misSolicitudesStore.imprimir_comprobacion(
        solicitud.value.id
      );
      if (resp.success) {
        imprimir_comprobacion();
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
  }
};

const concluirComprobacion = async () => {
  $q.dialog({
    title: "Conclusión de solicitud de comisión",
    message: `¿Desea concluir la solicitud con folio ${solicitud.value.folio}?`,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "save",
      color: "secondary",
      label: "Sí! Concluir",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    loadingShow();
    const resp = await solictudesRFStore.concluir(solicitud.value.id);
    if (resp.success) {
      $q.loading.hide();
      await solictudesRFStore.load_Solicitudes_RF();
      await solictudesRFStore.load_solicitudes_rec_financieros_aprobadas();
      actualizarModal(false);
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
  width: 100%;
  position: sticky;
  bottom: 0;
  background-color: white;
}
</style>
