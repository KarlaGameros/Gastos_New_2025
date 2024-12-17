<template>
  <q-dialog
    v-model="modal_Elegir"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section class="row">
        <q-img src="../../../assets/IEEN300.png" width="70px" />
        <div
          class="text-center text-h6 text-bold text-gray-ieen-1 absolute-center"
        >
          {{
            tipo == "reembolso"
              ? "SU SELECCIÓN ES REEMBOLSO: "
              : "SELECCIONE UNA OPCIÓN"
          }}
        </div>
        <q-space />
        <q-btn
          @click="actualizarModal(false)"
          icon="close"
          flat
          round
          dense
          v-close-popup
        />
      </q-card-section>
      <q-card-section class="row flex-center">
        <div class="q-pa-sm text-center">
          <q-btn
            style="width: 230px; border-radius: 8px"
            class="my-card text-center card_box"
            @click="actualizarModal('comision')"
          >
            <q-card-section>
              <q-icon name="currency_exchange" size="lg" color="blue-grey" />
              <div class="text-grey-8 text-bold q-ma-sm">Comisiones</div>
            </q-card-section>
          </q-btn>
        </div>
        <div class="q-pa-sm text-center">
          <q-btn
            style="width: 230px; border-radius: 8px"
            class="my-card text-center card_box"
            @click="actualizarModal('gastoComprobar')"
          >
            <q-card-section>
              <q-icon name="paid" size="lg" color="blue-grey" />
              <div class="text-grey-8 text-bold q-ma-sm">Gasto a comprobar</div>
            </q-card-section>
          </q-btn>
        </div>
        <div class="q-pa-sm text-center">
          <q-btn
            style="width: 230px; border-radius: 8px"
            class="my-card text-center card_box"
            @click="actualizarModal('reembolso')"
          >
            <q-card-section>
              <q-icon name="price_check" size="lg" color="blue-grey" />
              <div class="text-grey-8 text-bold q-ma-sm">Reembolso</div>
            </q-card-section>
          </q-btn>
        </div>
      </q-card-section>
      <!-- <q-card-section v-else class="row flex-center">
        <div class="q-pa-sm text-center">
          <q-btn
            style="width: 230px; border-radius: 8px"
            class="my-card text-center card_box"
            @click="actualizarModalReembolso('porComision')"
          >
            <q-card-section>
              <q-icon name="price_check" size="lg" color="blue-grey" />
              <div class="text-grey-8 text-bold q-ma-sm">Por comisión</div>
            </q-card-section>
          </q-btn>
        </div>
        <div class="q-pa-sm text-center">
          <q-btn
            style="width: 230px; border-radius: 8px"
            class="my-card text-center card_box"
            @click="actualizarModalReembolso('otro')"
          >
            <q-card-section>
              <q-icon name="attach_money" size="lg" color="blue-grey" />
              <div class="text-grey-8 text-bold q-ma-sm">Otro</div>
            </q-card-section>
          </q-btn>
        </div>
      </q-card-section> -->
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";

//-----------------------------------------------------------

const $q = useQuasar();
const misSolicitudesStore = useMisSolicitudesStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { solicitud } = storeToRefs(devengarDevengadoStore);
const { modal_Elegir } = storeToRefs(misSolicitudesStore);
const tipo = ref(null);

//-----------------------------------------------------------

const actualizarModal = (valor) => {
  tipo.value = valor;
  if (valor == "comision") {
    misSolicitudesStore.actualizarModal(true);
    misSolicitudesStore.actualizarModalElegir(false);
  } else if (valor == "gastoComprobar") {
    solicitud.value.borrador = false;
    devengarDevengadoStore.actualizarModalDevengar(true);
    misSolicitudesStore.actualizarModalElegir(false);
  } else if (valor == "reembolso") {
    solicitud.value.borrador = true;
    devengarDevengadoStore.actualizarModalDevengado(true);
    misSolicitudesStore.actualizarModalElegir(false);
  }
};

const actualizarModalReembolso = (valor) => {};
</script>
<style scoped>
.card_box:hover {
  transform: scale(0.9);
  box-shadow: 0px 0px 20px 1px #7e8a9c3f;
  border: 1px solid rgba(232, 213, 233, 0.454);
}
</style>
