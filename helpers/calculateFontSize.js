const { Logger } = require('../utils/logger');



module.exports = {
    calculateFontSize : (size, text) => {
        let fontSize;
        const charLength = text.length
        switch(size) {
            case "250":
                if (charLength >= 1 && charLength <= 5) {
                    fontSize = 80;
                } else if (charLength >= 6 && charLength <= 9) {
                    fontSize = 50;
                } else if (charLength >= 10 && charLength <= 13) {
                    fontSize = 35;
                } else if (charLength >= 14 && charLength <= 15) {
                    fontSize = 30;
                } else {
                    Logger.warn("Text length is outside the defined ranges.")
                    fontSize = 25
                }
                break;
            case "400":
                if (charLength >= 1 && charLength <= 5) {
                    fontSize = 120;
                } else if (charLength >= 6 && charLength <= 9) {
                    fontSize = 90;
                } else if (charLength >= 10 && charLength <= 13) {
                    fontSize = 60;
                } else if (charLength >= 14 && charLength <= 15) {
                    fontSize = 50
                } else {
                    Logger.warn("Text length is outside the defined ranges.")
                    fontSize = 40
                }
                break;
            case "675":
                if (charLength >= 1 && charLength <= 5) {
                    fontSize = 130;
                } else if (charLength >= 6 && charLength <= 9) {
                    fontSize = 100;
                } else if (charLength >= 10 && charLength <= 13) {
                    fontSize = 70;
                } else if (charLength >= 14 && charLength <= 15) {
                    fontSize = 62
                } else {
                    Logger.warn("Text length is outside the defined ranges.")
                    fontSize = 40
                }
        }
        return fontSize;
    }
}