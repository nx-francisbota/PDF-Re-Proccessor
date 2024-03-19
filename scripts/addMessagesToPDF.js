const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const path = require('path');

const { logger } = require('../utils/logger');
const { countAndFindLastI, splitToLastI } = require('../utils/heartSvgUtilities');
const { generatePdfWithBarcode } = require('../helpers/barcodeGenerator');
const { mmToLibUnit } = require('../helpers/millimetreToLibUnitConverter');
const { calculateFontSize } = require('../helpers/calculateFontSize');
const { pdfConstants } = require('../constants/constants');

const fontBytes = fs.readFileSync(path.join(__dirname, '../public/assets/fonts/MerciLogo-Regular2019.otf'));
const svgHeart = fs.readFileSync(path.join(__dirname, '../public/assets/merci-heart-red-shadow.pdf'));


/**
 * @param jsonData
 * @param file string
 */
exports.replaceTextContent = async (jsonData, file) => {
    let { titleText } = jsonData;
    const { size, guid, productNumber, orderNumber, quantity } = jsonData;

    if (!quantity || !productNumber || !orderNumber) {
        throw new Error("Missing required properties: quantity, productNumber or orderNumber missing");
    }

    if (titleText === "") {
        titleText = "merci"
    }

    const textInformation = countAndFindLastI(titleText);
    const pdfBuffer = fs.readFileSync(path.join(__dirname, file));

    try {
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
        if (!pdfConstants[size]) {
            logger.error(`PDF size ${size} assigned to ${orderNumber} is not recognized`);
            return;
        }

        const fontSize = calculateFontSize(size, titleText);
        const textWidth = arcaneFont.widthOfTextAtSize(titleText, fontSize);
        const textHeight = arcaneFont.heightAtSize(fontSize);
        const pdfWidth = mmToLibUnit(pdfConstants[size].width);
        const y = pdfConstants[size].y;
        let offsetX = (pdfWidth - textWidth) / 2;
        let svgHeartOffset;
        let svgScale = arcaneFont.widthOfTextAtSize("i", fontSize);

        const charactersUntilLastI = splitToLastI(titleText);
        if (charactersUntilLastI.length !== 0) {
            const sizeArr = charactersUntilLastI.map(t => arcaneFont.widthOfTextAtSize(t, fontSize));
            const heartWidthOffset = sizeArr.reduce((x, y) => {
                return x + y
            });
            svgHeartOffset = heartWidthOffset + offsetX - svgScale;
        } else {
            svgHeartOffset = offsetX + textWidth;
        }


        pdfPage.drawText(titleText, {
            x: offsetX,
            y,
            size: fontSize,
            color: rgb(0.8823529411764706, 0.6705882352941176, 0.3568627450980392),
            font: arcaneFont,
        })

        //Draw options for SVG for text ending with i
        const svgDrawOptions = {
            x: svgHeartOffset,
            y: y + (textHeight / 2) - 5,
            color: rgb(1, 1, 1),
            width: svgScale,
            height: svgScale,
        }

        if (textInformation.count > 0) {
            pdfPage.drawRectangle(svgDrawOptions)
            pdfPage.drawPage(svg, svgDrawOptions)
        } else {
            pdfPage.drawPage(svg, svgDrawOptions);
        }

        await generatePdfWithBarcode({productNumber, orderNumber}, pdfDoc);

        const mod = await pdfDoc.save();
        const fixedFiles = [];

        for (let i=0; i <= quantity; i++) {
            const filePath = `${__dirname}/public/pdf/${orderNumber}_${guid}-${i}`
            fs.writeFileSync(filePath, mod);
            fixedFiles.push(filePath);
        }
        return fixedFiles
    } catch (e) {
        logger.error(`Error adding title text to pdf file ${orderNumber}-${guid} : ${e}`);
    }
}