<template>
  <q-page>
    <div class="row bg-grey-1">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Mis solictudes</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Mis solicitudes" />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="text-right q-pa-md items-start q-gutter-md">
          <q-btn
            v-if="modulo == null ? false : modulo.registrar"
            type="button"
            class="q-ma-sm"
            color="purple-ieen"
            icon-right="add_circle_outline"
            label="Nuevo"
            @click="actualizarModal(true)"
          />
        </div>
      </div>
    </div>
    <div class="row q-pr-lg q-pl-lg">
      <div class="col">
        <q-card>
          <q-tabs
            inline-label
            v-model="tab"
            align="justify"
            indicator-color="purple-ieen"
            active-color="purple-ieen bg-grey-4"
            class="bg-grey-2 text-grey shadow-2 text-bold"
          >
            <q-tab
              icon="currency_exchange"
              name="comisiones"
              label="Comisiones"
            />
            <q-tab
              icon="paid"
              name="gastoComprobar"
              label="Gasto a comprobar"
            />
            <q-tab icon="price_check" name="reembolso" label="Reembolso" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="comisiones">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'comisiones'"
              />
            </q-tab-panel>
            <q-tab-panel name="gastoComprobar">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'gastoComprobar'"
              />
            </q-tab-panel>
            <q-tab-panel name="reembolso">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'reembolso'"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <ModalComp />
    <ModalComprobarComp />
    <ModalEvidencias />
    <ModalFacturas />
    <ReintegroComp />
    <ModalElegirTipo />
    <ModalGC />
    <ModalReembolso />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth-store";
import { onBeforeMount } from "vue";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import TablaComp from "../components/TablaComp.vue";
import ModalComp from "../components/ModalComp.vue";
import ModalFacturas from "../components/ModalFacturas.vue";
import ReintegroComp from "../components/ReintegroComp.vue";
import ModalElegirTipo from "../components/ModalElegirTipo.vue";
import ModalEvidencias from "../components/ModalEvidencias.vue";
import ModalComprobarComp from "../components/ModalComprobarComp.vue";
import ModalGC from "../../gastosComprobarReembolso/components/ModalGC.vue";
import ModalReembolso from "../../gastosComprobarReembolso/components/ModalReembolso.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { tab } = storeToRefs(misSolicitudesStore);
const { modulo } = storeToRefs(authStore);
const siglas = "MIS-SOLIC";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
});

//-----------------------------------------------------------

const leerPermisos = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  misSolicitudesStore.initSolicitud();
  misSolicitudesStore.actualizarEditar(false);
  misSolicitudesStore.actualizarVisualizar(false);
  misSolicitudesStore.actualizarModalElegir(valor);
};
</script>
