'use strict';
var rp = require('request-promise');
module.exports = class mLabInteractor {
    constructor(apiKey){
        this.apiKey = apiKey;
        rp({
            uri:`https://api.mongolab.com/api/1/databases?`,
            qs:{
                apiKey:this.apiKey
            }
        })
            .then(res => {
                if(res.message == 'Please provide a valid API key.')
                throw new Error('Invalid API key')
            });
    }
    listDatabases(){
        var opt = {
            uri: 'https://api.mongolab.com/api/1/databases',
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    listCollections(db){
        if(!db || typeof db != 'string') throw new Error('Invalid Database name')
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${db}/collections`,
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
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
        if(!options.database || !options.collectionName || ! options.documents) throw new Error('Invalid options')
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
        if(!options.database || !options.collectionName || !options.data) throw new Error('Invalid Options')
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
        if(!options.database || !options.collectionName) throw new Error('Invalid Options')
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
    viewDocument(options){
        if(!options.database || !options.collectionName || !options.id) throw new Error('Invalid Options')
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}/${options.id}`,
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    updateDocument(options){
        if(!options.database || !options.collectionName || !options.id || !options.updateObject) throw new Error('Invalid Options')
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}/${options.id}`,
            method:'PUT',
            body:options.updateObject,
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    deleteDocument(options){
        if(!options.database || !options.collectionName || !options.id) throw new Error('Invalid Options')
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/collections/${options.collectionName}/${options.id}`,
            method:'DELETE',
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return rp(opt)
    }
    runCommand(options){
        if(!options.database || !options.commands) throw new Error('Invalid Options')
        var opt = {
            uri: `https://api.mongolab.com/api/1/databases/${options.database}/runCommand`,
            method:'POST',
            body:options.commands,
            qs: {
                apiKey:this.apiKey // -> uri + '?access_token=xxxxx%20xxxxx'
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        return mLabInteractor
    }
}


