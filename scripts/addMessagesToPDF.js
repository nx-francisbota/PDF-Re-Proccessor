const { PDFDocument, rgb } = require('pdf-lib');
const { Logger } = require('../utils/logger');
const { countAndFindLastI, splitToLastI } = require('../utils/heartSvgUtilities');
const { generatePdfWithBarcode } = require('../helpers/barcodeGenerator');
const path = require('path');
const { mmToLibUnit } = require('../helpers/calculateCoordinates');
const { calculateFontSize } = require('../helpers/calculateFontSize');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const { pdfConstants } = require('../constants/constants');
const fontBytes = fs.readFileSync(path.join(__dirname, '../public/assets/fonts/MerciLogo-Regular2019.otf'));
const svgHeart = fs.readFileSync(path.join(__dirname, '../public/assets/merci-heart-red-shadow.pdf'));


/**
 * @param newTxt string
 * @param file string
 * @param size string
 */
const replaceTextContent = async (newTxt, file, size) => {
    if (newTxt === "") {
        newTxt = "merci"
    }
    const textInformation = countAndFindLastI(newTxt);
    const pdfBuffer = fs.readFileSync(path.join(__dirname, file));
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    //Register font kit instance
    pdfDoc.registerFontkit(fontkit);

    //Embed custom font and SVG
    const arcaneFont = await pdfDoc.embedFont(fontBytes);
    const embeddedPages = await pdfDoc.embedPdf(svgHeart);
    const svg = embeddedPages[0];

    const pdfPage = (await pdfDoc).getPage(0);

    //set bleed box
    pdfPage.setBleedBox(0, 0, 500, 500);

    //check if pdf size is accounted for
    if(!pdfConstants[size]) {
        Logger.error(`PDF size ${size} is not recognized`);
        return;
        //ToDo: Remember to continue after adding loop
    }

    const fontSize = calculateFontSize(size, newTxt);
    const textWidth = arcaneFont.widthOfTextAtSize(newTxt, fontSize);
    const textHeight = arcaneFont.heightAtSize(fontSize);
    const pdfWidth = mmToLibUnit(pdfConstants[size].width);
    const y = pdfConstants[size].y;
    let offsetX = (pdfWidth - textWidth) / 2;
    let svgHeartOffset;
    let widthOfI = arcaneFont.widthOfTextAtSize("i", fontSize);

    const charactersUntilLastI = splitToLastI(newTxt);
    if (charactersUntilLastI.length !== 0) {
        const sizeArr = charactersUntilLastI.map(t => arcaneFont.widthOfTextAtSize(t, fontSize));
        const heartWidthOffset = sizeArr.reduce((x, y) => {
            return x + y
        });
        svgHeartOffset = heartWidthOffset + offsetX - widthOfI;
    } else {
        svgHeartOffset = offsetX + textWidth;
    }


    pdfPage.drawText(newTxt, {
        x: offsetX,
        y,
        size: fontSize,
        color: rgb(0.8823529411764706, 0.6705882352941176, 0.3568627450980392),
        font: arcaneFont,
    })

    //Draw options for SVG for text ending with i
    const svgDrawOptions = {
        x: svgHeartOffset,
        y: y + (textHeight/2) - 5,
        color: rgb(1,1,1),
        width: widthOfI,
        height: widthOfI,
    }

    if (textInformation.count > 0) {
        pdfPage.drawRectangle(svgDrawOptions)
        pdfPage.drawPage(svg, svgDrawOptions)
    } else {
        pdfPage.drawPage(svg, svgDrawOptions);
    }

    await generatePdfWithBarcode({productNumber: "99K40001", orderNumber: "SO_233465"}, pdfDoc);

    const mod = await pdfDoc.save();
    fs.writeFileSync(__dirname + newTxt + file, mod);
}