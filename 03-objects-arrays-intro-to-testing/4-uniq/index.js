/**
 * uniq - returns array of uniq values:
 * @param {*[]} arr - the array of primitive values
 * @returns {*[]} - the new array with uniq values
 */

export function uniq(arr = '') {
  const copyArray = [...arr];
  if (!copyArray.join('')) {return [];}
  return [...new Set(copyArray)];
}
