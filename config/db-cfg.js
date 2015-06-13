module.exports = {
  connectionString: (function () {
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){                                  // RELEASE
      return 'mongodb://' + 
      process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
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
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: 'rating',
    },
    preventUpdate: ['_id', 'email', 'password', 'roles'],
  },
  artists: {
    preventUpdate: ['_id', 'albums', 'songs'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: '-rating',
      select: '_id name img'
    }
  },
  albums: {
   preventUpdate: ['_id', 'songs'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: '-rating',
      select: '_id name img'
    }
  },
  songs: {
    preventUpdate: ['_id'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: '-rating',
      select: '_id name img'
    }
  }
};