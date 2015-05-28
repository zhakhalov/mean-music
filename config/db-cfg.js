module.exports = {
  connectionString: (function () {
    return ''
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