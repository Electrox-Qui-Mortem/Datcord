'use strict';
var rp = require('request-promise')
var BASE_URL = 'https://api.mongolab.com/api/1/';
var MongoLab = function (apiKey) {
  if (!(this instanceof MongoLab)) {
    return new MongoLab(apiKey);
  }

  this.APIKEY = apiKey;

  var KEY_CHECK_URL = http.get(BASE_URL + 'databases?apiKey=' + this.APIKEY);
  if (KEY_CHECK_URL.message === 'Please provide a valid API key.') {
    throw new Error('Invalid API key');
  }
};
class mLab {
    constructor(apiKey){
        this.apiKey = apiKey
        rp(BASE_URL + 'databases?apiKey=' + this.apiKey)
            .then(res => {
                if(res.message == 'Please provide a valid API key.')
                throw new Error('Invalid API key')
            })
    }
    listDatabases(){
        var options = {
            uri: 'https://api.mongolab.com/api/1/databases',
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return new Promise(resolve => {
            rp(options)
                .then(res => {
                    resolve(res)
                })
        })
    }
    listCollections(db){
        if(!db || typeof db != 'string') throw new Error('Invalid Database name')
        var options = {
            uri: `https://api.mongolab.com/api/1/databases/${db}/collections`,
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(options)
    }
    listDocuments(options){
        if(!options.database || !options.collectionName) throw new Error('Database Name and Collection Name are required')
        var op = {
            q: options.query,
            c: options.resultCount,
            f: options.setOfFields,
            fo: options.findOne,
            s: options.sortOrder,
            sk: options.skipResults,
            l: options.limit
        };
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            qs:{
                apiKey:this.apiKey,
                q:op.q,
                c:op.c,
                f:op.f,
                fo:op.fo,
                s: op.s,
                sk:op.sk,
                l:op.l
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }   
    insertDocuments(options){
        if(!options.database || !options.collectionName || ! options.documents) throw new Error('Database name, Collection Name, and Document(s) are required')
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}`,
            qs: {
                apiKey:this.apiKey 
              
            },
            method:'POST',
            body: options.documents,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    updateDocuments(options){
        if(!options.database || !options.collectionName || !options.data) throw new Error('Invalid options')
        var op = {
            q: options.query,
            m: options.allDocuments,
            u: options.upsert
        };
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}?apiKey=${this.apiKey}`,
            qs: {
                apiKey:this.apiKey,
                q:op.q,
                m:op.m,
                u:op.u
            },
            method:'PUT',
            body: {
                "$set":options.data
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    deleteDocuments(options){
        if(!options.database || !options.collectionName) throw new Error('Invalid options')
        if(!options.documents) options.documents = []
        var op = {
            q:options.query
        }
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}`,
            qs: {
                apiKey:this.apiKey,
                q:op.q
              
            },
            method:'PUT',
            body: options.documents,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    
}
(function () {
  this.viewDocument = function (options, cb) {
    var database = options.database || null;
    var collectionName = options.collectionName || null;
    var id = options.id || null;

    if (typeof id !== 'string' || id === null) {
      cb(new Error('document id is required'), null);
    } else {

      var res = http.get(BASE_URL + 'databases/' + database + '/collections/' + collectionName + '/' + id + '?apiKey=' + this.APIKEY);

      cb(null, res);
    }
  };

  this.updateDocument = function (options, cb) {
    var database = options.database || null;
    var collectionName = options.collectionName || null;
    var id = options.id || null;
    var updateObject = options.updateObject || null;

    if (typeof id !== 'string' || id === null || updateObject === null) {
      cb(new Error('document id is required'), null);
    } else {
      var res = http.put(BASE_URL + 'databases/' + database + '/collections/' + collectionName + '/' + id + '?apiKey=' +
                                this.APIKEY, updateObject);

      cb(null, res);
    }
  };

  this.deleteDocument = function (options, cb) {
    var database = options.database || null;
    var collectionName = options.collectionName || null;
    var id = options.id || null;

    if (typeof id !== 'string' || id === null) {
      cb(new Error('document id is required'), null);
    } else {
      var res = http.del(BASE_URL + 'databases/' + database + '/collections/' + collectionName + '/' + id + '?apiKey=' + this.APIKEY);

      cb(null, res);
    }
  };

  this.runCommand = function (options, cb) {
    var database = options.database || null;
    var commands = options.commands || null;

    if (database === null || commands === null) {
      cb(new Error('invalid options'), null);
    } else {
      var res = http.post(BASE_URL + 'databases/' + database + '/runCommand?apiKey=' + this.APIKEY, commands);

      cb(null, res);
    }
  };
}).call(MongoLab.prototype);

module.exports = mLab;

