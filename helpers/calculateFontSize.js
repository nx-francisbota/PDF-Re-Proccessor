const { Logger } = require('../utils/logger');



module.exports = {
    calculateFontSize : (size, text) => {
        let fontSize;
        const charLength = text.length
        switch(size) {
            case "250":
                if (charLength >= 1 && charLength <= 5) {
                    fontSize = 90;
                } else if (charLength >= 6 && charLength <= 10) {
                    fontSize = 80;
                } else if (charLength >= 11 && charLength <= 15) {
                    fontSize = 40;
                } else {
                    Logger.warn("Text length is outside the defined ranges.")
                    fontSize = 40
                }
                break;
            case "400":
                if (charLength >= 1 && charLength <= 5) {
                    fontSize = 100;
                } else if (charLength >= 6 && charLength <= 10) {
                    fontSize = 90;
                } else if (charLength >= 11 && charLength <= 15) {
                    fontSize = 65;
                } else {
                    Logger.warn("Text length is outside the defined ranges.")
                    fontSize = 40
                }
                break;
            case "675":
                if (charLength >= 1 && charLength <= 5) {
                    fontSize = 120;
                } else if (charLength >= 6 && charLength <= 10) {
                    fontSize = 110;
                } else if (charLength >= 11 && charLength <= 15) {
                    fontSize = 75;
                } else {
                    Logger.warn("Text length is outside the defined ranges.")
                    fontSize = 40
                }
        }
        return fontSize;
    }
}