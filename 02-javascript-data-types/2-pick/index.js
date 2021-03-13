/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {
  const functionArguments = fields;
  const objEntries = Object.entries(obj);
  const newObj = [];

  for (let i = 0; i < functionArguments.length; i++) {

    for (let j = 0; j < objEntries.length; j++) {

      if (objEntries[j][0] === functionArguments[i]) {
        newObj.push(objEntries[j]);
      }
    }
  }
  return Object.fromEntries(newObj);
};
