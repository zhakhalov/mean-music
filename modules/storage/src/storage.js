// ----- node_modules
var dbox = require('dbox');
var _ = require('lodash');
var fs = require('fs');
var q = require('q');

// ----- config

var cfg = global.__require('./config/storage-cfg.js');

var client = dbox
            .app({ 'app_key': cfg.app_key, 'app_secret': cfg.app_secret, root:'auto' })
            .client({ 'access_token': cfg.access_token });

/**
 * Gets inforation about dropbox account.
 * @param {Function} fn callback funtion.
 */
function account (fn) {
  client.account(function (status, res) {
    if (status && status >= 400 && status <= 599) {
      fn(_.assign(new Error(res), { status: status }));
    } else {
      fn(null, res);
    }
  });
}

/**
 * Get file from storage.
 * @param {String} path Path to file.
 * @param {Function} fn callback funtion.
 */
function get (path, fn) {
  client.get(path, function (status, res, metadata) {
    if (status && status >= 400 && status <= 599) {
      fn(_.assign(new Error(res), { status: status }));
    } else {
      fn(null, res, metadata);
    }
  });
}

/**
 * Get url to media file. Expire after 4 hours.
 * @param {String} path Path to file.
 * @param {Function} fn callback funtion.
 */
function media (path, fn) {
  client.media(path, function (status, res, metadata) {
    if (status && status >= 400 && status <= 599) {
      fn(_.assign(new Error(res), { status: status }));
    } else {
      fn(null, res.url, res.expired, metadata);
    }
  });
}

/**
 * Get url to file.
 * @param {String} path Path to file.
 * @param {Function} fn callback funtion.
 */
function url (path, fn) {
  client.shares(path, { short_url: false }, function (status, res, metadata) {
    if (status && status >= 400 && status <= 599) {
      fn(_.assign(new Error(res), { status: status }));
    } else {
      fn(null, res.url, metadata);
    }
  });
}


/**
 * Save file to file storage.
 * @param {String} path Path to file.
 * @param {String|Buffer} data Data of filename to save at file storage.
 * @param {Function} fn callback funtion.
 * @param {Object} opts [optional] options.
 * @param {Boolean} opts.shareLink return share link as 3rd argument.
 */
function upload (path, data, fn, opts) {
  q.promise(function (resolve, reject) {
    if (typeof data === 'string') {
      fs.exists(data, function (exists) {
        if (exists) {
          fs.readFile(data, function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data, opts && opts.removeUploaded);
            }
          });
        } else {
          resolve(data);
        }
      });
    } else {
      resolve(data);
    }
  })
  .then(function (data, remove) {
    client.put(path, data, function (status, res) {
      if (status && status >= 400 && status <= 599) {
        fn(_.assign(new Error(res), { status: status }));
      } else if (opts && opts.shareLink) {
        url(res.path, function (err, url) {
          if (err) {
            fn(err);
          } else {
            url = url.replace("dl=0", "raw=1"); // link to file instead of link to Dropbox.
            fn(null, res, url);
          }
        });
      } else {
        fn(null, res);
      }
      if (typeof data === 'string' && remove) {
        fs.unlink(data);
      }
    });
  }, function (err) {
    fn(err);
  });
}

/**
 * Removes file from file storage.
 * @param {String} path Path to file.
 * @param {Function} fn callback funtion.
 */
function remove (path, fn) {
  client.rm(path, function (status,  res) {
    if (status && status >= 400 && status <= 599) {
      fn(_.assign(new Error(res), { status: status }));
    }
    if (!res || !res.is_deleted) {
      fn(new Error('Could not delete file at: ' + path));
    } else {
      fn(null, res);
    }
  });
}

// -----------------------------------------------------------------------
//                                  EXPORTS
// -----------------------------------------------------------------------
module.exports = {
  account: account,
  get: get,
  media: media,
  url: url,
  upload: upload,
  remove: remove
};