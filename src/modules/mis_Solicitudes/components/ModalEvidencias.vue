<template>
  <q-dialog
    v-model="modal_Evidencia"
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
      <q-card-section>
        <q-form class="row q-col-gutter-xs" @submit="onSubmit" ref="myForm">
          <div class="col-12">
            <q-input
              color="purple-ieen"
              v-model="evidencia.descripcion"
              label="Descripción"
              hint="Ingrese descripción"
            />
          </div>
          <div class="col-12 col-xs-12 col-md-12">
            <q-file
              color="purple-ieen"
              bottom-slots
              v-model="evidencia.evidencia"
              label=""
              counter
              accept=".jpg, image/*"
              max-files="1"
            >
              <template v-slot:before>
                <q-icon name="attachment" />
              </template>
              <template v-slot:append>
                <q-icon name="search" @click.stop />
              </template>
              <template v-slot:hint> Evidencia </template>
            </q-file>
          </div>
        </q-form>
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
              @click="onSubmit"
            >
              <template v-slot:loading>
                <q-spinner-hourglass class="on-left" />
                Cargando...
              </template>
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useComprobarStore } from "src/stores/comprobar-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onMounted } from "vue";

//-----------------------------------------------------------

const $q = useQuasar();
const comprobacionStore = useComprobarStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { evidencia, modal_Evidencia, is_Editar_Evidencia } =
  storeToRefs(comprobacionStore);
const { solicitud } = storeToRefs(misSolicitudesStore);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  comprobacionStore.actualizarModalEvidencia(valor);
  comprobacionStore.initEvidencia();
};

const onSubmit = async () => {
  if (evidencia.value.evidencia == null) {
    $q.dialog({
      title: "<b>Atención!</b>",
      message: "<strong>No ha subido evidencia.</strong>",
      html: true,
      ok: {
        icon: "close",
        color: "red",
        label: "Cerrar",
      },
    });
  } else {
    $q.loading.show({
      spinner: QSpinnerFacebook,
      spinnerColor: "purple-ieen",
      spinnerSize: 140,
      backgroundColor: "purple-3",
      message: "Espere un momento, por favor...",
      messageColor: "black",
    });
    let evidenciaFormData = new FormData();
    evidenciaFormData.append("Evidencia", evidencia.value.evidencia);
    evidenciaFormData.append("Descripcion", evidencia.value.descripcion);
    let resp;
    if (is_Editar_Evidencia.value == true) {
      // resp = await evidenciaStore.update_evidencia(
      //   evidencia.value.id,
      //   solicitud_gasto.value.id,
      //   evidenciaFormData
      // );
    } else {
      resp = await comprobacionStore.create_Evidencia(
        solicitud.value.id,
        evidenciaFormData
      );
    }
    if (resp.success == true) {
      actualizarModal(false);
      await comprobacionStore.load_Evidencias(solicitud.value.id);
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
</style>
