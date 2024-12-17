import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useMisSolicitudesStore = defineStore("useMisSolicitudesStore", {
  state: () => ({
    tab: "comisiones",
    is_Editar: false,
    visualizar: false,
    loading: false,
    modal: false,
    modal_Elegir: false,
    list_Mis_Solicitudes: [],
    solicitud: {
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
      r_Reintegro: false,
      gastos_Representacion: false,
      destinos: [],
    },
  }),
  actions: {
    //-----------------------------------------------------------
    actualizarModalElegir(valor) {
      this.modal_Elegir = valor;
    },

    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarVisualizar(valor) {
      this.visualizar = valor;
    },

    actualizarEditar(valor) {
      this.is_Editar = valor;
    },

    //-----------------------------------------------------------
    initSolicitud() {
      this.solicitud.id = null;
      this.solicitud.folio = null;
      this.solicitud.area_Id = null;
      this.solicitud.empleado_Solicitante_Id = null;
      this.solicitud.puesto_Empleado_Solicitante_Id = null;
      this.solicitud.responsable_Area_Id = null;
      this.solicitud.puesto_Responsable_Area_Id = null;
      this.solicitud.fecha_Salida = null;
      this.solicitud.fecha_LLegada = null;
      this.solicitud.no_Dias = null;
      this.solicitud.no_Noches = null;
      this.solicitud.borrador = false;
      this.solicitud.pernoctado = false;
      this.solicitud.actividad = null;
      this.solicitud.medio_Transporte = null;
      this.solicitud.medio_Transporte_Especifico = null;
      this.solicitud.vehiculo_Id = null;
      this.solicitud.rol = null;
      this.solicitud.saldo_Cero = false;
      this.solicitud.observaciones = null;
      this.solicitud.gastos_Viaje = null;
      this.solicitud.itinerario = null;
      this.solicitud.responsable_Administracion_Id = null;
      this.solicitud.responsable_Administracion = null;
      this.solicitud.puesto_Responsable_Administracion_Id = null;
      this.solicitud.puesto_Responsable_Administracion = null;
      this.solicitud.area = null;
      this.solicitud.empleado_Registra_Id = null;
      this.solicitud.empleado_Registra = null;
      this.solicitud.empleado_Solicitante = null;
      this.solicitud.puesto_Empleado_Solicitante = null;
      this.solicitud.responsable_Area = null;
      this.solicitud.puesto_Responsable_Area = null;
      this.solicitud.empleado_Rec_Financieros_Id = null;
      this.solicitud.empleado_Rec_Financieros = null;
      this.solicitud.puesto_Empleado_Rec_Financieros_Id = null;
      this.solicitud.puesto_Empleado_Rec_Financieros = null;
      this.solicitud.empleado_Recibe_Administracion_Id = null;
      this.solicitud.empleado_Recibe_Administracion = null;
      this.solicitud.puesto_Empleado_Recibe_Administracion_Id = null;
      this.solicitud.puesto_Empleado_Recibe_Administracion = null;
      this.solicitud.pernoctado_String = null;
      this.solicitud.estatus = null;
      this.solicitud.aprobado_Responsable_Area = null;
      this.solicitud.aprobado_Recursos_Financieros = null;
      this.solicitud.recibido_Administracion = false;
      this.solicitud.monto_Asignado = null;
      this.solicitud.monto_Utilizado = null;
      this.solicitud.monto_Reintegro = null;
      this.solicitud.monto_Saldo = null;
      this.solicitud.fecha_Registro = null;
      this.solicitud.vehiculo = null;
      this.solicitud.destino_String = null;
      this.solicitud.saldo_Cero_String = null;
      this.solicitud.fecha_Aprobacion_JA = null;
      this.solicitud.fecha_Aprobacion_RF = null;
      this.solicitud.fecha_Impresion = null;
      this.solicitud.fecha_Recepcion_Administracion = null;
      this.solicitud.forma_Pago = null;
      this.solicitud.fecha_Pago = null;
      this.solicitud.fecha_Pago_Largo = null;
      this.solicitud.impreso = false;
      this.solicitud.e_Informe_Actividades = false;
      this.solicitud.e_Comprobacion_Gasto = false;
      this.solicitud.e_Reintegro = false;
      this.solicitud.e_Evidencias = false;
      this.solicitud.tipo_Recibido = null;
      this.solicitud.r_Reintegro = null;
      this.solicitud.destinos = [];
    },

    //-----------------------------------------------------------
    async load_Mis_Solicitudes() {
      try {
        this.loading = true;
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/MisSolicitudes"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Mis_Solicitudes = data.map((solicitud) => {
                var diasFaltantes = null;
                var fecha = null;
                var fechaSalida = null;
                var fechaSolicitudSalida = solicitud.fecha_Salida.split("-");
                var fechaSolicitud = solicitud.fecha_LLegada.split("-");
                var year = fechaSolicitud[0];
                var month = fechaSolicitud[1] - 1;
                var day = fechaSolicitud[2];
                fecha = new Date(year, month, day);

                var yearS = fechaSolicitudSalida[0];
                var monthS = fechaSolicitudSalida[1] - 1;
                var dayS = fechaSolicitudSalida[2];
                fechaSalida = new Date(yearS, monthS, dayS);

                var fechaActual = null;
                var fechaA = new Date();
                var yearA = fechaA.getFullYear();
                var monthA = fechaA.getMonth();
                var dayA = fechaA.getDate();
                fechaActual = new Date(yearA, monthA, dayA);
                if (
                  fecha.getTime() > fechaActual.getTime() &&
                  !solicitud.pernoctado
                ) {
                  diasFaltantes = "Comisión por realizar";
                } else if (
                  fechaSalida.getTime() > fechaActual.getTime() &&
                  solicitud.pernoctado
                ) {
                  diasFaltantes = "Comisión por realizar";
                } else if (
                  fechaActual.getTime() == fecha.getTime() ||
                  (fechaActual.getTime() >= fechaSalida.getTime() &&
                    fechaActual.getTime() <= fecha.getTime())
                ) {
                  diasFaltantes = "Comisión en proceso";
                } else {
                  fecha.setDate(fecha.getDate() + 9);
                  var nuevaFecha = new Date(fecha.toISOString().slice(0, 10));
                  diasFaltantes = Math.ceil(
                    (nuevaFecha - fechaActual) / (1000 * 60 * 60 * 24)
                  );
                }
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
                  fecha_Pago: solicitud.fecha_Pago,
                  pagado: solicitud.pagado,
                  pernoctado_String: solicitud.pernoctado_String,
                  pernoctado: solicitud.pernoctado,
                  estatus: solicitud.estatus,
                  monto_Asignado: `$${solicitud.monto_Asignado.toFixed(2)}`,
                  monto_Utilizado: `$${solicitud.monto_Utilizado.toFixed(2)}`,
                  monto_Saldo:
                    solicitud.monto_Saldo == null
                      ? "$0.00"
                      : `$${solicitud.monto_Saldo.toFixed(2)}`,
                  fecha_Registro: solicitud.fecha_Registro,
                  destino: solicitud.destino,
                  aprobado_Responsable_Area:
                    solicitud.aprobado_Responsable_Area,
                  aprobado_Recursos_Financieros:
                    solicitud.aprobado_Recursos_Financieros,
                  fecha_Impresion: solicitud.fecha_Impresion,
                  saldo_Cero: solicitud.saldo_Cero,
                  dias_Comprobar: diasFaltantes,
                  e_Comprobacion_Gasto: solicitud.e_Comprobacion_Gasto,
                  e_Evidencias: solicitud.e_Evidencias,
                  e_Informe_Actividades: solicitud.e_Informe_Actividades,
                  e_Reintegro: solicitud.e_Reintegro,
                };
              });
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
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async load_Solicitud(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.solicitud.id = data.id;
            this.solicitud.area = data.area;
            this.solicitud.area_Id = data.area_Id;
            this.solicitud.folio = data.folio;
            this.solicitud.empleado_Registra_Id = data.empleado_Registra_Id;
            this.solicitud.empleado_Registra = data.empleado_Registra;
            this.solicitud.empleado_Solicitante_Id =
              data.empleado_Solicitante_Id;
            this.solicitud.empleado_Solicitante = data.empleado_Solicitante;
            this.solicitud.puesto_Empleado_Solicitante_Id =
              data.puesto_Empleado_Solicitante_Id;
            this.solicitud.puesto_Empleado_Solicitante =
              data.puesto_Empleado_Solicitante;
            this.solicitud.responsable_Area_Id = data.responsable_Area_Id;
            this.solicitud.responsable_Area = data.responsable_Area;
            this.solicitud.puesto_Responsable_Area_Id =
              data.puesto_Responsable_Area_Id;
            this.solicitud.puesto_Responsable_Area =
              data.puesto_Responsable_Area;
            this.solicitud.empleado_Rec_Financieros_Id =
              data.empleado_Rec_Financieros_Id;
            this.solicitud.empleado_Rec_Financieros =
              data.empleado_Rec_Financieros;
            this.solicitud.puesto_Empleado_Rec_Financieros_Id =
              data.puesto_Empleado_Rec_Financieros_Id;
            this.solicitud.puesto_Empleado_Rec_Financieros =
              data.puesto_Empleado_Rec_Financieros;
            this.solicitud.fecha_Salida = data.fecha_Salida;
            this.solicitud.fecha_LLegada = data.fecha_LLegada;
            this.solicitud.fecha_Registro = data.fecha_Registro;
            this.solicitud.pernoctado = data.pernoctado;
            this.solicitud.pernoctado_String = data.pernoctado_String;
            this.solicitud.estatus = data.estatus;
            this.solicitud.aprobado_Responsable_Area =
              data.aprobado_Responsable_Area;
            this.solicitud.aprobado_Recursos_Financieros =
              data.aprobado_Recursos_Financieros;
            this.solicitud.monto_Asignado = `$${data.monto_Asignado.toFixed(
              2
            )}`;
            this.solicitud.monto_Utilizado = `$${data.monto_Utilizado.toFixed(
              2
            )}`;
            this.solicitud.monto_Reintegro = `$${data.monto_Reintegro.toFixed(
              2
            )}`;
            this.solicitud.monto_Saldo = data.monto_Saldo;
            this.solicitud.no_Dias = data.no_Dias;
            this.solicitud.no_Noches = data.no_Noches;
            this.solicitud.actividad = data.actividad;
            this.solicitud.borrador = data.borrador;
            this.solicitud.medio_Transporte = data.medio_Transporte;
            this.solicitud.medio_Transporte_Especifico =
              data.medio_Transporte_Especifico;
            this.solicitud.rol = data.rol;
            this.solicitud.vehiculo_Id = data.vehiculo_Id;
            this.solicitud.vehiculo = data.vehiculo;
            this.solicitud.saldo_Cero = data.saldo_Cero;
            this.solicitud.destino_String = data.destino_String;
            this.solicitud.saldo_Cero_String = data.saldo_Cero_String;
            this.solicitud.responsable_Administracion_Id =
              data.responsable_Administracion_Id;
            this.solicitud.responsable_Administracion =
              data.responsable_Administracion;
            this.solicitud.puesto_Responsable_Administracion_Id =
              data.puesto_Responsable_Administracion_Id;
            this.solicitud.puesto_Responsable_Administracion =
              data.puesto_Responsable_Administracion;
            this.solicitud.fecha_Aprobacion_JA = data.fecha_Aprobacion_JA;
            this.solicitud.fecha_Aprobacion_RF = data.fecha_Aprobacion_RF;
            this.solicitud.fecha_Impresion = data.fecha_Impresion;
            this.solicitud.empleado_Recibe_Administracion =
              data.empleado_Recibe_Administracion;
            this.solicitud.empleado_Recibe_Administracion_Id =
              data.empleado_Recibe_Administracion_Id;
            this.solicitud.puesto_Empleado_Recibe_Administracion =
              data.puesto_Empleado_Recibe_Administracion;
            this.solicitud.puesto_Empleado_Recibe_Administracion_Id =
              data.puesto_Empleado_Recibe_Administracion_Id;
            this.solicitud.fecha_Recepcion_Administracion =
              data.fecha_Recepcion_Administracion;
            this.solicitud.recibido_Administracion =
              data.recibido_Administracion;
            this.solicitud.impreso = data.impreso;
            this.solicitud.fecha_Pago = data.fecha_Pago;
            this.solicitud.fecha_Pago_Largo = data.fecha_Pago_Largo;
            this.solicitud.e_Comprobacion_Gasto = data.e_Comprobacion_Gasto;
            this.solicitud.e_Informe_Actividades = data.e_Informe_Actividades;
            this.solicitud.e_Reintegro = data.e_Reintegro;
            this.solicitud.e_Evidencias = data.e_Evidencias;
            this.solicitud.tipo_Recibido = data.tipo_Recibido;
            this.solicitud.r_Reintegro = data.r_Reintegro;
            this.solicitud.observaciones = data.observaciones;
            this.solicitud.gastos_Viaje = data.gastos_Viaje;
            this.solicitud.itinerario = data.itinerario;
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
    async load_Estatus_Solicitud(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.solicitud.aprobado_Responsable_Area =
              data.aprobado_Responsable_Area;
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
      }
    },

    //-----------------------------------------------------------
    async cancelar_Solicitud(id) {
      try {
        this.loading = true;
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/Cancelar/${id}`
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
      } finally {
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async create_Solicitud(solicitud) {
      try {
        const resp = await api.post(
          "/GastosComprobar/SolicitudesGastosComprobar",
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
    async update_Solicitud(solicitud, sistema) {
      try {
        const resp = await api.put(
          `/GastosComprobar/SolicitudesGastosComprobar/${solicitud.id}/${sistema}`,
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
    async imprimir_Gasto(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/Imprimir/${id}`
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
    async imprimir_ReporteAct(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/ImprimirReporteAct/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
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
      }
    },

    //-----------------------------------------------------------
    async imprimir_comprobacion(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/ImprimirComprobacion/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
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
      }
    },
  },
});
