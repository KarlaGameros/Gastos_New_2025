<template>
  <q-page>
    <div class="row bg-grey-2">
      <div class="col-9">
        <div class="q-pa-md q-gutter-sm">
          <div class="text-gray-ieen-1 text-h6">
            Solicitudes recursos financieros
          </div>
          <q-breadcrumbs>
            <template v-slot:separator>
              <q-icon size="1.5em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el icon="home" label="Inicio" to="/" />
            <q-breadcrumbs-el class="text-grey-7" label="Comisiones" />
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
              label="Pendientes de aprobación"
            >
              <q-badge color="purple" floating>
                {{ list_Solicitudes_RF.length }}
              </q-badge>
            </q-tab>
            <q-tab
              icon="downloading"
              name="aprobados_rf"
              label="Aprobadas RF / Pendiente pago"
            >
              <q-badge color="purple" floating>
                {{
                  list_Solictudes_Aprobadas_RF.filter(
                    (x) =>
                      x.pagado == false &&
                      x.estatus != "Cancelado" &&
                      x.saldo_Cero != true
                  ).length
                }}
              </q-badge>
            </q-tab>
            <q-tab icon="paid" name="pagada" label="Pagadas" />
            <q-tab
              icon="pending"
              name="pendiente_concluir"
              label="Pendientes de concluir"
            >
              <q-badge color="purple" floating>
                {{
                  list_Solictudes_Aprobadas_RF.filter(
                    (x) =>
                      x.estatus != "Concluido" &&
                      x.estatus != "Cancelado" &&
                      x.estatus != "Pagada" &&
                      x.estatus != "Pendiente" &&
                      (x.pagado == true ||
                        x.fecha_Pago != "Sin registro" ||
                        x.saldo_Cero == true)
                  ).length
                }}
              </q-badge>
            </q-tab>
            <q-tab icon="task_alt" name="concluidas" label="Concluidas" />
            <q-tab icon="cancel" name="canceladas" label="Canceladas" />
          </q-tabs>
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="pendientes">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'pendientes'"
              />
            </q-tab-panel>
            <q-tab-panel name="aprobados_rf">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'aprobados_rf'"
              />
            </q-tab-panel>
            <q-tab-panel name="pagada">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'pagada'"
              />
            </q-tab-panel>
            <q-tab-panel name="pendiente_concluir">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'pendiente_concluir'"
              />
            </q-tab-panel>
            <q-tab-panel name="concluidas">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'concluidas'"
              />
            </q-tab-panel>
            <q-tab-panel name="canceladas">
              <TablaComp
                v-if="modulo == null ? false : modulo.leer"
                :tipo="'canceladas'"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
    <ModalComp />
    <ModalPago />
    <ModalReintegro />
    <ModalFacturas />
  </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useAuthStore } from "../../stores/auth-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { storeToRefs } from "pinia";
import TablaComp from "../solicitudes_RF_Comision/components/TablaComp.vue";
import ModalComp from "../solicitudes_RF_Comision/components/ModalComp.vue";
import ModalPago from "../solicitudes_RF_Comision/components/ModalPago.vue";
import ModalReintegro from "../solicitudes_RF_Comision/components/ModalReintegro.vue";
import ModalFacturas from "../solicitudes_RF_Comision/components/ModalFacturas.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const solicitudesRFStore = useSolicitudesRFStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { list_Solicitudes_RF, list_Solictudes_Aprobadas_RF } =
  storeToRefs(solicitudesRFStore);
const tab = ref("pendientes");
const siglas = "SOLIC-RF";

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
