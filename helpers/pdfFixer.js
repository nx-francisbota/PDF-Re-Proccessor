const { PDFDocument, rgb, TextAlignment } = require('pdf-lib');
const { Logger } = require('../helpers/logger');
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
    const pdfBuffer = fs.readFileSync(path.join(__dirname, file));
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    //Register font kit instance
    pdfDoc.registerFontkit(fontkit);

    //Embed custom font and SVG
    const arcaneFont = await pdfDoc.embedFont(fontBytes);
    const embeddedPages = await pdfDoc.embedPdf(svgHeart);
    const svg = embeddedPages[0];

    const pdfPage = (await pdfDoc).getPage(0);

    //check if pdf size is accounted for
    if(!pdfConstants[size]) {
        Logger.error(`PDF size ${size} is not recognized`);
        return;
        //ToDo: Remember to continue after adding loop
    }

    const fontSize = calculateFontSize(newTxt);
    const textWidth = arcaneFont.widthOfTextAtSize(newTxt, fontSize);
    const textHeight = arcaneFont.heightAtSize(fontSize);
    const pdfWidth = mmToLibUnit(pdfConstants[size].width);
    const y = pdfConstants[size].y;

    const offsetX = (pdfWidth - textWidth) / 2;
    const heartOffset = getHeartOffset(newTxt, textWidth);

    //Draw Options for SVG for text not ending with i
    const svgDrawOptions1 = {
        x: offsetX + textWidth,
        y: y + (textHeight/2) - 6,
        width: 25,
        height: 25,
    };

    //Draw options for SVG for text ending with i
    const svgDrawOptions2 = {
        x: offsetX + textWidth - (heartOffset/2.8352) - 7,
        y: y + (textHeight/2) - 4,
        width: 25,
        height: 25,
    }

    pdfPage.drawText(newTxt, {
        x: offsetX,
        y,
        size: fontSize,
        color: rgb(0.8823529411764706, 0.6705882352941176, 0.3568627450980392),
        font: arcaneFont,
    })

    if (lastCharacterIsI(newTxt)) {
        pdfPage.drawRectangle({
            x: offsetX + textWidth - (heartOffset/2.8352) - 7,
            y: y + (textHeight/2) - 4,
            color: rgb(1,1,1),
            width: 25,
            height: 25,
        })
        pdfPage.drawPage(svg, svgDrawOptions2)
    } else {
        pdfPage.drawPage(svg, svgDrawOptions1);
    }


    const mod = await pdfDoc.save();
    fs.writeFileSync(__dirname + newTxt + file, mod);
}


const getHeartOffset = (txt, textWidth) => {
    const textLength = txt.length;
    return textWidth/textLength;
}

const lastCharacterIsI = (text) => {
    const trimmed = text.trim();
    const lastChar = trimmed.charAt(trimmed.length - 1);
    return lastChar.toLowerCase() === "i";
}


replaceTextContent("Merci", "Example1.pdf", "675").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Bon Arrive", "Example1.pdf", "675").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("merry x-mas", "Example2.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("", "Example2.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Merry X'Mas", "Example3.pdf", "250").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Merci", "Example3.pdf", "250").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Blacko", "Example4.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Merci", "Example4.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
