import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    filtrar: false,
    yearFiltro: null,
    areasTodos: true,
    fecha: null,
    monto_Aprobado_GC: null,
    monto_Aprobado_Reem: null,
    monto_Utilizado_GC: null,
    monto_Utilizado_Reem: null,
    monto_Reintegrado_GC: null,
    monto_Reintegrado_Reem: null,
    solicitudes: [],
    solicitudes_DV: [],
    montos_Erogados: [],
    montos_Erogados_DV: [],
    montos_Utilizados: [],
    montos_Utilizados_DV: [],
    areas_Gastos: [],
    areas_Gastos_DV: [],
    areas_Filtro: [],
    areas_Filtro_DD: [],
    areas: [],
    areas_DD: [],
    solicitudes_Mes: null,
    solicitudes_Mes_DV: null,
    solicitudes_Totales_DV: null,
    total_Erogado_DV: null,
    total_Utilizado_DV: null,
    total_Reitegrado_DV: null,
    total_Saldo_DV: null,
    solicitudes_Totales: 0,
    total_Erogado: 0,
    total_Utilizado: 0,
    total_Reitegrado: 0,
    total_Saldo: 0,
    textoFecha: "",
    solicitudes_filtro: [],
    solicitudes_filtro_org: [],
    solicitudes_filtro_DD: [],
    solicitudes_filtro_org_DD: [],
    is_loading: false,
    areas_opt: [],
    modal_filtro: false,
    myLocale: {
      days: "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_"),
      daysShort: "Dom_Lun_Mar_Mié_Jue_Vie_Sáb".split("_"),
      months:
        "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
          "_"
        ),
      monthsShort: "Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic".split("_"),
      firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
      format24h: true,
      pluralDay: "dias",
    },
  }),
  actions: {
    async loadDashboard(inicio, fin) {
      try {
        this.solicitudes = [];
        this.montos = [];
        this.areas_Filtro = [];
        this.areas_Gastos = [];
        const resp = await api.get(
          `/GastosComprobar/Dashboard/ByRangoFecha?Fecha_Inicio=${inicio}&Fecha_Fin=${fin}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            const {
              solicitudes,
              solicitudes_DV,
              montos_Erogados,
              montos_Erogados_DV,
              montos_Utilizados,
              montos_Utilizados_DV,
              areas_Gastos,
              areas_Gastos_DV,
              solicitudes_Mes,
              solicitudes_Mes_DV,
              solicitudes_Totales,
              solicitudes_Totales_DV,
              total_Erogado,
              total_Erogado_DV,
              total_Utilizado,
              total_Utilizado_DV,
              total_Reitegrado,
              total_Reitegrado_DV,
              total_Saldo,
              total_Saldo_DV,
            } = data;
            this.areas_Filtro = areas_Gastos;
            this.areas_Filtro_DD = areas_Gastos_DV;
            this.areas = areas_Gastos;
            this.areas_DD = areas_Gastos_DV;
            this.solicitudes = solicitudes;
            this.solicitudes_DV = solicitudes_DV;
            this.montos_Erogados = montos_Erogados;
            this.montos_Erogados_DV = montos_Erogados_DV;
            this.montos_Utilizados = montos_Utilizados;
            this.montos_Utilizados_DV = montos_Utilizados_DV;
            this.areas_Gastos = areas_Gastos;
            this.areas_Gastos_DV = areas_Gastos_DV;
            this.solicitudes_Mes = solicitudes_Mes;
            this.solicitudes_Mes_DV = solicitudes_Mes_DV;
            this.solicitudes_Totales = solicitudes_Totales;
            this.solicitudes_Totales_DV = solicitudes_Totales_DV;
            this.total_Erogado = total_Erogado;
            this.total_Erogado_DV = total_Erogado_DV;
            this.total_Utilizado = total_Utilizado;
            this.total_Utilizado_DV = total_Utilizado_DV;
            this.total_Reitegrado = total_Reitegrado;
            this.total_Reitegrado_DV = total_Reitegrado_DV;
            this.total_Saldo = total_Saldo;
            this.total_Saldo_DV = total_Saldo_DV;
          } else {
            return {
              success: false,
              data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
            };
          }
        }
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    async load_solicitudes(year) {
      try {
        this.is_loading = true;
        this.solicitudes_filtro = [];
        this.solicitudes_filtro_org = [];
        const resp = await api.get(
          `/GastosComprobar/Dashboard/Solicitudes/${year}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const solicitudesArray = data.map((solicitud) => {
                return {
                  id: solicitud.id,
                  folio: solicitud.folio,
                  area: solicitud.area,
                  area_Id: solicitud.area_Id,
                  e_Reintegro: solicitud.e_Reintegro,
                  empleado_Solicitante: solicitud.empleado_Solicitante,
                  fecha_Salida: solicitud.fecha_Salida,
                  fecha_LLegada: solicitud.fecha_LLegada,
                  monto_Asignado: solicitud.monto_Asignado,
                  monto_Utilizado: solicitud.monto_Utilizado,
                  monto_Reintegro: solicitud.monto_Reintegro,
                  saldo: solicitud.monto_Saldo,
                  estatus: solicitud.estatus,
                };
              });
              this.solicitudes_filtro = solicitudesArray;
              this.solicitudes_filtro_org = solicitudesArray;
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

    async load_solicitudes_DD(year) {
      try {
        this.is_loading = true;
        this.solicitudes_filtro_DD = [];
        this.solicitudes_filtro_org_DD = [];
        const resp = await api.get(
          `/GastosComprobar/Dashboard/SolicitudesDV/${year}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              const solicitudesArray = data.map((solicitud) => {
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
                  area: solicitud.area,
                  responsable_Area_Id: solicitud.responsable_Area_Id,
                  responsable_Area: solicitud.responsable_Area,
                  puesto_Responsable_Area_Id:
                    solicitud.puesto_Responsable_Area_Id,
                  empleado_Administracion_Id:
                    solicitud.empleado_Administracion_Id,
                  puesto_Empleado_Administracion_Id:
                    solicitud.puesto_Empleado_Administracion_Id,
                  responsable_Administracion_Id:
                    solicitud.responsable_Administracion_Id,
                  responsable_Administracion:
                    solicitud.responsable_Administracion,
                  empleado_Rec_Financieros_Id:
                    solicitud.empleado_Rec_Financieros_Id,
                  empleado_Rec_Financieros: solicitud.empleado_Rec_Financieros,
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
                  fecha_Solicitud:
                    solicitud.fecha_Solicitud != null
                      ? solicitud.fecha_Solicitud.split(" ")[0]
                      : "",
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
                  pagado: solicitud.pagado,
                  impreso: solicitud.impreso,
                  terminado: solicitud.terminado,
                  validado: solicitud.validado,
                };
              });
              this.solicitudes_filtro_DD = solicitudesArray.filter(
                (x) => x.estatus != "Cancelado"
              );
              this.solicitudes_filtro_org_DD = solicitudesArray;
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

    async load_areas_opt() {
      try {
        const resp = await api.get("/Areas/GetLista");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success == true) {
            this.areas_opt = data.map((area) => {
              return {
                label: area.label,
                value: area.value,
                activo: true,
              };
            });
            return { success };
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

    actualizar_modal_filtro(valor) {
      this.modal_filtro = valor;
    },
  },
});
