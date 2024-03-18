const bwipjs = require("bwip-js");
const { logger } = require('../utils/logger');
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
    const { productNumber, orderNumber } = data;
    const barcodeProdData = await generateBarcodeSVGBuffer(productNumber);
    const barcodeOrderData = await generateBarcodeSVGBuffer(orderNumber);

    const page = pdfDoc.addPage([940, 544]);

    //set 6mm bleed
    page.setBleedBox(0, 0, 18, 18)

    try {
        const barcodeImageProd = await pdfDoc.embedPng(barcodeProdData);
        const barcodeImageOrder = await pdfDoc.embedPng(barcodeOrderData);

        //draw product number barcode
        page.drawImage(barcodeImageProd, {
            width: pdfConstants.barcodeWidth,
            height: pdfConstants.barcodeHeight,
            x: pdfConstants.barcodeX,
            y: 544 / 2,
        });

        page.drawImage(barcodeImageOrder, {
            width: pdfConstants.barcodeWidth,
            height: pdfConstants.barcodeHeight,
            x: pdfConstants.barcodeX,
            y: 544 / 4,
        });

        await pdfDoc.save();
    } catch (e) {
        logger.error(`Error generating barcode page: ${e}`);
    }

}

module.exports = {
    generatePdfWithBarcode
}
