<template>
  <q-dialog
    v-model="modal_Evidencia_DD"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 700px; max-width: 70vw">
      <div class="flotante">
        <q-card-section class="row">
          <q-img src="../../../assets/IEEN300.png" width="90px" />
          <div class="text-h5 text-gray-ieen-1 text-bold absolute-center">
            REGISTRO DE EVIDENCIA
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
      <q-form @submit="onSubmit">
        <q-card-section>
          <div class="col-12">
            <q-input
              color="purple-ieen"
              v-model="evidenciaDD.descripcion"
              label="Descripción"
              hint="Ingrese descripción"
            />
          </div>
          <div class="col-12 col-xs-12 col-md-12">
            <q-file
              color="purple-ieen"
              bottom-slots
              v-model="evidenciaDD.evidencia"
              label=""
              counter
              accept=".jpg, .png"
              max-files="1"
              lazy-rules
              :rules="[(val) => !!val || 'La evidencia es requerida']"
            >
              <template v-slot:before>
                <q-icon name="image" />
              </template>
              <template v-slot:append>
                <q-icon name="search" @click.stop />
              </template>
              <template v-slot:hint> Evidencia </template>
            </q-file>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="col-12 justify-end">
            <div class="text-right q-gutter-xs">
              <q-btn
                color="red"
                label="Cerrar"
                @click="actualizarModal(false)"
                icon="close"
              />
              <q-btn
                type="submit"
                color="secondary"
                label="Guardar"
                icon="save"
              >
                <template v-slot:loading>
                  <q-spinner-hourglass class="on-left" />
                  Cargando...
                </template>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useEvidenciaStore } from "src/stores/evidencias-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useFacturasStore } from "src/stores/facturas-store";

//-----------------------------------------------------------

const $q = useQuasar();
const evidenciasStore = useEvidenciaStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const facturasStore = useFacturasStore();
const { list_Facturas_By_Solicitud } = storeToRefs(facturasStore);
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { evidenciaDD, modal_Evidencia_DD, list_Evidencias } =
  storeToRefs(evidenciasStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  evidenciasStore.actualizarModalEvidencia(valor);
  evidenciasStore.initEvidenciaDD();
};

const onSubmit = async () => {
  $q.loading.show({
    spinner: QSpinnerFacebook,
    spinnerColor: "purple-ieen",
    spinnerSize: 140,
    backgroundColor: "purple-3",
    message: "Espere un momento, por favor...",
    messageColor: "black",
  });
  let evidenciaFormData = new FormData();
  evidenciaFormData.append("Evidencia", evidenciaDD.value.evidencia);
  evidenciaFormData.append("Descripcion", evidenciaDD.value.descripcion);
  let resp = await evidenciasStore.create_Evidencia_DD(
    solicitud.value.id,
    evidenciaFormData
  );
  let respUpdate = null;
  if (resp.success == true) {
    actualizarModal(false);
    await evidenciasStore.load_Evidencias_DD(solicitud.value.id);
    if (
      solicitud.value.tipo_Solicitud_Gasto == 0 &&
      solicitud.value.borrador == true
    ) {
      if (
        list_Facturas_By_Solicitud.value.length > 0 &&
        list_Evidencias.value.length > 0
      ) {
        $q.dialog({
          title: "¿Ha subido todas sus evidencias y comprobantes?",
          message:
            "Al aceptar se le notificará al responsable de área y ya no podrá agregar más evidencias y/o comprobantes",
          icon: "Warning",
          persistent: true,
          html: true,
          transitionShow: "scale",
          transitionHide: "scale",
          ok: {
            icon: "done",
            color: "secondary",
            label: "Sí! notificar",
          },
          cancel: {
            icon: "close",
            color: "red",
            label: "No, regresar",
          },
        })
          .onOk(async () => {
            solicitud.value.borrador = false;
            respUpdate = await devengarDevengadoStore.update_Solicitud_DD(
              solicitud.value
            );
            if (respUpdate.success) {
              await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
              devengarDevengadoStore.actualizarModalDevengado(false);
            }
          })
          .onCancel(async () => {
            solicitud.value.borrador = true;
            respUpdate = await devengarDevengadoStore.update_Solicitud_DD(
              solicitud.value
            );
            if (respUpdate.success) {
              await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
            }
          });
      } else {
        solicitud.value.borrador = true;
        respUpdate = await devengarDevengadoStore.update_Solicitud_DD(
          solicitud.value
        );
        if (respUpdate.success) {
          await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
        }
      }
    }
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
  $q.loading.hide();
};
</script>
<style scoped>
.flotante {
  position: sticky;
  top: 1px;
  z-index: 999;
  background-color: white;
}
</style>
