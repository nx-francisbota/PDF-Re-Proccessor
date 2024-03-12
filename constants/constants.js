const pdfConstants = {
    250: {
      x: 0,
      y: 89,
      width: 184,
    },
    675: {
        x: 101,
        y: 155,
        width: 363,
    },
    400: {
        x: 122,
        y: 135,
        width: 335,
    },
    barcodeWidth: 100,
    barcodeHeight: 50,
    barcodeX: 100,
    barcodeY: 150,
    width: 700,
    height: 122,
    fontSize: 35,
    merciGold: {
        red: 0.7843137254901961,
        green: 0.596078431372549,
        blue: 0.2901960784313726
    },
    defaultText: 'Merci',
}

const formats = {
    250: {
        x: 184,
        y: 152
    },
    400: {
        x: 335,
        y: 194
    },
    675: {
        x: 363,
        y: 263
    }
}

module.exports = {
    pdfConstants,
    formats
};