import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudesRFStore = defineStore("useSolicitudesRFStore", {
  state: () => ({
    modal: false,
    modalReintegro: false,
    perfil_RF: false,
    is_loading: false,
    visualizar: false,
    archivo_Reintegro: false,
    list_Solicitudes_RF: [],
    list_Solictudes_Aprobadas_RF: [],
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
      r_Reintegro: false,
      destinos: [],
    },
  }),
  actions: {
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

    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarModalReintegro(valor) {
      this.modalReintegro = valor;
    },

    actualizarVisualizar(valor) {
      this.visualizar = valor;
    },

    //-----------------------------------------------------------
    async load_Solicitudes_RF() {
      try {
        this.is_loading = true;
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/RecursosFiancieros"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Solicitudes_RF = data.map((solicitud) => {
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
                  estatus: solicitud.estatus,
                  monto_Asignado: `$${solicitud.monto_Asignado.toFixed(2)}`,
                  monto_Utilizado: `$${solicitud.monto_Utilizado.toFixed(2)}`,
                  monto_Saldo: `$${solicitud.monto_Saldo.toFixed(2)}`,
                  fecha_Registro: solicitud.fecha_Registro,
                  destino: solicitud.destino,
                  fecha_Pago: solicitud.fecha_Pago,
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
        this.is_loading = false;
      }
    },

    //-----------------------------------------------------------
    async load_solicitudes_rec_financieros_aprobadas() {
      try {
        this.is_loading = true;
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/AprobadosRecursosFinancieros"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Solictudes_Aprobadas_RF = data.map((solicitud) => {
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
                  pernoctado: solicitud.pernoctado,
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
                  estatus: solicitud.estatus,
                  mon_Asignado: `$${solicitud.monto_Asignado.toFixed(2)}`,
                  monto_Utilizado: `$${solicitud.monto_Utilizado.toFixed(2)}`,
                  monto_Saldo: `$${solicitud.monto_Saldo.toFixed(2)}`,
                  fecha_Registro: solicitud.fecha_Registro,
                  destino: solicitud.destino,
                  pagado: solicitud.pagado,
                  fecha_Pago: solicitud.fecha_Pago,
                  e_Reintegro: solicitud.e_Reintegro,
                  r_Reintegro: solicitud.r_Reintegro,
                  afectar: solicitud.afectar,
                  saldo_Cero: solicitud.saldo_Cero,
                  dias_Comprobar: diasFaltantes,
                  e_Comprobacion_Gasto: solicitud.e_Comprobacion_Gasto,
                  e_Evidencias: solicitud.e_Evidencias,
                  e_Informe_Actividades: solicitud.e_Informe_Actividades,
                  aprobado_Recursos_Financieros:
                    solicitud.aprobado_Recursos_Financieros,
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
        this.is_loading = false;
      }
    },

    //-----------------------------------------------------------
    async load_Solicitud_Id_RF(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/RecursosFiancieros/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.solicitudRF.id = data.id;
            this.solicitudRF.area = data.area;
            this.solicitudRF.area_Id = data.area_Id;
            this.solicitudRF.folio = data.folio;
            this.solicitudRF.empleado_Registra_Id = data.empleado_Registra_Id;
            this.solicitudRF.empleado_Registra = data.empleado_Registra;
            this.solicitudRF.empleado_Solicitante_Id =
              data.empleado_Solicitante_Id;
            this.solicitudRF.empleado_Solicitante = data.empleado_Solicitante;
            this.solicitudRF.puesto_Empleado_Solicitante_Id =
              data.pues_Empleado_Solicitante_Id;
            this.solicitudRF.responsable_Area_Id = data.responsable_Area_Id;
            this.solicitudRF.responsable_Area = data.responsable_Area;
            this.solicitudRF.puesto_Responsable_Area_Id =
              data.puesto_Responsable_Area_Id;
            this.solicitudRF.puesto_Responsable_Area =
              data.puesto_Responsable_Area;
            this.solicitudRF.empleado_Rec_Financieros_Id =
              data.empleado_Rec_Financieros_Id;
            this.solicitudRF.fecha_Aprobacion_RF = data.fecha_Aprobacion_RF;
            this.solicitudRF.empleado_Rec_Financieros =
              data.empleado_Rec_Financieros;
            this.solicitudRF.fecha_Salida = data.fecha_Salida;
            this.solicitudRF.fecha_LLegada = data.fecha_LLegada;
            this.solicitudRF.fecha_Registro = data.fecha_Registro;
            this.solicitudRF.pernoctado = data.pernoctado;
            this.solicitudRF.estatus = data.estatus;
            this.solicitudRF.aprobado_Responsable_Area =
              data.aprobado_Responsable_Area;
            this.solicitudRF.aprobado_Recursos_Financieros =
              data.aprobado_Recursos_Financieros;
            this.solicitudRF.monto_Asignado = data.monto_Asignado;
            this.solicitudRF.monto_Utilizado = `$${data.monto_Utilizado.toFixed(
              2
            )}`;
            this.solicitudRF.monto_Reintegro = `$${data.monto_Reintegro.toFixed(
              2
            )}`;
            this.solicitudRF.monto_Saldo = `$${data.monto_Saldo.toFixed(2)}`;
            this.solicitudRF.no_Dias = data.no_Dias;
            this.solicitudRF.no_Noches = data.no_Noches;
            this.solicitudRF.actividad = data.actividad;
            this.solicitudRF.borrador = data.borrador;
            this.solicitudRF.medio_Transporte = data.medio_Transporte;
            this.solicitudRF.medio_Transporte_Especifico =
              data.medio_Transporte_Especifico;
            this.solicitudRF.rol = data.rol;
            this.solicitudRF.vehiculo_Id = data.vehiculo_Id;
            this.solicitudRF.vehiculo = data.vehiculo;
            this.solicitudRF.saldo_Cero = data.saldo_Cero;
            this.solicitudRF.destino_String = data.destino_String;
            this.solicitudRF.saldo_Cero_String = data.saldo_Cero_String;
            this.solicitudRF.empleado_Recibe_Administracion =
              data.empleado_Recibe_Administracion;
            this.solicitudRF.empleado_Recibe_Administracion_Id =
              data.empleado_Recibe_Administracion_Id;
            this.solicitudRF.puesto_Empleado_Recibe_Administracion =
              data.puesto_Empleado_Recibe_Administracion;
            this.solicitudRF.puesto_Empleado_Recibe_Administracion_Id =
              data.puesto_Empleado_Recibe_Administracion_Id;
            this.solicitudRF.fecha_Recepcion_Administracion =
              data.fecha_Recepcion_Administracion;
            this.solicitudRF.recibido_Administracion =
              data.recibido_Administracion;
            this.solicitudRF.impreso = data.impreso;
            this.solicitudRF.fecha_Pago = data.fecha_Pago;
            this.solicitudRF.fecha_Pago_Largo = data.fecha_Pago_Largo;
            this.solicitudRF.r_Reintegro = data.r_Reintegro;
            this.solicitudRF.observaciones = data.observaciones;
            this.solicitudRF.gastos_Viaje = data.gastos_Viaje;
            this.solicitudRF.itinerario = data.itinerario;
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
    async aprobar_RF(id, monto) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/AprobarRf/${id}/${monto}`
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
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/RechazarRa/${id}`
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
    async afectar(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/AfectarCuentas/${id}`
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
    async concluir(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/Concluir/${id}`
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
