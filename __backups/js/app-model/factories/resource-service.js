(function (ng) {
  ng.module('app')
  .factory('ResourceSvc', ['CLEAR_CACHE_DEBOUNCE', '$q', '_',
    function ResourceSvc (CLEAR_CACHE_DEBOUNCE, $q, _) {
      return function (Resource) {
        var self = this;
        self.$instances = {};
        
        /**
         * @function
         * Clear cache after CLEAR_CACHE_DEBOUNCE since last request
         */
        var clearCache = _.debounce(function () {
          self.$instances = {};
        }, CLEAR_CACHE_DEBOUNCE);
        
        /**
         * @function
         * Get genre resource instance from cache or request it from server;
         * @return {Promise}
         */
        self.getOne = function (id) {
          return $q.promise(function (resolve, reject) {
            if (id in self.$instances) {
              resolve(self.$instances[id]);
            } else {
              Resource.get(id)
              .then(function (instance) {
                self.$instances[instance._id] = instance;
                resolve(instance);
              }, function (err) {
                reject(err);
              });
            }
            clearCache();
          });
        };
        
        /**
         * @function
         * Get genre resource instances from cache or request them from server;
         * @param {[String]} ids Array of ids of requested albums.
         * @return {Promise}
         */
        self.getSeveral = function (ids) {
          return $q.promise(function (resolve, reject) {
            // get not cached artists
            var difference = _(self.$instances).keys().difference(ids).value();
            // if there is not cached artists
            if (difference.length > 0) {
              Resource.query({ _id: { $in: difference }})
              .then(function (artists) {
                _.forEach(artists, function (entry) {
                  self.$instances[entry._id] = entry;
                });
                resolve(_.pick(self.$instances, ids));
              }, function (err) {
                reject(err);
              });
            } else {
              resolve(_.pick(self.$instances, ids));
            }
            clearCache();
          });
        };
        
        /**
         * @function
         * Add instance of genre to cache.
         */
        self.setOne = function (instance) {
          self.$instances[instance._id] = instance;
        };
      };
    }]);
})(window.angular);