import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useAdministracionStore = defineStore("useAdministracionStore", {
  state: () => ({
    modal: false,
    modalDD: false,
    loading: false,
    pendiente_Firma: false,
    list_Pendientes_Firmas: [],
    list_Pendientes_Administracion_GC_Reem: [],
    list_Recibidas_Administracion_Comision: [],
    list_Pendientes_Administracion_Comision: [],
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalDD(valor) {
      this.modalDD = valor;
    },

    actualizarPendienteFirma(valor) {
      this.pendiente_Firma = valor;
    },

    /******************************************COMISIONES*****************************************************/

    //-----------------------------------------------------------
    //GET PENDIENTES ADMINISTRACION COMISIÓN
    async load_Solicitudes_Administracion() {
      try {
        this.loading = true;
        this.list_Pendientes_Administracion_Comision = [];
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/PendientesAdministracion"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Pendientes_Administracion_Comision = data.map(
                (solicitud) => {
                  return {
                    id: solicitud.id,
                    folio: solicitud.folio,
                    empleado_Registra_Id: solicitud.empleado_Registra_Id,
                    empleado_Registra: solicitud.empleado_Registra,
                    empleado_Solicitante_Id: solicitud.empleado_Solicitante_Id,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    puesto_Empleado_Solicitante_Id:
                      solicitud.puesto_Empleado_Solicitante_Id,
                    puesto_Empleado_Solicitante:
                      solicitud.puesto_Empleado_Solicitante,
                    responsable_Area_Id: solicitud.responsable_Area_Id,
                    responsable_Area: solicitud.responsable_Area,
                    puesto_Responsable_Area_Id:
                      solicitud.puesto_Responsable_Area_Id,
                    puesto_Responsable_Area: solicitud.puesto_Responsable_Area,
                    empleado_Rec_Financieros_Id:
                      solicitud.empleado_Rec_Financieros_Id,
                    empleado_Rec_Financieros:
                      solicitud.empleado_Rec_Financieros,
                    fecha_Salida: solicitud.fecha_Salida,
                    fecha_LLegada: solicitud.fecha_LLegada,
                    pernoctado: solicitud.pernoctado,
                    pernoctado_String: solicitud.pernoctado_String,
                    estatus: solicitud.estatus,
                    monto_Asignado: `$${solicitud.monto_Asignado.toFixed(2)}`,
                    monto_Utilizado: `$${solicitud.monto_Utilizado.toFixed(2)}`,
                    monto_Saldo: `$${solicitud.monto_Saldo.toFixed(2)}`,
                    fecha_Registro: solicitud.fecha_Registro,
                    destino: solicitud.destino,
                    aprobado_Recursos_Financieros:
                      solicitud.aprobado_Recursos_Financieros,
                  };
                }
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
    //GET ADMINISTRACIÓN COMISIÓN
    async load_Recibidas_Administracion() {
      try {
        this.loading = true;
        this.list_Recibidas_Administracion_Comision = [];
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/Administracion"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Recibidas_Administracion_Comision = data.map(
                (solicitud) => {
                  return {
                    id: solicitud.id,
                    folio: solicitud.folio,
                    empleado_Registra_Id: solicitud.empleado_Registra_Id,
                    empleado_Registra: solicitud.empleado_Registra,
                    empleado_Solicitante_Id: solicitud.empleado_Solicitante_Id,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    puesto_Empleado_Solicitante_Id:
                      solicitud.puesto_Empleado_Solicitante_Id,
                    puesto_Empleado_Solicitante:
                      solicitud.puesto_Empleado_Solicitante,
                    responsable_Area_Id: solicitud.responsable_Area_Id,
                    responsable_Area: solicitud.responsable_Area,
                    puesto_Responsable_Area_Id:
                      solicitud.puesto_Responsable_Area_Id,
                    puesto_Responsable_Area: solicitud.puesto_Responsable_Area,
                    empleado_Rec_Financieros_Id:
                      solicitud.empleado_Rec_Financieros_Id,
                    empleado_Rec_Financieros:
                      solicitud.empleado_Rec_Financieros,
                    fecha_Salida: solicitud.fecha_Salida,
                    fecha_LLegada: solicitud.fecha_LLegada,
                    pernoctado_String: solicitud.pernoctado_String,
                    pernoctado: solicitud.pernoctado,
                    estatus: solicitud.estatus,
                    monto_Asignado: `$${solicitud.monto_Asignado.toFixed(2)}`,
                    monto_Utilizado: `$${solicitud.monto_Utilizado.toFixed(2)}`,
                    monto_Saldo: `$${solicitud.monto_Saldo.toFixed(2)}`,
                    fecha_Registro: solicitud.fecha_Registro,
                    destino: solicitud.destino,
                    empleado_Recibe_Administracion:
                      solicitud.empleado_Recibe_Administracion,
                    fecha_Recepcion_Administracion:
                      solicitud.fecha_Recepcion_Administracion,
                  };
                }
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
    //GET PENDIENTES FIRMAS COMISIÓN
    async load_Pendientes_Firmas() {
      try {
        this.loading = true;
        this.list_Pendientes_Firmas = [];
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/PendientesFirmas"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Pendientes_Firmas = data.map((solicitud) => {
                return {
                  id: solicitud.id,
                  folio: solicitud.folio,
                  empleado_Registra_Id: solicitud.empleado_Registra_Id,
                  empleado_Registra: solicitud.empleado_Registra,
                  empleado_Solicitante_Id: solicitud.empleado_Solicitante_Id,
                  empleado_Solicitante: solicitud.empleado_Solicitante,
                  puesto_Empleado_Solicitante_Id:
                    solicitud.puesto_Empleado_Solicitante_Id,
                  puesto_Empleado_Solicitante:
                    solicitud.puesto_Empleado_Solicitante,
                  responsable_Area_Id: solicitud.responsable_Area_Id,
                  responsable_Area: solicitud.responsable_Area,
                  puesto_Responsable_Area_Id:
                    solicitud.puesto_Responsable_Area_Id,
                  puesto_Responsable_Area: solicitud.puesto_Responsable_Area,
                  empleado_Rec_Financieros_Id:
                    solicitud.empleado_Rec_Financieros_Id,
                  empleado_Rec_Financieros: solicitud.empleado_Rec_Financieros,
                  fecha_Salida: solicitud.fecha_Salida,
                  fecha_LLegada: solicitud.fecha_LLegada,
                  pernoctado_String: solicitud.pernoctado_String,
                  pernoctado: solicitud.pernoctado,
                  estatus: solicitud.estatus,
                  monto_Asignado: `$${solicitud.monto_Asignado.toFixed(2)}`,
                  monto_Utilizado: `$${solicitud.monto_Utilizado.toFixed(2)}`,
                  monto_Saldo: `$${solicitud.monto_Saldo.toFixed(2)}`,
                  fecha_Registro: solicitud.fecha_Registro,
                  destino: solicitud.destino,
                  empleado_Recibe_Administracion:
                    solicitud.empleado_Recibe_Administracion,
                  fecha_Recepcion_Administracion:
                    solicitud.fecha_Recepcion_Administracion,
                };
              });
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
    //GET RECIBIR ADMINISTRACIÓN COMISIÓN
    async recibir_Admon(id, tipo) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/RecbibirAdmon/${id}/${tipo}`
        );
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

    /*****************************************GASTOS A COMRPOBAR Y REEMBOLSOS******************************************************/

    //-----------------------------------------------------------
    //GET PENDIENTES RECEPCIÓM GASTOS A COMPROBAR Y REEMBOLSOS
    async load_Pendientes_Recepcion_Devengar_Devengado() {
      try {
        this.loading = true;
        this.list_Pendientes_Administracion_GC_Reem = [];
        const resp = await api.get("/SolicitudesGastos/PendientesRecepcion");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Pendientes_Administracion_GC_Reem = data.map(
                (solicitud) => {
                  return {
                    id: solicitud.id,
                    folio: solicitud.folio,
                    estatus: solicitud.estatus,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    tipo_Solicitud_Gasto: solicitud.tipo_Solicitud_Gasto,
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
                    estatus_Recepcion_Administracion:
                      solicitud.estatus_Recepcion_Administracion,
                    impreso: solicitud.impreso,
                  };
                }
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
    //GET RECIBIR ADMINISTRACIÓN GASTO A COMPROBAR Y REEMBOLSO
    async recibir_Admon_GC_Reem(id, tipo) {
      try {
        const resp = await api.get(
          `/SolicitudesGastos/RecibirAdministracion/${id}?Tipo=${tipo}`
        );
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
});
