import { jsPDF } from "jspdf";

const GeneraInforme = async (solicitud_gasto, evidencias) => {
  try {
    const doc = new jsPDF({ orientation: "portrait", format: "letter" });

    let pdfWidth = doc.internal.pageSize.getWidth();
    var imgWidth = 30;
    var imgHeight = 20;
    let x = 10;
    let y = 22;
    let img = new Image();

    function createHeader() {
      doc.setFontSize(20);
      doc.setFont("bold");
      img.src = require("../assets/IEEN300.png");
      doc.addImage(img, "png", 10, 5, 30, 20);
      let title = "Instituto Estatal Electoral de Nayarit";
      let titleWidth = doc.getTextWidth(title);
      let titleX = (pdfWidth - titleWidth) / 2;
      doc.text(titleX, 15, title);
      doc.setFontSize(15);

      title = `Evidencias ${solicitud_gasto.folio}`;
      titleWidth = doc.getTextWidth(title);
      // Calculate the x coordinate to center the title
      doc.setFontSize(15);
      titleX = (pdfWidth - titleWidth) / 2;
      doc.text(titleX, 20, title);
    }

    // Get the width of the PDF document
    imgWidth = 90;
    imgHeight = 110;
    x = 10;
    y = 10;

    function createFooter() {
      doc.setFontSize(14);
      y = 260;
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
        260,
        null,
        null,
        "right"
      );
    }

    let vuelta = 1;
    for (let evidencia of evidencias) {
      switch (vuelta) {
        case 1:
          x = 10;
          y = 35;
          break;
        case 2:
          x = 110;
          y = 35;
          break;
        case 3:
          x = 10;
          y = 155;
          break;
        case 4:
          x = 110;
          y = 155;
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

    //--------------------------------------------------------------------------//

    var newPageCount = doc.internal.getNumberOfPages();
    for (var i = 0; i < newPageCount; i++) {
      createHeader();
      createFooter();
    }
    doc.save(`${solicitud_gasto.folio}.pdf`);
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

export default GeneraInforme;
