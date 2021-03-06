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
    preventUpdate: ['_id', 'rating', 'raters', 'createdBy', 'udatedBy', 'createdAt', 'updatedAt', 'img', 'imgPath'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: 'name',
      select: '_id name img rating genres',
      populate: []
    }
  },
  albums: {
   preventUpdate: ['_id', 'rating', 'raters', 'createdBy', 'udatedBy', 'createdAt', 'updatedAt'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: '-release',
      select: '_id name img rating songs genres release',
      populate: [
        { path: 'songs', select: 'name duration listened rating' },
        { path: 'genres', select: ''}
      ]
    }
  },
  songs: {
    preventUpdate: ['_id', 'path', 'rating', 'raters', 'createdBy', 'udatedBy', 'createdAt', 'updatedAt'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: '-rating',
      select: '_id name img rating albums artists duration listened'
    }
  },
  genres: {
    preventUpdate: ['_id', 'name', 'createdBy', 'udatedBy', 'createdAt', 'updatedAt'],
    defaultQuery: {
      query: {},
      skip: 0, 
      limit: 10,
      sort: 'name',
      select: '_id name img rating'
    }
  }
};