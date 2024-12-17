<template>
  <q-dialog
    v-model="modal_Devengar"
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
              is_Editar
                ? "EDITAR SOLICITUD GASTO A COMPROBAR"
                : visualizar
                ? "VER SOLICITUD GASTO A COMPROBAR"
                : "CREAR SOLICITUD GASTO A COMPROBAR"
            }}
            <br />
            <div
              v-if="is_Editar || visualizar"
              class="text-center text-bold text-h6 text-purple-ieen"
            >
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
      <q-form @submit="onSubmit">
        <q-card-section>
          <q-card>
            <q-tabs
              v-model="tabDevengar"
              align="justify"
              class="text-grey flotante-tab"
              active-color="purple-ieen"
              indicator-color="purple-ieen"
              inline-label
            >
              <q-tab icon="menu" name="general" label="Datos generales" />
              <q-tab
                v-if="solicitud.id != null && solicitud.aprobado_Administracion"
                icon="menu"
                name="evidencias"
                label="Evidencias"
              />
              <q-tab
                v-if="solicitud.id != null && solicitud.aprobado_Administracion"
                icon="edit_note"
                name="comprobacion"
                label="Comprobación"
              />
            </q-tabs>
            <q-tab-panels v-model="tabDevengar" animated>
              <q-tab-panel name="general" class="row q-col-gutter-xs">
                <div class="col-12">
                  <q-select
                    :readonly="
                      is_Editar || visualizar || perfil != 'Super Administrador'
                    "
                    v-model="area_Id"
                    :options="list_Areas"
                    label="Área"
                    hint="Seleccione el Área del solicitante"
                    lazy-rules
                    :rules="[(val) => !!val || 'El area es requerida']"
                    color="purple-ieen"
                    class="text-bold"
                  >
                    <template v-slot:prepend>
                      <q-icon name="apartment" />
                    </template>
                  </q-select>
                </div>
                <div
                  class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
                  v-if="
                    (perfil == 'Super Administrador' ||
                      perfil == 'Administrador') &&
                    !visualizar
                  "
                >
                  <q-select
                    :readonly="is_Editar || visualizar"
                    color="purple-ieen"
                    v-model="solicitante_Id"
                    :options="list_Empleados_By_Area"
                    label="Solicitante"
                    hint="Seleccione al empleado solicitante"
                    lazy-rules
                    :rules="[(val) => !!val || 'El solicitante es requerido']"
                    class="text-bold"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-select>
                </div>
                <div
                  class="col-lg-6 col-md-6 col-sm-12 col-xs-12"
                  v-else-if="perfil == 'Personal' && !visualizar"
                >
                  <q-input
                    color="purple-ieen"
                    v-model="personal_Captura"
                    label="Solicitante"
                    hint="Empleado que realiza la solicitud"
                    readonly
                    class="text-bold"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" v-else>
                  <q-input
                    color="purple-ieen"
                    v-model="solicitud.empleado_Solicitante"
                    label="Solicitante"
                    hint="Empleado que realiza la solicitud"
                    readonly
                    class="text-bold"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" />
                    </template>
                  </q-input>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                  <q-input
                    v-model="responsable_area.nombre_Completo"
                    label="Responsable"
                    hint="Empleado responsable de área"
                    readonly
                    color="purple-ieen"
                    class="text-bold"
                  >
                    <template v-slot:prepend>
                      <q-icon name="supervisor_account" />
                    </template>
                  </q-input>
                </div>
                <div
                  :class="
                    solicitud.monto_Aprobado != null
                      ? 'col-lg-3 col-md-3 col-xs-12'
                      : 'col-lg-4 col-md-4 col-xs-12'
                  "
                >
                  <q-select
                    :readonly="visualizar"
                    color="purple-ieen"
                    v-model="solicitud.tipo_Evento"
                    :options="tipos_Solicitudes"
                    label="Tipo de solictud"
                    hint="Seleccione el tipo"
                    lazy-rules
                    :rules="[
                      (val) => !!val || 'El tipo de solicitud es requerido',
                    ]"
                    class="text-bold"
                  >
                    <template v-slot:prepend>
                      <q-icon name="format_list_numbered" />
                    </template>
                  </q-select>
                </div>
                <div
                  :class="
                    solicitud.monto_Aprobado != null
                      ? 'col-lg-3 col-md-3 col-xs-12'
                      : 'col-lg-4 col-md-4 col-xs-12'
                  "
                >
                  <q-input
                    class="text-bold"
                    :readonly="visualizar"
                    color="purple-ieen"
                    v-model="solicitud.fecha_Solicitud"
                    label="Fecha"
                    hint="Fecha en que se requiere el recurso"
                    lazy-rules
                    mask="date"
                    :rules="[(val) => !!val || 'La fecha es requerida']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          v-if="!visualizar"
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            :options="optionsFecha"
                            color="purple-ieen"
                            v-model="solicitud.fecha_Solicitud"
                            mask="YYYY/MM/DD"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Listo"
                                color="purple-ieen"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div
                  :class="
                    solicitud.monto_Aprobado != null
                      ? 'col-lg-3 col-md-3 col-xs-12'
                      : 'col-lg-4 col-md-4 col-xs-12'
                  "
                >
                  <q-input
                    :readonly="visualizar"
                    v-model="solicitud.monto_Solicitado"
                    label="Monto solicitado"
                    hint="Ingrese el monto a solicitar"
                    color="purple-ieen"
                    class="text-bold"
                    type="number"
                    lazy-rules
                    :rules="[(val) => !!val || 'El monto requerido']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_money" />
                    </template>
                  </q-input>
                </div>
                <div
                  v-if="solicitud.monto_Aprobado != null"
                  class="col-lg-3 col-md-3 col-xs-12"
                >
                  <q-input
                    readonly
                    v-model="solicitud.monto_Aprobado"
                    label="Monto aprobado"
                    color="purple-ieen"
                    hint="Monto aprobado"
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
                    maxlength="1500"
                    :readonly="visualizar"
                    color="purple-ieen"
                    v-model="solicitud.motivo"
                    label="Justificación de la solicitud"
                    hint="Describa la justificación de la solicitud"
                    type="textarea"
                    lazy-rules
                    class="text-bold"
                    :rules="[(val) => !!val || 'La justificación es requerida']"
                  >
                    <template v-slot:prepend>
                      <q-icon name="edit_note" />
                    </template>
                  </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    class="text-bold"
                    color="purple-ieen"
                    :readonly="visualizar"
                    v-model="solicitud.observaciones"
                    label="Observaciones"
                    hint="Ingrese observaciones que necesita que administración verifique"
                    type="textarea"
                  >
                    <template v-slot:prepend>
                      <q-icon name="edit_note" />
                    </template>
                  </q-input>
                </div>
                <div
                  v-if="gasto_Representacion || solicitud.gastos_Representacion"
                  class="col-6 text-center"
                >
                  <q-toggle
                    :disable="visualizar"
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
                <div
                  v-if="!visualizar && solicitud.folio == null"
                  class="col-6 text-center"
                >
                  <q-toggle
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
                        ) == false &&
                        solicitud.validado
                      "
                      color="purple-ieen"
                      label="Imprimir evidencias"
                      @click="imprimir_Evidencias"
                      icon-right="print"
                    />
                    <q-btn
                      v-if="
                        solicitud.estatus != 'Concluido' &&
                        solicitud.terminado != true
                      "
                      color="purple-ieen"
                      label="Nuevo"
                      @click="actualizar_Modal_Evidencia(true)"
                      icon-right="add_circle_outline"
                    />
                  </div>
                </div>
                <div class="col-12">
                  <TablaEvidenciasComp :tipo="'gastoComprobar'" />
                </div>
              </q-tab-panel>
              <q-tab-panel name="comprobacion" class="row q-col-gutter-xs">
                <div
                  class="text-subtitle1 text-bold text-gray-ieen-1 q-pl-xs q-pt-xs"
                >
                  <q-icon name="label_important" />
                  Comprobación de gastos
                </div>
                <q-banner
                  v-if="list_Facturas_By_Solicitud.length > 0"
                  dense
                  inline-actions
                  rounded
                  class="bg-orange text-white col-12 q-ma-sm"
                >
                  <template v-slot:avatar>
                    <q-icon name="warning" color="white" />
                  </template>
                  <div class="text-bold text-subtitle1">
                    Si todos los comprobantes están validados podrá subir su
                    reintegro y descargar la comprobación
                  </div>
                </q-banner>
                <div class="col-12 justify-end">
                  <div class="text-right q-gutter-xs">
                    <q-btn
                      v-if="
                        list_Facturas_By_Solicitud.length > 0 &&
                        list_Facturas_By_Solicitud.some(
                          (element) => element.estatus === 'Pendiente'
                        ) == false &&
                        solicitud.validado
                      "
                      color="purple-ieen"
                      label="Imprimir comprobación"
                      @click="imprimirComprobacion"
                      icon-right="print"
                    />
                    <q-btn
                      v-if="
                        solicitud.estatus != 'Concluido' &&
                        list_Facturas_By_Solicitud.length > 0 &&
                        list_Facturas_By_Solicitud.some(
                          (element) => element.estatus === 'Pendiente'
                        ) == false &&
                        solicitud.validado &&
                        (solicitud.monto_Saldo != 0 ||
                          solicitud.reintegro_Url != null)
                      "
                      color="purple-ieen"
                      :label="
                        solicitud.reintegro_Url != null
                          ? 'Ver reintegro'
                          : 'Subir reintegro'
                      "
                      @click="abrirReintegro"
                      :icon-right="
                        solicitud.e_Reintegro ? 'visibility' : 'request_quote'
                      "
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
                <div class="col-12 justify-end q-pt-lg">
                  <div class="text-right">
                    <q-btn
                      v-if="
                        solicitud.estatus != 'Concluido' &&
                        solicitud.terminado != true
                      "
                      color="purple-ieen"
                      label="Agregar factura"
                      @click="subirFacturas(solicitud.id)"
                      icon-right="upload_file"
                    />
                  </div>
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
                                solicitud.estatus != 'Concluido' &&
                                solicitud.terminado != true
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
                <div
                  v-if="
                    solicitud.terminado != true &&
                    list_Facturas_By_Solicitud.length > 0
                  "
                  class="col-lg-6 col-md-6 col-sm-12 text-right"
                >
                  <q-btn
                    label="Enviar comprobación"
                    color="purple-ieen"
                    icon-right="send"
                    @click="enviarComprobacion"
                  >
                    <q-tooltip class="text-body2" :offset="[10, 10]">
                      Al mandar la comprobación se le notificará a recursos
                      financieros para su validación
                    </q-tooltip>
                  </q-btn>
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
                  v-if="!visualizar"
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
          </q-card-section>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
  <ModalReintegro />
  <ModalEvidencias />
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onBeforeMount, ref, watch } from "vue";
import { EncryptStorage } from "storage-encryption";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useFacturasStore } from "src/stores/facturas-store";
import { useReintegroStore } from "src/stores/reintegro-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import TablaEvidenciasComp from "./TablaEvidenciasComp.vue";
import ModalReintegro from "./ModalReintegro.vue";
import ModalEvidencias from "./ModalEvidencias.vue";
import GeneraEvidencias from "src/helpers/GeneraEvidencias";
import GeneraComprobacionDD from "src/helpers/GeneraComprobacionDD";

//-----------------------------------------------------------

const $q = useQuasar();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const misSolicitudesStore = useMisSolicitudesStore();
const configuracionStore = useConfiguracionStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturaStore = useFacturasStore();
const reintegroStore = useReintegroStore();
const evidenciasStore = useEvidenciaStore();
const { tab } = storeToRefs(misSolicitudesStore);
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const { modal_Devengar, solicitud, visualizar, is_Editar } = storeToRefs(
  devengarDevengadoStore
);
const { list_Areas, list_Empleados_By_Area, responsable_area, empleado } =
  storeToRefs(configuracionStore);
const { list_Evidencias } = storeToRefs(evidenciasStore);
const perfil = ref(encryptStorage.decrypt("perfil"));
const area_Id = ref(null);
const solicitante_Id = ref(null);
const personal_Captura = ref(`${encryptStorage.decrypt("empleado")}`);
const tabDevengar = ref("general");
const loading = ref(false);
const tipos_Solicitudes = ref(["Ordinaria", "Urgente", "Otro"]);
const monto_Calculado = ref(0);
const monto_Validar = ref(0);
const gasto_Representacion = ref(false);

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
  } else {
    monto_Calculado.value = 0;
  }
});

watch(solicitud.value, (val) => {
  if (val != null && modal_Devengar.value) {
    cargarArea(solicitud.value);
    cargarSolicitante(solicitud.value);
  }
  if (perfil.value == "Personal" || perfil.value == "Administrador") {
    cargarArea(solicitud.value);
  }
});

watch(area_Id, (val) => {
  if (val != null) {
    if (is_Editar.value == false && visualizar.value == false) {
      solicitante_Id.value = null;
    }
    loadEmpleadosByArea(val.value);
  }
});

watch(solicitante_Id, (val) => {
  if (val != null) {
    loadResponsableEmpleado(val.value);
  }
});

//-----------------------------------------------------------

const cargarData = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await configuracionStore.load_Empleado_ByUsusario();
  cargarArea();
  let puesto = encryptStorage.decrypt("puesto").toUpperCase();
  gasto_Representacion.value = puesto.includes("PRESIDENTA", "PRESIDENTE");
  $q.loading.hide();
};

const abrirReintegro = async () => {
  if (solicitud.value.reintegro_Url != null) {
    await reintegroStore.load_Reintegro_DD(solicitud.value.id);
  }
  reintegroStore.actualizarModalReintegro(true);
};

const loadEmpleadosByArea = async (id) => {
  await configuracionStore.load_Empleados_By_Area(id);
};

const loadResponsableEmpleado = async (empleadoId) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await configuracionStore.load_Responsable_Empleado(empleadoId);
  $q.loading.hide();
};

const cargarArea = async (val) => {
  await configuracionStore.load_Areas();
  if (val == undefined || val.id == null) {
    if (perfil.value != "Super Administrador" && area_Id.value == null) {
      let areaFiltrado = list_Areas.value.find(
        (x) => x.value == encryptStorage.decrypt("area_Id")
      );
      area_Id.value = areaFiltrado;
    }
  } else {
    let areaFiltrado = list_Areas.value.find((x) => x.value == val.area_Id);
    area_Id.value = areaFiltrado;
  }
  if (perfil.value == "Personal" && visualizar.value == false) {
    loadResponsableEmpleado(empleado.value.id);
  }
  if (perfil.value == "Personal" && visualizar.value == true) {
    loadResponsableEmpleado(val.empleado_Solicitante_Id);
  }
};

const cargarSolicitante = async (val) => {
  await configuracionStore.load_Empleados_By_Area(val.area_Id);
  if (val != undefined) {
    let solicitanteFiltrado = list_Empleados_By_Area.value.find(
      (x) => x.value == val.empleado_Solicitante_Id
    );
    solicitante_Id.value = solicitanteFiltrado;
  }
  loadResponsableEmpleado(val.empleado_Solicitante_Id);
};

const limpiar = () => {
  area_Id.value = null;
  solicitante_Id.value = null;
};

const actualizarModal = (valor) => {
  limpiar();
  tabDevengar.value = "general";
  devengarDevengadoStore.initSolicitudDD();
  devengarDevengadoStore.actualizarModalDevengar(valor);
  devengarDevengadoStore.actualizarVisualizar(valor);
  devengarDevengadoStore.actualizarEditar(valor);
  list_Facturas_By_Solicitud.value = [];
  tab.value = "gastoComprobar";
};

const actualizar_Modal_Evidencia = () => {
  evidenciasStore.actualizarModalEvidencia(true);
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

const eliminar = async (id) => {
  $q.dialog({
    title: "Eliminar factura",
    message: "¿Desea eliminar la factura?",
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

const optionsFecha = (date) => {
  const dateActual = new Date();
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, "0");
  const day = String(dateActual.getDate()).padStart(2, "0");
  const dateA = `${year}/${month}/${day}`;
  return date >= dateA;
};

const imprimir_Evidencias = async () => {
  GeneraEvidencias(solicitud.value, list_Evidencias.value);
  if (
    (solicitud.value.estatus != "Concluido" &&
      solicitud.value.reintegro_Url != null) ||
    (solicitud.value.estatus != "Concluido" && solicitud.value.monto_Saldo == 0)
  ) {
    let resp = await devengarDevengadoStore.actualizar_Estatus(
      solicitud.value.id,
      "Pendiente de conclusión"
    );
    if (resp.success) {
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    }
  } else {
    let resp = await devengarDevengadoStore.imprimir_Evidencia(
      solicitud.value.id
    );
    if (resp.success) {
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    }
  }
};

const imprimirComprobacion = async () => {
  GeneraComprobacionDD(solicitud.value, list_Facturas_By_Solicitud.value);
  if (
    (solicitud.value.estatus != "Concluido" &&
      solicitud.value.reintegro_Url != null) ||
    (solicitud.value.estatus != "Concluido" && solicitud.value.monto_Saldo == 0)
  ) {
    let resp = await devengarDevengadoStore.actualizar_Estatus(
      solicitud.value.id,
      "Pendiente de conclusión"
    );
    if (resp.success) {
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    }
  } else {
    // let resp = await devengarDevengadoStore.imprimir_Comprobacion(
    //   solicitud.value.id
    // );
    // if (resp.success) {
    //   await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    // }
  }
};

const verObservaciones = (observacion) => {
  $q.dialog({
    title: "Observaciones",
    message: `${observacion}`,
    ok: "Cerrar",
    persistent: true,
  });
};

const subirFacturas = async (id) => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  devengarDevengadoStore.actualizarModalFacturas(true);
  $q.loading.hide();
};

const enviarComprobacion = async () => {
  if (list_Facturas_By_Solicitud.value.length == 0) {
    $q.notify({
      position: "top-right",
      type: "warning",
      message:
        "Deberá subir minimo un comprobante para poder mandar la comprobación",
    });
  } else if (list_Evidencias.value.length == 0) {
    $q.notify({
      position: "top-right",
      type: "warning",
      message: "Deberá agregar minimo una evidencia",
    });
  } else {
    $q.dialog({
      title: "¿Está seguro de enviar la comprobación?",
      message:
        "Pasará a recursos financieros para su validación, ya no podrá agregar más facturas a esta comprobación",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "send",
        color: "secondary",
        label: "Sí! enviar",
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
      let resp = await devengarDevengadoStore.enviar_Comprobacion(
        solicitud.value.id
      );
      if (resp.success) {
        $q.loading.hide();
        actualizarModal(false);
        await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
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

const onSubmit = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  loading.value = true;
  if (
    perfil.value == "Super Administrador" ||
    perfil.value == "Administrador"
  ) {
    solicitud.value.empleado_Solicitante_Id = solicitante_Id.value.value;
    solicitud.value.puesto_Empleado_Solicitante_Id =
      solicitante_Id.value.puesto_Id;
  } else {
    let solicitanteFiltrado = list_Empleados_By_Area.value.find(
      (x) => x.label == encryptStorage.decrypt("empleado")
    );
    solicitud.value.empleado_Solicitante_Id = solicitanteFiltrado.value;
    solicitud.value.puesto_Empleado_Solicitante_Id =
      solicitanteFiltrado.puesto_Id;
  }
  solicitud.value.tipo_Solicitud_Gasto = 1;
  solicitud.value.area_Id = parseInt(area_Id.value.value);
  solicitud.value.responsable_Area_Id = responsable_area.value.id;
  solicitud.value.puesto_Responsable_Area_Id = responsable_area.value.puesto_Id;
  if (solicitud.value.motivo != null) {
    solicitud.value.motivo = solicitud.value.motivo.replace(/\s+/g, " ");
  }
  if (solicitud.value.observaciones != null) {
    solicitud.value.observaciones = solicitud.value.observaciones.replace(
      /\s+/g,
      " "
    );
  }
  let resp = null;
  if (is_Editar.value == false) {
    resp = await devengarDevengadoStore.create_Solicitud_Gasto(solicitud.value);
  } else {
    resp = await devengarDevengadoStore.update_Solicitud_DD(solicitud.value);
  }
  if (resp.success) {
    loading.value = false;
    $q.loading.hide();
    await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
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
    loading.value = false;
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
