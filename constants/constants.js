//The x and y constants for the pdf were inspected set from manual inspection with a pdf tool
const pdfConstants = {
    250: {
      x: 0,
      y: 130,
      width: 184,
      height: 152,
    },
    675: {
        x: 101,
        y: 250,
        width: 363,
        height: 263,
    },
    400: {
        x: 122,
        y: 150,
        width: 335,
        height: 194,
    },
    barcodeWidth: 100,
    libToMMFactor: 1.2346561,
    barcodeHeight: 50,
    barcodeX: 100,
    barcodeY: 150,
    width: 700,
    height: 122,
    fontSize: 40,
    defaultText: 'Merci',
}

const mmToLibUnit = (mmUnit) => {
    //1lib-unit = 1/72 inch
    //1mm = 0.0393701inches
    //1lib-unit = 0.35278mm
    //2.8352lib-units = 1mm
    return mmUnit * 2.8352;
}


module.exports = {
    pdfConstants,
};