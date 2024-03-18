const mmToLibUnit = (mmUnit) => {
    //1lib-unit = 1/72 inch
    //1mm = 0.0393701inches
    //1lib-unit = 0.35278mm
    //2.8352lib-units = 1mm
    return mmUnit * 2.8352;
}

module.exports = {
    mmToLibUnit,
}