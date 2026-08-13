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

/**
 * @param {String} value - An API key, an API id or a shrine perk id.
 * @description Canonical id shared by the API, the bundled assets and the overrides.
 *              "Ace_In_The_Hole", "aceinthehole" and "Élodie" all collapse to a single key,
 *              which is what lets the shrine, /random and the icon files line up.
 */
function canonicalId(value) {
    return String(value)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}



module.exports = {
    getLength: getLength,
    isEmptyObject: isEmptyObject,
    comma: comma,
    calculateCenter: calculateCenter,
    canonicalId: canonicalId
}