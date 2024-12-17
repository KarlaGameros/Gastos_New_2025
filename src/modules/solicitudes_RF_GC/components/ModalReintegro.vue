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
              solicitud.monto_Reintegro != null
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
        <q-card-section class="row q-col-gutter-xs">
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              class="text-bold"
              disable
              color="purple-ieen"
              v-model="reintegro_DD.fecha_Devolucion"
              label="Fecha en la que se realizó el reintegro"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              class="text-bold"
              disable
              color="purple-ieen"
              v-model="reintegro_DD.monto_Reintegro"
              prefix="$"
              label="Monto"
            />
          </div>
          <div class="col-lg-6 col-md-6 col-sm-12">
            <q-input
              class="text-bold"
              disable
              color="purple-ieen"
              v-model="reintegro_DD.folio_Reintegro"
              label="Folio"
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
        </q-card-section>
      </q-card>
    </q-dialog>
  </template>
</template>
<script setup>
import { watch } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useReintegroStore } from "src/stores/reintegro-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";

//-----------------------------------------------------------

const reintegroStore = useReintegroStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { reintegro_DD, modal_Reintegro } = storeToRefs(reintegroStore);

//-----------------------------------------------------------

watch(solicitud.value, (val) => {
  if (val.id != null && val.reintegro_Url == null) {
    reintegro_DD.value.monto_Reintegro = solicitud.value.monto_Saldo;
  }
});

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  reintegroStore.actualizarModal(valor);
};
</script>
