<template>
  <q-card class="no-shadow no-border rounded row flex-center">
    <q-card-section>
      <q-item-section class="q-pa-lg bg-purple-1" style="border-radius: 10px">
        <q-item-label class="purple-ieen text-subtitle1 text-bold text-grey-9">
          Total de solicitudes:
          {{
            props.tipo == "comisiones"
              ? solicitudes_Totales
              : props.tipo == "gc"
              ? solicitudes_filtro_DD.filter((x) => x.tipo_Solicitud_Gasto == 1)
                  .length
              : solicitudes_filtro_DD.filter((x) => x.tipo_Solicitud_Gasto == 0)
                  .length
          }}
        </q-item-label>
      </q-item-section>
    </q-card-section>
    <q-card-section>
      <q-item-section class="q-pa-lg bg-purple-1" style="border-radius: 10px">
        <q-item-label class="purple-ieen text-subtitle1 text-bold text-grey-9">
          Total asignado: $
          {{
            props.tipo == "comisiones"
              ? total_Erogado.toLocaleString("en-US")
              : props.tipo == "gc"
              ? monto_Aprobado_GC.toLocaleString("en-US")
              : monto_Aprobado_Reem.toLocaleString("en-US")
          }}
        </q-item-label>
      </q-item-section>
    </q-card-section>
    <q-card-section>
      <q-item-section class="q-pa-lg bg-purple-1" style="border-radius: 10px">
        <q-item-label class="purple-ieen text-subtitle1 text-bold text-grey-9">
          Total ejercido: $
          {{
            props.tipo == "comisiones"
              ? total_Utilizado.toLocaleString("en-US")
              : props.tipo == "gc"
              ? monto_Utilizado_GC.toLocaleString("en-US")
              : monto_Utilizado_Reem.toLocaleString("en-US")
          }}
        </q-item-label>
      </q-item-section>
    </q-card-section>
    <q-card-section>
      <q-item-section class="q-pa-lg bg-purple-1" style="border-radius: 10px">
        <q-item-label class="purple-ieen text-subtitle1 text-bold text-grey-9">
          Total reintegrado: $
          {{
            props.tipo == "comisiones"
              ? total_Reitegrado.toLocaleString("en-US")
              : props.tipo == "gc"
              ? monto_Reintegrado_GC.toLocaleString("en-US")
              : monto_Reintegrado_Reem.toLocaleString("en-US")
          }}
        </q-item-label>
      </q-item-section>
    </q-card-section>
    <q-card-section v-if="props.tipo == 'comisiones'">
      <q-item-section class="q-pa-lg bg-purple-1" style="border-radius: 10px">
        <q-item-label class="purple-ieen text-subtitle1 text-bold text-grey-9">
          Total saldo: $
          {{
            props.tipo == "comisiones"
              ? total_Saldo.toLocaleString("en-US")
              : total_Saldo_DV.toLocaleString("en-US")
          }}
        </q-item-label>
      </q-item-section>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useDashboardStore } from "../../../stores/dashboard-store";

//-----------------------------------------------------------

const $q = useQuasar();
const dasboardStore = useDashboardStore();
const {
  solicitudes_Totales,
  solicitudes_Totales_DV,
  total_Erogado,
  total_Erogado_DV,
  total_Utilizado,
  total_Utilizado_DV,
  total_Reitegrado,
  total_Reitegrado_DV,
  total_Saldo,
  total_Saldo_DV,
  solicitudes_filtro_DD,
  monto_Aprobado_GC,
  monto_Aprobado_Reem,
  monto_Utilizado_GC,
  monto_Utilizado_Reem,
  monto_Reintegrado_GC,
  monto_Reintegrado_Reem,
} = storeToRefs(dasboardStore);
const props = defineProps({
  tipo: {
    type: String,
    required: true,
  },
});
</script>
