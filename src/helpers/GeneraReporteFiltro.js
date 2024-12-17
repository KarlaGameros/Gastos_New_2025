import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const GeneraReporteFiltro = async (tipo, soliciutes, titulo) => {
  try {
    let img = new Image();
    let totalPagesExp = "{total_pages_count_string}";
    img.src = require("../assets/IEEN300.png");
    jsPDF.autoTableSetDefaults({
      headStyles: { fillColor: [84, 37, 131], halign: "center" },
      styles: {
        halign: "center",
        valign: "middle",
      },
    });
    const doc = new jsPDF({
      orientation: "landscape",
      format: "letter",
    });
    doc.addImage(img, "png", 15, 8, 35, 18);
    doc.setFontSize(15);
    doc.text(titulo, 140, 15, null, null, "center", 22);
    autoTable(doc, {
      theme: "grid",
      startY: 35,
      head: [
        tipo == "gc"
          ? [
              "#",
              "Folio",
              "Estatus",
              "Área",
              "Empleado solicitante",
              "Fecha salida",
              "Fecha llegada",
              "Monto aprobado",
              "Monto ejercido",
              "Monto reintegro",
              "Saldo",
            ]
          : [
              "#",
              "Folio",
              "Estatus",
              "Área",
              "Empleado solicitante",
              "Fecha actividad",
              "Monto aprobado",
              "Monto ejercido",
              "Monto reintegro",
              "Saldo",
            ],
      ],
      body: soliciutes,
      didDrawPage: function (data) {
        let str = "Página " + doc.internal.getNumberOfPages();
        if (typeof doc.putTotalPages === "function") {
          str = str + " de " + totalPagesExp;
        }
        doc.setFontSize(11);
        doc.text(str, 310, 205, null, null, "right");
      },
    });
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages(totalPagesExp);
    }
    doc.save("Reporte_Gastos_Comprobar" + ".pdf");
  } catch (error) {
    return {
      success: false,
      data: "Ocurrió un error, inténtelo de nuevo. Si el error persiste, contacte a soporte",
    };
  }
};

export default GeneraReporteFiltro;
