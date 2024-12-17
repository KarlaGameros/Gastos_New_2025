<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Dashboard</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Dashboard" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <q-card class="bg-transparent no-shadow no-border" bordered>
      <q-card-section class="q-pa-none q-pr-md q-pl-md q-pt-md">
        <div class="row q-col-gutter-sm">
          <div class="col-md-3 col-sm-3 col-xs-12">
            <q-item class="q-pa-none bg-purple-1">
              <q-item-section class="q-pa-md q-ml-none text-grey-7">
                <q-item-label class="text-h6 text-weight-bolder">
                  Total solicitudes
                </q-item-label>
                <q-item-label class="text-subtitle1">
                  {{ solicitudes_filtro.concat(solicitudes_filtro_DD).length }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-3 col-xs-12">
            <q-item class="q-pa-none bg-purple-1">
              <q-item-section class="q-pa-md q-ml-none text-grey-7">
                <q-item-label class="text-h6 text-weight-bolder">
                  Total asignado
                </q-item-label>
                <q-item-label class="text-subtitle1">
                  ${{ total_Asignado }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-3 col-xs-12">
            <q-item class="q-pa-none bg-purple-1">
              <q-item-section class="q-pa-md q-ml-none text-grey-7">
                <q-item-label class="text-h6 text-weight-bolder">
                  Total ejercido
                </q-item-label>
                <q-item-label class="text-subtitle1"
                  >${{ total_Ejercido }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
          <div class="col-md-3 col-sm-3 col-xs-12">
            <q-item class="q-pa-none bg-purple-1">
              <q-item-section class="q-pa-md q-ml-none text-grey-7">
                <q-item-label class="text-h6 text-weight-bolder">
                  Total reintegrado
                </q-item-label>
                <q-item-label class="text-subtitle1"
                  >${{ total_Reintegro }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div class="row q-pa-md">
      <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 q-pa-sm">
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
      <div class="col-lg-3 col-md-6 col-sm-12 col-xs-12 q-pa-sm">
        <q-input
          v-if="buscar_Por == 'año'"
          label="Buscar por año"
          dense
          v-model.number="year"
          type="number"
          color="purple-ieen"
        />
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
                  v-model="fecha"
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
        v-if="!$q.screen.xs"
        class="col-lg-6 col-md-12 col-sm-12 col-xs-12 q-pl-lg"
      >
        <q-btn
          class="q-ma-sm"
          type="button"
          color="purple-ieen"
          icon-right="search"
          label="Buscar"
          @click="cargarDashboard"
        />
        <q-btn
          class="q-ma-sm"
          type="button"
          color="purple-ieen"
          icon-right="filter_alt"
          label="Filtrar por área"
          @click="actualizarModal"
        />
        <q-btn
          v-if="solicitudes_filtro.length > 0"
          class="q-ma-sm"
          label="Generar PDF"
          type="button"
          color="purple-ieen"
          icon-right="picture_as_pdf"
          @click="generar_pdf"
        />
      </div>
      <div v-else class="col-12">
        <q-btn
          class="q-ma-sm"
          type="button"
          color="purple-ieen"
          icon-right="search"
          @click="cargarDashboard"
        >
          <q-tooltip>Buscar</q-tooltip>
        </q-btn>
        <q-btn
          class="q-ma-sm"
          type="button"
          color="purple-ieen"
          icon-right="filter_alt"
          @click="actualizarModal"
        >
          <q-tooltip>Filtrar por área</q-tooltip>
        </q-btn>
        <q-btn
          v-if="solicitudes_filtro.length > 0"
          class="q-ma-sm"
          type="button"
          color="purple-ieen"
          icon-right="picture_as_pdf"
          @click="generar_pdf"
        >
          <q-tooltip>Generar PDF</q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-card bordered class="q-mr-md q-ml-md q-mt-md col-12">
      <q-tabs
        v-model="tabGeneral"
        align="justify"
        class="bg-grey-3 text-purple-ieen text-bold"
        inline-label
      >
        <q-tab name="comisiones" icon="currency_exchange" label="Comisiones" />
        <q-tab name="gc" icon="paid" label="Gastos a comprobar" />
        <q-tab name="reembolso" icon="attach_money" label="Reembolsos" />
      </q-tabs>
      <q-tab-panels v-model="tabGeneral" animated class="text-dark text-center">
        <q-tab-panel name="comisiones">
          <div class="row q-pa-lg">
            <q-card class="col-12">
              <q-tabs
                v-model="tab"
                active-color="purple-ieen"
                indicator-color="purple-ieen"
                align="justify"
                class="text-purple-ieen shadow-2 text-bold"
                inline-label
                narrow-indicator
              >
                <q-tab name="general" icon="account_tree" label="Generales" />
                <q-tab name="detalle" icon="manage_history" label="Detalle" />
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
                class="text-dark text-center"
              >
                <q-tab-panel name="general">
                  <div class="row flex-center">
                    <TarjetasGeneral :tipo="'comisiones'" />
                  </div>
                </q-tab-panel>
                <q-tab-panel name="detalle">
                  <div class="row flex-center">
                    <TarjetasDetalle :tipo="'comisiones'" />
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
          <div class="col-12 q-pa-lg">
            <TablaFiltro :buscar_Por="buscar_Por" :tipo="'comisiones'" />
          </div>
          <div class="row q-pa-lg">
            <q-card square class="col-12 q-pa-sm">
              <div class="text-left text-h6 text-bold text-purple-ieen">
                Solicitudes del año: {{ year }}
              </div>
              <DashboardComp :tipo="'comisiones'" />
            </q-card>
          </div>
          <ModalFiltroTablaComp :tipo="'comisiones'" />
          <ModalComprobarComp />
          <ModalFacturas />
          <ModalReintegro />
        </q-tab-panel>
        <q-tab-panel name="gc">
          <div class="row q-pa-lg">
            <q-card square class="col-12">
              <q-tabs
                v-model="tab"
                active-color="purple-ieen"
                indicator-color="purple-ieen"
                align="justify"
                class="text-purple-ieen shadow-2 text-bold"
                inline-label
                narrow-indicator
              >
                <q-tab name="general" icon="account_tree" label="Generales" />
                <q-tab name="detalle" icon="manage_history" label="Detalle" />
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
                class="text-dark text-center"
              >
                <q-tab-panel name="general">
                  <div class="row">
                    <TarjetasGeneral :tipo="'gc'" />
                  </div>
                </q-tab-panel>
                <q-tab-panel name="detalle">
                  <div class="row">
                    <TarjetasDetalle :tipo="'gc'" />
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
          <div class="col-12 q-pa-lg">
            <TablaFiltro :buscar_Por="buscar_Por" :tipo="'gc'" />
          </div>
          <div class="row q-pa-lg">
            <q-card square class="col-12 q-pa-sm">
              <div class="text-left text-h6 text-bold text-purple-ieen">
                Solicitudes del año: {{ year }}
              </div>
              <DashboardComp :tipo="'gc'" />
            </q-card>
          </div>
          <ModalFiltroTablaComp :tipo="'gc'" />
          <ModalComprobarComp />
          <ModalFacturas />
          <ModalReintegro />
          <ModalGC />
          <ModalReembolso />
        </q-tab-panel>
        <q-tab-panel name="reembolso">
          <div class="row q-pa-lg">
            <q-card square class="col-12">
              <q-tabs
                v-model="tab"
                active-color="purple-ieen"
                indicator-color="purple-ieen"
                align="justify"
                class="text-purple-ieen shadow-2 text-bold"
                inline-label
                narrow-indicator
              >
                <q-tab name="general" icon="account_tree" label="Generales" />
                <q-tab name="detalle" icon="manage_history" label="Detalle" />
              </q-tabs>
              <q-tab-panels
                v-model="tab"
                animated
                class="text-dark text-center"
              >
                <q-tab-panel name="general">
                  <div class="row">
                    <TarjetasGeneral :tipo="'reembolso'" />
                  </div>
                </q-tab-panel>
                <q-tab-panel name="detalle">
                  <div class="row">
                    <TarjetasDetalle :tipo="'reembolso'" />
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </q-card>
          </div>
          <div class="col-12 q-pa-lg">
            <TablaFiltro :buscar_Por="buscar_Por" :tipo="'reembolso'" />
          </div>
          <div class="row q-pa-lg">
            <q-card square class="col-12 q-pa-sm">
              <div class="text-left text-h6 text-bold text-purple-ieen">
                Solicitudes del año: {{ year }}
              </div>
              <DashboardComp :tipo="'reembolso'" />
            </q-card>
          </div>
          <ModalFiltroTablaComp :tipo="'reembolso'" />
          <ModalComprobarComp />
          <ModalFacturas />
          <ModalReintegro />
          <ModalGC />
          <ModalReembolso />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboardStore } from "src/stores/dashboard-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import TablaFiltro from "../components/TablaFiltro.vue";
import DashboardComp from "src/helpers/DashboardComp.vue";
import TarjetasGeneral from "../components/TarjetasGeneral.vue";
import TarjetasDetalle from "../components/TarjetasDetalle.vue";
import GenerarReporteFiltro from "src/helpers/GeneraReporteFiltro";
import ModalFiltroTablaComp from "../components/ModalFiltroTablaComp.vue";
import ModalGC from "src/modules/gastosComprobarReembolso/components/ModalGC.vue";
import ModalFacturas from "src/modules/mis_Solicitudes/components/ModalFacturas.vue";
import ModalReintegro from "../../solicitudes_RF_Comision/components/ModalReintegro.vue";
import ModalReembolso from "src/modules/gastosComprobarReembolso/components/ModalReembolso.vue";
import ModalComprobarComp from "../../solicitudes_RF_Comision/components/ModalComprobarComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const dasboardStore = useDashboardStore();
const {
  solicitudes_filtro,
  solicitudes_filtro_DD,
  textoFecha,
  yearFiltro,
  myLocale,
  fecha,
  areasTodos,
  areas_Gastos,
  areas_Gastos_DV,
  monto_Aprobado_GC,
  monto_Aprobado_Reem,
  total_Erogado,
  monto_Utilizado_GC,
  monto_Utilizado_Reem,
  monto_Reintegrado_GC,
  monto_Reintegrado_Reem,
} = storeToRefs(dasboardStore);
const hoy = new Date();
const tab = ref("general");
const buscar_Por = ref("año");
const year = ref(hoy.getFullYear());
const tabGeneral = ref("comisiones");
const total_Asignado = ref(0);
const total_Ejercido = ref(0);
const total_Reintegro = ref(0);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarDashboard();
});

//-----------------------------------------------------------

watch(tabGeneral, (val) => {
  if (val != null) {
    buscar_Por.value = "año";
    tab.value = "general";
  }
});

watch(fecha, (val) => {
  if (val != null) {
    if (typeof val != "string") {
      let { from, to } = val;
      textoFecha.value = "del " + from + " hasta " + to;
    } else {
      textoFecha.value = val;
    }
  }
});

watch(buscar_Por, (val) => {
  if (val != null) {
    fecha.value = null;
    textoFecha.value = null;
  }
});

//-----------------------------------------------------------

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

const cargarData = async () => {
  if (
    buscar_Por.value != "año" &&
    (fecha.value == null || fecha.value == undefined)
  ) {
    $q.notify({
      type: "warning",
      message: "No seleccionó rango de fecha",
      position: "top-right",
    });
  } else {
    fecha.value = { from: `${year.value}-01-01`, to: `${year.value}-12-31` };
    await dasboardStore.loadDashboard(fecha.value.from, fecha.value.to);
    await dasboardStore.load_solicitudes(fecha.value.from.split("-")[0]);
    await dasboardStore.load_solicitudes_DD(fecha.value.from.split("-")[0]);
    filtrarPorFecha();
  }
};

const filtrarPorFecha = () => {
  let fecha_Inicio = null;
  let fecha_Fin = null;
  if (buscar_Por.value == "año") {
    areasTodos.value = true;
    yearFiltro.value = year.value;
    fecha_Inicio = new Date(`${year.value}-01-01`);
    fecha_Fin = new Date(`${year.value}-12-31`);
  } else {
    fecha_Inicio = new Date(fecha.value.from);
    fecha_Fin = new Date(fecha.value.to);
  }
  solicitudes_filtro.value = solicitudes_filtro.value.filter((element) => {
    const inicio = Date.parse(element.fecha_Salida);
    const fin = Date.parse(element.fecha_LLegada);
    return inicio >= fecha_Inicio && fin <= fecha_Fin;
  });
  areas_Gastos.value.forEach((element) => {
    element.activo = true;
  });
  solicitudes_filtro_DD.value = solicitudes_filtro_DD.value.filter(
    (element) => {
      let date = element.fecha_Solicitud.split("-");
      const fecha = Date.parse(`${date[2]}-${date[1]}-${date[0]}`);
      return fecha >= fecha_Inicio && fecha <= fecha_Fin;
    }
  );
  areas_Gastos_DV.value.forEach((element) => {
    element.activo = true;
  });

  const initialValue = 0;
  monto_Aprobado_GC.value = solicitudes_filtro_DD.value
    .filter((x) => x.tipo_Solicitud_Gasto == 1)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Aprobado,
      initialValue
    );

  monto_Aprobado_Reem.value = solicitudes_filtro_DD.value
    .filter((x) => x.tipo_Solicitud_Gasto == 0)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Aprobado,
      initialValue
    );

  monto_Utilizado_GC.value = solicitudes_filtro_DD.value
    .filter((x) => x.tipo_Solicitud_Gasto == 1)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Utilizado,
      initialValue
    );

  monto_Utilizado_Reem.value = solicitudes_filtro_DD.value
    .filter((x) => x.tipo_Solicitud_Gasto == 0)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Utilizado,
      initialValue
    );

  monto_Reintegrado_GC.value = solicitudes_filtro_DD.value
    .filter((x) => x.tipo_Solicitud_Gasto == 1)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Reintegro,
      initialValue
    );

  monto_Reintegrado_Reem.value = solicitudes_filtro_DD.value
    .filter((x) => x.tipo_Solicitud_Gasto == 0)
    .reduce(
      (accumulator, currentValue) => accumulator + currentValue.monto_Reintegro,
      initialValue
    );

  let monto_Asignado = solicitudes_filtro.value.reduce(
    (accumulator, currentValue) => accumulator + currentValue.monto_Asignado,
    initialValue
  );
  let monto_Utilizado = solicitudes_filtro.value.reduce(
    (accumulator, currentValue) => accumulator + currentValue.monto_Utilizado,
    initialValue
  );
  let monto_Reintegro = solicitudes_filtro.value.reduce(
    (accumulator, currentValue) => accumulator + currentValue.monto_Reintegro,
    initialValue
  );
  total_Asignado.value =
    monto_Asignado + monto_Aprobado_GC.value + monto_Aprobado_Reem.value;

  total_Ejercido.value =
    monto_Utilizado + monto_Utilizado_GC.value + monto_Utilizado_Reem.value;

  total_Reintegro.value =
    monto_Reintegro + monto_Reintegrado_GC.value + monto_Reintegrado_Reem.value;
};

const cargarDashboard = async () => {
  loading();
  cargarData();
  $q.loading.hide();
};

const actualizarModal = () => {
  dasboardStore.actualizar_modal_filtro(true);
};

const generar_pdf = () => {
  if (solicitudes_filtro.value.length == 0) {
    $q.notify({
      type: "warning",
      message: "No hay datos por procesar",
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
    return;
  } else {
    let total_erogado = 0;
    let total_utilizado = 0;
    let total_reintegro = 0;
    let total_saldo = 0;

    for (let element of solicitudes_filtro.value) {
      total_erogado += element.monto_Asignado;
      total_utilizado += element.monto_Utilizado;
      total_reintegro += element.monto_Reintegro;
      total_saldo += element.saldo;
    }
    const body = [
      ...solicitudes_filtro.value.map((element, index) => [
        index + 1,
        element.folio,
        element.estatus,
        element.area,
        element.empleado_Solicitante,
        element.fecha_Salida,
        element.fecha_LLegada,
        `$${
          element.monto_Asignado == null
            ? "$0.00"
            : element.monto_Asignado.toLocaleString("en-US")
        }`,
        `$${
          element.monto_Utilizado == null
            ? "$0.00"
            : element.monto_Utilizado.toLocaleString("en-US")
        }`,
        `$${
          element.monto_Reintegro == null
            ? "$0.00"
            : element.monto_Reintegro.toLocaleString("en-US")
        }`,
        `$${
          element.saldo == null
            ? "$0.00"
            : element.saldo.toLocaleString("en-US")
        }`,
      ]),
      [
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "Totales",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_erogado}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_utilizado}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_reintegro}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_saldo}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
      ],
    ];
    GenerarReporteFiltro(
      tabGeneral.value,
      body,
      textoFecha.value == ""
        ? `Reporte de solicitudes del ejercicio ${year.value}`
        : textoFecha.value.includes("hasta") == true
        ? `Reporte de solicitudes que comprenden ${textoFecha.value}`
        : `Reporte de solicitudes del día ${textoFecha.value}`
    );
  }
};

const generar_pdf_DD = () => {
  if (solicitudes_filtro_DD.value.length == 0) {
    $q.notify({
      type: "warning",
      message: "No hay datos por procesar",
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
    return;
  } else {
    let total_erogado = 0;
    let total_utilizado = 0;
    let total_reintegro = 0;
    let total_saldo = 0;

    for (let element of solicitudes_filtro_DD.value) {
      total_erogado += element.monto_Aprobado;
      total_utilizado += element.monto_Utilizado;
      total_reintegro += element.monto_Reintegro;
      total_saldo += element.monto_Saldo;
    }
    const body = [
      ...solicitudes_filtro_DD.value.map((element, index) => [
        index + 1,
        element.folio,
        element.estatus,
        element.area,
        element.empleado_Solicitante,
        element.fecha_Solicitud,
        `$${
          element.monto_Aprobado == null
            ? "$0.00"
            : element.monto_Aprobado.toLocaleString("en-US")
        }`,
        `$${
          element.monto_Utilizado == null
            ? "$0.00"
            : element.monto_Utilizado.toLocaleString("en-US")
        }`,
        `$${
          element.monto_Reintegro == null
            ? "$0.00"
            : element.monto_Reintegro.toLocaleString("en-US")
        }`,
        `$${
          element.monto_Saldo == null
            ? "$0.00"
            : element.monto_Saldo.toLocaleString("en-US")
        }`,
      ]),
      [
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: "Totales",
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_erogado}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_utilizado}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_reintegro}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
        {
          content: `$${total_saldo}`,
          colSpan: 1,
          styles: { halign: "right" },
        },
      ],
    ];
    GenerarReporteFiltro(
      tabGeneral.value,
      body,
      textoFecha.value == ""
        ? `Reporte de solicitudes de gastos a comprobar y reembolsos del ejercicio ${year.value}`
        : textoFecha.value.includes("hasta") == true
        ? `Reporte de solicitudes de gastos a comprobar y reembolsos que comprenden ${textoFecha.value}`
        : `Reporte de solicitudes de gastos a comprobar y reembolsos del día ${textoFecha.value}`
    );
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
