<template>
  <q-page>
    <div class="row bg-grey-1">
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
                  {{ list_Solicitudes_RF.length }}
                </q-badge>
              </div>
            </q-tab>
            <q-tab name="gastoComprobar">
              <div>
                <q-icon size="sm" name="paid" />
                Gasto a comprobar
                <q-badge color="purple" align="middle">
                  {{
                    list_Solicitudes_RF_GC.filter(
                      (x) =>
                        x.tipo_Solicitud_Gasto == 1 &&
                        x.estatus != "Borrador" &&
                        !x.aprobado_Administracion
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
                    list_Solicitudes_RF_Reembolso.filter(
                      (x) =>
                        x.tipo_Solicitud_Gasto == 0 &&
                        x.estatus != "Borrador" &&
                        !x.aprobado_Administracion
                    ).length
                  }}
                </q-badge>
              </div>
            </q-tab>
          </q-tabs>
          <q-tab-panels v-model="tabGeneral" animated>
            <q-tab-panel name="comisiones">
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
                      >
                        <q-badge color="grey" floating>
                          {{ list_Solicitudes_RF.length }}
                        </q-badge>
                      </q-tab>
                      <q-tab
                        icon="downloading"
                        name="aprobados_rf"
                        label="Aprobadas RF / Pendiente pago"
                      >
                        <q-badge color="grey" floating>
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
                        <q-badge color="grey" floating>
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
                      <q-tab
                        icon="task_alt"
                        name="concluidas"
                        label="Concluidas"
                      />
                      <q-tab
                        icon="cancel"
                        name="canceladas"
                        label="Canceladas"
                      />
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
            </q-tab-panel>
            <q-tab-panel name="gastoComprobar">
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
                      >
                        <q-badge color="grey" floating>
                          {{
                            list_Solicitudes_RF_GC.filter(
                              (x) =>
                                x.estatus != "Borrador" &&
                                !x.aprobado_Administracion
                            ).length
                          }}
                        </q-badge>
                      </q-tab>
                      <q-tab
                        icon="downloading"
                        name="aprobados_rf"
                        label="Aprobadas RF / Pendiente pago"
                      >
                      </q-tab>
                      <q-tab icon="paid" name="pagada" label="Pagadas" />
                      <q-tab
                        icon="verified"
                        name="validar"
                        label="Validación de facturas"
                      >
                        <q-badge color="grey" floating>
                          {{
                            list_Solicitudes_RF_GC_Aprobado.filter(
                              (x) =>
                                (x.estatus == "Pendiente de revisión" &&
                                  x.pagado &&
                                  x.terminado &&
                                  !x.validado) ||
                                (x.estatus != "Concluido" &&
                                  x.estatus !=
                                    "Comprobación de gastos generada" &&
                                  x.terminado &&
                                  !x.validado)
                            ).length
                          }}
                        </q-badge>
                      </q-tab>
                      <q-tab
                        icon="pending"
                        name="pendiente_concluir"
                        label="Pendientes de concluir"
                      >
                        <q-badge color="grey" floating>
                          {{
                            list_Solicitudes_RF_GC_Aprobado.filter(
                              (x) =>
                                x.estatus != "Concluido" &&
                                x.estatus !=
                                  "Aprobado por recursos financieros" &&
                                x.estatus != "Aprobado por jefe de area" &&
                                x.estatus != "Pendiente de revisión" &&
                                x.pagado &&
                                x.validado
                            ).length
                          }}
                        </q-badge>
                      </q-tab>
                      <q-tab
                        icon="task_alt"
                        name="concluidas"
                        label="Concluidas"
                      />
                      <q-tab
                        icon="cancel"
                        name="canceladas"
                        label="Canceladas"
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="aprobados_rf">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'aprobados_rf'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pagada">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pagada'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="validar">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'validar'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pendiente_concluir">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendiente_concluir'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="concluidas">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'concluidas'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="canceladas">
                        <TablaCompGC
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'canceladas'"
                        />
                      </q-tab-panel>
                    </q-tab-panels>
                  </q-card>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="reembolso">
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
                      >
                        <q-badge color="purple" floating>
                          {{
                            list_Solicitudes_RF_Reembolso.filter(
                              (x) =>
                                x.estatus != "Borrador" &&
                                !x.aprobado_Administracion
                            ).length
                          }}
                        </q-badge>
                      </q-tab>
                      <q-tab
                        icon="downloading"
                        name="aprobados_rf"
                        label="Aprobadas RF / Pendiente pago"
                      >
                      </q-tab>
                      <q-tab icon="paid" name="pagada" label="Pagadas" />
                      <q-tab
                        icon="pending"
                        name="pendiente_concluir"
                        label="Pendientes de concluir"
                      >
                      </q-tab>
                      <q-tab
                        icon="task_alt"
                        name="concluidas"
                        label="Concluidas"
                      />
                      <q-tab
                        icon="cancel"
                        name="canceladas"
                        label="Canceladas"
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="aprobados_rf">
                        <TablaCompReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'aprobados_rf'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pagada">
                        <TablaCompReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pagada'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pendiente_concluir">
                        <TablaCompReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendiente_concluir'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="concluidas">
                        <TablaCompReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'concluidas'"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="canceladas">
                        <TablaCompReembolso
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'canceladas'"
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
    <ModalFacturas />
    <ModalReintegro />
    <ModalCompGCReembolso />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
//COMISIONES
import ModalComp from "../../solicitudes_RF_Comision/components/ModalComp.vue";
import TablaComp from "../../solicitudes_RF_Comision/components/TablaComp.vue";
import ModalReintegro from "../../solicitudes_RF_Comision/components/ModalReintegro.vue";
import ModalFacturas from "../../solicitudes_RF_Comision/components/ModalFacturas.vue";
//GASTOS A COMPROBAR
import TablaCompGC from "../../solicitudes_RF_GC/components/TablaComp.vue";
import ModalCompGCReembolso from "../../solicitudes_Area_GC_Reembolso/components/ModalComp.vue";
//REEMBOLSO
import TablaCompReembolso from "../../solicitudes_RF_Reembolso/components/TablaComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const solicitudesRFStore = useSolicitudesRFStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const { modulo } = storeToRefs(authStore);
const { list_Solicitudes_RF, list_Solictudes_Aprobadas_RF } =
  storeToRefs(solicitudesRFStore);
const {
  list_Solicitudes_RF_GC,
  list_Solicitudes_RF_Reembolso,
  list_Solicitudes_RF_GC_Aprobado,
} = storeToRefs(solicitudesGCReemRFStore);
const siglas = "SOLIC-RF";
const tab = ref("pendientes");
const tabGeneral = ref("comisiones");

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
  cargarData();
});

watch(tabGeneral, (val) => {
  if (val != null) {
    tab.value = "pendientes";
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
  loading();
  await solicitudesRFStore.load_Solicitudes_RF();
  await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
  await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Rechazadas();
  await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
  await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
  $q.loading.hide();
};

const leerPermisos = async () => {
  loading();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>
