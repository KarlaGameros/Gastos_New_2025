<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Solicitudes del área</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              :label="
                tabGeneral == 'comisiones'
                  ? 'Comisiones'
                  : tabGeneral == 'reembolso'
                  ? 'Reembolso'
                  : 'Gastos a comprobar'
              "
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row q-pa-lg">
      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 text-center">
        <q-btn-toggle
          v-model="buscar_Por"
          style="border: 1px solid #673e84"
          no-caps
          unelevated
          toggle-color="purple-ieen"
          color="white"
          text-color="purple-ieen"
          :options="[
            { label: 'Año', value: 'año' },
            { label: 'Rango de fecha', value: 'rango' },
          ]"
        />
      </div>
      <div
        :class="
          buscar_Por == 'año'
            ? 'col-lg-2 col-md-2 col-sm-2 col-xs-12 text-center'
            : 'col-lg-3 col-md-3 col-sm-3 col-xs-12 text-center'
        "
      >
        <q-select
          dense
          color="purple-ieen"
          v-if="buscar_Por == 'año'"
          :options="years"
          v-model.number="year"
        ></q-select>
        <q-input
          v-else
          dense
          color="purple-ieen"
          v-model="textoFecha"
          label="Fecha de consulta"
        >
          <template v-slot:append>
            <q-btn icon="event" color="purple-ieen" flat round>
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date
                  :options="options"
                  v-model="rango_Fecha"
                  :locale="myLocale"
                  mask="YYYY-MM-DD"
                  color="purple-ieen"
                  range
                >
                  <div class="row items-center justify-end q-gutter-sm">
                    <q-btn
                      label="Aceptar"
                      color="purple-ieen"
                      flat
                      v-close-popup
                    />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-btn>
          </template>
        </q-input>
      </div>
      <div
        :class="
          $q.screen.xs
            ? 'col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pa-xs text-center'
            : 'col-lg-3 col-md-3 col-sm-3 col-xs-12 q-pa-xs'
        "
      >
        <q-btn
          type="button"
          color="purple-ieen"
          icon-right="search"
          label="Buscar"
          @click="buscar"
        />
      </div>
    </div>

    <div class="row q-pr-lg q-pl-lg q-pt-lg">
      <div class="col">
        <q-card>
          <q-tabs
            v-model="tabGeneral"
            active-color="purple-ieen bg-grey-4"
            indicator-color="purple-ieen"
            align="justify"
            class="bg-grey-2 text-grey shadow-2 text-bold"
          >
            <q-tab name="comisiones">
              <div>
                <q-icon size="sm" name="currency_exchange" />
                Comisiones
                <q-badge color="purple" align="middle">
                  {{ list_Solicitudes_ByArea.length }}
                </q-badge>
              </div>
            </q-tab>
            <q-tab name="gastoComprobar">
              <div>
                <q-icon size="sm" name="paid" />
                Gasto a comprobar
                <q-badge color="purple" align="middle">
                  {{
                    list_Solicitudes_ByArea_GC_Reembolso.filter(
                      (x) => x.tipo_Solicitud_Gasto == 1
                    ).length
                  }}
                </q-badge>
              </div>
            </q-tab>
            <q-tab name="reembolso">
              <div>
                <q-icon size="sm" name="price_check" />
                Reembolso
                <q-badge color="purple" align="middle">
                  {{
                    list_Solicitudes_ByArea_GC_Reembolso.filter(
                      (x) => x.tipo_Solicitud_Gasto == 0
                    ).length
                  }}
                </q-badge>
              </div>
            </q-tab>
          </q-tabs>
          <q-tab-panels v-model="tabGeneral" animated>
            <q-tab-panel name="comisiones">
              <div v-if="gastos_Filtrado.length > 0" class="row q-mb-md">
                <q-card
                  class="my-card col-lg-6 col-md-6 col-sm-6 col-xs-12 bg-purple-1"
                  style="border-radius: 10px"
                >
                  <q-item-label
                    class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
                  >
                    {{ encryptStorage.decrypt("area") }}</q-item-label
                  >
                  <q-card-section horizontal>
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          Solicitudes:
                          {{
                            gastos_Filtrado[0].no_Solicitudes
                          }}</q-item-section
                        >
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto asignado: ${{
                            gastos_Filtrado[0].monto_Erogado
                          }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto ejercido: ${{
                            gastos_Filtrado[0].monto_Utilizado
                          }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto Reintegrado: ${{
                            gastos_Filtrado[0].monto_Reintegrado
                          }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Saldo ${{ gastos_Filtrado[0].monto_Saldo }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
                <q-card
                  class="my-card col-lg-6 col-md-6 col-sm-6 col-xs-12 bg-purple-1"
                  style="border-radius: 10px"
                >
                  <q-item-label
                    class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
                  >
                    Detalle monto ejercido
                  </q-item-label>
                  <q-card-section horizontal>
                    <q-list dense>
                      <q-item
                        v-for="gasto in gastos_Filtrado[0].gastos.slice(
                          0,
                          gastos_Filtrado[0].gastos.length / 2
                        )"
                        :key="gasto"
                      >
                        <q-item-section
                          >{{ gasto.concepto }}: ${{
                            gasto.importe
                          }}</q-item-section
                        >
                      </q-item>
                    </q-list>
                    <q-list dense>
                      <q-item
                        v-for="gasto in gastos_Filtrado[0].gastos.slice(
                          5,
                          gastos_Filtrado[0].gastos.length
                        )"
                        :key="gasto"
                      >
                        <q-item-section
                          >{{ gasto.concepto }}: ${{
                            gasto.importe
                          }}</q-item-section
                        >
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
              <div class="row">
                <div class="col">
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      active-color="purple-ieen"
                      indicator-color="purple-ieen"
                      align="justify"
                      class="text-grey shadow-2 text-bold"
                    >
                      <q-tab
                        icon="pending_actions"
                        name="pendientes"
                        label="Pendientes de aprobación"
                      />
                      <q-tab
                        icon="manage_search"
                        name="historial"
                        label="Historial"
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaComp
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="historial">
                        <TablaComp
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'historial'"
                        />
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="gastoComprobar">
              <div class="row q-mb-md">
                <q-card
                  class="my-card col-12 bg-purple-1"
                  style="border-radius: 10px"
                >
                  <q-item-label
                    class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
                  >
                    {{ encryptStorage.decrypt("area") }}
                  </q-item-label>
                  <q-card-section horizontal>
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          Solicitudes:
                          {{
                            list_Historial_GC_Reembolso_Filtro.filter(
                              (x) => x.tipo_Solicitud_Gasto === 1
                            ).length
                          }}</q-item-section
                        >
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto solicitado: ${{ montoSolicitadoGC }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto aprobado: ${{ montoAprobadoGC }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto ejercido: ${{ montoUtilizadoGC }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto Reintegrado: ${{ montoReintegroGC }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
              <div class="row">
                <div class="col">
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      active-color="purple-ieen"
                      indicator-color="purple-ieen"
                      align="justify"
                      class="text-grey shadow-2 text-bold"
                    >
                      <q-tab
                        icon="pending_actions"
                        name="pendientes"
                        label="Pendientes de aprobación"
                      />
                      <q-tab
                        icon="manage_search"
                        name="historial"
                        label="Historial"
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompGCReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                          :tab="tabGeneral"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="historial">
                        <TablaCompGCReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'historial'"
                          :tab="tabGeneral"
                        />
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="reembolso">
              <div class="row q-mb-md">
                <q-card
                  class="my-card col-12 bg-purple-1"
                  style="border-radius: 10px"
                >
                  <q-item-label
                    class="text-h6 q-pl-sm q-pt-sm purple-ieen text-bold text-purple-ieen"
                  >
                    {{ encryptStorage.decrypt("area") }}
                  </q-item-label>
                  <q-card-section horizontal>
                    <q-list dense>
                      <q-item>
                        <q-item-section>
                          Solicitudes:
                          {{
                            list_Historial_GC_Reembolso_Filtro.filter(
                              (x) => x.tipo_Solicitud_Gasto === 0
                            ).length
                          }}</q-item-section
                        >
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto ejercido: ${{ montoUtilizadoREEM }}
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section>
                          Monto aprobado: ${{ montoAprobadoREEM }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
              <div class="row">
                <div class="col">
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      active-color="purple-ieen"
                      indicator-color="purple-ieen"
                      align="justify"
                      class="text-grey shadow-2 text-bold"
                    >
                      <q-tab
                        icon="pending_actions"
                        name="pendientes"
                        label="Pendientes de aprobación"
                      />
                      <q-tab
                        icon="manage_search"
                        name="historial"
                        label="Historial"
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompGCReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                          :tab="tabGeneral"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="historial">
                        <TablaCompGCReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'historial'"
                          :tab="tabGeneral"
                        />
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <ModalComp />
    <ModalCompGCReembolso />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth-store";
import { EncryptStorage } from "storage-encryption";
import { useDashboardStore } from "src/stores/dashboard-store";
import { useSolicitudesAreaStore } from "src/stores/solicitudes-area-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesAreaGCReembolsoStore } from "src/stores/solicitudes-area-gc-reembolso-store";
import Swal from "sweetalert2";
//COMISIONES
import ModalComp from "../../mis_Solicitudes/components/ModalComp.vue";
import TablaComp from "../../solicitudes_Area_Comision/components/TablaComp.vue";
//GASTOS A COMPROBAR Y REEMBOLSOS
import TablaCompGCReembolso from "../../solicitudes_Area_GC_Reembolso/components/TablaComp.vue";
import ModalCompGCReembolso from "../../solicitudes_Area_GC_Reembolso/components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const dashboardStore = useDashboardStore();
const solicitudesAreaStore = useSolicitudesAreaStore();
const solicitudesAreaGCReembolsoStore = useSolicitudesAreaGCReembolsoStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const { modulo } = storeToRefs(authStore);
const { areas_Gastos } = storeToRefs(dashboardStore);
const {
  recargar,
  list_Historial_GC_Reembolso,
  list_Historial_GC_Reembolso_Filtro,
  list_Solicitudes_ByArea_GC_Reembolso,
  list_Solicitudes_ByArea_GC_Reembolso_Filtro,
} = storeToRefs(solicitudesAreaGCReembolsoStore);
const {
  list_Solicitudes_ByArea,
  list_Solicitudes_ByArea_Filtro,
  list_Historial,
  list_Historial_Filtro,
} = storeToRefs(solicitudesAreaStore);
const years = ref([]);
const startYear = 2023;
const hoy = new Date();
const siglas = "SOLIC-AREA";
const textoFecha = ref(null);
const tab = ref("pendientes");
const buscar_Por = ref("año");
const rango_Fecha = ref(null);
const gastos_Filtrado = ref([]);
const montoSolicitadoGC = ref(0);
const montoUtilizadoGC = ref(0);
const montoUtilizadoREEM = ref(0);
const montoReintegroGC = ref(0);
const montoAprobadoGC = ref(0);
const montoAprobadoREEM = ref(0);
const year = ref(hoy.getFullYear());
const tabGeneral = ref("comisiones");
const myLocale = {
  days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
  daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
  months:
    "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
      "_"
    ),
  monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
  firstDayOfWeek: 1,
  format24h: true,
  pluralDay: "dias",
};

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

//-----------------------------------------------------------

watch(recargar, (val) => {
  if (val == true) {
    cargarData();
    solicitudesAreaGCReembolsoStore.actualizarRecargar(false);
  }
});

watch(buscar_Por, (val) => {
  if (val != null) {
    textoFecha.value = null;
    rango_Fecha.value = null;
    year.value = hoy.getFullYear();
  }
});

watch(tabGeneral, (val) => {
  if (val != null) {
    tab.value = "pendientes";
    filtrarTablas();
  }
});

watch(rango_Fecha, (val) => {
  if (val != null) {
    if (typeof val != "string") {
      let { from, to } = val;
      textoFecha.value = "del " + from + " hasta " + to;
    } else {
      textoFecha.value = val;
    }
  }
});

//-----------------------------------------------------------

const crearListYears = () => {
  for (let yearList = startYear; yearList <= year.value; yearList++) {
    years.value.push(yearList);
  }
};

const cargarData = async () => {
  loading();
  crearListYears();
  await dashboardStore.loadDashboard(
    `${year.value}-01-01`,
    `${year.value}-12-31`
  );
  await solicitudesAreaStore.load_Historial();
  await solicitudesAreaStore.load_Solicitudes_Area();
  await solicitudesAreaGCReembolsoStore.load_Historial_DD();
  await solicitudesAreaGCReembolsoStore.load_Solicitudes_Area_Devengar_Devengado();
  filtrarTablas();
  calcularMontos();
  $q.loading.hide();
};

const calcularMontos = () => {
  const initialValue = 0;
  montoSolicitadoGC.value = list_Historial_GC_Reembolso.value
    .filter((x) => x.tipo_Solicitud_Gasto === 1)
    .reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.monto_Solicitado,
      initialValue
    );
  montoUtilizadoGC.value = list_Historial_GC_Reembolso.value
    .filter((x) => x.tipo_Solicitud_Gasto === 1)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Utilizado,
      initialValue
    );
  montoReintegroGC.value = list_Historial_GC_Reembolso.value
    .filter((x) => x.tipo_Solicitud_Gasto === 1)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Reintegro,
      initialValue
    );
  montoAprobadoGC.value = list_Historial_GC_Reembolso.value
    .filter((x) => x.tipo_Solicitud_Gasto === 1)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Aprobado,
      initialValue
    );

  //--------------------------------------------------------------

  montoUtilizadoREEM.value = list_Historial_GC_Reembolso.value
    .filter((x) => x.tipo_Solicitud_Gasto === 0)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Utilizado,
      initialValue
    );
  montoAprobadoREEM.value = list_Historial_GC_Reembolso.value
    .filter((x) => x.tipo_Solicitud_Gasto === 0)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Aprobado,
      initialValue
    );
};

const filtrarPorFecha = (lista) => {
  let fecha_Inicio = null;
  let fecha_Fin = null;
  if (buscar_Por.value == "año") {
    fecha_Inicio = new Date(`${year.value}-01-01`).getTime();
    fecha_Fin = new Date(`${year.value}-12-31`).getTime();
  } else {
    fecha_Inicio = new Date(rango_Fecha.value.from);
    fecha_Fin = new Date(rango_Fecha.value.to);
  }
  if (tabGeneral.value == "comisiones") {
    return lista.filter((element) => {
      const inicio = Date.parse(element.fecha_Salida);
      const fin = Date.parse(element.fecha_LLegada);
      return inicio >= fecha_Inicio && fin <= fecha_Fin;
    });
  } else {
    return lista.filter((element) => {
      let fecha = element.fecha_Solicitud.split(" ")[0].split("-");
      const fecha_Solicitud = Date.parse(
        `${parseInt(fecha[2])}-${parseInt(fecha[1])}-${parseInt(fecha[0])}`
      );
      return fecha_Solicitud >= fecha_Inicio && fecha_Solicitud <= fecha_Fin;
    });
  }
};

const filtrarTablas = () => {
  const area_Id = encryptStorage.decrypt("area_Id");
  switch (tabGeneral.value) {
    case "comisiones":
      gastos_Filtrado.value = areas_Gastos.value.filter(
        (x) => x.area_Id === area_Id
      );
      list_Historial_Filtro.value = filtrarPorFecha(list_Historial.value);
      list_Solicitudes_ByArea_Filtro.value = filtrarPorFecha(
        list_Solicitudes_ByArea.value
      );
      break;
    case "gastoComprobar":
    case "reembolso":
      list_Historial_GC_Reembolso_Filtro.value = filtrarPorFecha(
        list_Historial_GC_Reembolso.value
      );
      list_Solicitudes_ByArea_GC_Reembolso_Filtro.value = filtrarPorFecha(
        list_Solicitudes_ByArea_GC_Reembolso.value
      );
      break;
    default:
      break;
  }
};

const loading = () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
};

const leerPermisos = async () => {
  loading();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const buscar = async () => {
  if (
    buscar_Por.value == "rango" &&
    (rango_Fecha.value == null || rango_Fecha.value == undefined)
  ) {
    Swal.fire({
      title: "Atención",
      text: "No seleccionó rango de fecha",
      icon: "warning",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    loading();
    await dashboardStore.loadDashboard(
      buscar_Por.value == "año"
        ? `${year.value}-01-01`
        : rango_Fecha.value.from,
      buscar_Por.value == "año" ? `${year.value}-12-31` : rango_Fecha.value.to
    );
    filtrarTablas();
    $q.loading.hide();
  }
};

const options = (date) => {
  const dateActual = new Date();
  const year = dateActual.getFullYear();
  const month = String(dateActual.getMonth() + 1).padStart(2, "0");
  const day = String(dateActual.getDate()).padStart(2, "0");
  const dateA = `${year}/${month}/${day}`;
  return date <= dateA;
};
</script>
