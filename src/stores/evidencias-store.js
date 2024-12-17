import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useEvidenciaStore = defineStore("useEvidenciaStore", {
  state: () => ({
    loading: false,
    modal_Evidencia_DD: false,
    list_Evidencias: [],
    evidenciaDD: {
      id: null,
      evidencia: null,
      descripcion: null,
    },
  }),
  actions: {
    actualizarModalEvidencia(valor) {
      this.modal_Evidencia_DD = valor;
    },

    initEvidenciaDD() {
      this.evidenciaDD.id = null;
      this.evidenciaDD.descripcion = null;
      this.evidenciaDD.evidencia = null;
    },

    //-----------------------------------------------------------
    async load_Evidencias_DD(id) {
      try {
        this.loading = true;
        this.list_Evidencias = [];
        const resp = await api.get(
          `/EvidenciasSolicitudesGastosDV/BySolicitud/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Evidencias = data.map((element) => {
                return {
                  id: element.id,
                  evidencia_URL: element.evidencia_URL,
                  descripcion: element.descripcion,
                  base_64: element.base_64,
                  solicitud_Gasto_Id: element.solicitud_Gasto_Id,
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
    async create_Evidencia_DD(id, evidencia) {
      try {
        const resp = await api.post(
          `/EvidenciasSolicitudesGastosDV/${id}`,
          evidencia,
          {
            headers: {
              "Conten-Type": "multipart/form-data",
            },
          }
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
    async delete_Evidencia(id) {
      try {
        const resp = await api.delete(`/EvidenciasSolicitudesGastosDV/${id}`);
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
