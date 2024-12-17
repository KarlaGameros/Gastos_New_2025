import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudesGCReemRFStore = defineStore(
  "useSolicitudesGCReemRFStore",
  {
    state: () => ({
      modalDevengar: false,
      modalDevengado: false,
      is_loading: false,
      visualizar: false,
      list_Solicitudes_RF_GC: [],
      list_Solicitudes_RF_Reembolso: [],
      list_Solicitudes_RF_GC_Aprobado: [],
      list_Solicitudes_RF_Reembolso_Aprobado: [],
      list_Solicitudes_RF_GC_Rechazada: [],
      list_Solicitudes_RF_Reembolso_Rechazada: [],
      solicitudRF: {
        id: null,
        folio: null,
        area_Id: null,
        empleado_Solicitante_Id: null,
        puesto_Empleado_Solicitante_Id: null,
        responsable_Area_Id: null,
        puesto_Responsable_Area_Id: null,
        fecha_Salida: null,
        fecha_LLegada: null,
        no_Dias: null,
        no_Noches: null,
        borrador: false,
        pernoctado: false,
        actividad: null,
        medio_Transporte: null,
        medio_Transporte_Especifico: null,
        vehiculo_Id: null,
        rol: null,
        saldo_Cero: false,
        observaciones: null,
        gastos_Viaje: null,
        itinerario: null,
        responsable_Administracion_Id: null,
        responsable_Administracion: null,
        puesto_Responsable_Administracion_Id: null,
        puesto_Responsable_Administracion: null,
        area: null,
        empleado_Registra_Id: null,
        empleado_Registra: null,
        empleado_Solicitante: null,
        puesto_Empleado_Solicitante: null,
        responsable_Area: null,
        puesto_Responsable_Area: null,
        empleado_Rec_Financieros_Id: null,
        empleado_Rec_Financieros: null,
        puesto_Empleado_Rec_Financieros_Id: null,
        puesto_Empleado_Rec_Financieros: null,
        empleado_Recibe_Administracion_Id: null,
        empleado_Recibe_Administracion: null,
        puesto_Empleado_Recibe_Administracion_Id: null,
        puesto_Empleado_Recibe_Administracion: null,
        pernoctado_String: null,
        estatus: null,
        aprobado_Responsable_Area: null,
        aprobado_Recursos_Financieros: null,
        recibido_Administracion: false,
        monto_Asignado: null,
        monto_Utilizado: null,
        monto_Reintegro: null,
        monto_Saldo: null,
        fecha_Registro: null,
        vehiculo: null,
        destino_String: null,
        saldo_Cero_String: null,
        fecha_Aprobacion_JA: null,
        fecha_Aprobacion_RF: null,
        fecha_Impresion: null,
        fecha_Recepcion_Administracion: null,
        forma_Pago: null,
        fecha_Pago: null,
        fecha_Pago_Largo: null,
        impreso: false,
        e_Informe_Actividades: false,
        e_Comprobacion_Gasto: false,
        e_Reintegro: false,
        e_Evidencias: false,
        tipo_Recibido: null,
        r_Reintegro: null,
      },
      aprobarInporte: {
        importe: null,
      },
    }),
    actions: {
      //-----------------------------------------------------------
      initSolicitudRF() {
        this.solicitudRF.id = null;
        this.solicitudRF.folio = null;
        this.solicitudRF.area_Id = null;
        this.solicitudRF.empleado_Solicitante_Id = null;
        this.solicitudRF.puesto_Empleado_Solicitante_Id = null;
        this.solicitudRF.responsable_Area_Id = null;
        this.solicitudRF.puesto_Responsable_Area_Id = null;
        this.solicitudRF.fecha_Salida = null;
        this.solicitudRF.fecha_LLegada = null;
        this.solicitudRF.no_Dias = null;
        this.solicitudRF.no_Noches = null;
        this.solicitudRF.borrador = false;
        this.solicitudRF.pernoctado = false;
        this.solicitudRF.actividad = null;
        this.solicitudRF.medio_Transporte = null;
        this.solicitudRF.medio_Transporte_Especifico = null;
        this.solicitudRF.vehiculo_Id = null;
        this.solicitudRF.rol = null;
        this.solicitudRF.saldo_Cero = false;
        this.solicitudRF.observaciones = null;
        this.solicitudRF.gastos_Viaje = null;
        this.solicitudRF.itinerario = null;
        this.solicitudRF.responsable_Administracion_Id = null;
        this.solicitudRF.responsable_Administracion = null;
        this.solicitudRF.puesto_Responsable_Administracion_Id = null;
        this.solicitudRF.puesto_Responsable_Administracion = null;
        this.solicitudRF.area = null;
        this.solicitudRF.empleado_Registra_Id = null;
        this.solicitudRF.empleado_Registra = null;
        this.solicitudRF.empleado_Solicitante = null;
        this.solicitudRF.puesto_Empleado_Solicitante = null;
        this.solicitudRF.responsable_Area = null;
        this.solicitudRF.puesto_Responsable_Area = null;
        this.solicitudRF.empleado_Rec_Financieros_Id = null;
        this.solicitudRF.empleado_Rec_Financieros = null;
        this.solicitudRF.puesto_Empleado_Rec_Financieros_Id = null;
        this.solicitudRF.puesto_Empleado_Rec_Financieros = null;
        this.solicitudRF.empleado_Recibe_Administracion_Id = null;
        this.solicitudRF.empleado_Recibe_Administracion = null;
        this.solicitudRF.puesto_Empleado_Recibe_Administracion_Id = null;
        this.solicitudRF.puesto_Empleado_Recibe_Administracion = null;
        this.solicitudRF.pernoctado_String = null;
        this.solicitudRF.estatus = null;
        this.solicitudRF.aprobado_Responsable_Area = null;
        this.solicitudRF.aprobado_Recursos_Financieros = null;
        this.solicitudRF.recibido_Administracion = false;
        this.solicitudRF.monto_Asignado = null;
        this.solicitudRF.monto_Utilizado = null;
        this.solicitudRF.monto_Reintegro = null;
        this.solicitudRF.monto_Saldo = null;
        this.solicitudRF.fecha_Registro = null;
        this.solicitudRF.vehiculo = null;
        this.solicitudRF.destino_String = null;
        this.solicitudRF.saldo_Cero_String = null;
        this.solicitudRF.fecha_Aprobacion_JA = null;
        this.solicitudRF.fecha_Aprobacion_RF = null;
        this.solicitudRF.fecha_Impresion = null;
        this.solicitudRF.fecha_Recepcion_Administracion = null;
        this.solicitudRF.forma_Pago = null;
        this.solicitudRF.fecha_Pago = null;
        this.solicitudRF.fecha_Pago_Largo = null;
        this.solicitudRF.impreso = false;
        this.solicitudRF.e_Informe_Actividades = false;
        this.solicitudRF.e_Comprobacion_Gasto = false;
        this.solicitudRF.e_Reintegro = false;
        this.solicitudRF.e_Evidencias = false;
        this.solicitudRF.tipo_Recibido = null;
        this.solicitudRF.r_Reintegro = null;
        this.solicitudRF.destinos = [];
      },

      actualizarModalDevengar(valor) {
        this.modalDevengar = valor;
      },

      actualizarModalDevengado(valor) {
        this.modalDevengado = valor;
      },

      //-----------------------------------------------------------
      async load_Solicitudes_RF_Devengar_Devengado() {
        try {
          this.is_loading = true;
          const resp = await api.get("/SolicitudesGastos/SolicitudesRF");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              if (data) {
                let list = data.map((solicitud) => {
                  let fecha = solicitud.fecha_Solicitud
                    .split(" ")[0]
                    .split("-");
                  return {
                    id: solicitud.id,
                    estatus: solicitud.estatus,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    folio: solicitud.folio,
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
                    fecha_Solicitud: `${fecha[2]}-${fecha[1]}-${fecha[0]}`,
                    motivo: solicitud.motivo,
                    observaciones: solicitud.observaciones,
                    monto_Solicitado: solicitud.monto_Solicitado,
                    monto_Utilizado: solicitud.monto_Utilizado,
                    monto_Aprobado: solicitud.monto_Aprobado,
                    monto_Saldo: solicitud.monto_Saldo,
                    tipo_Evento: solicitud.tipo_Evento,
                    gastos_Representacion: solicitud.gastos_Representacion,
                    borrador: solicitud.borrador,
                    impreso: solicitud.impreso,
                    pagado: solicitud.pagado,
                    folio_Solicitud_Gasto_Comprobar:
                      solicitud.folio_Solicitud_Gasto_Comprobar,
                  };
                });
                this.list_Solicitudes_RF_GC = list
                  .filter((x) => x.tipo_Solicitud_Gasto == 1)
                  .sort((a, b) => b.id - a.id);
                this.list_Solicitudes_RF_Reembolso = list
                  .filter((x) => x.tipo_Solicitud_Gasto == 0)
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
          this.is_loading = false;
        }
      },

      //-----------------------------------------------------------
      async load_Solicitudes_RF_DD_Aprobadas() {
        try {
          this.is_loading = true;
          const resp = await api.get("/SolicitudesGastos/AprobadosRF");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              if (data) {
                let list = data.map((solicitud) => {
                  let fecha = solicitud.fecha_Solicitud
                    .split(" ")[0]
                    .split("-");
                  return {
                    id: solicitud.id,
                    estatus: solicitud.estatus,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    folio: solicitud.folio,
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
                    fecha_Solicitud: `${fecha[2]}-${fecha[1]}-${fecha[0]}`,
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
                    pagado: solicitud.pagado,
                    terminado: solicitud.terminado,
                    validado: solicitud.validado,
                    reintegro_Url: solicitud.reintegro_Url,
                    folio_Solicitud_Gasto_Comprobar:
                      solicitud.folio_Solicitud_Gasto_Comprobar,
                  };
                });
                this.list_Solicitudes_RF_GC_Aprobado = list
                  .filter((x) => x.tipo_Solicitud_Gasto == 1)
                  .sort((a, b) => b.id - a.id);
                this.list_Solicitudes_RF_Reembolso_Aprobado = list
                  .filter((x) => x.tipo_Solicitud_Gasto == 0)
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
          this.is_loading = false;
        }
      },

      //-----------------------------------------------------------
      async aprobar_RF(id, importe) {
        try {
          const resp = await api.post(
            `/SolicitudesGastos/AprobarRf/${id}`,
            importe
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

      //-----------------------------------------------------------
      async rechazar_RF(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/RechazarRF/${id}`);
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
      async concluir(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/Concluir/${id}`);
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
      async load_Solicitudes_RF_DD_Rechazadas() {
        try {
          this.is_loading = true;
          const resp = await api.get("/SolicitudesGastos/RechazadosRF");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              if (data) {
                let list = data.map((solicitud) => {
                  let fecha = solicitud.fecha_Solicitud
                    .split(" ")[0]
                    .split("-");
                  return {
                    id: solicitud.id,
                    estatus: solicitud.estatus,
                    empleado_Solicitante: solicitud.empleado_Solicitante,
                    folio: solicitud.folio,
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
                    fecha_Solicitud: `${fecha[2]}-${fecha[1]}-${fecha[0]}`,
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
                    pagado: solicitud.pagado,
                    terminado: solicitud.terminado,
                    validado: solicitud.validado,
                    reintegro_Url: solicitud.reintegro_Url,
                  };
                });
                this.list_Solicitudes_RF_GC_Rechazada = list
                  .filter((x) => x.tipo_Solicitud_Gasto == 1)
                  .sort((a, b) => b.id - a.id);
                this.list_Solicitudes_RF_Reembolso_Rechazada = list
                  .filter((x) => x.tipo_Solicitud_Gasto == 0)
                  .sort((a, b) => b.id - a.id);
              }
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
          this.is_loading = false;
        }
      },
    },
  }
);
