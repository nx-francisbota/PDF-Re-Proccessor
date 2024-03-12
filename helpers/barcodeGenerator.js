const bwipjs = require("bwip-js");
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
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

async function generatePdfWithBarcode(data, filePath) {
    const barcodeProdData = await generateBarcodeSVGBuffer(data.productNumber);
    const barcodeOrderData = await generateBarcodeSVGBuffer(data.orderNumber);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.getPages()[0] || pdfDoc.addPage();

    const barcodeImageProd = await pdfDoc.embedPng(barcodeProdData);
    const barcodeImageOrder = await pdfDoc.embedPng(barcodeOrderData);

    page.drawImage(barcodeImageProd, {
        width: pdfConstants.barcodeWidth,
        height: pdfConstants.barcodeHeight,
        x: pdfConstants.barcodeX,
        y: pdfConstants.barcodeY,
    });

    page.drawImage(barcodeImageOrder, {
        width: pdfConstants.barcodeWidth,
        height: pdfConstants.barcodeHeight,
        x: pdfConstants.barcodeX,
        y: pdfConstants.barcodeY - 80,
    });

    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfBytes);
}


generatePdfWithBarcode({ productNumber:"99K40001", orderNumber: "SO_233465"}, __dirname + 'mod.pdf')
    .then(() => console.log('PDF with barcode generated successfully!'))
    .catch((error) => console.error('Error generating PDF:', error));
