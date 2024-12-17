import { ref } from "vue";
import { useQuasar } from "quasar";
import { EncryptStorage } from "storage-encryption";
import { useSolicitudesRFStore } from "src/stores/solicitudes-rf-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";
import { useSolicitudesGCReemRFStore } from "src/stores/solicitudes-rf-gc-reembolso-store";
import { useSolicitudesAreaStore } from "src/stores/solicitudes-area-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";
import { useSolicitudesAreaGCReembolsoStore } from "src/stores/solicitudes-area-gc-reembolso-store";
import * as signalR from "@microsoft/signalr";

//----------------------------------------------------------

const solicitudesAreasStore = useSolicitudesAreaStore();
const solicitudesAreaGCReembolsoStore = useSolicitudesAreaGCReembolsoStore();
const misSolicitudesStore = useMisSolicitudesStore();
const devengarDevengadoStore = useDevengarDevengadoStore();
const solicitudesGCReemRFStore = useSolicitudesGCReemRFStore();
const solicitudesRFStore = useSolicitudesRFStore();
const encryptStorage = new EncryptStorage("SECRET_KEY", "sessionStorage");
const onLine = ref(false);
const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://sistema.ieenayarit.org:9170/hubUniverso", {
    accessTokenFactory: () => encryptStorage.decrypt("key"),
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();

export function useNotifications() {
  const $q = useQuasar();

  const startConnection = async () => {
    try {
      await connection.start();
      onLine.value = true;
      console.info("SignalR Connected.");
    } catch (err) {
      onLine.value = false;
      console.error("SignalR Connection Error: ", err);
      setTimeout(startConnection, 5000);
    }
  };

  const onReceiveNotification = () => {
    connection.on("notificarUsuario", (data) => {
      $q.notify({
        position: "top-right",
        message: data.titulo,
        icon: data.tipo == "I" ? "announcement" : "warning",
        color:
          data.tipo == "I" ? "purple" : data.tipo == "E" ? "red" : "orange",
        caption: data.sistema,
        actions: [
          {
            icon: "close",
            color: "white",
            round: true,
            handler: () => {},
          },
        ],
      });
      cargarData();
      createNotification(data.sistema, data.titulo);
    });
  };

  const cargarData = async () => {
    if (encryptStorage.decrypt("perfil") != "Personal") {
      await solicitudesAreasStore.load_Solicitudes_Area();
      await solicitudesAreaGCReembolsoStore.load_Solicitudes_Area_Devengar_Devengado();
      await misSolicitudesStore.load_Mis_Solicitudes();
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
      await solicitudesGCReemRFStore.load_Solicitudes_RF_DD_Aprobadas();
      await solicitudesGCReemRFStore.load_Solicitudes_RF_Devengar_Devengado();
      await solicitudesRFStore.load_Solicitudes_RF();
      await solicitudesRFStore.load_solicitudes_rec_financieros_aprobadas();
    } else {
      await misSolicitudesStore.load_Mis_Solicitudes();
      await devengarDevengadoStore.load_Solicitudes_Devengar_Devengado();
    }
  };

  const createNotification = (title, mensaje) => {
    if (!("Notification" in window)) {
      alert("Este navegador no permite notificaciones");
    } else if (Notification.permission === "granted") {
      const notificacion = new Notification(title, {
        body: mensaje,
      });
      notificacion.onclick = function () {
        window.open("http://sistema.ieenayarit.org:9177");
      };
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          const notificacion = new Notification(title, {
            icon: "https://cdn-icons-png.flaticon.com/512/6828/6828737.png",
            body: mensaje,
          });
          notificacion.onclick = function () {
            window.open("http://sistema.ieenayarit.org:9177");
          };
        }
      });
    }
  };

  return { startConnection, onReceiveNotification, onLine };
}
