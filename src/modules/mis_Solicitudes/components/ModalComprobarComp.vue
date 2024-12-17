<template>
  <q-dialog
    v-model="modal"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 1000px; max-width: 100vw">
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
            />
            <q-tab icon="image" name="evidencias" label="Evidencias" />
            <q-tab
              icon="paid"
              name="comprobacion"
              label="Comprobación de gastos"
              v-if="
                solicitud.saldo_Cero != true &&
                solicitud.monto_Asignado != '$0.00'
              "
            />
          </q-tabs>
          <q-separator />
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="generales" class="row q-col-gutter-xs">
              <div class="col-12">
                <q-input
                  readonly
                  v-model="solicitud.area"
                  label="Área"
                  hint="Área de la cual se esta realizando la solicitud"
                >
                  <template v-slot:prepend>
                    <q-icon name="apartment" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  readonly
                  v-model="solicitud.empleado_Solicitante"
                  label="Solicitante"
                  hint="Empleado que realiza la solicitud"
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
                  readonly
                >
                  <template v-slot:prepend>
                    <q-icon name="supervisor_account" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  readonly
                  v-model="solicitud.actividad"
                  label="Actividad a realizar"
                  type="textarea"
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" />
                  </template>
                </q-input>
              </div>
              <div class="col-12">
                <q-input
                  readonly
                  v-model="solicitud.destino_String"
                  label="Destinos"
                >
                  <template v-slot:prepend>
                    <q-icon name="location_on" />
                  </template>
                </q-input>
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  readonly
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
                  readonly
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
                  readonly
                  v-model="solicitud.no_Dias"
                  type="number"
                  label="No. días"
                />
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  v-model="solicitud.no_Noches"
                  type="number"
                  label="No. noches"
                  readonly
                />
              </div>
              <div class="col-lg-3 col-md-3 col-xs-12">
                <q-input
                  readonly
                  v-model="solicitud.medio_Transporte"
                  label="Medio de transporte"
                >
                  <template
                    v-if="
                      solicitud.medio_Transporte != null &&
                      solicitud.medio_Transporte != 'Ninguno'
                    "
                    v-slot:prepend
                  >
                    <q-icon
                      :name="
                        solicitud.medio_Transporte == 'Terrestre'
                          ? 'directions_car'
                          : solicitud.medio_Transporte == 'Aéreo'
                          ? 'flight'
                          : 'directions_boat'
                      "
                    />
                  </template>
                </q-input>
              </div>
              <div
                v-if="solicitud.medio_Transporte != 'Ninguno'"
                class="col-lg-3 col-md-3 col-xs-12"
              >
                <q-input
                  v-model="solicitud.medio_Transporte_Especifico"
                  label="Tipo de medio de transporte"
                  readonly
                />
              </div>
              <div
                class="col-lg-3 col-md-3 col-xs-12"
                v-if="
                  solicitud.medio_Transporte_Especifico == 'Vehículo oficial'
                "
              >
                <q-input
                  readonly
                  v-model="solicitud.rol"
                  label="Tipo de medio de transporte"
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
                  readonly
                />
              </div>
              <div class="col-12"></div>
              <br />
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
                  readonly
                  v-model="solicitud.observaciones"
                  label="Observaciones"
                  hint="Ingrese observaciones que necesita que administración verifique"
                  type="textarea"
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" /> </template
                ></q-input>
              </div>
              <div class="col-12" v-if="solicitud.saldo_Cero == false">
                <q-input
                  color="purple-ieen"
                  readonly
                  v-model="solicitud.gastos_Viaje"
                  hint="Gastos de viaje"
                  type="textarea"
                  placeholder="Los viáticos y gastos de hospedaje serán asignados conforme a tabulador vigente. En caso de requerir gastos de viaje (transporte terrestre, transporte aéreo, traslados, gasolina, peajes, entre otros) favor de enlistar el tipo de gasto de viaje y el monto solicitado en este espacio."
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" /> </template
                ></q-input>
              </div>
              <div class="col-12">
                <q-input
                  color="purple-ieen"
                  readonly
                  v-model="solicitud.itinerario"
                  label="Itinerario"
                  hint="En espacio para indicar el itinerario a seguir durante la comisión"
                  type="textarea"
                >
                  <template v-slot:prepend>
                    <q-icon name="edit_note" /> </template
                ></q-input>
              </div>
            </q-tab-panel>
            <q-tab-panel name="reporte">
              <q-form @submit="reporte" class="row q-col-gutter-xs">
                <div class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="list_Evidencias.length > 0 && informe.id != null"
                      color="purple-ieen"
                      label="Imprimir reporte"
                      @click="imprimir_Reporte_Act"
                      icon-right="print"
                    />
                  </div>
                </div>
                <div class="col-12 col-xs-12 col-md-12">
                  <div
                    class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs"
                  >
                    <q-icon name="label_important" />
                    Actividad realizada
                  </div>
                  <q-input
                    counter
                    maxlength="1500"
                    :readonly="visualizar"
                    color="purple-ieen"
                    v-model.trim="informe.actividad_Realizada"
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
                    class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
                  >
                    <q-icon name="label_important" />
                    Conclusión y/o resultados obtenidos
                  </div>
                  <q-input
                    counter
                    maxlength="1500"
                    :readonly="visualizar"
                    color="purple-ieen"
                    v-model.trim="informe.conclusion"
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
                <div class="col-12 text-right" v-if="!visualizar">
                  <br />
                  <q-separator />
                  <q-toggle
                    checked-icon="check"
                    unchecked-icon="clear"
                    size="lg"
                    left-label
                    class="text-bold text-suntitle1"
                    label="¿Guardar como borrador?"
                    v-model="informe.borrador"
                    color="purple-ieen"
                  />
                </div>
                <div class="col-12">
                  <q-separator />
                  <br />
                </div>
                <div class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="solicitud.estatus != 'Concluido' && !visualizar"
                      :loading="loading"
                      type="submit"
                      color="secondary"
                      :label="informe.id == null ? 'Guardar' : 'Editar'"
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
            </q-tab-panel>
            <q-tab-panel name="evidencias" class="row">
              <div
                class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
              >
                <q-icon name="label_important" />
                Evidencias
              </div>
              <div class="col-12 justify-end">
                <div class="text-right q-gutter-xs">
                  <q-btn
                    v-if="list_Evidencias.length > 0 && informe.id != null"
                    color="purple-ieen"
                    label="Imprimir evidencias"
                    @click="imprimir_Reporte_Act"
                    icon-right="print"
                  />
                  <q-btn
                    v-if="!visualizar"
                    color="purple-ieen"
                    label="Nuevo"
                    @click="actualizar_Modal_Evidencia(true)"
                    icon-right="add_circle_outline"
                  />
                </div>
              </div>
              <TablaEvidenciasComp />
            </q-tab-panel>
            <q-tab-panel name="comprobacion">
              <div class="row">
                <div
                  class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
                >
                  <q-icon name="label_important" />
                  Comprobación de gastos
                </div>
                <div class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="solicitud.fecha_Pago != 'Sin registro'"
                      color="purple-ieen"
                      label="Imprimir comprobación"
                      @click="imprimirComprobacion"
                      icon-right="print"
                    />
                    <q-btn
                      v-if="
                        solicitud.monto_Asignado != solicitud.monto_Utilizado
                      "
                      color="purple-ieen"
                      :label="
                        solicitud.e_Reintegro
                          ? 'Ver reintegro'
                          : 'Registrar reintegro'
                      "
                      @click="abrirReintegro"
                      :icon-right="
                        solicitud.e_Reintegro ? 'visibility' : 'request_quote'
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
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useReintegroStore } from "src/stores/reintegro-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import TablaEvidenciasComp from "../components/TablaEvidenciasComp.vue";
import ComprobacionComp from "./ComprobacionComp.vue";
import GeneraInforme from "src/helpers/GeneraInforme";
import GeneraComprobacion from "src/helpers/GeneraComprobacion";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobarStore = useComprobarStore();
const reintegroStore = useReintegroStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { solicitud, visualizar } = storeToRefs(misSolicitudesStore);
const { modal, informe, list_Evidencias, list_Comprobaciones_Solicitud } =
  storeToRefs(comprobarStore);
const loading = ref(false);
const tab = ref("generales");

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  tab.value = "generales";
  comprobarStore.initComprobacion();
  comprobarStore.initInforme();
  comprobarStore.initEvidencia();
  misSolicitudesStore.initSolicitud();
  comprobarStore.actualizarConcluir(false);
  comprobarStore.actualizarModal(valor);
  misSolicitudesStore.actualizarEditar(false);
  misSolicitudesStore.actualizarVisualizar(false);
};

const actualizar_Modal_Evidencia = (valor) => {
  comprobarStore.actualizarModalEvidencia(valor);
};

const abrirReintegro = async () => {
  await misSolicitudesStore.load_Solicitud(solicitud.value.id);
  if (solicitud.value.e_Reintegro) {
    await reintegroStore.load_Reintegro(solicitud.value.id);
    reintegroStore.actualizarVisualizar(true);
  }
  reintegroStore.actualizarModal(true);
};

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
    if (informe.value.actividad_Realizada != null) {
      informe.value.actividad_Realizada =
        informe.value.actividad_Realizada.replace(/\s+/g, " ");
    }
    if (informe.value.conclusion != null) {
      informe.value.conclusion = informe.value.conclusion.replace(/\s+/g, " ");
    }
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
      await misSolicitudesStore.load_Mis_Solicitudes();
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
    await misSolicitudesStore.load_Mis_Solicitudes();
  }
};

const imprimir_comprobacion = async () => {
  loadingShow();
  await comprobarStore.loadComprobacionesBySolicitud(solicitud.value.id);
  GeneraComprobacion(solicitud.value, list_Comprobaciones_Solicitud.value);
  await misSolicitudesStore.load_Mis_Solicitudes();
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
      html: true,
      persistent: true,
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
        await misSolicitudesStore.load_Mis_Solicitudes();
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
