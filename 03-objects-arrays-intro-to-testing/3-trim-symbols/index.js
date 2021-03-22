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
  const arrString = [...string];

  for (const [i, char] of [...string].entries()) {
    const pattern  = char.repeat(size);
    const position = string.indexOf(pattern , i);

    if (position !== i) {
      continue;
    }
    if (position === i && string[i - 1] === char){
      arrString[i] = '';
    }
  }
  return arrString.join('');
}
