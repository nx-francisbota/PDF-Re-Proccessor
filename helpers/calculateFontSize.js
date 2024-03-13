const { Logger } = require('../helpers/logger');

module.exports = {
    calculateFontSize : (text) => {
        let fontSize;
        const charLength = text.length
        if (charLength >= 1 && charLength <= 5) {
            fontSize = 60;
        } else if (charLength >= 6 && charLength <= 10) {
            fontSize = 50;
        } else if (charLength >= 11 && charLength <= 15) {
            fontSize = 40;
        } else {
            Logger.warn("Text length is outside the defined ranges.")
            fontSize = 50
        }
        return fontSize;
    }
}