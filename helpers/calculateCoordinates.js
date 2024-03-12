const { formats} = require("../constants/constants");


const calculateXOffset = (size, textWidth) => {
    let pageWidth = formats[size].x;
    return (pageWidth - textWidth)/2;
}
//
// const getFontSize = (titleText) => {
//     let fontSize;
//     const numberOfCharacters = titleText.length;
//     switch (numberOfCharacters) {
//         case
//     }
// }

module.exports = {
    calculateXOffset
}