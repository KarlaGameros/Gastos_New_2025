<template>
  <apexchart
    height="400"
    type="bar"
    :options="pospes_options"
    :series="props.tipo == 'comisiones' ? series_Comisiones : series_DD"
  ></apexchart>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { ref, watch } from "vue";
import { useDashboardStore } from "../stores/dashboard-store";

//-----------------------------------------------------------

const dasboardStore = useDashboardStore();
const {
  montos_Utilizados,
  montos_Utilizados_DV,
  montos_Erogados,
  montos_Erogados_DV,
} = storeToRefs(dasboardStore);
const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
const props = defineProps({
  tipo: {
    type: String,
    required: true,
  },
});
const pospes_options = ref({
  chart: {
    type: "bar",
    height: 400,
    id: "apex-column",
  },
  xaxis: {
    type: "category",
    categories: meses,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return "$ " + val;
      },
    },
  },
});
const series_Comisiones = ref([
  {
    name: "Monto asignado",
    data: montos_Erogados.value,
    color: "#a25eb5",
  },
  {
    name: "Monto utilizado",
    data: montos_Utilizados.value,
    color: "#673e84",
  },
]);

const series_DD = ref([
  {
    name: "Monto asignado",
    data: montos_Erogados_DV.value,
    color: "#a25eb5",
  },
  {
    name: "Monto utilizado",
    data: montos_Utilizados_DV.value,
    color: "#673e84",
  },
]);

//-----------------------------------------------------------

watch(montos_Erogados, (nuevoValor, viejoValor) => {
  if (nuevoValor != viejoValor) {
    series_Comisiones.value[0].data = nuevoValor;
  }
});

watch(montos_Erogados_DV, (nuevoValor, viejoValor) => {
  if (nuevoValor != viejoValor) {
    series_DD.value[0].data = nuevoValor;
  }
});

watch(montos_Utilizados, (nuevoValor, viejoValor) => {
  if (nuevoValor != viejoValor) {
    series_Comisiones.value[1].data = nuevoValor;
  }
});

watch(montos_Utilizados_DV, (nuevoValor, viejoValor) => {
  if (nuevoValor != viejoValor) {
    series_DD.value[1].data = nuevoValor;
  }
});
</script>
