/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arrayKey = path.trim().split('.');

  function getValueObject (obj) {

    let tempValue = obj;

    if (Object.keys(obj).length === 0) {
      return;
    }

    for (let valueKey of arrayKey) {
      tempValue = tempValue[valueKey];
    }

    return tempValue;
  }
  return getValueObject;
}
