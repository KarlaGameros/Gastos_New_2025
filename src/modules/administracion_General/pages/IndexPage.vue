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
              </div>
            </q-tab>
            <q-tab name="gastoComprobar">
              <div>
                <q-icon size="sm" name="paid" />
                Gasto a comprobar
                <q-badge color="purple" align="middle">
                  {{
                    list_Pendientes_Administracion_GC_Reem.filter(
                      (x) =>
                        x.estatus_Recepcion_Administracion ==
                          "Pendiente_Recepcion" &&
                        x.estatus != "Pendiente" &&
                        x.estatus != "Cancelado" &&
                        x.estatus != "Rechazado por jefe de area" &&
                        x.tipo_Solicitud_Gasto == 1
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
                    list_Pendientes_Administracion_GC_Reem.filter(
                      (x) =>
                        x.estatus_Recepcion_Administracion ==
                          "Pendiente_Recepcion" &&
                        x.estatus != "Pendiente" &&
                        x.estatus != "Cancelado" &&
                        x.estatus != "Rechazado por jefe de area" &&
                        x.tipo_Solicitud_Gasto == 0
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
                        <q-badge color="grey" floating>
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
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompGCReem
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                          :tabGeneral="tabGeneral"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="recibidas">
                        <TablaCompGCReem
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'recibidas'"
                          :tabGeneral="tabGeneral"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pendientes_firmas">
                        <TablaCompGCReem
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes_firmas'"
                          :tabGeneral="tabGeneral"
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
                      />
                    </q-tabs>
                    <q-tab-panels v-model="tab" animated>
                      <q-tab-panel name="pendientes">
                        <TablaCompGCReem
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes'"
                          :tabGeneral="tabGeneral"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="recibidas">
                        <TablaCompGCReem
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'recibidas'"
                          :tabGeneral="tabGeneral"
                        />
                      </q-tab-panel>
                      <q-tab-panel name="pendientes_firmas">
                        <TablaCompGCReem
                          v-if="modulo == null ? false : modulo.leer"
                          :tipo="'pendientes_firmas'"
                          :tabGeneral="tabGeneral"
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
    <ModalCompGCReem />
    <ModalCompComision />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "../../../stores/auth-store";
import { useAdministracionStore } from "src/stores/administracion-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
//COMISIONES
import TablaCompComision from "../../admiComision/components/TablaComp.vue";
import ModalCompComision from "../../admiComision/components/ModalComp.vue";
//GASTOS A COMPROBAR Y REEMBOLSOS
import TablaCompGCReem from "../../admiGCReembolso/components/TablaComp.vue";
import ModalCompGCReem from "../../admiGCReembolso/components/ModalComp.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const authStore = useAuthStore();
const administracionStore = useAdministracionStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const {
  list_Pendientes_Firmas,
  list_Pendientes_Administracion_GC_Reem,
  list_Pendientes_Administracion_Comision,
} = storeToRefs(administracionStore);
const { modulo } = storeToRefs(authStore);
const siglas = "SOLIC-ADMON";
const tab = ref("pendientes");
const tabGeneral = ref("comisiones");

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

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
  leerPermisos();
  await administracionStore.load_Pendientes_Firmas();
  await administracionStore.load_Recibidas_Administracion();
  await administracionStore.load_Solicitudes_Administracion();
  await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
  await administracionStore.load_Pendientes_Recepcion_Devengar_Devengado();
  $q.loading.hide();
};

const leerPermisos = async () => {
  loading();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};
</script>
