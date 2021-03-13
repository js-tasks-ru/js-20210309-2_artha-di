/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const functionArguments = fields;
  const objEntries = Object.entries(obj);

  for (let i = 0; i < functionArguments.length; i++) {

    for (let j = 0; j < objEntries.length; j++) {

      if (objEntries[j][0] === functionArguments[i]) {

        objEntries.splice(j, 1);
      }
    }
  }
  return Object.fromEntries(objEntries);
};
