import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useVehiculoStore = defineStore("vehiculo", {
  state: () => ({
    vehiculos_Opt: [],
  }),
  actions: {
    //-----------------------------------------------------------
    async loadVehiculos() {
      try {
        this.vehiculos_Opt = [];
        const resp = await api.get("/Vehiculos/GetLista");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.vehiculos_Opt = data.map((element) => {
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
    async loadVehiculosDisponibles(filtro) {
      try {
        this.vehiculos_Opt = [];
        const resp = await api.post("/Vehiculos/GetListaDisponible", filtro);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.vehiculos_Opt = data.map((element) => {
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
  },
});
