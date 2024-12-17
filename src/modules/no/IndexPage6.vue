<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">Recibir administración</div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el
              class="text-grey-7"
              label="Gastos a comprobar y Reembolsos"
            />
          </q-breadcrumbs>
        </div>
      </div>
    </div>
    <div class="row q-pa-lg">
      <div class="col">
        <q-card>
          <q-tabs
            v-model="tab"
            dense
            active-color="purple-ieen"
            indicator-color="purple-ieen"
            align="justify"
            class="bg-grey-4 text-purple-ieen shadow-2 text-bold"
          >
            <q-tab
              icon="pending_actions"
              name="pendientes"
              label="Pendientes de recepción"
            >
              <q-badge color="purple" floating>
                {{
                  list_Pendientes_Administracion_GC_Reem.filter(
                    (x) =>
                      x.estatus_Recepcion_Administracion ==
                        "Pendiente_Recepcion" &&
                      x.estatus != "Pendiente" &&
                      x.estatus != "Cancelado" &&
                      x.estatus != "Rechazado por jefe de area"
                  ).length
                }}
              </q-badge>
            </q-tab>
            <q-tab
              icon="call_received"
              name="recibidas"
              label="Recibidas con firmas"
            />
            <q-tab
              icon="pending"
              name="pendientes_firmas"
              label="Pendientes de firmas"
            >
            </q-tab>
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="pendientes">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'pendientes'"
              />
            </q-tab-panel>
            <q-tab-panel name="recibidas">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'recibidas'"
              />
            </q-tab-panel>
            <q-tab-panel name="pendientes_firmas">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'pendientes_firmas'"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <ModalComp />
  </q-page>
</template>

<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../stores/auth-store";
import { onBeforeMount, ref } from "vue";
import { useAdministracionStore } from "src/stores/administracion-store";
import TablaComp from "../admiGCReembolso/components/TablaComp.vue";
import ModalComp from "../admiGCReembolso/components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const administracionStore = useAdministracionStore();
const { list_Pendientes_Administracion_GC_Reem } =
  storeToRefs(administracionStore);
const { modulo } = storeToRefs(authStore);
const tab = ref("pendientes");
const siglas = "SOLIC-ADMON";

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
</script>
