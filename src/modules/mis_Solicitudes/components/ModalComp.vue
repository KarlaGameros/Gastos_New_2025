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
              is_Editar
                ? "EDITAR SOLICITUD DE COMISIÓN"
                : visualizar
                ? "VER SOLICITUD DE COMISIÓN"
                : "CREAR SOLICITUD DE COMISIÓN"
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
      <q-card-section>
        <q-form class="row q-col-gutter-md" @submit="onSubmit">
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
            class="col-12"
            v-if="
              (perfil == 'Super Administrador' || perfil == 'Administrador') &&
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
          <div class="col-12" v-else-if="perfil == 'Personal' && !visualizar">
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
          <div class="col-12" v-else>
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
          <div v-if="!visualizar" class="col-12">
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
          <div v-else class="col-12">
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
          <div class="col-12">
            <q-input
              :readonly="visualizar"
              color="purple-ieen"
              v-model.trim="solicitud.actividad"
              label="Actividad a realizar"
              hint="Describa la actividad que realizará"
              type="textarea"
              lazy-rules
              class="text-bold"
              counter
              maxlength="800"
              :rules="[
                (val) => !!val || 'La actividad a realizar es requerida',
              ]"
            />
          </div>
          <div class="col-lg-3 col-md-3 col-xs-12">
            <q-input
              class="text-bold"
              :readonly="visualizar"
              color="purple-ieen"
              v-model="solicitud.fecha_Salida"
              label="Fecha de salida"
              hint="Ingrese fecha de salida"
              lazy-rules
              :rules="[
                (val) => !!val || 'La fecha y hora de salida son requeridas',
              ]"
            >
              <template v-slot:prepend v-if="!visualizar">
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :options="optionsSa"
                      color="purple-ieen"
                      v-model="solicitud.fecha_Salida"
                      mask="YYYY/MM/DD HH:mm"
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
              <template v-slot:append v-if="!visualizar">
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      color="purple-ieen"
                      v-model="solicitud.fecha_Salida"
                      mask="YYYY/MM/DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Listo"
                          color="purple-ieen"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-lg-3 col-md-3 col-xs-12">
            <q-input
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="solicitud.fecha_LLegada"
              label="Fecha de llegada"
              hint="Ingrese fecha de llegada"
              lazy-rules
              :rules="[
                (val) => !!val || 'La fecha y hora de llegada son requeridas',
              ]"
            >
              <template v-slot:prepend v-if="!visualizar">
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      :options="optionsFn"
                      color="purple-ieen"
                      v-model="solicitud.fecha_LLegada"
                      mask="YYYY/MM/DD HH:mm"
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
              <template v-slot:append v-if="!visualizar">
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      :options="optionsFnTime"
                      color="purple-ieen"
                      v-model="solicitud.fecha_LLegada"
                      mask="YYYY/MM/DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Listo"
                          color="purple-ieen"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-lg-3 col-md-3 col-xs-12">
            <q-input
              class="text-bold"
              color="purple-ieen"
              v-model="solicitud.no_Dias"
              type="number"
              label="No. días"
              hint="Ingrese el total de días"
              readonly
            />
          </div>
          <div class="col-lg-3 col-md-3 col-xs-12">
            <q-input
              class="text-bold"
              color="purple-ieen"
              v-model="solicitud.no_Noches"
              type="number"
              label="No. noches"
              hint="Ingrese el total de noches"
              readonly
            />
          </div>
          <div class="col-lg-3 col-md-3 col-xs-12">
            <q-select
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="medio_Transporte_Id"
              :options="list_Medios_Transporte"
              label="Medio de transporte"
              hint="Seleccione medio de transporte"
              lazy-rules
              :rules="[(val) => !!val || 'El medio de transporte es requerido']"
            >
              <template
                v-if="
                  medio_Transporte_Id != null &&
                  medio_Transporte_Id != 'Ninguno'
                "
                v-slot:prepend
              >
                <q-icon
                  :name="
                    medio_Transporte_Id == 'Terrestre'
                      ? 'directions_car'
                      : medio_Transporte_Id == 'Aéreo'
                      ? 'flight'
                      : 'directions_boat'
                  "
                />
              </template>
            </q-select>
          </div>
          <div
            class="col-lg-3 col-md-3 col-xs-12"
            v-if="medio_Transporte_Id == 'Aéreo'"
          >
            <q-select
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="medio_Transporte_Especifico_Id"
              :options="medio_Aereo"
              label="Tipo de medio de transporte aereo"
              hint="Seleccione tipo de medio de transporte aereo"
              lazy-rules
              :rules="[
                (val) =>
                  !!val || 'El tipo de medio de transporte aereo es requerido',
              ]"
            />
          </div>
          <div
            class="col-lg-3 col-md-3 col-xs-12"
            v-if="medio_Transporte_Id == 'Marítimo'"
          >
            <q-select
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="medio_Transporte_Especifico_Id"
              :options="medio_Maritimo"
              label="Tipo de medio de transporte maritimo"
              hint="Seleccione tipo de medio de transporte maritimo"
              lazy-rules
              :rules="[
                (val) =>
                  !!val ||
                  'El tipo de medio de transporte maritimo es requerido',
              ]"
            />
          </div>
          <div
            class="col-lg-3 col-md-3 col-xs-12"
            v-if="medio_Transporte_Id == 'Terrestre'"
          >
            <q-select
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="medio_Transporte_Especifico_Id"
              :options="medio_Terrestre"
              label="Tipo de medio de transporte terrestre"
              hint="Seleccione tipo de medio de transporte terrestre"
              lazy-rules
              :rules="[
                (val) =>
                  !!val ||
                  'El tipo de medio de transporte terrestre es requerido',
              ]"
            />
          </div>
          <div
            class="col-lg-3 col-md-3 col-xs-12"
            v-if="medio_Transporte_Especifico_Id == 'Vehículo oficial'"
          >
            <q-select
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="solicitud.rol"
              :options="rol"
              label="Rol"
              hint="Seleccione rol"
              lazy-rules
              :rules="[(val) => !!val || 'El rol es requerido']"
            />
          </div>
          <div
            class="col-lg-3 col-md-3 col-xs-12"
            v-if="
              medio_Transporte_Especifico_Id == 'Vehículo oficial' &&
              solicitud.rol == 'Chofer'
            "
          >
            <q-select
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model="vehiculo_Id"
              :options="vehiculos_Opt"
              label="Vehículo oficial"
              hint="Seleccione vehículo"
              lazy-rules
              :rules="[(val) => !!val || 'El vehículo es requerido']"
            />
          </div>
          <div class="col-12" v-if="vehiculo_Id == null"></div>
          <br />
          <div class="col-lg-4 col-md-4 col-xs-12 text-center">
            <q-toggle
              v-if="!is_Editar && !visualizar"
              :disable="!check_habilitado || visualizar"
              v-model="pernoctado"
              checked-icon="other_houses"
              color="purple-ieen"
              label="¿Pernoctado?"
              unchecked-icon="clear"
              size="lg"
              left-label
              class="text-bold text-suntitle1"
            />
            <q-toggle
              v-else
              :disable="!check_habilitado || visualizar"
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
              :disable="visualizar || solicitud.folio != null"
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
              :disable="visualizar"
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
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model.trim="solicitud.observaciones"
              label="Observaciones"
              hint="Ingrese observaciones que necesita que administración verifique"
              type="textarea"
            />
          </div>
          <div class="col-12" v-if="solicitud.saldo_Cero == false">
            <q-input
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model.trim="solicitud.gastos_Viaje"
              hint="Gastos de viaje"
              type="textarea"
              placeholder="Los viáticos y gastos de hospedaje serán asignados conforme a tabulador vigente. En caso de requerir gastos de viaje (transporte terrestre, transporte aéreo, traslados, gasolina, peajes, entre otros) favor de enlistar el tipo de gasto de viaje y el monto solicitado en este espacio."
            />
          </div>
          <div class="col-12">
            <q-input
              class="text-bold"
              color="purple-ieen"
              :readonly="visualizar"
              v-model.trim="solicitud.itinerario"
              label="Itinerario"
              hint="En espacio para indicar el itinerario a seguir durante la comisión"
              type="textarea"
            />
          </div>
          <q-card-section class="col-12">
            <br />
            <div class="text-h5 text-purple-ieen text-bold text-center">
              DESTINOS
            </div>
            <RegistroDestino />
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
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { EncryptStorage } from "storage-encryption";
import { useDestinoStore } from "src/stores/destino-store";
import { useVehiculoStore } from "src/stores/vehiculo-store";
import { useConfiguracionStore } from "src/stores/configuracion-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { onBeforeMount, ref, watch, watchEffect } from "vue";
import RegistroDestino from "./RegistroDestino.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const destinosStore = useDestinoStore();
const vehiculosStore = useVehiculoStore();
const configuracionStore = useConfiguracionStore();
const misSolicitudesStore = useMisSolicitudesStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { list_Destinos } = storeToRefs(destinosStore);
const { vehiculos_Opt } = storeToRefs(vehiculosStore);
const { modal, solicitud, is_Editar, visualizar, tab } =
  storeToRefs(misSolicitudesStore);
const { list_Areas, list_Empleados_By_Area, responsable_area, empleado } =
  storeToRefs(configuracionStore);
const area_Id = ref(null);
const loading = ref(false);
const vehiculo_Id = ref(null);
const pernoctado = ref(false);
const solicitante_Id = ref(null);
const check_habilitado = ref(false);
const medio_Transporte_Id = ref(null);
const medio_Transporte_Especifico_Id = ref(null);
const perfil = ref(encryptStorage.decrypt("perfil"));
const personal_Captura = ref(
  `${encryptStorage.decrypt("empleado")} - ${encryptStorage.decrypt("puesto")}`
);
const medio_Terrestre = ref([
  "Vehículo oficial",
  "Vehículo personal",
  "Servicio transporte",
]);
const list_Medios_Transporte = ref([
  "Ninguno",
  "Terrestre",
  "Aéreo",
  "Marítimo",
]);
const rol = ref(["Chofer", "Pasajero(a)"]);
const medio_Aereo = ref(["Avion", "Avioneta"]);
const medio_Maritimo = ref(["Barco", "Lancha"]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(modal, (val) => {
  if (val == true && solicitud.value.id != null) {
    cargarArea(solicitud.value);
    cargarSolicitante(solicitud.value);
    cargarMedioTrasporte(solicitud.value);
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

watch(medio_Transporte_Especifico_Id, (val) => {
  if (val == "Vehículo oficial") {
    if (!is_Editar.value && !visualizar.value) {
      alerta_Vehiculo();
    }
  }
});

watch(solicitante_Id, (val) => {
  if (val != null) {
    loadResponsableEmpleado(val.value);
  }
});

watch(medio_Transporte_Id, (val) => {
  if (val != null) {
    //solicitud.value.rol = null;
    //vehiculo_Id.value = null;
    //medio_Transporte_Especifico_Id.value = null;
  }
});

watchEffect(() => {
  if (
    solicitud.value.fecha_Salida != null &&
    solicitud.value.fecha_LLegada != null
  ) {
    const fecha1 = new Date(solicitud.value.fecha_Salida);
    const fecha_Inicio = new Date(fecha1.toDateString());
    const fecha2 = new Date(solicitud.value.fecha_LLegada);
    const fecha_Fin = new Date(fecha2.toDateString());
    let dayCount = 0;
    while (fecha_Fin > fecha_Inicio) {
      dayCount++;
      fecha_Inicio.setDate(fecha_Inicio.getDate() + 1);
    }
    solicitud.value.no_Noches = dayCount;
    solicitud.value.no_Dias = dayCount + 1;
    if (solicitud.value.no_Noches > 0) {
      check_habilitado.value = true;
      pernoctado.value = true;
    } else {
      check_habilitado.value = false;
      pernoctado.value = false;
    }
  }

  if (
    solicitud.value.fecha_Salida != null &&
    solicitud.value.fecha_LLegada != null &&
    medio_Transporte_Especifico_Id.value == "Vehículo oficial"
  ) {
    load_Vehiculos();
  }
});

//-----------------------------------------------------------

const optionsFnTime = (time) => {
  if (pernoctado.value == false) {
    if (solicitud.value.fecha_Salida == null) {
      return time;
    } else if (solicitud.value.fecha_Salida != null) {
      let fecha = new Date(solicitud.value.fecha_Salida);
      let hora = fecha.getHours();
      return time > hora;
    } else {
      return true;
    }
  } else {
    return true;
  }
};

const optionsSa = (date) => {
  const dateActual = new Date();
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, "0");
  const day = String(dateActual.getDate()).padStart(2, "0");
  const dateA = `${year}/${month}/${day}`;
  solicitud.value.fecha_LLegada = null;
  return date >= dateA;
};

const optionsFn = (date) => {
  if (solicitud.value.fecha_Salida == null) {
    return date;
  } else {
    let fecha = solicitud.value.fecha_Salida.split(" ")[0];
    return date >= fecha;
  }
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

const cargarData = async () => {
  loadingShow();
  await configuracionStore.load_Empleado_ByUsusario();
  cargarArea();
  $q.loading.hide();
};

const alerta_Vehiculo = () => {
  $q.dialog({
    title: "<strong>Atención!<strong>",
    html: true,
    message:
      "<strong>En caso de requerir vehículo oficial, favor de verificar disponibilidad en la ext. 117.</strong>",
    ok: {
      icon: "close",
      color: "red",
      label: "Cerrar",
    },
  });
};

const load_Vehiculos = async () => {
  loadingShow();
  await vehiculosStore.loadVehiculosDisponibles({
    fecha_Inicio: solicitud.value.fecha_Salida,
    fecha_Fin: solicitud.value.fecha_LLegada,
  });
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
  loadingShow();
  await configuracionStore.load_Empleados_By_Area(val.area_Id);
  if (val != undefined) {
    let solicitanteFiltrado = list_Empleados_By_Area.value.find(
      (x) => x.value == val.empleado_Solicitante_Id
    );
    solicitante_Id.value = solicitanteFiltrado;
  }
  $q.loading.hide();
};

const cargarMedioTrasporte = (val) => {
  if (val != undefined) {
    let medioFiltrado = list_Medios_Transporte.value.find(
      (x) => x == val.medio_Transporte
    );
    medio_Transporte_Id.value = medioFiltrado;
    if (val.medio_Transporte != "Ninguno") {
      let list =
        val.medio_Transporte == "Terrestre"
          ? medio_Terrestre.value
          : val.medio_Transporte == "Marítimo"
          ? medio_Maritimo.value
          : medio_Aereo.value;
      let tipoMedioFiltrado = list.find(
        (x) => x == val.medio_Transporte_Especifico
      );
      medio_Transporte_Especifico_Id.value = tipoMedioFiltrado;
      if (
        val.rol == "Chofer" &&
        val.medio_Transporte_Especifico == "Vehículo oficial"
      ) {
        vehiculo_Id.value = { value: val.vehiculo_Id, label: val.vehiculo };
      }
    }
  }
};

const actualizarModal = (valor) => {
  area_Id.value = null;
  vehiculo_Id.value = null;
  list_Destinos.value = [];
  tab.value = "comisiones";
  solicitante_Id.value = null;
  check_habilitado.value = false;
  medio_Transporte_Id.value = null;
  medio_Transporte_Especifico_Id.value = null;
  responsable_area.value.nombre_Completo = null;
  misSolicitudesStore.initSolicitud();
  misSolicitudesStore.actualizarModal(valor);
  misSolicitudesStore.actualizarEditar(false);
  misSolicitudesStore.actualizarVisualizar(false);
};

const onSubmit = async () => {
  const fecha1 = new Date(solicitud.value.fecha_Salida);
  const fecha2 = new Date(solicitud.value.fecha_LLegada);
  if (fecha2 < fecha1) {
    $q.notify({
      type: "warning",
      message: "Le fecha de llegada no puede ser menor a la fecha de salida",
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
    loading.value = true;
    if (
      perfil.value == "Super Administrador" ||
      perfil.value == "Administrador"
    ) {
      solicitud.value.empleado_Solicitante_Id = solicitante_Id.value.value;
      solicitud.value.puesto_Empleado_Solicitante_Id =
        solicitante_Id.value.puesto_Id;
    }
    solicitud.value.pernoctado = pernoctado.value;
    solicitud.value.area_Id = area_Id.value.value;
    solicitud.value.responsable_Area_Id = responsable_area.value.id;
    solicitud.value.puesto_Responsable_Area_Id =
      responsable_area.value.puesto_Id;
    solicitud.value.medio_Transporte = medio_Transporte_Id.value;
    solicitud.value.medio_Transporte_Especifico =
      medio_Transporte_Especifico_Id.value;
    if (
      medio_Transporte_Especifico_Id.value == "Vehículo oficial" &&
      solicitud.value.rol == "Chofer"
    ) {
      solicitud.value.vehiculo_Id = vehiculo_Id.value.value;
    }
    solicitud.value.destinos = list_Destinos.value;
    if (solicitud.value.actividad != null) {
      solicitud.value.actividad = solicitud.value.actividad.replace(
        /\s+/g,
        " "
      );
    }
    if (solicitud.value.observaciones != null) {
      solicitud.value.observaciones = solicitud.value.observaciones.replace(
        /\s+/g,
        " "
      );
    }
    if (solicitud.value.itinerario != null) {
      solicitud.value.itinerario = solicitud.value.itinerario.replace(
        /\s+/g,
        " "
      );
    }
    let resp = null;
    if (is_Editar.value == false) {
      if (list_Destinos.value.length == 0) {
        $q.notify({
          type: "warning",
          message: "No ha agregado ningun destino",
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
        loading.value = false;
        return;
      } else {
        loadingShow();
        resp = await misSolicitudesStore.create_Solicitud(solicitud.value);
        if (resp.success) {
          loading.value = false;
          await misSolicitudesStore.load_Mis_Solicitudes();
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
        loading.value = false;
      }
    } else {
      if (list_Destinos.value.length == 0) {
        $q.notify({
          type: "warning",
          message: "No ha agregado ningun destino",
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
        loading.value = false;
        return;
      } else {
        loadingShow();
        await misSolicitudesStore.load_Estatus_Solicitud(solicitud.value.id);
        if (solicitud.value.aprobado_Responsable_Area) {
          $q.loading.hide();
          loading.value = false;
          actualizarModal(false);
          await misSolicitudesStore.load_Mis_Solicitudes();
          $q.notify({
            type: "warning",
            message:
              "La solicitud ya fue aprobada, por lo que no podrá guardar nuevos cambios",
          });
        } else {
          resp = await misSolicitudesStore.update_Solicitud(
            solicitud.value,
            encryptStorage.decrypt("sistema")
          );
          if (resp.success) {
            loading.value = false;
            $q.loading.hide();
            await misSolicitudesStore.load_Mis_Solicitudes();
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
          loading.value = false;
        }
      }
    }
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
.flotanteFooter {
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: white;
}
</style>
