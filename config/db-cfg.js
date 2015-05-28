module.exports = {
  connectionString: (function () {
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){                                  // RELEASE
      return process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
    } else if (process.env.TEST) {
      return 'mongodb://system:123456@ds041851.mongolab.com:41851/test';            // TEST
    } else {
      return 'mongodb://default:123456@ds037262.mongolab.com:37262/meanmusic';      // DEV
    }
  })(),
  users: {
    public: 'name avatar',
    preventUpdate: ['_id', 'email', 'password', 'roles']
  },
  artists: {
    preventUpdate: ['_id'],
    pagination: {skip: 0, limit: 10}
  },
  albums: {
    preventUpdate: ['_id'],
    pagination: {skip: 0, limit: 10}
  },
  songs: {
    preventUpdate: ['_id'],
    pagination: {skip: 0, limit: 10}
  }
};