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
    <div class="row q-pr-lg q-pl-lg q-pt-lg">
      <div class="col">
        <q-card>
          <q-tabs
            v-model="tabGeneral"
            active-color="purple-ieen"
            indicator-color="purple-ieen"
            align="justify"
            class="bg-grey-2 text-grey shadow-2 text-bold"
          >
            <q-tab
              icon="currency_exchange"
              name="comisiones"
              label="Comisiones"
            >
              <q-badge color="purple" floating>
                {{
                  list_Pendientes_Administracion_Comision.filter(
                    (x) =>
                      x.aprobado_Recursos_Financieros == true &&
                      x.estatus != "Pendiente" &&
                      x.estatus != "Cancelado" &&
                      x.estatus != "Rechazado por jefe de area"
                  ).length
                }}
              </q-badge>
            </q-tab>
            <q-tab icon="paid" name="gastoComprobar" label="Gasto a comprobar">
              <!-- <q-badge color="purple" floating>
                {{
                  list_Solicitudes_ByArea_GC_Reembolso.filter(
                    (x) => x.tipo_Solicitud_Gasto == 1
                  ).length
                }}
              </q-badge> -->
            </q-tab>
            <q-tab icon="price_check" name="reembolso" label="Reembolso">
              <!-- <q-badge color="purple" floating>
                {{
                  list_Solicitudes_ByArea_GC_Reembolso.filter(
                    (x) => x.tipo_Solicitud_Gasto == 0
                  ).length
                }}
              </q-badge> -->
            </q-tab>
          </q-tabs>
          <q-tab-panels v-model="tabGeneral" animated>
            <q-tab-panel name="comisiones">
              <div class="row">
                <div class="col">
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      dense
                      active-color="purple-ieen"
                      indicator-color="purple-ieen"
                      align="justify"
                      class="text-grey shadow-2 text-bold"
                    >
                      <q-tab
                        icon="pending_actions"
                        name="pendientes"
                        label="Pendientes de recepción"
                      />
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
                        <q-badge color="purple" floating>
                          {{
                            list_Pendientes_Firmas.filter(
                              (x) =>
                                x.estatus != "Cancelado" &&
                                x.estatus != "Pendiente" &&
                                x.estatus != "Rechazado por jefe de area"
                            ).length
                          }}
                        </q-badge>
                      </q-tab>
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompComision
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="recibidas">
                        <TablaCompComision
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'recibidas'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pendientes_firmas">
                        <TablaCompComision
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes_firmas'"
                        />
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="gastoComprobar">
              <!-- <div class="row">
                <div class="col">
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      active-color="grey"
                      indicator-color="grey"
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
              </div> -->
            </q-tab-panel>
            <q-tab-panel name="reembolso">
              <!-- <div class="row">
                <div class="col">
                  <q-card>
                    <q-tabs
                      v-model="tab"
                      active-color="grey"
                      indicator-color="grey"
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
              </div> -->
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
import TablaCompComision from "../admiComision/components/TablaComp.vue";
import ModalComp from "../admiComision/components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const administracionStore = useAdministracionStore();
const { list_Pendientes_Administracion_Comision, list_Pendientes_Firmas } =
  storeToRefs(administracionStore);
const { modulo } = storeToRefs(authStore);
const tab = ref("pendientes");
const siglas = "SOLIC-ADMON";
const tabGeneral = ref("comisiones");

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
