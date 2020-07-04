const words = require('../enums/random-words-enums')

function generateRandomName() {
    const { length } = words
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min
    }
    const word1 = words[getRandomInt(0, length - 1)]
    const word2 = words[getRandomInt(0, length - 1)]
    const word3 = words[getRandomInt(0, length - 1)]
    return `${word1}-${word2}-${word3}`
}

module.exports = {
    generateRandomName,
}
