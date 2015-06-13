// ----- node_modules
var dbox = require('dbox');
var _ = require('lodash');

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
 * @param {String} data Data to save in file.
 * @param {Function} fn callback funtion.
 */
function save (path, data, fn) {
  client.put(path, data, function (status, res) {
    if (status && status >= 400 && status <= 599) {
      fn(_.assign(new Error(res), { status: status }));
    } else {
      fn(null, res);
    }
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
  save: save,
  remove: remove
};