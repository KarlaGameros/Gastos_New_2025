import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudesAreaGCReembolsoStore = defineStore(
  "useSolicitudesAreaGCReembolsoStore",
  {
    state: () => ({
      modal: false,
      loading: false,
      recargar: false,
      list_Historial_GC_Reembolso: [],
      list_Historial_GC_Reembolso_Filtro: [],
      list_Solicitudes_ByArea_GC_Reembolso: [],
      list_Solicitudes_ByArea_GC_Reembolso_Filtro: [],
    }),
    actions: {
      //-----------------------------------------------------------
      actualizarRecargar(valor) {
        this.recargar = valor;
      },

      //-----------------------------------------------------------
      actualizarModal(valor) {
        this.modal = valor;
      },

      //-----------------------------------------------------------
      async load_Solicitudes_Area_Devengar_Devengado() {
        try {
          this.loading = true;
          const resp = await api.get("/SolicitudesGastos/SolicitudesRA");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              if (data) {
                let list = data.map((solicitud) => {
                  return {
                    id: solicitud.id,
                    folio: solicitud.folio,
                    tipo_Solicitud_Gasto: solicitud.tipo_Solicitud_Gasto,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    empleado_Solicitante_Id: solicitud.empleado_Solicitante_Id,
                    puesto_Empleado_Solicitante_Id:
                      solicitud.puesto_Empleado_Solicitante_Id,
                    area_Id: solicitud.area_Id,
                    responsable_Area_Id: solicitud.responsable_Area_Id,
                    puesto_Responsable_Area_Id:
                      solicitud.puesto_Responsable_Area_Id,
                    empleado_Administracion_Id:
                      solicitud.empleado_Administracion_Id,
                    puesto_Empleado_Administracion_Id:
                      solicitud.puesto_Empleado_Administracion_Id,
                    aprobado_Repsonsable_Area:
                      solicitud.aprobado_Repsonsable_Area,
                    aprobado_Administracion: solicitud.aprobado_Administracion,
                    fecha_Aprobacion_Responsable_Area:
                      solicitud.fecha_Aprobacion_Responsable_Area,
                    fecha_Aprobacion_Administracion:
                      solicitud.fecha_Aprobacion_Administracion,
                    fecha_Registro: solicitud.fecha_Registro,
                    fecha_Solicitud: solicitud.fecha_Solicitud,
                    motivo: solicitud.motivo,
                    observaciones: solicitud.observaciones,
                    monto_Solicitado: solicitud.monto_Solicitado,
                    monto_Utilizado: solicitud.monto_Utilizado,
                    monto_Aprobado: solicitud.monto_Aprobado,
                    monto_Saldo: solicitud.monto_Saldo,
                    tipo_Evento: solicitud.tipo_Evento,
                    gastos_Representacion: solicitud.gastos_Representacion,
                    borrador: solicitud.borrador,
                    estatus: solicitud.estatus,
                  };
                });
                this.list_Solicitudes_ByArea_GC_Reembolso = list
                  .filter((x) => !x.aprobado_Repsonsable_Area)
                  .sort((a, b) => b.id - a.id);
              }
            } else {
              return { success, data };
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        } finally {
          this.loading = false;
        }
      },

      //-----------------------------------------------------------
      async load_Historial_DD() {
        try {
          this.loading = true;
          const resp = await api.get("/SolicitudesGastos/AprobadosJA");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              if (data) {
                let list = data.map((solicitud) => {
                  return {
                    id: solicitud.id,
                    folio: solicitud.folio,
                    estatus: solicitud.estatus,
                    tipo_Solicitud_Gasto: solicitud.tipo_Solicitud_Gasto,
                    empleado_Solicitante_Id: solicitud.empleado_Solicitante_Id,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    puesto_Empleado_Solicitante_Id:
                      solicitud.puesto_Empleado_Solicitante_Id,
                    area_Id: solicitud.area_Id,
                    responsable_Area_Id: solicitud.responsable_Area_Id,
                    responsable_Area: solicitud.responsable_Area,
                    puesto_Responsable_Area_Id:
                      solicitud.puesto_Responsable_Area_Id,
                    empleado_Administracion_Id:
                      solicitud.empleado_Administracion_Id,
                    puesto_Empleado_Administracion_Id:
                      solicitud.puesto_Empleado_Administracion_Id,
                    empleado_Rec_Financieros_Id:
                      solicitud.empleado_Rec_Financieros_Id,
                    empleado_Rec_Financieros:
                      solicitud.empleado_Rec_Financieros,
                    puesto_Empleado_Rec_Financieros_Id:
                      solicitud.puesto_Empleado_Rec_Financieros_Id,
                    puesto_Empleado_Rec_Financieros:
                      solicitud.puesto_Empleado_Rec_Financieros,
                    aprobado_Repsonsable_Area:
                      solicitud.aprobado_Repsonsable_Area,
                    aprobado_Administracion: solicitud.aprobado_Administracion,
                    fecha_Aprobacion_Responsable_Area:
                      solicitud.fecha_Aprobacion_Responsable_Area,
                    fecha_Aprobacion_Administracion:
                      solicitud.fecha_Aprobacion_Administracion,
                    fecha_Registro: solicitud.fecha_Registro,
                    fecha_Solicitud: solicitud.fecha_Solicitud,
                    motivo: solicitud.motivo,
                    observaciones: solicitud.observaciones,
                    monto_Solicitado: solicitud.monto_Solicitado,
                    monto_Utilizado: solicitud.monto_Utilizado,
                    monto_Aprobado: solicitud.monto_Aprobado,
                    monto_Saldo: solicitud.monto_Saldo,
                    monto_Reintegro: solicitud.monto_Reintegro,
                    tipo_Evento: solicitud.tipo_Evento,
                    gastos_Representacion: solicitud.gastos_Representacion,
                    borrador: solicitud.borrador,
                    estatus_Recepcion_Administracion:
                      solicitud.estatus_Recepcion_Administracion,
                    reintegro_Url: solicitud.reintegro_Url,
                  };
                });
                this.list_Historial_GC_Reembolso = list.sort(
                  (a, b) => b.id - a.id
                );
              }
            } else {
              return { success, data };
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        } finally {
          this.loading = false;
        }
      },

      //-----------------------------------------------------------
      async aprobar_Solicitud_Devengar_Devengado(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/AprobarJA/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            return { success, data };
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async rechazar_Solicitud_Devengar_Devengado(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/RechazarJA/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            return { success, data };
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (error) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },
    },
  }
);
