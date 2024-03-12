module.exports = {
    calculateFontSize : (text) => {
        let fontSize;
        const characterLength = text.length
        if (characterLength < 6) {
            fontSize = 20;
        } else if (characterLength > 9) {
            fontSize = 10;
        } else {
            fontSize = 15;
        }
        return fontSize;
    }
}