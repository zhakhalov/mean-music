(function (ng, _) {
  ng.module('app')
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
    }])
  .factory('$origin', ['$location',
    function $origin ($location) {
      return $location.protocol() + '://' + $location.host() + ':' + $location.port();
    }])
  .factory('Auth', ['REST_API_ROUTE', '$q', '$http',
    function Auth (REST_API_ROUTE, $q, $http) {
      return function () {
        var self = this;
        
        /**
         * @function
         * Sing in user
         * @param login {String} user's login
         * @param password {String} user's password
         * @param success {Function} success callback
         * @param error {Function} error callback
         * @return {Promise}
         */
        self.signIn = function (login, password) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'auth/signin', { login: login, password: password })
            .success(function (res) {
              resolve(res);
            })
            .error(function (res) {
              reject(res);
            });
          });
        };
        
        /**
         * @function
         * Register user
         * @param user {{ username: String, password: String, email: String }} user
         * @param success {Function} success callback
         * @param error {Function} error callback
         * @return {Promise}
         */
        self.signUp = function (user) {
          return $q(function (resolve, reject) {
            $http.post(REST_API_ROUTE + 'auth/signup', user)
            .success(function (res) {
              resolve(res);
            })
            .error(function (res) {
              reject(res);
            });
          });
        };
      };
    }])
  .factory('Resource', ['$http', '$q', 'FormData', '_',
    function Resource ($http, $q, FormData, _) {
      
      /**
       * @constructor
       * Create Resource
       * @param {String} url Base url.
       * @param {Object} opts Options.
       * @param {String|Function} authorization Authorization header or function getter for header.
       */
      return function (url, opts) {
        
        opts = opts || {};
        
        /**
         * @constructor
         * Create instance of Resource from instance data.
         * @param {Object} instance
         */
        var _resource = function (instance) {
          var self = this;
          ng.extend(self, instance || {});
          
          /**
           * @function
           * Get instance from server by id
           * @return {Promise}
           */
          self.$get = function () {
            return self.$$promise(function (resolve, reject) {
              $http.get(url + '/' + self._id)
              .success(function(data) {
                ng.extend(self, data, { $resolved: true });
                resolve(self);
              })
              .error(function(data, status) {
                reject(data);
              });
            });
          };
          
          /**
           * @function
           * Save instance at server by POST method.
           * @return {Promise}
           */
          self.$save = function () {
            return self.$$promise(function(resolve, reject) {
              
              $http.post(url, self.$$getData(), {
                headers: { 
                  Authorization: _resource.$$authorization(),
                  'Content-Type': undefined
                },
                transformRequest: ng.identity
              })
              .success(function (data) {
                ng.extend(self, data, { $resolved: true });
                self.$resolved = true;
                resolve(self);
              })
              .error(function (data) {
                reject(data);
              });
            });
          };
          
          /**
           * @function
           * Update instance at server by PUT method. Update all fields of instance with responce.
           * @return {Promise}
           */
          self.$update = function () {
            return self.$$promise(function(resolve, reject) {
              
              $http.put(url + '/' + self._id, self.$$getData(),
              {
                headers: { 
                  Authorization: _resource.$$authorization(),
                  'Content-Type': undefined
                },
                transformRequest: ng.identity
              })
              .success(function (data) {
                ng.extend(self, data);
                resolve(self);
              })
              .error(function (data) {
                reject(data);
              });
            });
          };
          
          /**
           * @function
           * Creates promise and stres it as self.$promise
           * @param {Function} fn
           * @return {Promise}
           */
          self.$$promise = function(fn) {
            self.$promise = $q(fn);
            return self.$promise;
          };
           
          
          /**
           * @function
           * Remove all service functions and fields.
           */
          self.$$getData = function () {
            var omit = _.chain(self)
              .keys()
              .filter(function (entry) {
                return '$' === entry[0];
              }).value();
              var data = _.omit(self, omit);
              return FormData(data);
          };
        };
        
        /**
         * @function
         * Gets array of song instances.
         * @return {Promise}
         */
        _resource.query = function (query) {
          return $q(function(resolve, reject) {
            query = query = {};
            $http.get(url, {
              params: query
            })
            .success(function(data) {
              ng.forEach(data, function (entry, idx) {
                data[idx] = new _resource(ng.extend(entry, { $resoved: true }));
              });
              resolve(data);
            })
            .error(function(data, status) {
              reject(data);  
            });
          });
        };
        
        /**
         * @function
         * Gets song instance by id.
         * @params {String} id. Song _id.
         * @return {Promise}
         */
        _resource.get = function (id) {
          return $q(function(resolve, reject) {
            $http.get(url + '/' + id)
            .success(function(data) {
              resolve(new _resource(ng.extend(data, { $resoved: true })));
            })
            .error(function(data, status) {
              reject(data);  
            });
          });
        };
        
        /**
         * @function
         * gets Authorization header.
         * @return {String} Authorization header.
         */
        _resource.$$authorization = function () {
          return ng.isFunction(opts.authorization) 
                            ? opts.authorization() 
                            : ((opts.authorization) 
                              ? opts.authorization 
                              : '');
        };
        
        return _resource;
      };
    }])
  .factory('MediaResource', ['Resource', '$http', '$q',
    function MediaResource (Resource, $http, $q) {
      
      /**
       * @constructor
       * @param 
       */
      return function (url) {
        var _resource = Resource(url);  
        var $resource = function (instance) {
          var self = new _resource(instance);
          
          /**
           * @function
           * Rate song.
           * @param {Number} rate Rating.
           * @return {Promise}
           */
          self.$rate = function (rate) {
            return self.$$promise(function (resolve, reject) {
              $http.post(url + '/' + self._id + '/rate/' + rate, {}, {
                headers: { Authorization: _resource.$$authorization() }
              })
              .success(function (data) {
                self.rating = data.rating;
                resolve(self);
              })
              .error(function (data, status) {
                reject(data);
              });
            });
          };
          
          return self;
        };
        
        // add static functions;
        ng.extend($resource, _resource);
        
        return $resource;
      };
    }])
  .factory('User', ['$http', '$q',  'REST_API_ROUTE', 'Resource', 'AuthSvc', 
    function User ($http, $q, REST_API_ROUTE, Resource, AuthSvc) {
      var url = REST_API_ROUTE + 'users';
      var _resource = Resource(url);  
      var $resource = function (instance) {
        var self = new _resource(instance);
        
        /**
         * @function
         * Update instance at server by PUT method. Update all fields of instance with responce.
         * @return {Promise}
         */
        self.$update = function () {
          return $q(function(resolve, reject) {
            if (!self.$me) {
              return reject(new Error('Cannot update another user'));
            }
            $http.put(REST_API_ROUTE + 'users/me' + self._id, self.$$getData(),
            {
              headers: { 
                Authorization: AuthSvc.header(),
                'Content-Type': undefined
              },
              transformRequest: ng.identity
            })
            .success(function (data) {
              ng.extend(self, data);
              resolve(self);
            })
            .error(function (data) {
              reject(data);
            });
          });
        };
        
        return self;
      };
      
      // add static functions;
      ng.extend($resource, _resource);
      
      /**
       * @function
       * Gets information about current user.
       * @return {Promise}
       */
      $resource.getMe = function () {
        return $q(function(resolve, reject) {
          $http.get(REST_API_ROUTE + 'users/me', {
            headers: { Authorization: AuthSvc.header() }
          })
          .success(function(data) {
            resolve(new Resource(ng.extend(data, { $resoved: true, $me: true })));
          })
          .error(function(data, status) {
            reject(data);  
          });
        });
      };
      
      return $resource;
    }])
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
         * Get resource instance from cache or request it from server;
         * @return {Resource}
         */
        self.getOne = function (id) {
          self.$instances[id] = self.$instances[id] || new Resource({ _id: id });
          if (!self.$instances[id].$resolved) {
            self.$instances[id].$resolved.$get();
          }
          clearCache();
          return self.$instances[id];
        };
        
        /**
         * @function
         * Get genre resource instances from cache or request them from server;
         * @param {[String]} ids Array of ids of requested albums.
         * @return {Promise}
         */
        self.getSeveral = function (ids) {
          return $q(function (resolve, reject) {
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
         * @return {Promise}
         */
        self.save = function (instance) {
          self.$instances[instance._id] = instance;
          return instance.$save();
        };
      };
    }])
})(window.angular, window._);