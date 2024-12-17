import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useFacturasStore = defineStore("useFacturasStore", {
  state: () => ({
    loading: false,
    modal: false,
    list_Facturas_By_Solicitud: [],
    factura: {
      fecha_Comprobante: null,
      emisor: null,
      folio: null,
      importe: null,
      pdf: null,
      xml: null,
    },
  }),
  actions: {
    actualizarModal(valor) {
      this.modal = valor;
    },

    initFactura() {
      this.factura.fecha_Comprobante = null;
      this.factura.emisor = null;
      this.factura.folio = null;
      this.factura.importe = null;
      this.factura.pdf = null;
      this.factura.xml = null;
      this.list_Facturas_By_Solicitud = [];
    },

    //-----------------------------------------------------------
    async load_Facturas_Bysolicitud(id) {
      try {
        this.loading = true;
        this.list_Facturas_By_Solicitud = [];
        const resp = await api.get(`/FacturasDevengadas/BySolicitud/${id}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Facturas_By_Solicitud = data.map((factura, index) => {
                return {
                  no: index + 1,
                  id: factura.id,
                  solicitud_Gasto_Id: factura.solicitud_Gasto_Id,
                  fecha_Comprobante: factura.fecha_Comprobnte,
                  emisor: factura.emisor,
                  folio: factura.folio,
                  importe: factura.importe,
                  pdF_Url: factura.pdF_Url,
                  xmL_Url: factura.xmL_Url,
                  fecha_Registro: factura.fecha_Registro,
                  aprobado: factura.aprobado,
                  estatus: factura.estatus,
                  observaciones: factura.observaciones,
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
    async create_Factura(id, factura) {
      try {
        this.loading = true;
        const resp = await api.post(`/FacturasDevengadas/${id}`, factura, {
          headers: {
            "Conten-Type": "multipart/form-data",
          },
        });
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
      } finally {
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    async aprobar_Factura(id) {
      try {
        const resp = await api.get(`/FacturasDevengadas/Aprobar/${id}`);
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

    async rechazar_Factura(id, motivo) {
      try {
        const body = `${motivo}`;
        const resp = await api.post(
          `/FacturasDevengadas/Rechazar/${id}`,
          body,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );

        if (resp.status === 200) {
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
    async delete_Factura(id) {
      try {
        const resp = await api.delete(`/FacturasDevengadas/${id}`);
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },
  },
});
