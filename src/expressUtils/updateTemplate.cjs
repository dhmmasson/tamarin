const fs = require("fs").promises;
const path = require("path");
const pug = require("pug");
const build = require("pug-runtime/build");
const defaultTemplateName = "template";

/**
 * exportTemplates - Read the folder `path`, parse all pug files and create a `_templateName`.js file corresponding in the `jsPath`
 * @param {string} pugPath - folder path containing the pug files to export
 * @param {string} jsPath - folder path containing the pug files to export
 * @param {string} [_templateName=template] - folder path containing the pug files to export
 *
 **/
function exportTemplates(pugPath, jsPath, _templateName) {
  const templateName = _templateName || defaultTemplateName;
  fs.readdir(pugPath)
    .then((files) => convertPugFile(pugPath, files))
    .then((jsFunctions) => save(jsPath, templateName, jsFunctions))
    .catch(console.error);
}

/**
 * @param {string} origin - the path to the template folder
 * @param {string[]} files an array of files to consider as template ( only *.pug file will be used )
 * @return {Promise<String[]>} a Promised array of function strings
 */
function convertPugFile(origin, files) {
  const correctFiles = [];
  // Only include inlineRuntimeFunctions once
  let includeInlineRuntimeFunctions = true;
  for (const file of files) {
    if (path.extname(file) === ".pug") {
      correctFiles.push(convert(origin, file, includeInlineRuntimeFunctions));
      // Only include inlineRuntimeFunctions once
      includeInlineRuntimeFunctions = false;
    }
  }
  return Promise.all(correctFiles);
}

/**
 * Convert template `file` to a function string
 * @param {string} origin path to the folder containing the pug templates
 * @param {string}  file the pug template
 * @return {promise<string>} a resolved promise with the jsFunction string corresponding to the pug file
 */
function convert(origin, file) {
  const js = pug.compileFileClient(path.resolve(origin, file), {
    filename: file,
    basedir: origin,
    compileDebug: false,
    inlineRuntimeFunctions: false,
    name: "__template__" + path.basename(file, ".pug"),
  });
  return Promise.resolve(js);
}

/**
 * Save all template functions in `jsFunctionArray` in file `templateName`  in folder `destination`
 * all functions become method of an Object named `templateName`
 * a pug object containing all necessary pug runtime functions is also included
 * @param {string} destination where to save the script file containing the templates function
 * @param {string} templateName where to save the script file containing the templates function
 * @param {string[]} jsFunctionArray an array of template function strings to be concatened and save tot he file
 * @return {promise} Promise from fs.writeFile
 * @todo change handle just one function instead of array
 */
function save(destination, templateName, jsFunctionArray) {
  let str = `let ${templateName}={}, pug={};\n`;
  str += build([
    "merge",
    "classes",
    "style",
    "attrs",
    "attr",
    "escape",
    "rethrow",
  ]);
  str = functionToMethod(str, "pug_", "pug");
  str += ";\n";
  str += jsFunctionArray.join(";\n");
  //
  str = functionToMethod(str, "__template__", templateName);
  str += `\nexport { ${templateName} } ;`;
  return fs.writeFile(path.resolve(destination, templateName + ".mjs"), str);
}

/**
 * transform all functions that start with the given `prefix` in the input `str` to method of the object `objectName`
 * @param {string} _str javascript text to convert. e.g. `pug_attr( a, e) { }`
 * @param {string} prefix prefix to all function to be converted e.g. pug_
 * @param {string} objectName name of the target object to bear the methods e.g. pug
 * @return {string} The modified string
 */
function functionToMethod(_str, prefix, objectName) {
  let str = _str.slice();
  const functionNames = str.matchAll(
    RegExp(`function ${prefix}(?<Name>[^ (]*)`, "g")
  );
  for (const result of functionNames) {
    const functionName = result.groups.Name;
    if (functionName) {
      str = str.replace(
        RegExp(result[0] + "\\b"),
        `${objectName}.${functionName} = function`
      );
      str = str.replace(
        RegExp(`${prefix}${functionName}\\b`),
        `${objectName}.${functionName}`
      );
    }
  }
  return str;
}
module.exports = exportTemplates;
