const { pdfConstants } = require("../constants/constants");

const mmToLibUnit = (mmUnit) => {
    //1lib-unit = 1/72 inch
    //1mm = 0.0393701inches
    //1lib-unit = 0.35278mm
    //2.8352lib-units = 1mm
    return mmUnit * 2.8352;
}


const calculateHeartOffset = (text) => {
    const trimmed = text.trim();
    if (lastChar.toLowerCase() === "i") {

    }
    const lastCharacterIsI = (text) => {
        const trimmed = text.trim();
        const lastChar = trimmed.charAt(trimmed.length - 1);
        return lastChar.toLowerCase() === "i";
    }
}

module.exports = {
    mmToLibUnit,
}