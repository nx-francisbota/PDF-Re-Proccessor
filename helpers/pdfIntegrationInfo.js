const pino = require('pino');
const { pdfConstants} = require("../constants/constants");

const logger = pino({});

/**
 * @param filename string
 */
const getJsonInfo = (filename) => {
    const infoObject = {};
    const jsonfile = filename.split('.')[0] + '.json';

    let data = require(__dirname + jsonfile);
    if (!data) {
        logger.error("Error reading json file", jsonfile);
        return;
    }
    data = JSON.parse(data);

    if (data.titleText !== '') {
        infoObject.titleText = data.titleText;
    } else {
        infoObject.titleText = pdfConstants.defaultText;
    }
    infoObject.numberOfChars = data.titleText.length;
    infoObject.productNumber = data.productNumber;
    infoObject.quantity = data.quantity;
    infoObject.guid = data.printId;

    return infoObject;
}

