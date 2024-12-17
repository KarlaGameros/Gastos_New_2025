import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const usePagoStore = defineStore("usePagoStore", {
  state: () => ({
    modalPago: false,
    list_Formas_Pago: [],
    pago: {
      forma_Pago_Id: null,
      fecha_Pago: null,
    },
  }),
  actions: {
    initPago() {
      this.pago.forma_Pago_Id = null;
      this.pago.fecha_Pago = null;
    },

    actualizarModalPago(valor) {
      this.modalPago = valor;
    },

    //-----------------------------------------------------------
    async load_Formas_Pago() {
      try {
        const resp = await api.get("/GastosComprobar/CFormasPago");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Formas_Pago = data.map((element) => {
                return {
                  label: element.descripcion,
                  clave: element.clave,
                  value: element.id,
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
      }
    },

    //-----------------------------------------------------------
    async pagar(id, pago) {
      try {
        const resp = await api.post(
          `/GastosComprobar/SolicitudesGastosComprobar/Pagar/${id}`,
          pago
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
    async pagarDD(id, pago) {
      try {
        const resp = await api.post(`/SolicitudesGastos/Pagar/${id}`, pago);
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
