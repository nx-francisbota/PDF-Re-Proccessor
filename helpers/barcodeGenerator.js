const bwipjs = require("bwip-js");
const { pdfConstants } = require('../constants/constants');

const generateBarcodeSVGBuffer = async (prop) => {
    return await bwipjs.toBuffer({
        bcid:        'code128',
        text:        prop,
        height:      12,
        includetext: true,
        textxalign:  'center',
    })
}

async function generatePdfWithBarcode(data, pdfDoc) {
    const barcodeProdData = await generateBarcodeSVGBuffer(data.productNumber);
    const barcodeOrderData = await generateBarcodeSVGBuffer(data.orderNumber);

    const page = pdfDoc.addPage();

    const barcodeImageProd = await pdfDoc.embedPng(barcodeProdData);
    const barcodeImageOrder = await pdfDoc.embedPng(barcodeOrderData);

    //draw product number barcode
    page.drawImage(barcodeImageProd, {
        width: pdfConstants.print.width,
        height: pdfConstants.print.height,
        x: pdfConstants.barcodeX,
        y: pdfConstants.barcodeY,
    });

    page.drawImage(barcodeImageOrder, {
        width: pdfConstants.barcodeWidth,
        height: pdfConstants.barcodeHeight,
        x: pdfConstants.barcodeX,
        y: pdfConstants.barcodeY - 80,
    });

    await pdfDoc.save();
}

module.exports = {
    generatePdfWithBarcode
}
