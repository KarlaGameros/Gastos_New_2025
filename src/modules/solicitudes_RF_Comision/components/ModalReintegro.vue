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
          <div class="text-h6 text-gray-ieen-1 text-bold absolute-center">
            REINTEGRO A COMISIÓN CON FOLIO <br />
            <div class="text-purple-ieen text-bold text-center">
              {{ solicitud.folio }}
            </div>
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
            <div class="col-lg-4 col-md-6 col-sm-12">
              <q-input
                class="text-bold"
                stack-label
                v-model="reintegro.fecha_Reintegro"
                disable
                type="date"
                label="Fecha"
                hint="Fecha en la que se realizó el reintegro"
              />
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <q-input
                class="text-bold"
                disable
                v-model="reintegro.monto_Reintegro"
                prefix="$"
                label="Monto"
                hint="Monto del reintegro"
              />
            </div>
            <div class="col-lg-4 col-md-6 col-sm-12">
              <q-input
                class="text-bold"
                disable
                v-model="reintegro.folio_Reintegro"
                label="Folio"
                hint="Folio del reintegro"
              />
            </div>
            <div class="col-12 justify-end q-pt-lg">
              <div class="text-right q-gutter-xs">
                <q-btn
                  label="Descargar reintegro"
                  @click="descargar_Reintegro"
                  color="purple-ieen"
                  icon="download"
                />
                <q-btn
                  v-if="!solicitud.r_Reintegro"
                  color="secondary"
                  label="Aprobar reintegro"
                  type="submit"
                  icon="check_circle"
                />
              </div>
            </div>
            <div
              class="col-12 text-bold text-center text-h6 text-gray-ieen-1 q-pt-lg"
            >
              <div>VER REINTEGRO</div>

              <iframe
                :src="reintegro.comprobante"
                width="100%"
                height="600"
              ></iframe>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useReintegroStore } from "src/stores/reintegro-store";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useQuasar, QSpinnerFacebook } from "quasar";

//-----------------------------------------------------------

const $q = useQuasar();
const reintegroStore = useReintegroStore();
const solicitudesRFStore = useSolicitudesRFStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { solicitud } = storeToRefs(misSolicitudesStore);
const { modal, reintegro } = storeToRefs(reintegroStore);

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

const descargar_Reintegro = async () => {
  loadingShow();
  const resp = await reintegroStore.load_Reintegro(solicitud.value.id);
  if (resp.success) {
    const urlImagen = reintegro.value.comprobante;
    fetch(urlImagen)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `R-${solicitud.value.folio}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        $q.notify({
          type: "negative",
          message: "Error al descargar la imagen:",
          error,
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
      });
  }
  $q.loading.hide();
};

const actualizarModal = (valor) => {
  reintegroStore.init_Reintegro();
  reintegroStore.actualizarModal(valor);
};

const onSubmit = async () => {
  $q.dialog({
    html: true,
    title: "Aprobación de reintegro",
    message: `¿Desea aprobar el reintegro de la solicitud con folio <b>${solicitud.value.folio}</b> por la cantidad de ${reintegro.value.monto_Reintegro}?, afectará saldos`,
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Sí! aprobar",
      icon: "check_circle",
    },
    cancel: {
      icon: "close",
      color: "red",
      label: "Cancelar",
    },
  }).onOk(async () => {
    loadingShow();
    const resp = await reintegroStore.aprobar_reintegro(solicitud.value.id);
    if (resp.success) {
      await solicitudesRFStore.load_Solicitudes_RF();
      await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
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
      $q.loading.hide();
      actualizarModal(false);
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
