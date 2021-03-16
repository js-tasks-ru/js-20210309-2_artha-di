/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const arrayEntries = Object.entries(obj);

  fields.map((item) => {
    arrayEntries.map(function (element, index, array) {
      if (element[0] === item) {
        array.splice(index, 1);
      }
    });
  });
  return Object.fromEntries(arrayEntries);
};
