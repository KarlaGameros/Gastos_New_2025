import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useDestinoStore = defineStore("destino", {
  state: () => ({
    is_Editar: false,
    is_Loading: false,
    list_Estados: [],
    list_Municipios: [],
    list_Localidades: [],
    destinos: [],
    list_Destinos: [],
    destino: {
      id: null,
      estado_Id: null,
      estado: null,
      municipio_Id: null,
      municipio: null,
      localidad_Id: null,
      localidad: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    init_destino() {
      this.destino.id = null;
      this.destino.estado_Id = null;
      this.destino.estado = null;
      this.destino.municipio_Id = null;
      this.destino.municipio = null;
      this.destino.localidad_Id = null;
      this.destino.localidad = null;
    },

    //-----------------------------------------------------------
    async create_Destino(solicitudId, desitno) {
      try {
        const resp = await api.post(
          `/GastosComprobar/DestinosGastosComprobar/${solicitudId}`,
          desitno
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async load_Destinos(solicitudId) {
      try {
        this.list_Destinos = [];
        const resp = await api.get(
          `/GastosComprobar/DestinosGastosComprobar/GetAll/${solicitudId}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Destinos = data.map((element) => {
                return {
                  id: element.id,
                  solicitud_Id: element.solicitud_Id,
                  estado_Id: element.estado_Id,
                  estado: element.estado,
                  municipio_Id: element.municipio_Id,
                  municipio: element.municipio,
                  localidad_Id: element.localidad_Id,
                  localidad: element.localidad,
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
    async load_Destino(id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/DestinosGastosComprobar/${id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            this.destino.id = data.id;
            this.destino.estado_Id = data.estado_Id;
            this.destino.municipio_Id = data.municipio_Id;
            this.destino.localidad_Id = data.localidad_Id;
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
    async load_Estados() {
      try {
        this.list_Estados = [];
        const resp = await api.get("/Estados/GetLista");
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Estados = data.map((element) => {
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
    async load_Municipios(estadoId) {
      try {
        this.list_Municipios = [];
        const resp = await api.get(`/Municipios/GetLista/${estadoId}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Municipios = data.map((element) => {
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
    async load_Localidades(municipioId) {
      try {
        this.list_Localidades = [];
        const resp = await api.get(`/Localidades/GetLista/${municipioId}`);
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Localidades = data.map((element) => {
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
    async create_Destino(solicitudId, desitno) {
      try {
        const resp = await api.post(
          `/GastosComprobar/DestinosGastosComprobar/${solicitudId}`,
          desitno
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async update_Destino(desitno) {
      try {
        const resp = await api.put(
          `/GastosComprobar/DestinosGastosComprobar/${desitno.id}`,
          desitno
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    async delete_Destino(id) {
      try {
        const resp = await api.delete(
          `/GastosComprobar/DestinosGastosComprobar/${id}`
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
      } catch (error) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    add_Destinos(destino) {
      this.list_Destinos.push(destino);
      return { success: true, data: "Registro agregado con éxito" };
    },

    delete_Destino_Array(id) {
      const index = this.list_Destinos.findIndex((element) => {
        return element.id == id;
      });
      this.list_Destinos.splice(index, 1);
      return { success: true, data: "Registro eliminado con éxito" };
    },

    init_destino_array() {
      this.destinos = [];
      this.destinos_array = [];
    },

    updateEditar(valor) {
      this.isEditar = valor;
    },
  },
});
