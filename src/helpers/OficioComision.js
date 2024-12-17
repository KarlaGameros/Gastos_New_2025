import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useDistribucionStore } from "src/stores/distribuciones-store";
import { useMisSolicitudesStore } from "src/stores/mis-solicitudes-store";

const OficioComision = async (id) => {
  try {
    const misSolicitudesStore = useMisSolicitudesStore();
    const distribucionStore = useDistribucionStore();
    const { solicitud } = storeToRefs(misSolicitudesStore);
    const { list_Distribuciones } = storeToRefs(distribucionStore);
    //--------------------------------------------------------------------------//
    await misSolicitudesStore.load_Solicitud(id);
    await distribucionStore.load_Distribuciones(id);
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.setPage();
    doc.setFontSize(20);
    doc.setFont("bold");
    let pdfWidth = doc.internal.pageSize.getWidth();
    let x = 10;
    let y = 15;
    let img = new Image();
    img.src = require("../assets/IEEN300.png");

    function createHeader() {
      doc.addImage(img, "png", 10, 5, 35, 21);
      doc.setFontSize(14);
      doc.text(
        "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n  OFICIO DE COMISIÓN",
        110,
        15,
        null,
        null,
        "center"
      );
      doc.setFontSize(12);
      doc.text(`FOLIO: ${solicitud.value.folio}`, 158, 30);
    }

    function createFooter() {
      doc.setPage(i + 1);
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Página " + (i + 1) + " de " + newPageCount,
        200,
        275,
        null,
        null,
        "right"
      );
    }
    y += 20;
    doc.setFontSize(12);
    //Evaluar el tamaño del puesto
    var strArrSolicitante = doc.splitTextToSize(
      solicitud.value.empleado_Solicitante,
      pdfWidth - 70
    );
    let rectHeight = 10 * strArrSolicitante.length;
    doc.rect(x - 2, y, 45, rectHeight, "S");
    doc.rect(x + 43, y, 150, rectHeight, "S");
    y += 7;
    doc.text("Comisionado:", x + 10, y);
    doc.text(strArrSolicitante, x + 48, y);
    //Area
    doc.rect(
      x - 2,
      y + rectHeight - 7,
      45,
      rectHeight / strArrSolicitante.length,
      "S"
    );
    doc.rect(
      x + 43,
      y + rectHeight - 7,
      150,
      rectHeight / strArrSolicitante.length,
      "S"
    );
    doc.text("Área:", x + 10, y + rectHeight);
    doc.text(solicitud.value.area, x + 48, y + rectHeight);
    y += rectHeight + 3;
    //Actividad
    var strArrActividad = doc.splitTextToSize(
      solicitud.value.actividad,
      pdfWidth - 70
    );
    let rectActHeight = 6 * strArrActividad.length;
    doc.rect(x - 2, y, 45, rectActHeight + 1, "S");
    doc.rect(x + 43, y, 150, rectActHeight + 1, "S");
    y += 6;
    doc.text("Actividad:", x + 10, y);
    doc.text(strArrActividad, x + 48, y);
    //Destino
    var strArrDestino = doc.splitTextToSize(
      solicitud.value.destino_String,
      pdfWidth - 70
    );
    y = y + (rectActHeight + 1) - 6;
    let rectDestHeight = 8 * strArrDestino.length;
    doc.rect(x - 2, y, 45, rectDestHeight, "S");
    doc.rect(x + 43, y, 150, rectDestHeight, "S");
    y += 7;
    doc.text("Destino:", x + 10, y);
    doc.text(strArrDestino, x + 48, y);
    //Fecha
    y += rectDestHeight - 7;
    doc.rect(x - 2, y, 45, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x - 2 + 45, y, 51, rectDestHeight / strArrDestino.length, "S");
    doc.rect(
      x - 2 + 45 + 51,
      y,
      45,
      rectDestHeight / strArrDestino.length,
      "S"
    );
    doc.rect(x - 2 + 141, y, 54, rectDestHeight / strArrDestino.length, "S");
    y += 7;
    doc.text("Fecha y hora de salida:", x + 1, y);
    doc.text(solicitud.value.fecha_Salida, x + 48, y);
    doc.text("Fecha y hora de llegada:", x + 96, y);
    doc.text(solicitud.value.fecha_LLegada, x + 145, y);
    //Dias
    y += 1;
    doc.rect(x - 2, y, 45, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x - 2 + 45, y, 25, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x - 2 + 70, y, 26, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x - 2 + 96, y, 25, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x - 2 + 121, y, 35, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x - 2 + 156, y, 39, rectDestHeight / strArrDestino.length, "S");

    y += 7;
    doc.text("No. noches:", x + 10, y);
    doc.text(`${solicitud.value.no_Noches}`, x + 55, y);
    doc.text("No. días:", x + 75, y);
    doc.text(`${solicitud.value.no_Dias}`, x + 105, y);
    doc.text("Pernoctado:", x + 126, y);
    doc.text(`${solicitud.value.pernoctado == true ? "Si" : "No"}`, x + 170, y);
    y += 1;
    doc.rect(x - 2, y, 45, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x + 43, y, 150, rectDestHeight / strArrDestino.length, "S");
    y += 5;
    doc.text("Medio de transporte:", x + 1, y);
    doc.text(
      `${solicitud.value.medio_Transporte} ${
        solicitud.value.medio_Transporte == "Ninguno"
          ? ""
          : solicitud.value.medio_Transporte_Especifico
      } ${
        solicitud.value.medio_Transporte_Especifico == "Vehículo oficial"
          ? " " + solicitud.value.vehiculo
          : ""
      }`,
      x + 48,
      y
    );
    y += 10;
    doc.setFontSize(15);
    let sub_title = "Desglose financiero";
    let sub_titleWidth = doc.getTextWidth(sub_title);
    let sub_titleX = (pdfWidth - sub_titleWidth) / 2;
    doc.text(sub_titleX, y, sub_title);
    y += 5;
    doc.rect(x - 2, y, 100, rectDestHeight / strArrDestino.length, "S");
    doc.rect(x + 98, y, 95, rectDestHeight / strArrDestino.length, "S");
    y += 5;
    doc.setFontSize(12);
    doc.text("Concepto", x + 42, y);
    doc.text("Monto asignado", x + 130, y);
    y += 3;
    for (let i = 0; i < list_Distribuciones.value.length; i++) {
      doc.rect(x - 2, y, 100, rectDestHeight / strArrDestino.length, "S");
      doc.rect(x + 98, y, 95, rectDestHeight / strArrDestino.length, "S");
      y += 5;
      doc.text(list_Distribuciones.value[i].c_Gasto, x + 1, y);
      doc.text(`$${list_Distribuciones.value[i].importe}`, x + 130, y);
      y += 3;
    }
    doc.rect(x + 98, y, 95, rectDestHeight / strArrDestino.length, "S");
    y += 5;
    doc.setFontSize(14);
    doc.text(`Total asignado: ${solicitud.value.monto_Asignado}`, x + 125, y);
    y += 10;

    //--------------------------------------------------------------------------//
    //Numeracion de paginas y footer
    if (y > 213) {
      doc.addPage();
      doc.setFontSize(12);
      let strArrEscrito = doc.splitTextToSize(
        "En caso de que no se comprueben los gastos y viáticos que amparan la suma recibida, dentro de los 8 días naturales siguientes a la fecha en que concluya la comisión conferida, autorizo para que se me descuente de mi sueldo.",
        pdfWidth - 20
      );
      y = 170;
      doc.text(strArrEscrito, x - 2, y, {
        align: "justify",
        maxWidth: pdfWidth - 20,
      });
      //Firmas Solicitante y jefe de area
      y += 35;
      doc.rect(x, y, 90, 1, "F");
      doc.rect(x + 105, y, 90, 1, "F");
      y += 5;
      let strArrEmpSolicitante = doc.splitTextToSize(
        solicitud.value.empleado_Solicitante,
        100
      );
      let strArrEmpResponsable = doc.splitTextToSize(
        solicitud.value.responsable_Area,
        100
      );

      doc.setFontSize(11);
      doc.text("Solicitante", x + 35, y - 20);
      doc.text(strArrEmpSolicitante, x, y);
      doc.text("Autoriza comisión", x + 135, y - 20);
      doc.text(
        `Autorizado con fecha ${solicitud.value.fecha_Aprobacion_JA}`,
        x + 105,
        y - 10
      );
      doc.text(strArrEmpResponsable, x + 105, y);
      //Firmas recursos financieros y administración
      y += 25;
      doc.rect(x, y, 90, 1, "F");
      doc.rect(x + 105, y, 90, 1, "F");
      y += 5;
      let strArrRecFinanciero = doc.splitTextToSize(
        solicitud.value.empleado_Rec_Financieros,
        90
      );
      let strArrEmpResponsableAdmon = doc.splitTextToSize(
        solicitud.value.responsable_Administracion,
        90
      );
      doc.text("Revisó", x + 37, y - 20);
      doc.text(
        `Revisado con fecha ${solicitud.value.fecha_Aprobacion_RF}`,
        x,
        y - 10
      );
      doc.text(strArrRecFinanciero, x, y);
      doc.text("Autoriza gastos de viaje y viáticos", x + 121, y - 20);
      doc.text(strArrEmpResponsableAdmon, x + 105, y);
    } else {
      doc.setFontSize(12);
      let strArrEscrito = doc.splitTextToSize(
        "En caso de que no se comprueben los gastos y viáticos que amparan la suma recibida, dentro de los 8 días naturales siguientes a la fecha en que concluya la comisión conferida, autorizo para que se me descuente de mi sueldo.",
        pdfWidth - 20
      );
      doc.text(strArrEscrito, x - 2, y, {
        align: "justify",
        maxWidth: pdfWidth - 20,
      });
      //Firmas Solicitante y jefe de area
      y += 35;
      doc.rect(x, y, 90, 1, "F");
      doc.rect(x + 105, y, 90, 1, "F");
      y += 5;
      let strArrEmpSolicitante = doc.splitTextToSize(
        solicitud.value.empleado_Solicitante,
        100
      );
      let strArrEmpResponsable = doc.splitTextToSize(
        solicitud.value.responsable_Area,
        100
      );
      doc.setFontSize(11);
      doc.text("Solicitante", x + 35, y - 20);
      doc.text(strArrEmpSolicitante, x, y);
      doc.text("Autoriza comisión", x + 135, y - 20);
      doc.text(
        `Autorizado con fecha ${solicitud.value.fecha_Aprobacion_JA}`,
        x + 105,
        y - 10
      );
      doc.text(strArrEmpResponsable, x + 105, y);
      //Firmas recursos financieros y administración
      y += 25;
      doc.rect(x, y, 90, 1, "F");
      doc.rect(x + 105, y, 90, 1, "F");
      y += 5;
      let strArrRecFinanciero = doc.splitTextToSize(
        solicitud.value.empleado_Rec_Financieros,
        90
      );
      let strArrEmpResponsableAdmon = doc.splitTextToSize(
        solicitud.value.responsable_Administracion,
        90
      );
      doc.text("Revisó", x + 37, y - 20);
      doc.text(
        `Revisado con fecha ${solicitud.value.fecha_Aprobacion_RF}`,
        x,
        y - 10
      );
      doc.text(strArrRecFinanciero, x, y);
      doc.text("Autoriza gastos de viaje y viáticos", x + 121, y - 20);
      doc.text(strArrEmpResponsableAdmon, x + 105, y);
    }

    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }
    doc.save(`${solicitud.value.folio}.pdf`);
    if (solicitud.value.fecha_Impresion == "Sin registro") {
      const resp = await misSolicitudesStore.imprimir_Gasto(id);
      if (resp.success == true) {
        misSolicitudesStore.load_Mis_Solicitudes();
        $q.notify({
          type: "positive",
          message: resp.data,
        });
      } else {
        $q.notify({
          type: "negative",
          message: resp.data,
        });
      }
    }
    $q.loading.hide();
    return {
      success: true,
      msj: "Recibo generado con éxito",
    };
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default OficioComision;
