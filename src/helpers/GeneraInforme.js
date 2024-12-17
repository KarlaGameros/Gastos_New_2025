import { jsPDF } from "jspdf";

const GeneraInforme = async (solicitud_gasto, informe, evidencias) => {
  try {
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });
    doc.setPage();
    doc.setFontSize(20);
    doc.setFont("bold");
    let pdfWidth = doc.internal.pageSize.getWidth();
    var imgWidth = 30;
    var imgHeight = 20;
    let x = 10;
    let y = 22;
    let img = new Image();
    img.src = require("../assets/IEEN300.png");

    let title = "Instituto Estatal Electoral de Nayarit";
    function createHeader(subtitle) {
      doc.addImage(img, "png", 10, 5, 30, 20);
      doc.setFontSize(20);
      doc.text(title, 110, 15, null, null, "center");
      doc.setFontSize(15);
      doc.text(subtitle, 90, 22);
      doc.setFontSize(14);
      doc.text(`Folio: ${solicitud_gasto.folio}`, 160, 22);
    }

    createHeader("Informe de comisión");

    doc.setFontSize(12);
    y = 35;
    doc.text(
      "En términos de lo dispuesto por los lineamientos administrativos para el ejercicio y control del gasto del Instituto Estatal Electoral de Nayarit, titulo V, numeral 5 de los viáticos y gasto de viaje, punto 12, en relación con el artículo 33 numeral IX de la Ley de Transparencia y Acceso a la Información del Estado de Nayarit, se rinde informe de comisión:",
      x,
      y,
      {
        align: "justify",
        maxWidth: pdfWidth - 20,
      }
    );

    //----------------------------------------------------------------
    //DATOS DEL COMISIONADO
    y += 20;
    let rectHeight = 8;
    doc.rect(x - 2, y, pdfWidth - 15, rectHeight, "S");
    let titleDatosComisionado = "Datos del comisionado";
    let titleDatosPersonalWidth = doc.getTextWidth(title);
    let titlexDatosPerosnal = (pdfWidth - titleDatosPersonalWidth) / 2;
    y += 7;
    doc.text(titleDatosComisionado, titlexDatosPerosnal, y);
    y += 1;
    let strArrNombre = doc.splitTextToSize(
      solicitud_gasto.empleado_Solicitante,
      pdfWidth - 77
    );
    let rectNomHeight = 6 * strArrNombre.length;
    doc.rect(x - 2, y, 55, rectNomHeight, "S");
    doc.rect(x + 53, y, 146, rectNomHeight, "S");
    y += 5;
    doc.text("Nombre del comisionado:", x + 3, y);
    doc.text(solicitud_gasto.empleado_Solicitante, x + 55, y, {
      align: "justify",
      maxWidth: pdfWidth - 79,
    });
    y += rectNomHeight - 5;
    doc.rect(x - 2, y, 55, rectHeight, "S");
    doc.rect(x + 53, y, 146, rectHeight, "S");
    y += 5;
    doc.text("Adscripción:", x + 3, y);
    doc.text(solicitud_gasto.area, x + 55, y);
    y += 7;
    doc.rect(x - 2, y, pdfWidth - 15, rectHeight, "S");
    y += 7;

    //----------------------------------------------------------------
    //DATOS DE LA COMISION
    let titleDatosComision = "Datos de la comisión";
    let titleDatosComisionWidth = doc.getTextWidth(titleDatosComision);
    let titlexDatosComision = (pdfWidth - titleDatosComisionWidth) / 2;
    doc.text(titleDatosComision, titlexDatosComision, y);
    y += 1;
    doc.rect(x - 2, y, 55, rectHeight, "S");
    doc.rect(x + 53, y, 146, rectHeight, "S");
    y += 7;
    doc.text("No. Oficio comisión:", x + 3, y);
    doc.text(solicitud_gasto.folio, x + 55, y);
    y += 1;

    let strArrDest = doc.splitTextToSize(
      solicitud_gasto.destino_String,
      pdfWidth - 77
    );
    let rectDestHeight = 6 * strArrDest.length + 2;

    doc.rect(x - 2, y, 55, rectDestHeight, "S");
    doc.rect(x + 53, y, 146, rectDestHeight, "S");

    doc.text("Lugar de la comisión:", x + 3, y + 6);
    doc.text(solicitud_gasto.destino_String, x + 55, y + 6, {
      align: "justify",
      maxWidth: pdfWidth - 79,
    });
    y += rectDestHeight;
    doc.rect(x - 2, y, 55, rectHeight, "S");
    doc.rect(x + 53, y, 146, rectHeight, "S");
    y += 7;
    doc.text("Periodo de la comisión:", x + 3, y);
    doc.text(
      `Del ${solicitud_gasto.fecha_Salida} al ${solicitud_gasto.fecha_LLegada}`,
      x + 55,
      y
    );
    y += 1;
    doc.rect(x - 2, y, 55, rectHeight, "S");
    doc.rect(x + 53, y, 146, rectHeight, "S");
    y += 7;
    doc.text("Medio de transporte:", x + 3, y);
    doc.text(
      `${solicitud_gasto.medio_Transporte} ${
        solicitud_gasto.medio_Transporte_Especifico ?? ""
      }`,
      x + 55,
      y
    );
    y += 1;
    doc.rect(x - 2, y, 55, rectHeight, "S");
    doc.rect(x + 53, y, 146, rectHeight, "S");
    y += 7;
    doc.text("Vehículo:", x + 3, y);
    doc.text(solicitud_gasto.vehiculo ?? "N/A", x + 55, y);
    y += 1;
    doc.rect(x - 2, y, 55, rectHeight, "S");
    doc.rect(x + 53, y, 146, rectHeight, "S");
    y += 7;
    let importeWidth = doc.getTextWidth(`$${solicitud_gasto.monto_Asignado}`);
    doc.text("Monto erogado:", x + 3, y);
    doc.text(
      `${solicitud_gasto.monto_Asignado}`,
      pdfWidth - 10 - importeWidth,
      y
    );
    y += 1;
    let strArrObjetivo = doc.splitTextToSize(
      solicitud_gasto.actividad,
      pdfWidth - 77
    );
    let rectActHeight = 5.5 * strArrObjetivo.length;
    doc.rect(x - 2, y, 55, rectActHeight + 2, "S");
    doc.rect(x + 53, y, 146, rectActHeight + 2, "S");
    y += 5;
    doc.text("Objetivo de la comisión:", x + 3, y);
    doc.text(solicitud_gasto.actividad, x + 55, y, {
      align: "justify",
      maxWidth: pdfWidth - 79,
    });

    let strArrResumen = doc.splitTextToSize(
      informe.actividad_Realizada,
      pdfWidth - 20
    );

    //----------------------------------------------------------------
    //RESUMEN
    let rectResumHeight = 5.5 * strArrResumen.length;
    if (y + rectResumHeight + rectActHeight >= 244) {
      doc.addPage();
      doc.setPage();
      x = 10;
      y = 10;
    } else {
      y += rectActHeight;
    }
    doc.rect(x - 2, y, pdfWidth - 15, rectHeight, "S");
    let titleResumen = "Resumen de las actividades realizadas";
    let titlerESUMENWidth = doc.getTextWidth(titleResumen);
    let titlexResumen = (pdfWidth - titlerESUMENWidth) / 2;
    y += 7;
    doc.text(titleResumen, titlexResumen, y);
    y += 1;
    doc.rect(x - 2, y, pdfWidth - 15, rectResumHeight, "S");
    y += 5;
    doc.text(informe.actividad_Realizada, x, y, {
      align: "justify",
      maxWidth: pdfWidth - 20,
    });
    y += rectResumHeight;
    if (y > 210) {
      doc.addPage();
      doc.setPage();
      x = 10;
      y = 10;
    }

    //----------------------------------------------------------------
    //CONCLUSIÓN
    doc.rect(x - 2, y, pdfWidth - 15, rectHeight, "S");
    let titleConclusion = "Conclusión y resultado obtenido";
    let titlerConclusionWidth = doc.getTextWidth(titleConclusion);
    let titlexConslusion = (pdfWidth - titlerConclusionWidth) / 2;
    y += 6;
    doc.text(titleConclusion, titlexConslusion, y, {
      align: "justify",
      maxWidth: pdfWidth - 20,
    });

    let strArrConclusion = doc.splitTextToSize(
      informe.conclusion,
      pdfWidth - 20
    );
    let rectConcluHeight = 5.5 * strArrConclusion.length;
    y += 2;
    doc.rect(x - 2, y, pdfWidth - 15, rectConcluHeight, "S");
    y += 5;
    doc.text(informe.conclusion, x, y, {
      maxWidth: pdfWidth - 20,
    });

    doc.addPage();
    doc.setPage();

    imgWidth = 90;
    imgHeight = 110;

    createHeader("Evidencias");

    let vuelta = 1;
    for (let evidencia of evidencias) {
      switch (vuelta) {
        case 1:
          x = 10;
          y = 25;
          break;
        case 2:
          x = 110;
          y = 25;
          break;
        case 3:
          x = 10;
          y = 138;
          break;
        case 4:
          x = 110;
          y = 138;
      }
      const extension = evidencia.evidencia_URL.split(".").pop();
      doc.addImage(evidencia.base_64, extension, x, y, imgWidth, imgHeight);
      vuelta++;
      if (vuelta == 5 && vuelta != evidencias.length + 1) {
        doc.addPage();
        doc.setPage();
        x = 10;
        y = 10;
        vuelta = 1;
      }
    }

    function createFooter() {
      doc.setFontSize(14);
      y = 255;
      let titleAtte = "Atentamente";
      let titleAtteWidth = doc.getTextWidth(titleAtte);
      let titlexAtte = (pdfWidth - titleAtteWidth) / 2;
      doc.text(titleAtte, titlexAtte, y);
      y += 10;
      doc.setFontSize(12);

      doc.rect(50, y, 110, 1, "F");
      y += 5;
      let titleAtteP = solicitud_gasto.empleado_Solicitante;
      let titleAtteWidthP = doc.getTextWidth(titleAtteP);
      let titlexAtteP = (pdfWidth - titleAtteWidthP) / 2;
      doc.text(titleAtteP, titlexAtteP, y);

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
    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createFooter();
    }
    doc.save(`${solicitud_gasto.folio}.pdf`);
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

export default GeneraInforme;
