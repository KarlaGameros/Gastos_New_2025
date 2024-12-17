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
          <div class="text-h5 text-gray-ieen-1 text-bold absolute-center">
            SOLICITUD DE COMISIÓN<br />
            <div class="text-center text-purple-ieen">
              {{ solicitudRF.folio }}
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
      <q-card-section class="row q-col-gutter-xs">
        <div class="col-12">
          <q-input
            v-model="solicitudRF.area"
            label="Área"
            hint="Área de la cual se esta realizando la solicitud"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="apartment" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            v-model="solicitudRF.empleado_Solicitante"
            label="Solicitante"
            hint="Empleado que realiza la solicitud"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            v-model="solicitudRF.responsable_Area"
            label="Responsable"
            hint="Empleado responsable de área"
            readonly
          >
            <template v-slot:prepend>
              <q-icon name="supervisor_account" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            readonly
            v-model="solicitudRF.actividad"
            label="Actividad a realizar"
            type="textarea"
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            readonly
            v-model="solicitudRF.fecha_Salida"
            label="Fecha de salida"
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            readonly
            v-model="solicitudRF.fecha_LLegada"
            label="Fecha de llegada"
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            v-model="solicitudRF.no_Dias"
            type="number"
            label="No. días"
            readonly
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            v-model="solicitudRF.no_Noches"
            type="number"
            label="No. noches"
            readonly
          />
        </div>
        <div class="col-12">
          <q-input
            v-model="solicitudRF.destino_String"
            label="Destinos"
            readonly
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            v-model="solicitudRF.medio_Transporte"
            label="Medio de transporte"
            readonly
          >
            <template
              v-if="
                solicitudRF.medio_Transporte != null &&
                solicitudRF.medio_Transporte != 'Ninguno'
              "
              v-slot:prepend
            >
              <q-icon
                :name="
                  solicitudRF.medio_Transporte == 'Terrestre'
                    ? 'directions_car'
                    : solicitudRF.medio_Transporte == 'Aéreo'
                    ? 'flight'
                    : 'directions_boat'
                "
              />
            </template>
          </q-input>
        </div>
        <div
          v-if="solicitudRF.medio_Transporte != 'Ninguno'"
          class="col-lg-3 col-md-3 col-xs-12"
        >
          <q-input
            v-model="solicitudRF.medio_Transporte_Especifico"
            label="Tipo de medio de transporte"
            readonly
          />
        </div>
        <div
          class="col-lg-3 col-md-3 col-xs-12"
          v-if="solicitudRF.medio_Transporte_Especifico == 'Vehículo oficial'"
        >
          <q-input
            v-model="solicitudRF.rol"
            label="Tipo de medio de transporte"
            readonly
          />
        </div>
        <div
          class="col-lg-3 col-md-3 col-xs-12"
          v-if="
            solicitudRF.medio_Transporte_Especifico == 'Vehículo oficial' &&
            solicitudRF.rol == 'Chofer'
          "
        >
          <q-input
            v-model="solicitudRF.vehiculo"
            label="Vehículo oficial"
            readonly
          />
        </div>
        <div class="col-12"></div>
        <div class="col-lg-4 col-md-4 col-xs-12 text-center">
          <q-toggle
            disable
            v-model="solicitudRF.pernoctado"
            checked-icon="check"
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
            disable
            checked-icon="check"
            unchecked-icon="clear"
            size="lg"
            left-label
            class="text-bold text-suntitle1"
            label="¿Guardar como borrador?"
            v-model="solicitudRF.borrador"
            color="purple-ieen"
          />
        </div>
        <div class="col-lg-4 col-md-4 col-xs-12 text-center">
          <q-toggle
            disable
            checked-icon="check"
            unchecked-icon="clear"
            size="lg"
            left-label
            class="text-bold text-suntitle1"
            color="purple-ieen"
            name="¿Solicitar recurso?"
            v-model="solicitudRF.saldo_Cero"
            label="No solicitar recurso"
            lazy-rules
            :rules="[
              (val) => !!val || 'Especifique si desea solicitar recurso',
            ]"
          />
        </div>
        <div class="col-12">
          <q-input
            readonly
            v-model="solicitudRF.observaciones"
            label="Observaciones"
            hint="Ingrese observaciones que necesita que administración verifique"
            type="textarea"
          />
        </div>
        <div class="col-12" v-if="solicitudRF.saldo_Cero == false">
          <q-input
            readonly
            v-model="solicitudRF.gastos_Viaje"
            hint="Gastos de viaje"
            type="textarea"
            placeholder="Los viáticos y gastos de hospedaje serán asignados conforme a tabulador vigente. En caso de requerir gastos de viaje (transporte terrestre, transporte aéreo, traslados, gasolina, peajes, entre otros) favor de enlistar el tipo de gasto de viaje y el monto solicitado en este espacio."
          />
        </div>
        <div class="col-12">
          <q-input
            readonly
            v-model="solicitudRF.itinerario"
            label="Itinerario"
            hint="En espacio para indicar el itinerario a seguir durante la comisión"
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-section v-if="!visualizar && solicitudRF.saldo_Cero == false">
        <div class="col-12 text-h5 text-purple-ieen text-bold text-center">
          <br />
          INFORMACIÓN FINANCIERA
        </div>
        <br />
        <q-form class="row q-col-gutter-xs" @submit="agregar_Distribucion">
          <div v-if="!visualizar" class="col-lg-3 col-md-6 col-xs-12">
            <q-input
              v-model="solicitudRF.monto_Asignado"
              prefix="$"
              label="Monto calculado"
              readonly
            />
          </div>
          <div v-if="!visualizar" class="col-lg-3 col-md-6 col-xs-12">
            <q-input
              v-model="monto_Real"
              prefix="$"
              label="Monto asignado"
              readonly
            />
          </div>
          <div v-if="!visualizar" class="col-lg-3 col-md-6 col-xs-12">
            <q-select
              color="purple-ieen"
              ref="gasto_ref"
              v-model="gasto_Id"
              :options="list_Gastos"
              label="Gasto"
              hint="Seleccione el gasto"
              lazy-rules
              :rules="[(val) => !!val || 'El gasto es requerido']"
            />
          </div>
          <div v-if="!visualizar" class="col-lg-3 col-md-6 col-xs-12">
            <q-input
              color="purple-ieen"
              type="number"
              ref="importe_ref"
              v-model="distribucion.importe"
              label="Monto"
              lazy-rules
              :rules="[(val) => !!val || 'El monto es requerido']"
            />
          </div>
          <div v-if="!visualizar" class="col-12 justify-end q-pb-md">
            <div class="text-right q-gutter-xs">
              <q-btn
                color="red"
                label="limpiar"
                @click="limpiarDistribucion"
                icon="cleaning_services"
              />
              <q-btn
                color="secondary"
                :label="is_Editar ? 'Editar' : 'Agregar'"
                type="submit"
                icon="add"
              />
            </div>
          </div>
          <div class="col-12">
            <TablaDistribucion />
          </div>
        </q-form>
      </q-card-section>
      <div class="flotanteFooter">
        <q-card-section
          v-if="solicitudRF.estatus == 'Aprobado por jefe de area'"
        >
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                color="red"
                label="Rechazar"
                @click="rechazar"
                icon="cancel"
              />
              <q-btn
                :loading="loading"
                type="button"
                color="secondary"
                label="Aprobar"
                icon="task_alt"
                @click="aprobar"
              />
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { usePagoStore } from "src/stores/pago-store";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { onBeforeMount, ref, watch } from "vue";
import { useQuasar, QSpinnerFacebook } from "quasar";
import TablaDistribucion from "./TablaDistribucion.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const pagoStore = usePagoStore();
const distribucionStore = useDistribucionStore();
const solicitudesRFStore = useSolicitudesRFStore();
const { pago, list_Formas_Pago } = storeToRefs(pagoStore);
const { distribucion, list_Gastos, is_Editar, list_Distribuciones } =
  storeToRefs(distribucionStore);
const { modal, solicitudRF, visualizar } = storeToRefs(solicitudesRFStore);
const monto_Real = ref(0);
const loading = ref(false);
const gasto_Id = ref(null);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarData();
});

//-----------------------------------------------------------

watch(list_Distribuciones, (val) => {
  if (val != [] && val != null) {
    monto_Real.value = list_Distribuciones.value.reduce(
      (accumulator, currentValue) => accumulator + currentValue.importe,
      0
    );
  }
});

watch(distribucion.value, (val) => {
  if (val.id != null && is_Editar.value == true) {
    if (gasto_Id.value == null) {
      let gastoFiltrado = list_Gastos.value.find(
        (x) => x.value == val.c_Gasto_Id
      );
      gasto_Id.value = gastoFiltrado;
    }
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

const alertNotify = (position, type, resp) => {
  $q.notify({
    position: position,
    type: type,
    message: resp,
    actions: [
      {
        icon: "close",
        color: "black",
        round: true,
        handler: () => {},
      },
    ],
  });
};

const cargarData = async () => {
  loadingShow();
  await distribucionStore.load_Gastos();
  await pagoStore.load_Formas_Pago();
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  pagoStore.initPago();
  limpiarDistribucion();
  solicitudesRFStore.initSolicitudRF();
  solicitudesRFStore.actualizarModal(valor);
  solicitudesRFStore.actualizarVisualizar(false);
};

const limpiarDistribucion = () => {
  gasto_Id.value = null;
  distribucionStore.initDistribucion();
};

const agregar_Distribucion = async () => {
  loadingShow();
  loading.value = true;
  let resp = null;
  distribucion.value.c_Gasto_Id = parseInt(gasto_Id.value.value);
  if (is_Editar.value == true) {
    resp = await distribucionStore.update_Distribucion(distribucion.value);
  } else {
    resp = await distribucionStore.create_Distribucion(
      solicitudRF.value.id,
      distribucion.value
    );
  }
  if (resp.success) {
    limpiarDistribucion();
    await distribucionStore.load_Distribuciones(solicitudRF.value.id);
    loading.value = false;
    alertNotify("top-right", "positive", resp.data);
  } else {
    alertNotify("top-right", "negative", resp.data);
    loading.value = false;
  }
  $q.loading.hide();
};

const aprobar = async () => {
  if (
    solicitudRF.value.saldo_Cero == true ||
    list_Distribuciones.value.length == 0
  ) {
    $q.dialog({
      title:
        solicitudRF.value.saldo_Cero == true
          ? "No solicitó recurso"
          : "No asigno recurso",
      message: `¿Desea continuar?`,
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Continuar",
        icon: "task_alt",
      },
      cancel: {
        color: "red",
        label: "Cancelar",
      },
    }).onOk(async () => {
      $q.dialog({
        title: "Aprobación de solicitud de comisión",
        message: `¿Desea aprobar la solicitud con folio ${solicitudRF.value.folio}?`,
        html: true,
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
        ok: {
          color: "secondary",
          label: "Sí! aprobar",
          icon: "task_alt",
        },
        cancel: {
          color: "red",
          label: "Cancelar",
        },
      }).onOk(async () => {
        loadingShow();
        const resp = await solicitudesRFStore.aprobar_RF(
          solicitudRF.value.id,
          monto_Real.value
        );
        if (resp.success) {
          let forma_Pago = list_Formas_Pago.value.filter((x) => x.clave == "4");
          await solicitudesRFStore.load_Solicitud_Id_RF(solicitudRF.value.id);
          pago.value.forma_Pago_Id = forma_Pago[0].value;
          pago.value.fecha_Pago = solicitudRF.value.fecha_Aprobacion_RF;
          const respPago = await solicitudesRFStore.pagar(
            solicitudRF.value.id,
            pago.value
          );
          if (respPago.success) {
            await solicitudesRFStore.load_Solicitudes_RF();
            $q.loading.hide();
            alertNotify("top-right", "positive", resp.data);
            actualizarModal(false);
          } else {
            $q.loading.hide();
            $q.notify({
              type: "negative",
              message: respPago.data,
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
          $q.loading.hide();
          alertNotify("top-right", "negative", resp.data);
        }
      });
    });
  } else if (monto_Real.value > solicitudRF.value.monto_Asignado) {
    $q.dialog({
      title: "Montos mayores al calculado",
      message: `El monto asignado ($${monto_Real.value}) a la solicitud con folio ${solicitudRF.value.folio} es mayor al calculado ($${solicitudRF.value.monto_Asignado}), ¿desea continuar?`,
      icon: "Warning",
      persistent: true,
      html: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Continuar",
        icon: "task_alt",
      },
      cancel: {
        color: "red",
        label: "Cancelar",
      },
    }).onOk(async () => {
      $q.dialog({
        title: "Aprobación de solicitud de comisión",
        message: `¿Desea aprobar la solicitud con folio ${solicitudRF.value.folio}?`,
        html: true,
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
        ok: {
          color: "secondary",
          label: "Sí! aprobar",
          icon: "task_alt",
        },
        cancel: {
          color: "red",
          label: "Cancelar",
        },
      }).onOk(async () => {
        loadingShow();
        const resp = await solicitudesRFStore.aprobar_RF(
          solicitudRF.value.id,
          monto_Real.value
        );
        if (resp.success) {
          $q.loading.hide();
          await solicitudesRFStore.load_Solicitudes_RF();
          await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
          alertNotify("top-right", "positive", resp.data);
          actualizarModal(false);
        } else {
          $q.loading.hide();
          alertNotify("top-right", "negative", resp.data);
        }
      });
    });
  } else if (monto_Real.value < solicitudRF.value.monto_Asignado) {
    $q.dialog({
      title: "Montos mayores al calculado",
      message: `El monto asignado ($${monto_Real.value}) a la solicitud con folio ${solicitudRF.value.folio} es menor al calculado ($${solicitudRF.value.monto_Asignado}), ¿desea continuar?`,
      icon: "Warning",
      html: true,
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Continuar",
        icon: "task_alt",
      },
      cancel: {
        color: "red",
        label: "Cancelar",
      },
    }).onOk(async () => {
      $q.dialog({
        title: "Aprobación de solicitud de comisión",
        message: `¿Desea aprobar la solicitud con folio ${solicitudRF.value.folio}?`,
        html: true,
        icon: "Warning",
        persistent: true,
        transitionShow: "scale",
        transitionHide: "scale",
        ok: {
          color: "secondary",
          label: "Sí! aprobar",
          icon: "task_alt",
        },
        cancel: {
          color: "red",
          label: "Cancelar",
        },
      }).onOk(async () => {
        loadingShow();
        const resp = await solicitudesRFStore.aprobar_RF(
          solicitudRF.value.id,
          monto_Real.value
        );
        if (resp.success) {
          $q.loading.hide();
          await solicitudesRFStore.load_Solicitudes_RF();
          await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
          alertNotify("top-right", "positive", resp.data);
          actualizarModal(false);
        } else {
          $q.loading.hide();
          alertNotify("top-right", "negative", resp.data);
        }
      });
    });
  } else {
    $q.dialog({
      title: "Aprobación de solicitud de comisión",
      message: `¿Desea aprobar la solicitud con folio ${solicitudRF.value.folio}?`,
      icon: "Warning",
      html: true,
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        color: "secondary",
        label: "Sí! aprobar",
        icon: "task_alt",
      },
      cancel: {
        color: "red",
        label: "Cancelar",
      },
    }).onOk(async () => {
      loadingShow();
      const resp = await solicitudesRFStore.aprobar_RF(
        solicitudRF.value.id,
        monto_Real.value
      );
      if (resp.success) {
        $q.loading.hide();
        await solicitudesRFStore.load_Solicitudes_RF();
        await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
        alertNotify("top-right", "positive", resp.data);
        actualizarModal(false);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  }
};

const rechazar = async () => {
  $q.dialog({
    title: "Rechazo de solicitud de comisión",
    message: `<b>¿Desea rechazar la solicitud con folio ${solicitudRF.value.folio}?, al cancelar la solicitud no procede</b>`,
    icon: "Warning",
    html: true,
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Sí! rechazar",
      icon: "cancel",
    },
    cancel: {
      color: "red",
      label: "No, Salir",
    },
  }).onOk(async () => {
    loadingShow();
    const resp = await solicitudesRFStore.rechazar_RF(solicitudRF.value.id);
    if (resp.success) {
      $q.loading.hide();
      await solicitudesRFStore.load_Solicitudes_RF();
      await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
      alertNotify("top-right", "positive", resp.data);
      actualizarModal(false);
    } else {
      $q.loading.hide();
      alertNotify("top-right", "negative", resp.data);
    }
  });
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
