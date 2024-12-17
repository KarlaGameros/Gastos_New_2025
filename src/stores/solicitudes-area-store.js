import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useSolicitudesAreaStore = defineStore("useSolicitudesAreaStore", {
  state: () => ({
    loading: false,
    modal: false,
    list_Historial: [],
    list_Historial_Filtro: [],
    list_Solicitudes_ByArea: [],
    list_Solicitudes_ByArea_Filtro: [],
  }),
  actions: {
    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },

    //-----------------------------------------------------------
    async load_Solicitudes_Area() {
      try {
        this.loading = true;
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/JefeArea"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Solicitudes_ByArea = data.map((solicitud) => {
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
    async load_Historial() {
      try {
        this.loading = true;
        const resp = await api.get(
          "/GastosComprobar/SolicitudesGastosComprobar/HistorialJA"
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Historial = data.map((solicitud) => {
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
    async aprobar_Solicitud(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/SolicitudesGastosComprobar/AprobarRa/${id}`
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
    async rechazar_Solicitud(id) {
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
  },
});
