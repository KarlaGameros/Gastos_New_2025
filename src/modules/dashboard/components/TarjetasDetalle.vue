<template>
  <q-card class="bg-transparent no-shadow no-border rounded">
    <q-card-section>
      <div class="text-h5 text-bold text-grey-8 q-pb-lg">
        Solicitudes del año: {{ yearFiltro }}
      </div>
      <div class="row q-col-gutter-sm">
        <div
          v-for="area in props.tipo == 'comisiones'
            ? areas_Filtro
            : areas_Filtro_DD"
          :key="area.area_Id"
          class="col-lg-3 col-md-6 col-sm-6 col-xs-12"
        >
          <q-item>
            <q-item-section
              class="q-pa-sm bg-purple-1"
              style="border-radius: 10px"
            >
              <q-item-label
                class="purple-ieen text-subtitle1 text-bold text-purple-ieen"
              >
                {{ area.area_Nombre }}
              </q-item-label>
              <q-item>
                <q-item-section>
                  <q-item-label>
                    Solicitudes: {{ area.no_Solicitudes }}
                  </q-item-label>
                  <q-item-label>
                    Monto erogado: ${{ area.monto_Erogado }}
                  </q-item-label>
                  <q-item-label>
                    Monto ejercido: ${{ area.monto_Utilizado }}
                  </q-item-label>
                  <q-item-label>
                    Monto Reintegrado: ${{ area.monto_Reintegrado }}
                  </q-item-label>
                  <q-item-label> Saldo ${{ area.monto_Saldo }} </q-item-label>
                </q-item-section>
              </q-item>
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useDashboardStore } from "../../../stores/dashboard-store";

//-----------------------------------------------------------

const dasboardStore = useDashboardStore();
const { areas_Filtro, areas_Filtro_DD, yearFiltro } =
  storeToRefs(dasboardStore);
const props = defineProps({
  tipo: {
    type: String,
    required: true,
  },
});
</script>
