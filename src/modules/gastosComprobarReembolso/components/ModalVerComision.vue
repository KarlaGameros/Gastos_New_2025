<template>
  <q-dialog
    v-model="modal_Ver_Comision"
    persistent
    transition-show="jump-right"
    transition-hide="jump-left"
  >
    <q-card style="width: 600px; max-width: 60vw">
      <q-card-section class="row flotante bg-grey-3">
        <q-img src="../../../assets/IEEN300.png" width="90px" />
        <div
          class="text-h5 text-gray-ieen-1 text-bold absolute-center text-center"
        >
          {{ solicitud.folio }}
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
      <q-card-section>
        <q-timeline color="purple-ieen">
          <q-timeline-entry subtitle="Comisión">
            <div><b>Área: </b>{{ solicitud.area }}</div>
            <div><b>Solicitante: </b>{{ solicitud.empleado_Solicitante }}</div>
            <div>
              <b>Responsable de área: </b>{{ solicitud.responsable_Area }}
            </div>
            <div><b>Actividad: </b>{{ solicitud.actividad }}</div>
            <div><b>Destinos: </b>{{ solicitud.destino_String }}</div>
            <div><b>Fecha de salida: </b>{{ solicitud.fecha_Salida }}</div>
            <div><b>Fecha de llegada: </b>{{ solicitud.fecha_LLegada }}</div>
            <div><b>Número de dias: </b>{{ solicitud.no_Dias }}</div>
            <div><b>Número de noches: </b>{{ solicitud.no_Noches }}</div>
            <div>
              <b>Medio de trasnporte: </b>{{ solicitud.medio_Transporte }}
            </div>
            <div>
              <b>Medio de transporte especifico: </b
              >{{ solicitud.medio_Transporte_Especifico }}
            </div>
            <div>
              <b>Pernoctado: </b>
              <q-icon
                size="sm"
                :name="solicitud.pernoctado ? 'done' : 'close'"
                :color="solicitud.pernoctado ? 'green' : 'red'"
              />
            </div>
            <div>
              <b>Observaciones: </b
              >{{
                solicitud.observaciones == null
                  ? "Sin observaciones"
                  : solicitud.observaciones
              }}
            </div>
            <div>
              <b>Itinerario: </b
              >{{
                solicitud.itinerario == null
                  ? "Sin itinerario"
                  : solicitud.itinerario
              }}
            </div>
          </q-timeline-entry>
          <q-timeline-entry></q-timeline-entry>
        </q-timeline>
      </q-card-section>
      <q-card-section class="text-grey-8">
        <hr />
        <i>
          La información corresponde a la comisión seleccionada con folio
          <b>{{ solicitud.folio }}</b>
        </i>
      </q-card-section>
      <div class="col-12 justify-end q-pa-sm">
        <div class="text-right q-gutter-xs">
          <q-btn
            color="red"
            label="Cerrar"
            @click="actualizarModal(false)"
            icon-right="close"
          />
          <q-btn
            @click="seleccionarComision"
            color="secondary"
            label="Seleccionar"
            icon-right="check_circle"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";

//-----------------------------------------------------------------------

const misSolicitudesStore = useMisSolicitudesStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const { solicitud } = storeToRefs(misSolicitudesStore);
const { modal_Ver_Comision, comision_Id } = storeToRefs(devengarDevengadoStore);

//-----------------------------------------------------------------------

const actualizarModal = (valor) => {
  devengarDevengadoStore.actualizarModalVerComision(valor);
};

const seleccionarComision = () => {
  comision_Id.value = solicitud.value.id;
  devengarDevengadoStore.actualizarModalVerComision(false);
};
</script>
