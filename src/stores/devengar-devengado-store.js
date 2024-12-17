import { api } from "src/boot/axios";
import { defineStore } from "pinia";

export const useDevengarDevengadoStore = defineStore(
  "useDevengasDevengadoStore",
  {
    state: () => ({
      modal_Devengar: false,
      modal_Devengado: false,
      modal_Facturas: false,
      modal_Ver_Comision: false,
      visualizar: false,
      is_Editar: false,
      comision_Id: null,
      list_Devengar: [],
      list_Devengado: [],
      list_Comisiones_By_Empleado: [],
      solicitud: {
        id: null,
        folio: null,
        estatus: null,
        tipo_Solicitud_Gasto: null,
        empleado_Solicitante_Id: null,
        solicitud_Gasto_Comprobar_Id: null,
        empleado_Solicitante: null,
        puesto_Empleado_Solicitante_Id: null,
        area_Id: null,
        responsable_Area_Id: null,
        puesto_Responsable_Area_Id: null,
        empleado_Administracion_Id: null,
        puesto_Empleado_Administracion_Id: null,
        aprobado_Repsonsable_Area: null,
        aprobado_Administracion: null,
        fecha_Aprobacion_Responsable_Area: null,
        fecha_Aprobacion_Administracion: null,
        fecha_Registro: null,
        fecha_Solicitud: null,
        motivo: null,
        observaciones: null,
        monto_Solicitado: null,
        monto_Utilizado: null,
        monto_Reintegro: null,
        monto_Aprobado: null,
        monto_Saldo: null,
        tipo_Evento: null,
        gastos_Representacion: false,
        borrador: false,
        responsable_Area: null,
        estatus_Recepcion_Administracion: null,
        reintegro_Url: null,
        empleado_Rec_Financieros: null,
        responsable_Administracion: null,
        terminado: null,
        validado: null,
        pagado: null,
        impreso: null,
      },
    }),
    actions: {
      actualizarModalDevengar(valor) {
        this.modal_Devengar = valor;
      },

      actualizarModalDevengado(valor) {
        this.modal_Devengado = valor;
      },

      actualizarModalFacturas(valor) {
        this.modal_Facturas = valor;
      },

      actualizarVisualizar(valor) {
        this.visualizar = valor;
      },

      actualizarModalVerComision(valor) {
        this.modal_Ver_Comision = valor;
      },

      actualizarEditar(valor) {
        this.is_Editar = valor;
      },

      initSolicitudDD() {
        this.solicitud.id = null;
        this.solicitud.folio = null;
        this.solicitud.estatus = null;
        this.solicitud.tipo_Solicitud_Gasto = null;
        this.solicitud.empleado_Solicitante_Id = null;
        this.solicitud.solicitud_Gasto_Comprobar_Id = null;
        this.solicitud.empleado_Solicitante = null;
        this.solicitud.puesto_Empleado_Solicitante_Id = null;
        this.solicitud.area_Id = null;
        this.solicitud.responsable_Area_Id = null;
        this.solicitud.puesto_Responsable_Area_Id = null;
        this.solicitud.empleado_Administracion_Id = null;
        this.solicitud.puesto_Empleado_Administracion_Id = null;
        this.solicitud.aprobado_Repsonsable_Area = null;
        this.solicitud.aprobado_Administracion = null;
        this.solicitud.fecha_Aprobacion_Responsable_Area = null;
        this.solicitud.fecha_Aprobacion_Administracion = null;
        this.solicitud.fecha_Registro = null;
        this.solicitud.fecha_Solicitud = null;
        this.solicitud.motivo = null;
        this.solicitud.monto_Reintegro = null;
        this.solicitud.observaciones = null;
        this.solicitud.monto_Solicitado = null;
        this.solicitud.monto_Utilizado = null;
        this.solicitud.monto_Aprobado = null;
        this.solicitud.monto_Saldo = null;
        this.solicitud.tipo_Evento = null;
        this.solicitud.gastos_Representacion = false;
        this.solicitud.borrador = false;
        this.solicitud.responsable_Area = null;
        this.solicitud.estatus_Recepcion_Administracion = false;
        this.solicitud.reintegro_Url = null;
        this.solicitud.responsable_Administracion = null;
        this.solicitud.responsable_Area = null;
      },

      //-----------------------------------------------------------
      async load_Solicitudes_Devengar_Devengado() {
        try {
          this.loading = true;
          const resp = await api.get("/SolicitudesGastos/MisSolicitudes");
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              let list = data.map((solicitud) => {
                var diasFaltantes = null;
                var fecha = null;
                var fechaSolicitud = solicitud.fecha_Solicitud
                  .split(" ")[0]
                  .split("-");
                var year = fechaSolicitud[2];
                var month = fechaSolicitud[1] - 1;
                var day = fechaSolicitud[0];
                fecha = new Date(year, month, day);

                var fechaActual = null;
                var fechaA = new Date();
                var yearA = fechaA.getFullYear();
                var monthA = fechaA.getMonth();
                var dayA = fechaA.getDate();
                fechaActual = new Date(yearA, monthA, dayA);

                if (fecha.getTime() > fechaActual.getTime()) {
                  diasFaltantes = `${
                    solicitud.tipo_Evento != "Evento"
                      ? `Actividad ${solicitud.tipo_Evento}`
                      : solicitud.tipo_Evento
                  } por realizar`;
                } else if (fechaActual.getTime() == fecha.getTime()) {
                  diasFaltantes = `${
                    solicitud.tipo_Evento != "Evento"
                      ? `Actividad ${solicitud.tipo_Evento}`
                      : solicitud.tipo_Evento
                  } en proceso`;
                } else {
                  fecha.setDate(fecha.getDate() + 9);
                  var nuevaFecha = new Date(fecha.toISOString().slice(0, 10));
                  let dias = Math.ceil(
                    (nuevaFecha - fechaActual) / (1000 * 60 * 60 * 24)
                  );
                  if (dias == 1) {
                    diasFaltantes = `${dias} día`;
                  } else {
                    diasFaltantes = `${dias} días`;
                  }
                }
                let fecha_Recurso = solicitud.fecha_Solicitud
                  .split(" ")[0]
                  .split("-");
                return {
                  dias_Comprobar: diasFaltantes,
                  estatus: solicitud.estatus,
                  aprobado_Administracion: solicitud.aprobado_Administracion,
                  aprobado_Responsable_Area:
                    solicitud.aprobado_Repsonsable_Area,
                  area_Id: solicitud.area_Id,
                  borrador: solicitud.borrador,
                  empleado_Administracion_Id:
                    solicitud.empleado_Administracion_Id,
                  empleado_Solicitante_Id: solicitud.empleado_Solicitante_Id,
                  empleado_Solicitante: solicitud.empleado_Solicitante,
                  fecha_Aprobacion_Administracion:
                    solicitud.fecha_Aprobacion_Administracion,
                  fecha_Aprobacion_Responsable_Area:
                    solicitud.fecha_Aprobacion_Responsable_Area,
                  fecha_Registro: solicitud.fecha_Registro,
                  fecha_Solicitud: `${fecha_Recurso[2]}-${fecha_Recurso[1]}-${fecha_Recurso[0]}`,
                  folio: solicitud.folio,
                  gastos_Representacion: solicitud.gastos_Representacion,
                  id: solicitud.id,
                  monto_Aprobado: solicitud.monto_Aprobado,
                  monto_Saldo: solicitud.monto_Saldo,
                  monto_Solicitado: solicitud.monto_Solicitado,
                  responsable_Area: solicitud.responsable_Area,
                  monto_Utilizado: solicitud.monto_Utilizado,
                  motivo: solicitud.motivo,
                  observaciones: solicitud.observaciones,
                  puesto_Empleado_Administracion_Id:
                    solicitud.puesto_Empleado_Administracion_Id,
                  puesto_Empleado_Solicitante_Id:
                    solicitud.puesto_Empleado_Solicitante_Id,
                  puesto_Responsable_Area_Id:
                    solicitud.puesto_Responsable_Area_Id,
                  responsable_Area_Id: solicitud.responsable_Area_Id,
                  tipo_Evento: solicitud.tipo_Evento,
                  tipo_Solicitud_Gasto: solicitud.tipo_Solicitud_Gasto,
                  impreso: solicitud.impreso,
                  validado: solicitud.validado,
                  pagado: solicitud.pagado,
                  solicitud_Gasto_Comprobar_Id:
                    solicitud.solicitud_Gasto_Comprobar_Id,
                  folio_Solicitud_Gasto_Comprobar:
                    solicitud.folio_Solicitud_Gasto_Comprobar,
                };
              });
              this.list_Devengar = list
                .filter((x) => x.tipo_Solicitud_Gasto == 1)
                .sort((a, b) => b.id - a.id);
              this.list_Devengado = list
                .filter((x) => x.tipo_Solicitud_Gasto == 0)
                .sort((a, b) => b.id - a.id);
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
      async load_Solicitud_DD(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/${id}`);
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              this.solicitud.id = data.id;
              this.solicitud.folio = data.folio;
              this.solicitud.estatus = data.estatus;
              this.solicitud.tipo_Solicitud_Gasto = data.tipo_Solicitud_Gasto;
              this.solicitud.empleado_Solicitante_Id =
                data.empleado_Solicitante_Id;
              this.solicitud.empleado_Solicitante = data.empleado_Solicitante;
              this.solicitud.puesto_Empleado_Solicitante_Id =
                data.puesto_Empleado_Solicitante_Id;
              this.solicitud.area_Id = data.area_Id;
              this.solicitud.responsable_Area_Id = data.responsable_Area_Id;
              this.solicitud.puesto_Responsable_Area_Id =
                data.puesto_Responsable_Area_Id;
              this.solicitud.empleado_Administracion_Id =
                data.empleado_Administracion_Id;
              this.solicitud.puesto_Empleado_Administracion_Id =
                data.puesto_Empleado_Administracion_Id;
              this.solicitud.aprobado_Repsonsable_Area =
                data.aprobado_Repsonsable_Area;
              this.solicitud.aprobado_Administracion =
                data.aprobado_Administracion;
              this.solicitud.fecha_Aprobacion_Responsable_Area =
                data.fecha_Aprobacion_Responsable_Area;
              this.solicitud.fecha_Aprobacion_Administracion =
                data.fecha_Aprobacion_Administracion;
              this.solicitud.fecha_Registro = data.fecha_Registro;
              let fecha = data.fecha_Solicitud.split(" ")[0].split("-");
              this.solicitud.fecha_Solicitud = `${fecha[2]}-${fecha[1]}-${fecha[0]}`;
              this.solicitud.motivo = data.motivo;
              this.solicitud.observaciones = data.observaciones;
              this.solicitud.monto_Solicitado = data.monto_Solicitado;
              this.solicitud.monto_Utilizado = data.monto_Utilizado;
              this.solicitud.monto_Aprobado =
                data.monto_Aprobado == null ? 0 : data.monto_Aprobado;
              this.solicitud.monto_Saldo = data.monto_Saldo;
              this.solicitud.tipo_Evento = data.tipo_Evento;
              this.solicitud.gastos_Representacion = data.gastos_Representacion;
              this.solicitud.borrador = data.borrador;
              this.solicitud.solicitud_Gasto_Comprobar_Id =
                data.solicitud_Gasto_Comprobar_Id;
              //---------------
              this.solicitud.area = data.area;
              this.solicitud.responsable_Area = data.responsable_Area;
              this.solicitud.reintegro_Url = data.reintegro_Url;
              this.solicitud.estatus_Recepcion_Administracion =
                data.estatus_Recepcion_Administracion;
              this.solicitud.monto_Reintegro = data.monto_Reintegro;
              this.solicitud.empleado_Rec_Financieros =
                data.empleado_Rec_Financieros;
              this.solicitud.responsable_Administracion =
                data.responsable_Administracion;
              this.solicitud.terminado = data.terminado;
              this.solicitud.validado = data.validado;
              this.solicitud.pagado = data.pagado;
              this.solicitud.impreso = data.impreso;
            } else {
              return { success, data };
            }
          } else {
            this.is_loading = false;
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (error) {
          this.is_loading = false;
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async create_Solicitud_Gasto(solicitud) {
        try {
          const resp = await api.post("/SolicitudesGastos", solicitud);
          if (resp.status == 200) {
            const { success, data, id } = resp.data;
            if (success === true) {
              return { success, data, id };
            } else {
              return { success, data };
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (e) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async update_Solicitud_DD(solicitud) {
        try {
          const resp = await api.put(
            `/SolicitudesGastos/${solicitud.id}`,
            solicitud
          );
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              return { success, data };
            } else {
              return { success, data };
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (e) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async cancelar_Solicitud_DD(id) {
        try {
          this.loading = true;
          const resp = await api.get(`/SolicitudesGastos/Cancelar/${id}`);
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
        } finally {
          this.loading = false;
        }
      },

      //-----------------------------------------------------------
      async imprimir_Gasto(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/Imprimir/${id}`);
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
      async imprimir_Comprobacion(id) {
        try {
          const resp = await api.get(
            `/SolicitudesGastos/ImprimirComprobacion/${id}`
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
      async imprimir_Evidencia(id) {
        try {
          const resp = await api.get(
            `/SolicitudesGastos/ImprimirEvidencia/${id}`
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
      async enviar_Comprobacion(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/SetTerminado/${id}`);
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
      async validar_Comprobacion(id) {
        try {
          const resp = await api.get(`/SolicitudesGastos/Validar/${id}`);
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
      async actualizar_Estatus(id, estatus) {
        try {
          let estatusObj = {
            estatus: estatus,
          };
          const resp = await api.post(
            `/SolicitudesGastos/ActualizarEstatus/${id}`,
            estatusObj
          );
          if (resp.status == 200) {
            const { success, data, id } = resp.data;
            if (success === true) {
              return { success, data, id };
            } else {
              return { success, data };
            }
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        } catch (e) {
          return {
            success: false,
            data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
          };
        }
      },

      //-----------------------------------------------------------
      async load_List_By_Empleado(id) {
        try {
          this.loading = true;
          const resp = await api.get(
            `/GastosComprobar/SolicitudesGastosComprobar/ListaByEmpleado/${id}`
          );
          if (resp.status == 200) {
            const { success, data } = resp.data;
            if (success === true) {
              this.list_Comisiones_By_Empleado = data.map((comision) => {
                return {
                  value: comision.id,
                  label: comision.folio,
                  id: comision.id,
                  rol: comision.rol,
                  area: comision.area,
                  folio: comision.folio,
                  pagado: comision.pagado,
                  destino: comision.destino,
                  afectar: comision.afectar,
                  area_Id: comision.area_Id,
                  estatus: comision.estatus,
                  actividad: comision.actividad,
                  pernoctado: comision.pernoctado,
                  saldo_Cero: comision.saldo_Cero,
                  fecha_Pago: comision.fecha_Pago,
                  forma_Pago: comision.forma_Pago,
                  monto_Saldo: comision.monto_Saldo,
                  e_Reintegro: comision.e_Reintegro,
                  r_Reintegro: comision.r_Reintegro,
                  e_Evidencias: comision.e_Evidencias,
                  fecha_Salida: comision.fecha_Salida,
                  fecha_LLegada: comision.fecha_LLegada,
                  puesto_Responsable_Area_Id:
                    comision.puesto_Responsable_Area_Id,
                  empleado_Rec_Financieros_Id:
                    comision.empleado_Rec_Financieros_Id,
                  puesto_Empleado_Solicitante:
                    comision.puesto_Empleado_Solicitante,
                  medio_Transporte_Especifico:
                    comision.medio_Transporte_Especifico,
                  fecha_Registro: comision.fecha_Registro,
                  fecha_Recepcion_Administracion:
                    comision.fecha_Recepcion_Administracion,
                  fecha_Impresion: comision.fecha_Impresion,
                  puesto_Empleado_Solicitante_Id:
                    comision.puesto_Empleado_Solicitante_Id,
                  aprobado_Recursos_Financieros:
                    comision.aprobado_Recursos_Financieros,
                  medio_Transporte: comision.medio_Transporte,
                  empleado_Registra: comision.empleado_Registra,
                  monto_Asignado: comision.monto_Asignado,
                  empleado_Recibe_Administracion:
                    comision.empleado_Recibe_Administracion,
                  monto_Utilizado: comision.monto_Utilizado,
                  monto_Reintegro: comision.monto_Reintegro,
                  responsable_Area: comision.responsable_Area,
                  pernoctado_String: comision.pernoctado_String,
                  responsable_Area_Id: comision.responsable_Area_Id,
                  empleado_Solicitante: comision.empleado_Solicitante,
                  empleado_Registra_Id: comision.empleado_Registra_Id,
                  e_Comprobacion_Gasto: comision.e_Comprobacion_Gasto,
                  e_Informe_Actividades: comision.e_Informe_Actividades,
                  empleado_Solicitante_Id: comision.empleado_Solicitante_Id,
                  puesto_Responsable_Area: comision.puesto_Responsable_Area,
                  empleado_Rec_Financieros: comision.empleado_Rec_Financieros,
                  aprobado_Responsable_Area: comision.aprobado_Responsable_Area,
                };
              });
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
    },
  }
);
