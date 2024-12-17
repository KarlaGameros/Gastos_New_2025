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
          <div class="text-h6 text-gray-ieen-1 text-bold absolute-center">
            SOLICITUD DE COMISIÓN <br />
            <div class="text-center text-purple-ieen">
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
      <q-card-section class="row q-col-gutter-md">
        <div class="col-6">
          <q-input v-model="solicitud.estatus" label="Estatus" disable />
        </div>
        <div class="col-12">
          <q-input
            v-model="solicitud.area"
            label="Área de la cual se esta realizando la solicitud"
            disable
          >
            <template v-slot:prepend>
              <q-icon name="apartment" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            v-model="solicitud.empleado_Solicitante"
            label="Empleado que realiza la solicitud"
            disable
          >
            <template v-slot:prepend>
              <q-icon name="person" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            v-model="solicitud.responsable_Area"
            label="Responsable de área"
            disable
          >
            <template v-slot:prepend>
              <q-icon name="supervisor_account" />
            </template>
          </q-input>
        </div>
        <div class="col-12">
          <q-input
            disable
            v-model="solicitud.actividad"
            label="Actividad a realizar"
            type="textarea"
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            disable
            v-model="solicitud.fecha_Salida"
            label="Fecha de salida"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            disable
            v-model="solicitud.fecha_LLegada"
            label="Fecha de llegada"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            v-model="solicitud.no_Dias"
            type="number"
            label="No. días"
            disable
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            v-model="solicitud.no_Noches"
            type="number"
            label="No. noches"
            disable
          />
        </div>
        <div class="col-lg-3 col-md-3 col-xs-12">
          <q-input
            v-model="solicitud.medio_Transporte"
            label="Medio de transporte"
            disable
          />
        </div>
        <div
          v-if="solicitud.medio_Transporte != 'Ninguno'"
          class="col-lg-3 col-md-3 col-xs-12"
        >
          <q-input
            v-model="solicitud.medio_Transporte_Especifico"
            label="Tipo de medio de transporte"
            disable
          />
        </div>
        <div
          class="col-lg-3 col-md-3 col-xs-12"
          v-if="solicitud.medio_Transporte_Especifico == 'Vehículo oficial'"
        >
          <q-input
            v-model="solicitud.rol"
            label="Tipo de medio de transporte"
            disable
          />
        </div>
        <div
          class="col-lg-3 col-md-3 col-xs-12"
          v-if="
            solicitud.medio_Transporte_Especifico == 'Vehículo oficial' &&
            solicitud.rol == 'Chofer'
          "
        >
          <q-input
            v-model="solicitud.vehiculo"
            label="Vehículo oficial"
            disable
          />
        </div>
        <div class="col-12 q-pb-lg">
          <q-input
            v-model="solicitud.destino_String"
            label="Destinos"
            disable
          />
        </div>
        <q-card flat class="q-pa-sm bg-grey-2 col-12">
          <q-card-section class="row items-center">
            <div class="col-lg-4 col-md-4 col-xs-12 text-center">
              <q-toggle
                disable
                v-model="solicitud.pernoctado"
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
                v-model="solicitud.borrador"
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
                v-model="solicitud.saldo_Cero"
                label="No solicitar recurso"
                lazy-rules
                :rules="[
                  (val) => !!val || 'Especifique si desea solicitar recurso',
                ]"
              />
            </div>
          </q-card-section>
        </q-card>
        <div class="col-12">
          <q-input
            disable
            v-model="solicitud.observaciones"
            label="Observaciones"
            hint="Ingrese observaciones que necesita que administración verifique"
            type="textarea"
          />
        </div>
        <div class="col-12" v-if="solicitud.saldo_Cero == false">
          <q-input
            disable
            v-model="solicitud.gastos_Viaje"
            hint="Gastos de viaje"
            type="textarea"
            placeholder="Los viáticos y gastos de hospedaje serán asignados conforme a tabulador vigente. En caso de requerir gastos de viaje (transporte terrestre, transporte aéreo, traslados, gasolina, peajes, entre otros) favor de enlistar el tipo de gasto de viaje y el monto solicitado en este espacio."
          />
        </div>
        <div class="col-12">
          <q-input
            disable
            v-model="solicitud.itinerario"
            label="Itinerario"
            hint="En espacio para indicar el itinerario a seguir durante la comisión"
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="col-12 text-h5 text-purple-ieen text-bold text-center">
          INFORMACIÓN FINANCIERA
        </div>
        <br />
        <div class="row">
          <div class="col-lg-3 col-md-6 col-xs-12 q-pb-md">
            <q-input
              v-model="solicitud.monto_Asignado"
              label="Monto calculado"
              disable
            />
          </div>
        </div>
        <TablaDistribucion />
      </q-card-section>
      <div class="flotanteFooter">
        <q-card-section
          v-if="
            solicitud.recibido_Administracion != true ||
            solicitud.tipo_Recibido == 'SF'
          "
        >
          <div
            class="col-12 justify-end"
            v-if="modulo == null ? false : modulo.registrar"
          >
            <div class="text-right q-gutter-xs">
              <q-btn
                :loading="loading"
                type="button"
                color="secondary"
                label="Recibir"
                icon="task_alt"
                @click="recibir"
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
import { useAuthStore } from "../../../stores/auth-store";
import { onBeforeMount, ref } from "vue";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useAdministracionStore } from "src/stores/administracion-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";
import TablaDistribucion from "../../solicitudes_RF_Comision/components/TablaDistribucion.vue";

//-----------------------------------------------------------

const $q = useQuasar();
const misSolicitudesStore = useMisSolicitudesStore();
const administracionStore = useAdministracionStore();
const distribucionStore = useDistribucionStore();
const authStore = useAuthStore();
const { modulo } = storeToRefs(authStore);
const { solicitud } = storeToRefs(misSolicitudesStore);
const { modal, pendiente_Firma } = storeToRefs(administracionStore);
const loading = ref(false);
const siglas = "SOLIC-ADMON";

//-----------------------------------------------------------

onBeforeMount(() => {
  leerPermisos();
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

const leerPermisos = async () => {
  loadingShow();
  await authStore.loadModulo(siglas);
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  administracionStore.actualizarModal(valor);
  distribucionStore.actualizarVisualizar(false);
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

const recibir = async () => {
  if (pendiente_Firma.value == true) {
    $q.dialog({
      title: "Recibir solucitud de comisión",
      message: `Esta seguro de darle recepción a la solicitud de comisión con folio ${solicitud.value.folio}, pasará a recursos financieros`,
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "check_circle",
        color: "secondary",
        label: "Sí! continuar",
      },
      cancel: {
        icon: "cancel",
        color: "red",
        label: "Cancelar",
      },
      options: {
        type: "radio",
        model: "opt1",
        isValid: (val) => val !== null,
        items: [
          {
            label: "Recibir con firmas",
            value: "opt1",
            color: "purple-ieen",
          },
        ],
      },
    }).onOk(async (opt) => {
      let resp = null;
      switch (opt) {
        case "opt1":
          loadingShow();
          resp = await administracionStore.recibir_Admon(solicitud.value.id, 1);
          $q.loading.hide();
          break;
      }
      if (resp.success) {
        await administracionStore.load_Solicitudes_Administracion();
        await administracionStore.load_Recibidas_Administracion();
        await administracionStore.load_Pendientes_Firmas();
        $q.loading.hide();
        actualizarModal(false);
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
  } else {
    $q.dialog({
      title: "Recibir solucitud de comisión",
      message: `Esta seguro de darle recepción a la solicitud de comisión con folio ${solicitud.value.folio}, pasará a recursos financieros`,
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "check_circle",
        color: "secondary",
        label: "Sí! continuar",
      },
      cancel: {
        icon: "cancel",
        color: "red",
        label: "Cancelar",
      },
      options: {
        type: "radio",
        model: "opt1",
        isValid: (val) => val !== null,
        items: [
          {
            label: "Recibir con firmas",
            value: "opt1",
            color: "purple-ieen",
          },
          {
            label: "Recibir sin firmas",
            value: "opt2",
            color: "purple-ieen",
          },
        ],
      },
    }).onOk(async (opt) => {
      let resp = null;
      switch (opt) {
        case "opt1":
          loadingShow();
          resp = await administracionStore.recibir_Admon(solicitud.value.id, 1);
          $q.loading.hide();
          break;
        case "opt2":
          loadingShow();
          resp = await administracionStore.recibir_Admon(solicitud.value.id, 2);
          $q.loading.hide();
          break;
      }
      if (resp.success) {
        await administracionStore.load_Solicitudes_Administracion();
        await administracionStore.load_Recibidas_Administracion();
        await administracionStore.load_Pendientes_Firmas();
        $q.loading.hide();
        actualizarModal(false);
        alertNotify("top-right", "positive", resp.data);
      } else {
        $q.loading.hide();
        alertNotify("top-right", "negative", resp.data);
      }
    });
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
  background-color: white;
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 10px;
}
</style>
