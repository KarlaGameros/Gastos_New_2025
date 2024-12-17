import { jsPDF } from "jspdf";
import { storeToRefs } from "pinia";
import { useFacturasStore } from "src/stores/facturas-store";
import { useDevengarDevengadoStore } from "src/stores/devengar-devengado-store";

const OficioReembolso = async (id) => {
  try {
    const devengarDevengadoStore = useDevengarDevengadoStore();
    const facturaStore = useFacturasStore();
    const { list_Facturas_By_Solicitud } = storeToRefs(facturaStore);
    const { solicitud } = storeToRefs(devengarDevengadoStore);

    //--------------------------------------------------------------------------//
    await devengarDevengadoStore.load_Solicitud_DD(id);
    await facturaStore.load_Facturas_Bysolicitud(id);
    let doc = new jsPDF({
      format: "a4",
    });
    doc.setPage();
    doc.setFontSize(20);
    doc.setFont("bold");
    let pdfWidth = doc.internal.pageSize.getWidth();
    var imgWidth = 30;
    var imgHeight = 20;
    let x = 10;
    let y = 15;
    let img = new Image();
    img.src = require("../assets/IEEN300.png");

    //----------------------------------------------------------------
    //HEADER
    function createHeader() {
      doc.addImage(img, "PNG", 10, x, imgWidth, imgHeight);
      doc.setFontSize(14);
      doc.text(
        "INSTITUTO ESTATAL ELECTORAL DE NAYARIT \n  OFICIO DE REEMBOLSO",
        110,
        15,
        null,
        null,
        "center"
      );
      doc.setFontSize(12);
      if (solicitud.value.gastos_Representacion) {
        doc.text("GASTOS DE REPRESENTACIÓN", 71, y + 15);
      }
      y = 30;
      doc.text(`FOLIO: ${solicitud.value.folio}`, 158, y);
    }

    //----------------------------------------------------------------
    //DATOS DE LA SOLICITUD
    y = 40;
    doc.setFontSize(12);
    var strArrSolicitante = doc.splitTextToSize(
      solicitud.value.empleado_Solicitante,
      pdfWidth - 70
    );
    let rectHeight = 10 * strArrSolicitante.length;
    doc.rect(x - 2, y, 45, rectHeight, "S");
    doc.rect(x + 43, y, 150, rectHeight, "S");
    y += 7;
    doc.text("Solicitante:", x + 10, y);
    doc.text(strArrSolicitante, x + 48, y);

    //------------------------------
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

    //------------------------------
    //Motivo
    var strArrJustificacion = doc.splitTextToSize(
      solicitud.value.motivo,
      pdfWidth - 70
    );
    let rectActHeight = 5.5 * strArrJustificacion.length + 1;
    doc.rect(x - 2, y, 45, rectActHeight, "S");
    doc.rect(x + 43, y, 150, rectActHeight, "S");
    y += 6;
    doc.text("Justificación:", x + 10, y);
    doc.text(strArrJustificacion, x + 48, y);

    //------------------------------
    //Tipo de solicitud
    y = y + rectActHeight - 6;
    doc.rect(x - 2, y, 45, 10, "S");
    doc.rect(x + 43, y, 150, 10, "S");
    y += 7;
    doc.text("Tipo de solicitud:", x + 5, y);
    doc.text(solicitud.value.tipo_Evento, x + 48, y);

    //------------------------------
    //Fecha
    y += 3;
    doc.rect(x - 2, y, 45, 10, "S");
    doc.rect(x + 43, y, 150, 10, "S");
    y += 9;
    doc.text("Fecha de la solicitud:", x + 5, y);
    doc.text(solicitud.value.fecha_Solicitud, x + 48, y);
    y += 7;
    doc.rect(x - 2, y - 6, 45, 10, "S");
    doc.rect(x - 2 + 45, y - 6, 51, 10, "S");
    doc.rect(x - 2 + 45 + 51, y - 6, 45, 10, "S");
    doc.rect(x - 2 + 141, y - 6, 54, 10, "S");
    doc.text("Monto solicitado:", x + 10, y);
    doc.text(`$${solicitud.value.monto_Utilizado}`, x + 48, y);
    doc.text("Monto aprobado:", x + 96, y);
    doc.text(`$${solicitud.value.monto_Aprobado}`, x + 145, y);

    //------------------------------
    //Desgloce
    y += 10;
    doc.setFontSize(15);
    let sub_title = "Desglose del monto solicitado";
    let sub_titleWidth = doc.getTextWidth(sub_title);
    let sub_titleX = (pdfWidth - sub_titleWidth) / 2;
    doc.text(sub_titleX, y, sub_title);
    y += 5;
    doc.rect(x - 2, y, 100, 9, "S");
    doc.rect(x + 98, y, 95, 9, "S");
    y += 5;
    doc.setFontSize(12);
    doc.text("Folio", x + 42, y);
    doc.text("Importe", x + 130, y);
    y += 4;
    let list = list_Facturas_By_Solicitud.value.filter(
      (x) => x.estatus == "Aprobado por recursos financieros"
    );
    for (let i = 0; i < list.length; i++) {
      doc.rect(x - 2, y, 100, 10, "S");
      doc.rect(x + 98, y, 95, 10, "S");
      y += 6;
      doc.text(list[i].folio, x + 1, y);
      doc.text(`$${list[i].importe}`, x + 130, y);
      y += 4;
    }
    doc.rect(x + 98, y, 95, 10, "S");
    y += 5;
    doc.setFontSize(14);
    doc.text(`Total asignado: $${solicitud.value.monto_Aprobado}`, x + 125, y);

    if (y > 229) {
      doc.addPage();
    } else {
      y += 25;
    }
    doc.setFontSize(12);

    //------------------------------
    //FIRMAS SOLICITANTE, JEFE DE ÁREA Y RECURSOS FINANCIEROS
    let strArrEscrito = doc.splitTextToSize(
      "En caso de que no se comprueben los gastos y viáticos que amparan la suma recibida, dentro de los 8 días naturales siguientes a la fecha en que concluya la comisión conferida, autorizo para que se me descuente de mi sueldo.",
      pdfWidth - 20
    );
    doc.text(strArrEscrito, x - 2, y - 10, {
      align: "justify",
      maxWidth: pdfWidth - 20,
    });

    y += 20;
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
      `Autorizado con fecha ${solicitud.value.fecha_Aprobacion_Responsable_Area}`,
      x + 105,
      y - 10
    );
    doc.text(strArrEmpResponsable, x + 105, y);
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
      `Revisado con fecha ${solicitud.value.fecha_Aprobacion_Administracion}`,
      x,
      y - 10
    );
    doc.text(strArrRecFinanciero, x, y);
    doc.text("Autoriza gastos de viaje y viáticos", x + 121, y - 20);
    doc.text(strArrEmpResponsableAdmon, x + 105, y);

    function createFooter() {
      doc.setPage(i + 1);
      doc.setTextColor(0, 0, 0);
      doc.text(
        "Página " + (i + 1) + " de " + newPageCount,
        200,
        290,
        null,
        null,
        "right"
      );
    }
    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }

    doc.save(`${solicitud.value.folio}.pdf`);
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

export default OficioReembolso;
