<template>
  <template>
    <q-dialog
      v-model="modal_Reintegro"
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
            REINTEGRO DE GASTO A COMPROBAR
            {{
              `POR UN TOTAL DE
            $${
              solicitud.tipo_Solicitud_Gasto == 1
                ? solicitud.monto_Aprobado - solicitud.monto_Utilizado
                : solicitud.monto_Reintegro != null &&
                  solicitud.monto_Reintegro != 0
                ? solicitud.monto_Reintegro
                : solicitud.monto_Saldo
            }`
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
            <div class="col-lg-6 col-md-6 col-sm-12">
              <q-input
                class="text-bold"
                :disable="solicitud.reintegro_Url != null"
                color="purple-ieen"
                v-model="reintegro_DD.fecha_Reintegro"
                type="date"
                label="Fecha"
                hint="Ingrese fecha en la que se realizó el reintegro"
                :rules="[(val) => !!val || 'La fecha es requerida']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <q-input
                class="text-bold"
                :disable="solicitud.reintegro_Url != null"
                color="purple-ieen"
                v-model="reintegro_DD.monto_Reintegro"
                prefix="$"
                label="Monto"
                hint="Ingrese el monto del reintegro"
                :rules="[(val) => !!val || 'El monto es requerido']"
              />
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
              <q-input
                class="text-bold"
                :disable="solicitud.reintegro_Url != null"
                color="purple-ieen"
                v-model="reintegro_DD.folio_Reintegro"
                label="Folio"
                hint="Ingrese el folio del reintegro"
                :rules="[(val) => !!val || 'El folio es requerido']"
              />
            </div>
            <div
              v-if="solicitud.reintegro_Url != null"
              class="col-12 text-bold text-center text-h6 text-gray-ieen-1 q-pt-lg"
            >
              <div>VER REINTEGRO</div>
              <iframe
                :src="reintegro_DD.comprobante_Url"
                width="100%"
                height="600"
              ></iframe>
            </div>
            <div v-else class="col-lg-6 col-md-6 col-sm-12">
              <q-file
                class="text-bold"
                color="purple-ieen"
                bottom-slots
                v-model="reintegro_DD.reintegro"
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
            <div v-if="solicitud.reintegro_Url == null" class="flotanteFooter">
              <q-card-section>
                <div class="col-12 justify-end q-pt-lg">
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
              </q-card-section>
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
import { useReintegroStore } from "src/stores/reintegro-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";

//-----------------------------------------------------------

const $q = useQuasar();
const reintegroStore = useReintegroStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { reintegro_DD, modal_Reintegro } = storeToRefs(reintegroStore);

//-----------------------------------------------------------

watch(solicitud.value, (val) => {
  if (val.id != null) {
    reintegro_DD.value.monto_Reintegro = solicitud.value.monto_Saldo;
  }
});

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  reintegroStore.actualizarModalReintegro(valor);
  reintegroStore.init_Reintegro_DD();
};

const onSubmit = async () => {
  $q.dialog({
    title: "Reintegro",
    message: `¿Desea realizar el registro del reintegro del folio <b>${solicitud.value.folio}</b>?, pasará a recursos financieros`,
    icon: "Warning",
    persistent: true,
    html: true,
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
    bodyFormData.append("Fecha_Reintegro", reintegro_DD.value.fecha_Reintegro);
    bodyFormData.append("Monto_Reintegro", reintegro_DD.value.monto_Reintegro);
    bodyFormData.append("Reintegro", reintegro_DD.value.reintegro);
    bodyFormData.append("Folio_Reintegro", reintegro_DD.value.folio_Reintegro);

    const resp = await reintegroStore.generar_Reintegro_DD(
      solicitud.value.id,
      bodyFormData
    );
    if (resp.success) {
      await devengarDevengadoStore.actualizar_Estatus(
        solicitud.value.id,
        "Pendiente de conclusión"
      );
      await devengarDevengadoStore.load_Solicitud_DD(solicitud.value.id);
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
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
<style scoped>
.flotanteFooter {
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: white;
}
</style>
