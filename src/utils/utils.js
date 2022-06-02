/**
 * @description Get length from object
 */
function getLength(obj) {
    return Object.keys(obj).length
}

/**
 * @param {Object} obj - Object.
 * @description Check if object is empty.
 */
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

/**
* @param {Int8Array} x - Number to add commas.
* @description Returns the number with commas every 3 digits.
*/
function comma(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function calculateCenter(x, letters, fontSize) {
    return x - (letters * fontSize)
}



module.exports = {
    getLength: getLength,
    isEmptyObject: isEmptyObject,
    comma: comma,
    calculateCenter: calculateCenter
}