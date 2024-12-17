<template>
  <q-dialog
    v-model="modal_filtro"
    persistent
    transition-show="scale"
    transition-hide="scale"
  >
    <q-card style="width: 900px; max-width: 90vw">
      <div class="flotante">
        <q-card-section class="row">
          <q-img src="../../../assets/IEEN300.png" width="90px" />
          <div class="text-h5 text-gray-ieen-1 text-bold absolute-center">
            FILTRAR
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
        <q-form @submit="onSubmit">
          <div class="row">
            <div class="text-subtitle1 text-gray-ieen-1 text-bold">
              Seleccione las áreas de las que desee que se aplique el filtro
            </div>
            <div class="col-12">
              <q-checkbox
                size="lg"
                class="text-bold text-subtitle1"
                left-label
                v-model="areasTodos"
                :label="textoAreaTodos"
                color="green"
                checked-icon="task_alt"
                unchecked-icon="highlight_off"
              />
            </div>
            <div class="col-6">
              <q-list bordered>
                <q-item
                  v-for="area in props.tipo == 'comisiones'
                    ? areas.filter((x) => !x.area_Nombre.includes('CME'))
                    : areas_DD.filter((x) => !x.area_Nombre.includes('CME'))"
                  :key="area"
                >
                  <q-item-section class="text-gray-ieen-1 text-bold">{{
                    area.area_Nombre
                  }}</q-item-section>
                  <q-item-section avatar>
                    <q-btn
                      size="sm"
                      round
                      :color="area.activo == true ? 'green' : 'red-5'"
                      :icon="area.activo == true ? 'done' : 'close'"
                      @click="area.activo = !area.activo"
                    ></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
            <div class="col-6">
              <q-list bordered>
                <q-item
                  v-for="area in props.tipo == 'comisiones'
                    ? areas.filter((x) => x.area_Nombre.includes('CME'))
                    : areas_DD.filter((x) => x.area_Nombre.includes('CME'))"
                  :key="area"
                >
                  <q-item-section class="text-gray-ieen-1 text-bold">{{
                    area.area_Nombre
                  }}</q-item-section>
                  <q-item-section avatar>
                    <q-btn
                      size="sm"
                      round
                      :color="area.activo == true ? 'green' : 'red-5'"
                      :icon="area.activo == true ? 'done' : 'close'"
                      @click="area.activo = !area.activo"
                    ></q-btn>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
          <div class="flotanteFooter">
            <div class="col-12 justify-end">
              <div class="text-right q-gutter-xs">
                <q-btn
                  color="red"
                  label="Cancelar"
                  @click="actualizarModal()"
                  icon="highlight_off"
                />
                <q-btn
                  type="submit"
                  color="secondary"
                  label="Filtrar"
                  icon="filter_alt"
                >
                </q-btn>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { ref, watch, watchEffect } from "vue";
import { useDashboardStore } from "../../../stores/dashboard-store";

//-----------------------------------------------------------

const $q = useQuasar();
const dasboardStore = useDashboardStore();
const {
  areas,
  areas_DD,
  areas_Gastos,
  areas_Gastos_DV,
  areas_Filtro,
  areas_Filtro_DD,
  modal_filtro,
  solicitudes_filtro,
  solicitudes_filtro_DD,
  solicitudes_filtro_org,
  solicitudes_filtro_org_DD,
  fecha,
  total_Erogado,
  total_Erogado_DV,
  solicitudes_Totales,
  solicitudes_Totales_DV,
  total_Utilizado,
  total_Utilizado_DV,
  total_Reitegrado,
  total_Reitegrado_DV,
  total_Saldo,
  total_Saldo_DV,
  areasTodos,
} = storeToRefs(dasboardStore);
let textoAreaTodos = ref("Seleccionar todos");
const props = defineProps({
  tipo: {
    type: String,
  },
});

//-----------------------------------------------------------

watchEffect(() => {
  textoAreaTodos.value =
    areasTodos.value == true ? "Deshabilitar todos" : "Seleccionar Todos";
  if (props.tipo == "comisiones") {
    areas_Gastos.value.forEach((element) => {
      element.activo = areasTodos.value;
    });
  } else {
    areas_Gastos_DV.value.forEach((element) => {
      element.activo = areasTodos.value;
    });
  }
});

watch(areas_Gastos, (val) => {
  if (val.length > 0) {
    textoAreaTodos.value =
      areasTodos.value == true ? "Deshabilitar todos" : "Seleccionar Todos";
    areas_Gastos.value.forEach((element) => {
      element.activo = areasTodos.value;
    });
  }
});

watch(areas_Gastos_DV, (val) => {
  if (val.length > 0) {
    textoAreaTodos.value =
      areasTodos.value == true ? "Deshabilitar todos" : "Seleccionar Todos";
    areas_Gastos_DV.value.forEach((element) => {
      element.activo = areasTodos.value;
    });
  }
});

//-----------------------------------------------------------

const actualizarModal = () => {
  dasboardStore.actualizar_modal_filtro(false);
};

const onSubmit = () => {
  if (areas.value.find((x) => x.activo == true)) {
    const solicitudes =
      props.tipo == "comisiones"
        ? solicitudes_filtro_org.value
        : solicitudes_filtro_org_DD.value;
    const areas =
      props.tipo == "comisiones"
        ? areas_Gastos.value
        : areas_Gastos_DV.value
            .filter((x) => x.activo == true)
            .map((x) => x.area_Id);
    if (props.tipo == "comisiones") {
      solicitudes_filtro.value = solicitudes.filter((x) =>
        areas.includes(x.area_Id)
      );
    } else {
      solicitudes_filtro_DD.value = solicitudes.filter((x) =>
        areas.includes(x.area_Id)
      );
    }

    if (fecha.value != null && fecha.value != undefined) {
      const fecha_Inicio = new Date(fecha.value.from);
      const fecha_Fin = new Date(fecha.value.to);
      solicitudes_filtro.value = solicitudes_filtro.value.filter((element) => {
        const inicio = Date.parse(element.fecha_Salida);
        const fin = Date.parse(element.fecha_LLegada);
        return inicio >= fecha_Inicio && fin <= fecha_Fin;
      });
    }
    const initialValue = 0;
    if (props.tipo == "comisiones") {
      areas_Filtro.value = areas_Gastos.value.filter((x) => x.activo == true);
      solicitudes_Totales.value = areas_Filtro.value.reduce(
        (accumulator, area) => accumulator + area.no_Solicitudes,
        initialValue
      );
      total_Erogado.value = areas_Filtro.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Erogado.replace("$", "").replace(",", "")),
        initialValue
      );
      total_Utilizado.value = areas_Filtro.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Utilizado.replace("$", "").replace(",", "")),
        initialValue
      );
      total_Reitegrado.value = areas_Filtro.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Reintegrado.replace("$", "").replace(",", "")),
        initialValue
      );
      total_Saldo.value = areas_Filtro.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Saldo.replace("$", "").replace(",", "")),
        initialValue
      );
    } else {
      areas_Filtro_DD.value = areas_Gastos_DV.value.filter(
        (x) => x.activo == true
      );
      solicitudes_Totales_DV.value = areas_Filtro_DD.value.reduce(
        (accumulator, area) => accumulator + area.no_Solicitudes,
        initialValue
      );
      total_Erogado_DV.value = areas_Filtro_DD.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Erogado.replace("$", "").replace(",", "")),
        initialValue
      );
      total_Utilizado_DV.value = areas_Filtro_DD.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Utilizado.replace("$", "").replace(",", "")),
        initialValue
      );
      total_Reitegrado_DV.value = areas_Filtro_DD.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Reintegrado.replace("$", "").replace(",", "")),
        initialValue
      );
      total_Saldo_DV.value = areas_Filtro_DD.value.reduce(
        (accumulator, area) =>
          accumulator +
          parseFloat(area.monto_Saldo.replace("$", "").replace(",", "")),
        initialValue
      );
    }

    actualizarModal();
  } else {
    $q.dialog({
      title: "No ha seleccionado áreas",
      message: `Es necesario seleccionar minimo 1 área para hacer el filtro`,
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: false,
      cancel: {
        color: "red",
        label: "Cerrar",
      },
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
  margin-top: auto;
  width: 100%;
  position: sticky;
  bottom: 0;
  padding: 10px;
  background-color: white;
}
</style>
