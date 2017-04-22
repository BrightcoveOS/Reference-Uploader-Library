function MissingParamError(where, param) {
  this.name = 'MissingParamError';
  this.message = 'A required parameter "' + param + '" was not provided in the constructor to ' + where;
  // TODO: Add link to documentation in error message
  this.stack = new Error().stack;
}
MissingParamError.prototype = Error.prototype;

function ParamParser(where, params) {
  var isUndefined = (param) => typeof params[param] === 'undefined';

  return {
    required: function(param) {
      if (isUndefined(param)) throw new MissingParamError(where, param);
      return params[param];
    },
    optional: function(param, defaultParam) {
      return isUndefined(param) ? defaultParam : params[param];
    }
  };
}

module.exports = ParamParser;
