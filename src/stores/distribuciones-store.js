import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDistribucionStore = defineStore("distribucion", {
  state: () => ({
    is_loading: false,
    is_Editar: false,
    visualizar: false,
    c_gastos: [],
    list_Distribuciones: [],
    list_Gastos: [],
    distribucion: {
      id: null,
      c_Gasto_Id: null,
      c_Gasto: null,
      importe: null,
    },
  }),
  actions: {
    actualizarEditar(valor) {
      this.is_Editar = valor;
    },

    actualizarVisualizar(valor) {
      this.visualizar = valor;
    },

    initDistribucion() {
      this.distribucion.id = null;
      this.distribucion.c_Gasto_Id = null;
      this.distribucion.c_Gasto = null;
      this.distribucion.importe = null;
    },

    //-----------------------------------------------------------
    async load_Distribucion_Id(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/DistribucionSolicitudGasto/ById/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.distribucion.id = data.id;
            this.distribucion.c_Gasto = data.c_Gasto;
            this.distribucion.c_Gasto_Id = data.c_Gasto_Id;
            this.distribucion.importe = data.importe.toFixed(2);
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
    async load_Distribuciones(id) {
      try {
        this.is_loading = true;
        this.list_Distribuciones = [];
        const resp = await api.get(
          `/GastosComprobar/DistribucionSolicitudGasto/BySolicitud/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Distribuciones = data.map((element) => {
                return {
                  id: element.id,
                  c_Gasto_Id: element.c_Gasto_Id,
                  c_Gasto: element.c_Gasto,
                  importe: element.importe,
                  importe_Utilizado: `$${element.importe_Utilizado.toFixed(2)}`,
                  diferencia: `$${element.diferencia.toFixed(2)}`,
                  importe_string: `$${element.importe.toFixed(2)}`,
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
    async load_Gastos() {
      try {
        const resp = await api.get("/GastosComprobar/CGastos/GetLista");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Gastos = data.map((element) => {
                return {
                  label: element.label,
                  value: element.value,
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
    async create_Distribucion(solicitud_id, distribucion) {
      try {
        const resp = await api.post(
          `/GastosComprobar/DistribucionSolicitudGasto/${solicitud_id}`,
          distribucion
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
    async update_Distribucion(distribucion) {
      try {
        const resp = await api.put(
          `/GastosComprobar/DistribucionSolicitudGasto/${distribucion.id}`,
          distribucion
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
    async delete_Distribucion(id) {
      try {
        const resp = await api.delete(
          `/GastosComprobar/DistribucionSolicitudGasto/${id}`
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
  },
});
