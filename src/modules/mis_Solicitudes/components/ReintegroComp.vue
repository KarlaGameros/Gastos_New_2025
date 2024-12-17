<template>
  <template>
    <q-dialog
      v-model="modal"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card style="width: 800px; max-width: 80vw">
        <q-card-section class="row">
          <q-img src="../../../assets/IEEN300.png" width="90px" />
          <div
            class="text-h6 text-gray-ieen-1 text-bold absolute-center text-center"
          >
            REINTEGRO A COMISIÓN
            {{
              solicitud.e_Reintegro
                ? ""
                : `POR UN TOTAL DE
            $${solicitud.monto_Saldo}`
            }}
          </div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click="actualizarModal(false)"
          />
        </q-card-section>
        <q-card-section>
          <q-form class="row q-col-gutter-xs" ref="form_ref" @submit="onSubmit">
            <div class="col-4">
              <q-input
                class="text-bold"
                :disable="visualizar"
                color="purple-ieen"
                v-model="reintegro.fecha_Reintegro"
                type="date"
                label="Fecha"
                hint="Ingrese fecha en la que se realizó el reintegro"
                :rules="[(val) => !!val || 'La fecha es requerida']"
              />
            </div>
            <div class="col-4">
              <q-input
                class="text-bold"
                :disable="visualizar"
                color="purple-ieen"
                v-model="reintegro.monto_Reintegro"
                prefix="$"
                label="Monto"
                hint="Ingrese el monto del reintegro"
                :rules="[(val) => !!val || 'El monto es requerido']"
              />
            </div>
            <div class="col-4">
              <q-input
                class="text-bold"
                :disable="visualizar"
                color="purple-ieen"
                v-model="reintegro.folio_Reintegro"
                label="Folio"
                hint="Ingrese el folio del reintegro"
                :rules="[(val) => !!val || 'El folio es requerido']"
              />
            </div>
            <div
              v-if="solicitud.e_Reintegro && solicitud.estatus != 'Concluido'"
              class="col-12 justify-end q-pt-lg"
            >
              <div class="text-right q-gutter-xs">
                <q-btn
                  label="Eliminar reintegro"
                  @click="eliminar_Reintegro"
                  color="red"
                  icon-right="delete"
                />
              </div>
            </div>
            <div
              v-if="visualizar"
              class="col-12 text-bold text-center text-h6 text-gray-ieen-1 q-pt-lg"
            >
              <div>VER REINTEGRO</div>
              <iframe
                :src="reintegro.comprobante"
                width="100%"
                height="600"
              ></iframe>
            </div>
            <div v-else class="col-4">
              <q-file
                class="text-bold"
                color="purple-ieen"
                bottom-slots
                v-model="reintegro.comprobante"
                label=""
                accept=".jpg, .pdf, image/*"
                counter
                max-files="1"
                :rules="[(val) => !!val || 'El comprobante es requerido']"
              >
                <template v-slot:append>
                  <q-icon name="attachment" @click.stop />
                </template>
                <template v-slot:hint> Archivo </template>
              </q-file>
            </div>
            <div v-if="!visualizar" class="col-12 justify-end q-pt-lg">
              <div class="text-right q-gutter-xs">
                <q-btn
                  color="red"
                  label="Cancelar"
                  @click="actualizarModal(valor)"
                  icon="highlight_off"
                />
                <q-btn
                  color="secondary"
                  label="Guardar"
                  type="submit"
                  icon="save"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>
<script setup>
import { useQuasar, QSpinnerFacebook } from "quasar";
import { storeToRefs } from "pinia";
import { watch } from "vue";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useReintegroStore } from "src/stores/reintegro-store";
import { useComprobarStore } from "src/stores/comprobar-store";

//-----------------------------------------------------------

const $q = useQuasar();
const misSolicitudesStore = useMisSolicitudesStore();
const reintegroStore = useReintegroStore();
const comprobarStore = useComprobarStore();
const { reintegro, modal, visualizar } = storeToRefs(reintegroStore);
const { solicitud } = storeToRefs(misSolicitudesStore);

//-----------------------------------------------------------

watch(solicitud.value, (val) => {
  if (val.id != null) {
    reintegro.value.monto_Reintegro = solicitud.value.monto_Saldo;
  }
});

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  reintegroStore.init_Reintegro();
  reintegroStore.actualizarModal(valor);
  reintegroStore.actualizarVisualizar(valor);
};

const eliminar_Reintegro = async () => {
  $q.dialog({
    title: "Eliminar reintegro",
    message: "¿Esta seguro de eliminar el reintegro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      icon: "delete",
      label: "Sí! eliminar",
    },
    cancel: {
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show();
    const resp = await reintegroStore.delete_Reintegro(
      reintegro.value.solicitud_Id
    );
    if (resp.success) {
      reintegroStore.init_Reintegro();
      misSolicitudesStore.initSolicitud();
      actualizarModal(false);
      comprobarStore.actualizarModal(false);
      await misSolicitudesStore.load_Mis_Solicitudes();
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
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
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
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
  });
};

const onSubmit = async () => {
  $q.dialog({
    title: "Reintegro",
    message: `¿Desea realizar el registro del reintegro del folio ${solicitud.value.folio}?, pasará a recursos financieros`,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      icon: "done",
      color: "secondary",
      label: "Sí! continuar",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    const bodyFormData = new FormData();
    bodyFormData.append("Fecha_Devolucion", reintegro.value.fecha_Reintegro);
    bodyFormData.append("Monto_Reintegro", reintegro.value.monto_Reintegro);
    bodyFormData.append("Comprobante", reintegro.value.comprobante);
    bodyFormData.append("Folio_Reintegro", reintegro.value.folio_Reintegro);

    const resp = await reintegroStore.generar_Reintegro(
      solicitud.value.id,
      bodyFormData
    );
    if (resp.success) {
      await misSolicitudesStore.load_Solicitud(solicitud.value.id);
      await misSolicitudesStore.load_Mis_Solicitudes();
      actualizarModal();
      $q.loading.hide();
      $q.notify({
        type: "positive",
        message: resp.data,
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
    } else {
      $q.loading.hide();
      $q.notify({
        type: "negative",
        message: resp.data,
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
  });
};
</script>
