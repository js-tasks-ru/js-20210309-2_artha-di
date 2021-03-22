/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arrayKey = path.split('.');

  function getValueObject (obj) {

    if (!Object.keys(obj).length) {
      return;
    }
    return arrayKey.reduce((prevValue, currentVal) => prevValue[currentVal], obj);
  }
  return getValueObject;
}
