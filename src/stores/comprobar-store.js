import { defineStore } from "pinia";
import { api } from "src/boot/axios";

export const useComprobarStore = defineStore("useComprobarStore", {
  state: () => ({
    is_Editar: false,
    is_Editar_Evidencia: false,
    loading: false,
    modal: false,
    modal_Evidencia: false,
    modal_Factura: false,
    concluir: false,
    list_Evidencias: [],
    list_Comprobaciones_Solicitud: [],
    list_Comprobaciones: [],
    comprobacion: {
      emisor: null,
      folio: null,
      importe: null,
      fecha_Comprobante: null,
      pdf: null,
      xml: null,
      rfC_Receptor: null,
    },
    informe: {
      id: null,
      actividad_Realizada: null,
      conclusion: null,
      borrador: false,
      fecha_Registro: null,
    },
    evidencia: {
      id: null,
      evidencia_URL: null,
      evidencia: null,
      descripcion: null,
    },
  }),
  actions: {
    //-----------------------------------------------------------
    actualizarModal(valor) {
      this.modal = valor;
    },

    actualizarConcluir(valor) {
      this.concluir = valor;
    },

    actualizarModalFactura(valor) {
      this.modal_Factura = valor;
    },

    actualizarModalEvidencia(valor) {
      this.modal_Evidencia = valor;
    },

    /******************************************COMPROBACIÓN GASTOS*****************************************************/

    initComprobacion() {
      this.comprobacion.emisor = null;
      this.comprobacion.folio = null;
      this.comprobacion.importe = null;
      this.comprobacion.fecha_Comprobante = null;
      this.comprobacion.pdf = null;
      this.comprobacion.xml = null;
      this.list_Comprobaciones = [];
      this.list_Comprobaciones_Solicitud = [];
    },

    //-----------------------------------------------------------
    //POST COMPROBAR FACTURAS
    async create_Comprobacion(distribucionId, comprobacion) {
      try {
        this.loading = true;
        const resp = await api.post(
          `/GastosComprobar/ComprobacionGastos/${distribucionId}`,
          comprobacion,
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
      } finally {
        this.loading = false;
      }
    },

    //-----------------------------------------------------------
    //GET FACTURAS POR DISTRIBUCIÓN
    async loadComprobaciones(distribucionId) {
      try {
        this.list_Comprobaciones = [];
        this.loading = true;
        const resp = await api.get(
          `/GastosComprobar/ComprobacionGastos/ByDistribucion/${distribucionId}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Comprobaciones = data.map((element) => {
                return {
                  id: element.id,
                  emisor: element.emisor,
                  folio: element.folio,
                  importe: `$${element.importe.toFixed(2)}`,
                  fecha_Comprobante: element.fecha_Comprobante,
                  pdf: element.pdf == true ? "Si" : "No",
                  xml: element.xml == true ? "Si" : "No",
                  pdF_Url: element.pdF_Url,
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
    //GET LIST COMPROBACIONES GASTOS
    async loadComprobacionesBySolicitud(solicitudId) {
      try {
        this.loading = true;
        this.list_Comprobaciones_Solicitud = [];
        const resp = await api.get(
          `/GastosComprobar/ComprobacionGastos/${solicitudId}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (success === true) {
            if (data) {
              this.list_Comprobaciones_Solicitud = data.map(
                (element, index) => {
                  return {
                    id: element.id,
                    clave_Gasto: element.clave_Gasto,
                    no: index + 1,
                    emisor: element.emisor,
                    folio: element.folio,
                    importe: `$${element.importe.toFixed(2)}`,
                    fecha_Comprobante: element.fecha_Comprobante,
                  };
                }
              );
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
    //DELETE COMRPOBACION
    async deleteComprobacion(id) {
      try {
        const resp = await api.delete(
          `/GastosComprobar/ComprobacionGastos/${id}`
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

    /******************************************INFORMES*****************************************************/

    initInforme() {
      this.informe.id = null;
      this.informe.actividad_Realizada = null;
      this.informe.conclusion = null;
      this.informe.borrador = false;
      this.informe.fecha_Registro = null;
    },

    //-----------------------------------------------------------
    //GET INFORME DE ACTIVIDADES
    async load_Informe(solicitud_id) {
      try {
        const resp = await api.get(
          `/GastosComprobar/ReportesSolicitudesGastosComprobar/${solicitud_id}`
        );
        if (resp.status == 200) {
          const { success, data } = resp.data;
          if (data != null) {
            if (success === true) {
              this.informe.id = data.id;
              this.informe.actividad_Realizada = data.actividad_Realizada;
              this.informe.conclusion = data.conclusion;
              this.informe.fecha_Registro = data.fecha_Registro;
              this.informe.borrador = data.borrador;
            } else {
              return { success, data };
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
      }
    },

    //-----------------------------------------------------------
    //POST INFORME DE ACTIVIDADES
    async create_Informe(solicitudId, informe) {
      try {
        const resp = await api.post(
          `/GastosComprobar/ReportesSolicitudesGastosComprobar/${solicitudId}`,
          informe
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
      } catch (e) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    //-----------------------------------------------------------
    //PUT INFORME
    async update_Informe(informe) {
      try {
        const resp = await api.put(
          `/GastosComprobar/ReportesSolicitudesGastosComprobar/${informe.id}`,
          informe
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
      } catch (e) {
        return {
          success: false,
          data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
        };
      }
    },

    /******************************************EVIDENCIAS*****************************************************/
    initEvidencia() {
      this.evidencia.id = null;
      this.evidencia.descripcion = null;
      this.evidencia.evidencia_URL = null;
      this.evidencia.evidencia = null;
      this.list_Evidencias = [];
    },

    //-----------------------------------------------------------
    //GET EVIDENCIAS BY SOLICITUD
    async load_Evidencias(solicitud_id) {
      try {
        this.loading = true;
        this.list_Evidencias = [];
        const resp = await api.get(
          `/GastosComprobar/EvidenciasSolicitudesViaticos/BySolicitud/${solicitud_id}`
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
    //POST EVIDENCIA
    async create_Evidencia(solicitud_id, evidencia) {
      try {
        const resp = await api.post(
          `/GastosComprobar/EvidenciasSolicitudesViaticos/${solicitud_id}`,
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
    //DELETE EVIDENCIA
    async delete_Evidencia(id) {
      try {
        const resp = await api.delete(
          `/GastosComprobar/EvidenciasSolicitudesViaticos/${id}`
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
    //POST LEER XML
    async leer_XML(xml) {
      try {
        const resp = await api.post("/LectorXML", xml, {
          headers: {
            "Conten-Type": "multipart/form-data",
          },
        });
        if (resp.status == 200) {
          const { success, data, repetido } = resp.data;
          if (data != null) {
            if (success === true) {
              let fecha = data.fecha_Comprobante.split("T")[0].split("-");
              this.comprobacion.fecha_Comprobante = `${fecha[0]}-${fecha[1]}-${fecha[2]}`;
              this.comprobacion.folio = data.folio;
              this.comprobacion.emisor = data.emisor;
              this.comprobacion.importe = data.importe;
              this.comprobacion.rfC_Receptor = data.rfC_Receptor;
              return { success, data, repetido };
            } else if (repetido == true) {
              return { success, data, repetido };
            } else {
              return { success, data };
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
      }
    },
  },
});
