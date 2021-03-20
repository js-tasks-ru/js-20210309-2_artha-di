/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

export function trimSymbols(string = '', size) {
  if (!string) { return '';}
  switch (size ?? '') {
    case 0:
      return '';
      break;
    case '':
      return string;
  }
  let countChar = 1;
  return [...string].reduce((accumulator, currentValue, i, arr) => {
    if (countChar < size && arr[i - 1] === currentValue) {
      countChar++;
      return accumulator += currentValue;
    }
    if (arr[i - 1] !== currentValue) {
      countChar = 1;
      return accumulator += currentValue;
    }
    return accumulator;
  });
}
