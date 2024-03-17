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
    order: {
        width: 65,
        height: 13,
        centre: 10
    },
    print: {
        width: 55,
        height: 13,
        centre: 10
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

module.exports = {
    pdfConstants,
};