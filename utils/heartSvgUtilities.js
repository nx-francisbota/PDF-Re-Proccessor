const countAndFindLastI = (text) => {
    const lowerText = text.toLowerCase();
    const textLength = text.length

    let count = 0;
    let lastIndex = -1;

    for (let i = 0; i < lowerText.length; i++) {
        if (lowerText[i] === "i") {
            count++;
            lastIndex = i;
        }
    }

    return {
        count,
        textLength,
        lastIndex,
    };
}

const splitToLastI = (text) => {
    const splitTxt = text.split('i');
    const restoredCharacterSplits =  splitTxt.map((t, i) => {
        if (i !== splitTxt.length - 1) {
            return t + "i";
        }
    });
    restoredCharacterSplits.pop()
    return restoredCharacterSplits
}

module.exports = {
    countAndFindLastI,
    splitToLastI
}