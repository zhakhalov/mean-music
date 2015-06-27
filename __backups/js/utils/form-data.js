(function (ng) {
  ng.module('form-data')
  .factory('FormData', ['$window', 
    function FormData ($window) {
      
      /**
       * Append object to FormData
       * @param {FormData} fd Append to.
       * @param {String} path Append at path.
       * @param {*} obj Object to append.
       */
      function append(fd, path, obj) {
        if (ng.isObject(obj)) {
          if (ng.isArray(obj)) {
            ng.forEach(obj, function (entry, index) {
              append(fd, path + '[' + index + ']', entry);
            });
          } else if (obj instanceof $window.File){
            fd.append(path, obj);
          } else {
            for(var prop in obj) {
              append(fd, path.length ? path + '[' + prop + ']' : prop, obj[prop]);
            }
          }
        } else {
          fd.append(path, obj);
        }
        return fd;
      }
      
      return function (obj) {
        return append(new $window.FormData(), '', obj);
      };
    }]);
})(window.angular);