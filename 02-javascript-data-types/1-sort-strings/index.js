/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {

  if (arr.length !== 0) {

    const arrayArg = arr.slice().sort();

    const newArraySort = arrayArg.sort(function (a, b) {
      return a.localeCompare(b, ['ru', 'en'], { sensitivity: 'base' });
    });

    if (param !== 'asc') {
      newArraySort.reverse();
    }
    return newArraySort;
  }
}
