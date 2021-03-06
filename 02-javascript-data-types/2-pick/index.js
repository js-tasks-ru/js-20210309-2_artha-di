/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const arrayEntries = Object.entries(obj);
  const newObj = [];

 /**
  * МОЖНО И ТАК НАВЕРНОЕ (менее читабильно)
  *
 * fields.map((item) => {
 *   newObj.push( arrayEntries.find(elem => elem[0] === item));
 * });
 */

  fields.map((item) => {
    arrayEntries.map((element) => {
      if (element[0] === item) {
        newObj.push(element);
      }
    });
  });
  return Object.fromEntries(newObj);
};
