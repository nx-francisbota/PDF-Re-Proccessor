const { PDFDocument, rgb } = require('pdf-lib');
const path = require('path');
const { calculateXOffset } = require('../helpers/calculateCoordinates');
const { calculateFontSize } = require('../helpers/calculateFontSize');
const fontkit = require('@pdf-lib/fontkit');
const fs = require('fs');
const { pdfConstants } = require('../constants/constants');

const fontBytes = fs.readFileSync(path.join(__dirname, '../public/assets/fonts/MerciLogo-Regular2019.otf'));
const svgHeart = fs.readFileSync(path.join(__dirname, '../public/assets/merci-heart-red-shadow.pdf'));

const lastCharacterIsI = (text) => {
    const trimmed = text.trim();
    const lastChar = trimmed.charAt(trimmed.length - 1);
    return lastChar.toLowerCase() === "i";
}

const replaceTextContent = async (newTxt, file, size) => {
    const pdfBuffer = fs.readFileSync(path.join(__dirname, file));
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    //Register font kit instance
    pdfDoc.registerFontkit(fontkit);

    //Embed custom font and SVG
    const arcaneFont = await pdfDoc.embedFont(fontBytes);
    const embeddedPages = await pdfDoc.embedPdf(svgHeart);
    const svg = embeddedPages[0];

    const pdfPage = (await pdfDoc).getPage(0);
    const { merciGold } = pdfConstants;
    const x = pdfConstants[size].x ?? pdfConstants["400"].x;
    const y = pdfConstants[size].y ?? pdfConstants["400"].x;
    const width = pdfConstants[size].width;
    const height = pdfConstants.height;
    const fontSize = calculateFontSize(newTxt);
    const textWidth = arcaneFont.widthOfTextAtSize(newTxt, fontSize);
    const textHeight = arcaneFont.heightAtSize(fontSize);

    const offsetX = calculateXOffset(size, textWidth);
    const offsetY = y + 30;


    pdfPage.drawText(newTxt, {
        x: offsetX * 2.8,
        y: y + 30,
        size: 35,
        color: rgb(merciGold.red, merciGold.blue, merciGold.green),
        font: arcaneFont,
    })
    pdfPage.drawPage(svg, {
        x: (lastCharacterIsI(newTxt)
            ? (offsetX * 2.8) + textWidth
            : offsetX + textWidth) * 2.8,
        y: offsetY + textHeight - 10,
        width: 20,
        height: 20,
    })

    const mod = await pdfDoc.save();
    fs.writeFileSync(__dirname + newTxt + file, mod);
}


replaceTextContent("Merci", "Example1.pdf", "675").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Blacki", "Example1.pdf", "675").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Hallo Amigos", "Example2.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Blacki", "Example2.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Blacko", "Example3.pdf", "250").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Merci", "Example3.pdf", "250").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Blacko", "Example4.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
replaceTextContent("Merci", "Example4.pdf", "400").then(val => console.log("finished reading: ", val)).catch(err => console.error(err));
