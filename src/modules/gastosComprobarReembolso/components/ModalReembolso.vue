<template>
  <q-dialog
    v-model="modal_Devengado"
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
                ? "EDITAR SOLICITUD DE REEMBOLSO"
                : visualizar
                ? "VER SOLICITUD DE REEMBOLSO"
                : "CREAR SOLICITUD DE REEMBOLSO"
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
              v-model="tabDevengado"
              align="justify"
              class="text-grey flotante-tab"
              active-color="purple-ieen"
              indicator-color="purple-ieen"
              inline-label
            >
              <q-tab icon="menu" name="general" label="Datos generales" />
              <q-tab
                v-if="solicitud.id != null"
                icon="menu"
                name="evidencias"
                label="Evidencias"
              />
              <q-tab
                v-if="solicitud.id != null"
                icon="edit_note"
                name="comprobacion"
                label="Comprobación"
              />
            </q-tabs>
            <q-tab-panels v-model="tabDevengado" animated>
              <q-tab-panel name="general" class="row q-col-gutter-xs">
                <div class="col-12">
                  <q-select
                    :readonly="
                      is_Editar ||
                      visualizar ||
                      perfil != 'Super Administrador' ||
                      !solicitud.borrador
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
                  class="col-lg-6 col-md-6 col-sm-6 col-sm-12"
                  v-if="
                    (perfil == 'Super Administrador' ||
                      perfil == 'Administrador') &&
                    !visualizar
                  "
                >
                  <q-select
                    :readonly="is_Editar || visualizar || !solicitud.borrador"
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
                  class="col-lg-6 col-md-6 col-sm-6 col-sm-12"
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
                <div class="col-lg-6 col-md-6 col-sm-12" v-else>
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
                <div v-if="!visualizar" class="col-lg-6 col-md-6 col-sm-12">
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
                <div v-else class="col-lg-6 col-md-6 col-sm-12">
                  <q-input
                    v-model="solicitud.responsable_Area"
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
                    tipo_Evento == 'Comisión'
                      ? 'col-lg-4 col-md-4 col-sm-4 col-xs-12'
                      : 'col-lg-6 col-md-6 col-sm-6 col-xs-12'
                  "
                >
                  <q-select
                    :readonly="!solicitud.borrador"
                    color="purple-ieen"
                    v-model="tipo_Evento"
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
                  v-if="tipo_Evento == 'Comisión'"
                  :class="
                    tipo_Evento == 'Comisión'
                      ? 'col-lg-4 col-md-4 col-sm-4 col-xs-12'
                      : 'col-lg-6 col-md-6 col-sm-6 col-xs-12'
                  "
                >
                  <q-select
                    color="purple-ieen"
                    v-model="comision_Id"
                    :options="optionsComisiones"
                    label="Comisiones"
                    emit-value
                    map-options
                    lazy-rules
                    :rules="[(val) => !!val || 'La comisión es requerida']"
                    use-input
                    input-debounce="0"
                    @filter="filterComision"
                  >
                    <template v-slot:option="{ itemProps, opt }">
                      <q-item clickable>
                        <q-item-section v-bind="itemProps">
                          <q-item-label>{{ opt.label }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn
                            icon="visibility"
                            color="purple-ieen"
                            flat
                            round
                            @click="verComision(opt.value)"
                          />
                        </q-item-section>
                      </q-item>
                    </template>
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          No hay resultados
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div
                  :class="
                    tipo_Evento == 'Comisión'
                      ? 'col-lg-4 col-md-4 col-sm-4 col-xs-12'
                      : 'col-lg-6 col-md-6 col-sm-6 col-xs-12'
                  "
                >
                  <q-input
                    v-model="monto_Calculado"
                    label="Monto calculado"
                    hint="Monto calculado"
                    color="purple-ieen"
                    class="text-bold"
                    readonly
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
                    :readonly="visualizar || !solicitud.borrador"
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
                      <q-icon name="edit_note" /> </template
                  ></q-input>
                </div>
                <div class="col-12">
                  <q-input
                    class="text-bold"
                    color="purple-ieen"
                    :readonly="visualizar || !solicitud.borrador"
                    v-model="solicitud.observaciones"
                    label="Observaciones"
                    hint="Ingrese observaciones que necesita que administración verifique"
                    type="textarea"
                  >
                    <template v-slot:prepend>
                      <q-icon name="edit_note" /> </template
                  ></q-input>
                </div>
                <div
                  v-if="gasto_Representacion || solicitud.gastos_Representacion"
                  class="col-6 text-center"
                >
                  <q-toggle
                    :disable="visualizar || !solicitud.borrador"
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
                <div v-if="solicitud.folio == null" class="col-6 text-center">
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
                        solicitud.pagado
                      "
                      color="purple-ieen"
                      label="Imprimir evidencias"
                      @click="imprimir_Evidencias"
                      icon-right="print"
                    />
                    <q-btn
                      v-if="
                        !solicitud.aprobado_Administracion &&
                        !visualizar &&
                        solicitud.borrador
                      "
                      color="purple-ieen"
                      label="Nuevo"
                      @click="actualizar_Modal_Evidencia(true)"
                      icon-right="add_circle_outline"
                    />
                  </div>
                </div>
                <TablaEvidenciasComp :tipo="'reembolso'" />
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
                        !solicitud.aprobado_Administracion &&
                        !visualizar &&
                        solicitud.borrador
                      "
                      color="purple-ieen"
                      label="Agregar factura"
                      @click="subirFacturas(solicitud.id)"
                      icon-right="upload_file"
                    />
                    <q-btn
                      v-if="
                        list_Facturas_By_Solicitud.length > 0 &&
                        list_Facturas_By_Solicitud.some(
                          (element) => element.estatus === 'Pendiente'
                        ) == false &&
                        solicitud.aprobado_Administracion &&
                        solicitud.pagado
                      "
                      color="purple-ieen"
                      label="Imprimir comprobación"
                      @click="imprimirComprobacion"
                      icon-right="print"
                    />
                  </div>
                </div>
                <div class="col-12 q-pt-md">
                  <q-card class="col-12 q-mb-xs text-center">
                    <q-card-section>
                      <div class="text-subtitle1 text-bold text-gray-ieen-1">
                        IMPORTE SOLICITADO: ${{ monto_Calculado }}
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
                                !solicitud.aprobado_Administracion &&
                                props.row.estatus == 'Pendiente' &&
                                !visualizar
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
                <div class="col-12">
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
            <div class="justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  color="red"
                  label="Cerrar"
                  @click="actualizarModal(false)"
                  icon="close"
                />
                <q-btn
                  v-if="!visualizar && solicitud.estatus != 'Pendiente'"
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
  <ModalFacturas />
  <ModalEvidencias />
  <ModalVerComision />
</template>
<script setup>
import { storeToRefs } from "pinia";
import { EncryptStorage } from "storage-encryption";
import { useFacturasStore } from "src/stores/facturas-store";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onBeforeMount, ref, watch } from "vue";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import Swal from "sweetalert2";
import ModalFacturas from "./ModalFacturas.vue";
import ModalEvidencias from "./ModalEvidencias.vue";
import ModalVerComision from "./ModalVerComision.vue";
import GeneraEvidencias from "src/helpers/GeneraEvidencias";
import TablaEvidenciasComp from "./TablaEvidenciasComp.vue";
import GeneraComprobacionDD from "src/helpers/GeneraComprobacionDD";

//-----------------------------------------------------------

const $q = useQuasar();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const configuracionStore = useConfiguracionStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturaStore = useFacturasStore();
const evidenciasStore = useEvidenciaStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { tab } = storeToRefs(misSolicitudesStore);
const { list_Evidencias } = storeToRefs(evidenciasStore);
const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
const {
  modal_Devengado,
  visualizar,
  solicitud,
  is_Editar,
  comision_Id,
  list_Comisiones_By_Empleado,
} = storeToRefs(devengarDevengadoStore);
const { list_Areas, list_Empleados_By_Area, responsable_area, empleado } =
  storeToRefs(configuracionStore);
const area_Id = ref(null);
const loading = ref(false);
const monto_Aprobado = ref(0);
const tipo_Evento = ref(null);
const monto_Calculado = ref(0);
const solicitante_Id = ref(null);
const monto_No_Aprobado = ref(0);
const tabDevengado = ref("general");
const gasto_Representacion = ref(false);
const perfil = ref(encryptStorage.decrypt("perfil"));
const optionsComisiones = ref(list_Comisiones_By_Empleado.value);
const tipos_Solicitudes = ref(["Comisión", "Ordinaria", "Urgente", "Otro"]);
const personal_Captura = ref(
  `${encryptStorage.decrypt("empleado")} - ${encryptStorage.decrypt("puesto")}`
);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(tipo_Evento, (val) => {
  if (val != null) {
    comision_Id.value = null;
  }
});

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

watch(modal_Devengado, (val) => {
  if (val == true && solicitud.value.id != null && !visualizar.value) {
    cargarArea(solicitud.value);
    cargarSolicitante(solicitud.value);
    tipo_Evento.value = solicitud.value.tipo_Evento;
    if (solicitud.value.solicitud_Gasto_Comprobar_Id != null) {
      cargarComision(solicitud.value);
    }
  }
  if (
    !visualizar.value &&
    (perfil.value == "Personal" || perfil.value == "Administrador")
  ) {
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
  await configuracionStore.load_Empleado_ByUsusario();
  cargarArea();
  let puesto = encryptStorage.decrypt("puesto").toUpperCase();
  gasto_Representacion.value = puesto.includes("PRESIDENTA", "PRESIDENTE");
  if (solicitud.value.id == null) {
    solicitud.value.borrador = true;
  }
  $q.loading.hide();
};

const loadEmpleadosByArea = async (id) => {
  loadingShow();
  await configuracionStore.load_Empleados_By_Area(id);
  $q.loading.hide();
};

const loadResponsableEmpleado = async (empleadoId) => {
  loadingShow();
  await configuracionStore.load_Responsable_Empleado(empleadoId);
  await devengarDevengadoStore.load_List_By_Empleado(empleadoId);
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
};

const cargarComision = async (val) => {
  await devengarDevengadoStore.load_List_By_Empleado(
    val.empleado_Solicitante_Id
  );
  if (comision_Id.value == null) {
    let comisionFiltrado = list_Comisiones_By_Empleado.value.find(
      (x) => x.value == val.solicitud_Gasto_Comprobar_Id
    );
    comision_Id.value = comisionFiltrado;
  }
};

const verComision = async (id) => {
  loadingShow();
  await misSolicitudesStore.load_Solicitud(id);
  devengarDevengadoStore.actualizarModalVerComision(true);
  $q.loading.hide();
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
  monto_Calculado.value = 0;
  tabDevengado.value = "general";
  solicitante_Id.value = null;
  devengarDevengadoStore.actualizarEditar(valor);
  devengarDevengadoStore.initSolicitudDD();
  devengarDevengadoStore.actualizarModalDevengado(valor);
  devengarDevengadoStore.actualizarVisualizar(valor);
  evidenciasStore.initEvidenciaDD();
  configuracionStore.initResponsableArea();
  list_Facturas_By_Solicitud.value = [];
  solicitud.value.borrador = true;
  tab.value = "reembolso";
  monto_No_Aprobado.value = 0;
  monto_Aprobado.value = 0;
  comision_Id.value = null;
  tipo_Evento.value = null;
  area_Id.value = null;
};

const filterComision = (val, update) => {
  if (val === "") {
    update(() => {
      optionsComisiones.value = list_Comisiones_By_Empleado.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    optionsComisiones.value = list_Comisiones_By_Empleado.value.filter(
      (x) => x.folio.toLowerCase().indexOf(needle) > -1
    );
  });
};

const actualizar_Modal_Evidencia = () => {
  evidenciasStore.actualizarModalEvidencia(true);
};

const imprimir_Evidencias = async () => {
  GeneraEvidencias(solicitud.value, list_Evidencias.value);
  if (
    solicitud.value.estatus != "Concluido" &&
    solicitud.value.estatus != "Pendiente de conclusión"
  ) {
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
  if (solicitud.value.estatus != "Concluido") {
    // let resp = await devengarDevengadoStore.imprimir_Comprobacion(
    //   solicitud.value.id
    // );
    let resp = await devengarDevengadoStore.actualizar_Estatus(
      solicitud.value.id,
      "Pendiente de conclusión"
    );
    if (resp.success) {
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    }
  }
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
  await devengarDevengadoStore.load_Solicitud_DD(id);
  devengarDevengadoStore.actualizarModalFacturas(true);
  $q.loading.hide();
};

const obtenerFecha = () => {
  const dateActual = new Date();
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, "0");
  const day = String(dateActual.getDate()).padStart(2, "0");
  const dateA = `${year}-${month}-${day}`;
  return dateA;
};

const onSubmit = async () => {
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
        solicitud.value.monto_Solicitado = monto_Calculado.value;
        let resp = await devengarDevengadoStore.update_Solicitud_DD(
          solicitud.value
        );
        if (resp.success) {
          loading.value = false;
          $q.loading.hide();
          await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
          $q.notify({
            position: "top-right",
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
          devengarDevengadoStore.actualizarModalDevengado(false);
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
      })
      .onCancel(async () => {
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
        solicitud.value.fecha_Solicitud = obtenerFecha();
        solicitud.value.tipo_Solicitud_Gasto = 0;
        solicitud.value.area_Id = area_Id.value.value;
        solicitud.value.responsable_Area_Id = responsable_area.value.id;
        solicitud.value.puesto_Responsable_Area_Id =
          responsable_area.value.puesto_Id;
        solicitud.value.monto_Solicitado = monto_Calculado.value;
        solicitud.value.tipo_Evento = tipo_Evento.value;
        if (tipo_Evento.value == "Comisión") {
          solicitud.value.solicitud_Gasto_Comprobar_Id = comision_Id.value;
        }
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
        if (!is_Editar.value) {
          solicitud.value.borrador = true;
          resp = await devengarDevengadoStore.create_Solicitud_Gasto(
            solicitud.value
          );
          if (resp.success) {
            loading.value = false;
            $q.loading.hide();
            await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
            $q.notify({
              position: "top-right",
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
            devengarDevengadoStore.actualizarModalDevengado(false);
            if (!is_Editar.value) {
              Swal.fire({
                title: "Atención",
                text: "¿Desea agregar facturas y evidencias en este momento?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si, Agregar!",
                cancelButtonText: "No, Salir!",
                reverseButtons: true,
                confirmButtonColor: "#26a69a",
                cancelButtonColor: "#f44336",
              }).then(async (result) => {
                if (result.isConfirmed) {
                  list_Evidencias.value = [];
                  list_Facturas_By_Solicitud.value = [];
                  devengarDevengadoStore.actualizarEditar(true);
                  devengarDevengadoStore.actualizarModalDevengado(true);
                  tabDevengado.value = "comprobacion";
                  await devengarDevengadoStore.load_Solicitud_DD(resp.id);
                } else {
                  actualizarModal(false);
                }
              });
            }
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
        } else {
          solicitud.value.borrador = true;
          resp = await devengarDevengadoStore.update_Solicitud_DD(
            solicitud.value
          );
          if (resp.success) {
            loading.value = false;
            $q.loading.hide();
            await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
            $q.notify({
              position: "top-right",
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
            devengarDevengadoStore.actualizarModalDevengado(false);
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
        }
      });
  } else {
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
    solicitud.value.fecha_Solicitud = obtenerFecha();
    solicitud.value.tipo_Solicitud_Gasto = 0;
    solicitud.value.area_Id = area_Id.value.value;
    solicitud.value.responsable_Area_Id = responsable_area.value.id;
    solicitud.value.puesto_Responsable_Area_Id =
      responsable_area.value.puesto_Id;
    solicitud.value.monto_Solicitado = monto_Calculado.value;
    solicitud.value.tipo_Evento = tipo_Evento.value;
    if (tipo_Evento.value == "Comisión") {
      solicitud.value.solicitud_Gasto_Comprobar_Id = comision_Id.value;
    }
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
    if (!is_Editar.value) {
      solicitud.value.borrador = true;
      resp = await devengarDevengadoStore.create_Solicitud_Gasto(
        solicitud.value
      );
      if (resp.success) {
        loading.value = false;
        $q.loading.hide();
        await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
        $q.notify({
          position: "top-right",
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
        devengarDevengadoStore.actualizarModalDevengado(false);
        if (!is_Editar.value) {
          Swal.fire({
            title: "Atención",
            text: "¿Desea agregar facturas y evidencias en este momento?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si, Agregar!",
            cancelButtonText: "No, Salir!",
            reverseButtons: true,
            confirmButtonColor: "#26a69a",
            cancelButtonColor: "#f44336",
          }).then(async (result) => {
            if (result.isConfirmed) {
              list_Evidencias.value = [];
              list_Facturas_By_Solicitud.value = [];
              devengarDevengadoStore.actualizarEditar(true);
              devengarDevengadoStore.actualizarModalDevengado(true);
              tabDevengado.value = "comprobacion";
              await devengarDevengadoStore.load_Solicitud_DD(resp.id);
            } else {
              actualizarModal(false);
            }
          });
        }
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
    } else {
      solicitud.value.borrador = true;
      resp = await devengarDevengadoStore.update_Solicitud_DD(solicitud.value);
      if (resp.success) {
        loading.value = false;
        $q.loading.hide();
        await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
        $q.notify({
          position: "top-right",
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
        devengarDevengadoStore.actualizarModalDevengado(false);
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
    }
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
</style>
