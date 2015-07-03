var mongoose = require('mongoose');
var q = require('q');

var PreferenceSchema = mongoose.Schema({
  name: { type: String }
});

var PersonSchema = mongoose.Schema({
  name: { type: String },
  preferences: [{ type:  mongoose.Schema.Types.ObjectId , ref: 'Preference' }]
});

var GroupSchema = mongoose.Schema({
  name: { type: String },
  persons: [{ type:  mongoose.Schema.Types.ObjectId , ref: 'Person' }]
});

PersonSchema.methods.setGroups = function (persons, cb) {
  var self = this;
  q.all([
    q.promise(function(resolve, reject) {
      GroupModel.update({ _id: { $nin: persons }, persons: self._id }, { $pull: { persons: self._id }}, { multi: true }).exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
    q.promise(function(resolve, reject) {
      GroupModel.update({ _id: { $in: persons }, persons: { $ne: self._id } }, { $push: { persons: self._id }}, { multi: true }).exec(function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }),
  ])
  .then(function () {
    cb(null);
  }, function (err) {
    cb(err);
  });
};

var PreferenceModel = mongoose.model('Preference', PreferenceSchema);
var PersonModel = mongoose.model('Person', PersonSchema);
var GroupModel = mongoose.model('Group', GroupSchema);

var groups = [];

q.promise(function (resolve, reject) {
  mongoose.connect('mongodb://system:123456@ds041851.mongolab.com:41851/test', function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('connected');
      resolve();
    }
  });
})
.then(function () { return q.promise(function (resolve, reject) {
  PreferenceModel.remove(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('PreferenceModel.remove');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  PersonModel.remove(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('PersonModel.remove');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  GroupModel.remove(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('GroupModel.remove');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new GroupModel({
    name: 'group1'
  }).save(function (err, doc) {
    if (err) {
      reject(err);
    } else {
      console.log('group1');
      groups.push(doc.id)
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new GroupModel({
    name: 'group2'
  }).save(function (err, doc) {
    if (err) {
      reject(err);
    } else {
      console.log('group2');
      groups.push(doc.id)
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new GroupModel({
    name: 'group3'
  }).save(function (err, doc) {
    if (err) {
      reject(err);
    } else {
      console.log('group3');
      groups.push(doc.id)
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new PersonModel({
    name: 'person1'
  }).save(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('person1');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new PersonModel({
    name: 'person2'
  }).save(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('person2');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new PersonModel({
    name: 'person3'
  }).save(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('person3');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new PreferenceModel({
    name: 'preference1'
  }).save(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('preference1');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new PreferenceModel({
    name: 'preference2'
  }).save(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('preference2');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  new PreferenceModel({
    name: 'preference3'
  }).save(function (err) {
    if (err) {
      reject(err);
    } else {
      console.log('preference3');
      resolve();
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  PreferenceModel.findOne({ name: 'preference1' }).exec(function (err, doc) {
    if (err) {
      reject(err);
    } else {
      PersonModel.update({ name: { $in: ['person1', 'person2'] }}, { $push: { preferences: doc._id }}, { multi: true }).exec(function () {
        resolve();
      });
    }
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  var personGroups = groups.slice(0, 2);
  PersonModel.findOne({ name: 'person1' }).exec(function (err, doc) {
    doc.setGroups(personGroups, function (err) {
      resolve();
    });
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  GroupModel.find().lean().populate([{ path: 'persons' }]).exec(function (err, docs) {
    GroupModel.populate(docs, {
      path: 'persons.preferences',
      model: 'Preference'
    }, function (err, docs) {
      console.log(JSON.stringify(docs));
      resolve();
    })
  })
})})
.then(function () { return q.promise(function (resolve, reject) {
  var personGroups = groups.slice(1);
  PersonModel.findOne({ name: 'person1' }).exec(function (err, doc) {
    doc.setGroups(personGroups, function (err) {
      resolve();
    });
  });
})})
.then(function () { return q.promise(function (resolve, reject) {
  PersonModel.findOne({ name: 'person1' }).exec(function (err, doc) {
    GroupModel.find({_id: { $in: groups}, persons: { $ne: doc.id }}).lean().exec(function (err, docs) {
      console.log(JSON.stringify(docs));
      resolve();
    })
  });
})})
.then(function () {
  GroupModel.find().lean().populate([{ path: 'persons' }]).exec(function (err, docs) {
    GroupModel.populate(docs, {
      path: 'persons.preferences',
      model: 'Preference'
    }, function (err, docs) {
      console.log(JSON.stringify(docs));
    })
  })
}, function (err) {
  console.log(err);
});