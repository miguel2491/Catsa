// CotizacionPDF.js
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../assets/images/logo_name.png";
import logo_qr from "../../assets/url_cot.png";
import marcaAgua from "../../assets/images/logo.png"; 
import { GetCotizaciones } from '../../Utilidades/Funciones';

export const generarPDF = async(idCotizacion, datos) => {
    const { data } = await GetCotizaciones(idCotizacion);
    const doc = new jsPDF();
    //=== CONFIG FOOTTER
    // Suponiendo que ya tienes tu imagen en base64 (ej: logoBase64)
    const pageHeightF = doc.internal.pageSize.getHeight();
    const pageWidthF = doc.internal.pageSize.getWidth();

    // Dimensiones de la imagen en el PDF (mm)
    const imgWidthF = 200;   // ancho de la imagen
    const imgHeightF = 20;  // alto de la imagen

    // Posición centrada en el footer
    const x = (pageWidthF - imgWidthF) / 2;
    const y = pageHeightF - imgHeightF - 5; // 5 mm arriba del borde inferior
    const logoBase64 = "data:image/png;base64,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";
    
    // Logo
    const imgWidth = 70;
    const imgHeight = 20;
    doc.addImage(logo, "PNG", 10, 10, imgWidth, imgHeight);
    doc.addImage(logo_qr, "PNG", 175, 10, 20, 20);
    // TÍTULO
    const pageWidth = doc.internal.pageSize.getWidth(); // ancho de la página
    const marginRight = 40;
    const titleText = "Cotización No. ";
    const numberText = String(idCotizacion);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const titleWidth = doc.getTextWidth(titleText + numberText);
    const xPosT = pageWidth - titleWidth - marginRight;
    const yPosT = 30; // debajo del logo
    doc.text(titleText+idCotizacion, xPosT, yPosT);
    //----------------------------------------------------------
    doc.setFont("helvetica", "regular");
    doc.setFontSize(10);
    doc.text("DIRECCION", xPosT, yPosT+5);
    doc.setTextColor(0, 0, 0); // 
    //NOMBRE CLIENTE
    doc.text("CLIENTE", 10, yPosT+10);
    //PARRAFO
    const startY = yPosT + 15; 
    const margin = 10;  // margen izquierdo/derecho
    const maxWidth = pageWidth - margin * 2;
    doc.setFont("helvetica", "bold");
    doc.text("PRESENTE", 10, startY+5);
    doc.setFont("helvetica", "regular");
    const textoPrecios = `
    Por este conducto, le agradecemos la oportunidad que nos brindan de presentarle nuestra propuesta para atender el suministro de 
    concreto premezclado para la construcción de su obra:
    `;
    const linesPrecios = doc.splitTextToSize(textoPrecios, maxWidth);
    let currenttPrecios = startY+8;
    linesPrecios.forEach(linesPrecios => {
    doc.text(linesPrecios, margin, currenttPrecios);
        currenttPrecios += 6; // espacio entre líneas
    });
    doc.text("OBRA:", 20, currenttPrecios - 4);
    //***************************************************************************************************************************************************************** */
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("1). PRECIOS", 10, currenttPrecios + 2);
    //-------------------------------------------------------
    // Tabla de productos
    const columns = ["Vol.", "Producto", "Unidad", "Resistencia","Tipo de Concreto","Edad","Colocación","TMA","Precio Unitario","Precio Total"];
    const safeRows = (datos || [
    ["0", "---", "M3", 250, "CONVENCIONAL", "N", "DIRECTO", 20, 2118, 120726],
    ]).map(row => row.map(cell => {
        if (cell === null || cell === undefined) return "";
        if (typeof cell === "number") return cell.toFixed(2); // dos decimales
        return cell.toString();
    }));

    autoTable(doc, {
        startY: startY + 40,
        head: [columns],
        body: safeRows,
        theme: "striped",
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [229, 241, 251] },
    });
    //-------------------------------------------------
    const rowsT = datos || [
        ["SUBTOTAL", "$120,726.00"],
        ["IVA", "$19,316.16"],
        ["TOTAL", "$140,042.16"],
    ];

    autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 2,
        body: rowsT,
        theme: "grid",
        margin: { left: pageWidth - 75 },
        headStyles: { fillColor: [20, 100] },
        columnStyles: {
            0: { cellWidth: 30 }, 
            1: { cellWidth: 30, halign: "center" },
        }
    });
    //--------------------------------------------------------
    // Marca de agua
    const imgWidthM = 200;   // ancho de la imagen
    const imgHeightM = 190;  // alto de la imagen
    const xPos = 10;        // posición horizontal
    const yPos = 30;       // posición vertical
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.addImage(marcaAgua, "PNG", xPos, yPos, imgWidthM, imgHeightM);
    doc.setGState(new doc.GState({ opacity: 1 }));
    //************************************************************************************************************************************************************ */
    doc.text("2). CONDICIONES COMERCIALES:", 10, doc.lastAutoTable.finalY + 18);
    doc.setFontSize(8);
    doc.text("* HORARIOS", 10, doc.lastAutoTable.finalY + 28);
    //************************************************************************************************************************************************************ */
    const texto = `
        -> La lista de precios rige en horario normal de lunes a viernes de 8:00 a 18:00 hrs y sábados de 8:00 a 14:00 hrs. y dentro de un radio normal de 30 kms a la 
            ubicación de la planta. Posterior a este kilometraje y  horarios se cotizará
        -> Se recomienda realizar su pedido con 24 hrs. de anticipación en horarios de oficina en tiros directos y con un mínimo de 48 hrs de anticipación en tiros 
            bombeables.
        -> El cliente dispone de 30 min. para la recepción de concreto a partir de la llegada del mismo a la obra. Después de este lapso de tiempo, la Empresa no se 
            responsabiliza de las características (revenimiento, resistencia, etc.) del producto. Como maximo sin cargo extra se considera una estadia de 45 minutos.
        -> El Cliente es el responsable de tener accesos habilitados y en condiciones de transito seguro para ollas revolvedoras y equipo de bombeo.
        -> El cliente podrá cancelar su suministro programado con 24 horas de anticipación, teniendo en cuenta un horario máximo de las 14:00 hrs. Sin costo para
        él, posterior al mismo la cancelación generará un cargo 
    `;
    doc.setFont("helvetica", "regular");
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(texto, maxWidth);
    let currentY = doc.lastAutoTable.finalY + 32;
    lines.forEach(line => {
    doc.text(line, margin, currentY);
    currentY += 3; // espacio entre líneas
    });
    //************************************************************************************************************************************************************ */
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("* REVENIMIENTO", 10, currentY + 2);
    const txtRev = `
        => Los concretos convencionales cumplen con la NMX-155-ONNCCE-2004, en el caso de revenimientos, se deberá realizar la prueba máximo 30 minutos
            posteriores a la llegada del camión revolvedor con las tolerancias especificadas en la norma anterior.
        => De acuerdo a la Norma NMX-C-155-ONNCCE-2004, la tolerancia de revenimiento de 10 cms es de +/- 2.5 cms y para revenimientos mayores la tolerancia es
            de +/- 3.5 cms. 
    `;
    doc.setFont("helvetica", "regular");
    const linesRev = doc.splitTextToSize(txtRev, maxWidth);
    let currentYRev = currentY + 5;
    linesRev.forEach(linesRev => {
    doc.text(linesRev, margin, currentYRev);
        currentYRev += 3; // espacio entre líneas
    });
    //************************************************************************************************************************************************************ */
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("* IMPUESTOS", 10, currentYRev + 5);
    const txtImp = `
        => Los precios de la presente son en moneda nacional (MXN)
        => Los precios de la presente cotización SI incluye I.V.A
    `;
    doc.setFont("helvetica", "regular");
    const linesImp = doc.splitTextToSize(txtImp, maxWidth);
    let currentYImp = currentYRev + 5;
    linesImp.forEach(linesImp => {
    doc.text(linesImp, margin, currentYImp);
        currentYImp += 3;
    });
    //************************************************************************************************************************************************************ */
    doc.setFont("helvetica", "bold");
    doc.text("* VIGENCIA DE CONDICIONES", 10, currentYImp + 5);
    const txtVig = `
        => La vigencia de nuestra propuesta comercial es de 30 días
    `;
    doc.setFont("helvetica", "regular");
    const linesVig = doc.splitTextToSize(txtVig, maxWidth);
    let currentYVig = currentYImp + 10;
    linesVig.forEach(linesVig => {
    doc.text(linesVig, margin, currentYVig);
        currentYVig += 3;
    });
    //************************************************************************************************************************************************************ */
    // Footer en la nueva página
    //FOOTER
    doc.setGState(new doc.GState({ opacity: 0.5 }));
    doc.addImage(
    logoBase64,
    "PNG",      // o "JPG" según el formato
    x,
    y,
    imgWidthF,
    imgHeightF
    );
    //******************************** */
    //************* PAGE 2 *************/
    //******************************** */
    doc.addPage();
    // Logo
    doc.addImage(logo, "PNG", 10, 10, imgWidth, imgHeight);
    doc.addImage(logo_qr, "PNG", 175, 10, 20, 20);
    const xPosD = pageWidth - titleWidth - marginRight;
    const yPosD = 40;
    doc.setTextColor(0, 0, 0);
    //************************************************************************************************************************************************************ */
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("* CONCRETOS ESPECIALES", 10, yPosD);
    const txtCE = `
        => Podemos realizar concretos a la medida del cliente según sus especificaciones.
        => Si se requiere podemos anexar fichas técnicas de los productos cotizados.
    `;
    doc.setFont("helvetica", "regular");
    const linesCE = doc.splitTextToSize(txtCE, maxWidth);
    let currentYCE = yPosD + 1;
    linesCE.forEach(linesCE => {
    doc.text(linesCE, margin, currentYCE);
        currentYCE += 3;
    });
    //************************************************************************************************************************************************************ */
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("* ASESORIA TÉCNICA", 10, currentYCE);
    const txtAT = `
        => Se ofrece sin cargos extras pruebas de laboratorio aleatorias; asesoría técnica, visitas por parte de profesionales a las obras ( previo acuerdo ).
    `;
    doc.setFont("helvetica", "regular");
    const linesAT = doc.splitTextToSize(txtAT, maxWidth);
    let currentYAT = currentYCE + 2;
    linesAT.forEach(linesAT => {
    doc.text(linesAT, margin, currentYAT);
        currentYAT += 3;
    });
    //************************************************************************************************************************************************************ */
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("* CRÉDITO CATSA", 10, currentYAT);
    const txtCC = `
        => Usted puede gozar del beneficio de un crédito CATSA, pregunte a su Ejecutivo Comercial sobre los requisitos, términos y condiciones para obtenerlo.
            o Recuerde que, si se atrasa en el pago de su crédito, este genera intereses a razón de un % mensual establecido al momento
            de la autorización del mismo. 
    `;
    doc.setFont("helvetica", "regular");
    const linesCC = doc.splitTextToSize(txtCC, maxWidth);
    let currentYCC = currentYAT + 1;
    linesCC.forEach(linesCC => {
    doc.text(linesCC, margin, currentYCC);
        currentYCC += 3;
    });
    //*************************************************************************************************************************************************** */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("3). PROCEDIMIENTO PARA SOLICITAR Y PAGAR CONCRETO", 10, currentYCC + 3);
    const txtCond = `
        a.  Si el pedido es de CONTADO el cliente deberá hacer su depósito en las instituciones bancarias determinadas y en las cuentas que previamente le han 
            sido entregadas por su Ejecutivo Comercial con un mínimo de 24 hrs. de anticipación  y deberá enviar la ficha de depósito al correo electrónico para poder programar su pedido.
        b.  Si el suministro es a CREDITO, se suministrará y se liquidará al vencimiento según plazo fecha factura.
        c.  Para la programación de sus pedidos el cliente podrá realizarlo vía telefónica al número
            de su ejecutivo comercial  en ese momento ambas partes acordarán las características del concreto; fecha y horario de suministro.
        d.  AJUSTE: Se considerarán como ajustes un máximo de un 10% del pedido y/o como máximo 7m3.
    `;
    doc.setFont("helvetica", "regular");
    doc.setFontSize(8);
    const linesCond = doc.splitTextToSize(txtCond, maxWidth);
    const startYCond = currentYCC + 10; 
    let currentYCond = startYCond;
    linesCond.forEach(lineCond => {
    doc.text(lineCond, margin, currentYCond);
        currentYCond += 4; // espacio entre líneas
    });
    //*************************************************************** */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("4). CONSIDERACIONES EN SERVICIOS.", 10, currentYCond+3);
    const txtServ = `
        ·   Servicio mínimo de bombeo  (pluma 15m3 y estacionaria 20m3)
        ·   Servicio mínimo de concreto
        ·   Sobre costo por uso de piezas de tubería extra (tubería, codos y mangueras)
        ·   Cargo día domingo
        ·   Cargo día Festivo
        ·   Cargo por concreto devuelto a planta (cualquier cantidad en olla) 
    `;
    doc.setFont("helvetica", "regular");
    doc.setFontSize(8);
    const linesSrv = doc.splitTextToSize(txtServ, maxWidth);
    const startYSrv = currentYCond + 3; 
    let currentYSrv = startYSrv;
    linesSrv.forEach(lineSrv => {
    doc.text(lineSrv, margin, currentYSrv + 2);
        currentYSrv += 4; // espacio entre líneas
    });
    //*************************************************************** */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("5). CUENTA BANCARIA PARA DEPOSITOS Ó TRANSFERENCIAS:", 10, currentYSrv+3);
    const rowsCta = [
        ["RAZÓN SOCIAL:", "ASESOR"],
        ["BANCO", "---"],
        ["No. CUENTA", "--- --- ----"],
        ["CLABE", "--- --- ----"],
    ];

    autoTable(doc, {
        startY: currentYSrv + 8,
        body: rowsCta,
        margin: { left: 10 },
        headStyles: { fillColor: [20, 100] },
        columnStyles: {
            0: { cellWidth: 40, halign: "left" }, 
            1: { cellWidth: 100, halign: "left" },
        }
    });
    const txtN = `
        Esperando ser favorecidos para otorgar solución a las necesidades de sus obras, quedamos de ustedes a sus órdenes deseando
            me otorguen unos minutos para poder comentar la presente.
    `;
    doc.setFont("helvetica", "regular");
    doc.setFontSize(10);
    const linesN = doc.splitTextToSize(txtN, maxWidth);
    const startN = doc.lastAutoTable.finalY + 2; 
    let currentN = startN;
    linesN.forEach(lineN => {
    doc.text(lineN, margin, currentN);
        currentN += 4;
    });
    //************************************************************************************************************************************************************************* */
    const rowsInfo = [
        ["Ejecutivo Comercial:", "ASESOR"],
        ["Correo", "---"],
        ["Celular", "--- --- ----"],
    ];

    autoTable(doc, {
        startY: currentN + 1,
        body: rowsInfo,
        margin: { left: 50 },
        headStyles: { fillColor: [20, 100] },
        columnStyles: {
            0: { cellWidth: 40, halign: "right" }, 
            1: { cellWidth: 80, halign: "left" },
        }
    });
     //*************************************************************** */
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("____________________________________________________________________", 40, doc.lastAutoTable.finalY+10);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("NOMBRE Y FIRMA DE ACEPTACIÓN POR PARTE DEL CLIENTE", 50, doc.lastAutoTable.finalY+20);
    //************************************************************************************************************************************************************************* */
    // Marca de agua en la nueva página
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.addImage(marcaAgua, "PNG", xPos, yPos, imgWidthM, imgHeightM);
    doc.setGState(new doc.GState({ opacity: 1 }));
    //FOOTER
    doc.setGState(new doc.GState({ opacity: 0.5 }));
    doc.addImage(
    logoBase64,
    "PNG",      // o "JPG" según el formato
    x,
    y,
    imgWidthF,
    imgHeightF
    );

    // Descargar PDF
    doc.save(`Cotizacion_${idCotizacion}.pdf`);
};
