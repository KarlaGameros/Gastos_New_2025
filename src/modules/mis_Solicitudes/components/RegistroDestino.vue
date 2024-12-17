<template>
  <br />
  <q-form class="row q-col-gutter-md" @submit="onSubmit">
    <div v-if="!visualizar" class="col-lg-4 col-md-4 col-xs-12">
      <q-select
        :disable="visualizar"
        use-input
        @filter="filtro_Estado"
        v-model="estado_Id"
        :options="list_Estados_Filtro"
        label="Estado"
        hint="Seleccione el estado"
        lazy-rules
        :rules="[(val) => !!val || 'El estado es requerido']"
      />
    </div>
    <div v-if="!visualizar" class="col-lg-4 col-md-4 col-xs-12">
      <q-select
        :disable="visualizar"
        use-input
        input-debounce="0"
        v-model="municipio_Id"
        :options="list_Municipios_Filtro"
        @filter="filtro_Municipio"
        label="Municipio"
        hint="Seleccione el municipio"
        lazy-rules
        :rules="[(val) => !!val || 'El municipio es requerido']"
      />
    </div>
    <div v-if="!visualizar" class="col-lg-4 col-md-4 col-xs-12">
      <q-select
        :disable="visualizar"
        use-input
        input-debounce="0"
        @filter="filtro_Localidad"
        v-model="localidad_Id"
        :options="list_Localidades_Filtro"
        label="Localidad"
        hint="Seleccione la localidad"
        lazy-rules
        :rules="[(val) => !!val || 'El municipio es requerido']"
      />
    </div>
    <div v-if="!visualizar" class="col-12 justify-end">
      <div class="text-right q-gutter-xs q-pt-md">
        <q-btn
          v-if="!visualizar"
          color="red"
          label="limpiar"
          @click="limpiar_Destino"
          icon="cleaning_services"
        />
        <q-btn
          v-if="!visualizar"
          :loading="loading"
          type="submit"
          color="secondary"
          label="Agregar"
          icon="add_circle"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Cargando...
          </template>
        </q-btn>
      </div>
    </div>
    <div class="col-12 q-pt-md q-pb-md">
      <q-table
        :rows="list_Destinos"
        :columns="columns"
        :filter="filter"
        :loading="is_Loading"
        :pagination="pagination"
        row-key="id"
        rows-per-page-label="Filas por pagina"
        no-data-label="No hay registros"
        class="my-sticky-header-table"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar.."
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <div v-if="col.name === 'id'">
                <q-btn
                  v-if="!visualizar"
                  flat
                  round
                  color="purple-ieen"
                  icon="delete"
                  @click="eliminarDestino(props.row)"
                >
                  <q-tooltip>Eliminar registro</q-tooltip>
                </q-btn>
              </div>
              <label v-else>{{ col.value }}</label>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </q-form>
</template>
<script setup>
import { storeToRefs } from "pinia";
import { useQuasar, QSpinnerFacebook } from "quasar";
import { useDestinoStore } from "src/stores/destino-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { onBeforeMount, watch, ref } from "vue";
import Swal from "sweetalert2";

//-----------------------------------------------------------

const $q = useQuasar();
const destinoStore = useDestinoStore();
const misSolicitudesStore = useMisSolicitudesStore();
const { list_Estados, list_Municipios, list_Localidades } =
  storeToRefs(destinoStore);
const { solicitud, is_Editar, visualizar } = storeToRefs(misSolicitudesStore);
const { destino, list_Destinos, is_Loading } = storeToRefs(destinoStore);
const estado_Id = ref(null);
const municipio_Id = ref(null);
const localidad_Id = ref(null);
const loading = ref(false);
const list_Estados_Filtro = ref([]);
const list_Municipios_Filtro = ref([]);
const list_Localidades_Filtro = ref([]);

//-----------------------------------------------------------

onBeforeMount(() => {
  cargarEstados();
});

//-----------------------------------------------------------

watch(estado_Id, (val) => {
  if (val != null) {
    cargarMunicipios(val.value);
  }
});

watch(municipio_Id, (val) => {
  if (val != null) {
    cargarLocalidades(val.value);
  }
});

//-----------------------------------------------------------

const cargarEstados = async () => {
  await destinoStore.load_Estados();
  estado_Id.value = list_Estados.value.find((x) => x.value == "18");
};

const cargarMunicipios = async (id) => {
  await destinoStore.load_Municipios(id);
  municipio_Id.value = list_Municipios.value[0];
};

const cargarLocalidades = async (id) => {
  await destinoStore.load_Localidades(id);
  localidad_Id.value = list_Localidades.value[0];
};

const eliminarDestino = async (row) => {
  $q.dialog({
    title: "Eliminar destino!",
    message: "¿Está seguro de eliminar el registro?",
    icon: "Warning",
    persistent: true,
    transitionShow: "scale",
    transitionHide: "scale",
    ok: {
      color: "secondary",
      label: "Si, Eliminar!",
      icon: "delete",
    },
    cancel: {
      color: "red",
      label: "No, Salir!",
      icon: "close",
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
    let resp = null;
    if (is_Editar.value == true) {
      resp = await destinoStore.delete_Destino(row.id);
    } else {
      resp = destinoStore.delete_Destino_Array(row.id);
    }
    if (resp.success) {
      if (is_Editar.value == true) {
        await destinoStore.load_Destinos(row.solicitud_Id);
      }
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

const filtro_Estado = (val, update) => {
  if (val === "") {
    update(() => {
      list_Estados_Filtro.value = list_Estados.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    list_Estados_Filtro.value = list_Estados.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filtro_Municipio = (val, update) => {
  if (val === "") {
    update(() => {
      list_Municipios_Filtro.value = list_Municipios.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    list_Municipios_Filtro.value = list_Municipios.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const filtro_Localidad = (val, update) => {
  if (val === "") {
    update(() => {
      list_Localidades_Filtro.value = list_Localidades.value;
    });
    return;
  }
  update(() => {
    const needle = val.toLowerCase();
    list_Localidades_Filtro.value = list_Localidades.value.filter(
      (v) => v.label.toLowerCase().indexOf(needle) > -1
    );
  });
};

const limpiar_Destino = () => {
  cargarEstados();
};

const onSubmit = async () => {
  let resp = null;
  let filtro = list_Destinos.value.find(
    (x) => x.localidad_Id == localidad_Id.value.value
  );
  if (filtro == undefined) {
    loading.value = true;
    destino.value.estado = estado_Id.value.label;
    destino.value.estado_Id = estado_Id.value.value;
    destino.value.municipio = municipio_Id.value.label;
    destino.value.municipio_Id = municipio_Id.value.value;
    destino.value.localidad = localidad_Id.value.label;
    destino.value.localidad_Id = localidad_Id.value.value;
    if (is_Editar.value == true) {
      resp = await destinoStore.create_Destino(
        solicitud.value.id,
        destino.value
      );
    } else {
      resp = destinoStore.add_Destinos({ ...destino.value });
    }
    if (resp.success) {
      if (is_Editar.value == true)
        await destinoStore.load_Destinos(solicitud.value.id);
      limpiar_Destino();
      cargarEstados();
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
      loading.value = false;
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
      loading.value = false;
    }
  } else {
    $q.dialog({
      title: "<strong>Atención!</strong>",
      html: true,
      message: "<strong>El destino ya se agrego</strong>",
      icon: "Warning",
      persistent: true,
      transitionShow: "scale",
      transitionHide: "scale",
      ok: {
        icon: "close",
        color: "red",
        label: "Cerrar",
      },
    });
  }
};

//-----------------------------------------------------------

const columns = [
  {
    name: "estado",
    align: "center",
    label: "Estado",
    field: "estado",
    sortable: true,
  },
  {
    name: "municipio",
    align: "center",
    label: "Municipio",
    field: "municipio",
    sortable: true,
  },
  {
    name: "localidad",
    align: "center",
    label: "Localidad",
    field: "localidad",
    sortable: true,
  },
  {
    name: "id",
    align: "center",
    label: "Acciones",
    field: "id",
    sortable: false,
  },
];

const pagination = ref({
  page: 1,
  rowsPerPage: 5,
  sortBy: "name",
  descending: false,
});

const filter = ref("");
</script>

<style lang="sass">
.my-sticky-header-table
  .q-table__top,
  thead tr:first-child th
    background-color: #EEEEEE
</style>
