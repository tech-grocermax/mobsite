function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var request = (this._store || this._index)[funcName].apply(this._store, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var idb = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      request.onupgradeneeded = function(event) {
        if (upgradeCallback) {
          upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
        }
      };

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

/* IDB wrapper completed */
var version = "1";

console.log("[ServiceWorker] Version ", version);

self.addEventListener("install", function(e) {
    console.log("[ServiceWorker] Install");
});

self.addEventListener("activate", function(e) {
    console.log("[ServiceWorker] Activate");
});

function qgSendDataToServer(e) {
    var endpoint = "";
    dbPromise.then(function(db) {
        var tx = db.transaction(QG_STORE_NAME, "readonly");
        var keyValStore = tx.objectStore(QG_STORE_NAME);
        return keyValStore.get(QG_USER_SETTINGS);
    }).then(function(data) {
        e["userId"] = data["QGUserId"];
        delete data["QGUserId"];
        e["appId"] = data["appId"];
        e["device"] = "web";
    }).then(function(data) {
        var endpoint = "https://api.quantumgraph.com/web/" + e["appId"] + "/data/";
        delete e["appId"];
        return fetch(endpoint, {
            method: "POST",
            body: JSON.stringify(e),
            mode: "cors",
            credentials: "include",
            headers: new Headers({
                "Content-Type": "application/json",
                "Origin": self.registration.scope
            })
        }).then(function(response) {
            // console.log("response - success", response);
        }).catch(function(err) {
            // console.log("response - error ", err);
        })
    }).catch(function(err) {
        // console.log("error", err);
    })
};

function qgLogEvent(eventName, parameters) {
    var data = {
        "events": [{
            "eventName": eventName,
            "parameters": parameters,
            "qgts": parseInt(new Date().getTime() / 1000)
        }]
    };
    qgSendDataToServer(data);
}

function showNotification(notificationOptions) {
    var title = notificationOptions["title"];
    if (!notificationOptions.hasOwnProperty("data")) {
        notificationOptions["data"] = {};
    }
    var data = notificationOptions.data;
    data["notificationId"] = notificationOptions["notificationId"];
    if (!(data.hasOwnProperty("sendReceipt") && data.sendReceipt == false)) {
        qgLogEvent("notification_received", { "notificationId": data["notificationId"] });
    }
    delete notificationOptions["notificationId"];
    delete notificationOptions["title"];
    notificationOptions.data = data;
    return self.registration.showNotification(title, notificationOptions);
}

var QG_IDB_VERSION = 1;
var QG_DB_NAME = "qg-offline"
var QG_STORE_NAME = "qg-offline";
var QG_USER_SETTINGS = "qgusersettings";
var dbPromise = idb.open(QG_DB_NAME, QG_IDB_VERSION, function(upgradeDb) {
    upgradeDb.createObjectStore(QG_STORE_NAME);
});

self.addEventListener("push", function(event) {
    var s = self;
    try{
      var data = event.data.json();
      event.waitUntil(showNotification(data));
    } catch(e){
      event.waitUntil(
          dbPromise.then(function(db) {
              var tx = db.transaction(QG_STORE_NAME, "readonly");
              var keyValStore = tx.objectStore(QG_STORE_NAME);
              return keyValStore.get(QG_USER_SETTINGS);
          }).then(function(data) {
              data["scope"] = s.registration.scope;
              if (data.hasOwnProperty("QGUserId") && data.hasOwnProperty("appId")) {
                  data["userId"] = data["QGUserId"];
                  delete data["QGUserId"];
                  return data
              }
              return data;
          }).then(function(data) {
              var url = "https://users.quantumgraph.com/web-push/get-creative";
              url = url + "?"
              for (key in data) {
                  if (data.hasOwnProperty(key)) {
                      url = url + key + "=" + data[key] + "&";
                  }
              }
              if (url.endsWith("&")) {
                  url = url.slice(0, -1);
              }
              return fetch(url, {
                  mode: "cors",
                  credentials: "include",
                  headers: new Headers({
                      "Content-Type": "application/json",
                      "origin": data["scope"]
                  })
              })
          }).then(function(response) {
              if (response.status != 200) {
                  throw "Not a valid response";
              }
              var data = response.json();
              return data;
          }).then(function(data) {
              return showNotification(data);
          }).catch(function(e) {
              console.log("error in displaying notification", e);
          })
      );
    }
})

self.addEventListener("notificationclick", function(event) {
    var data = event.notification.data;
    var action = event.action;
    event.notification.close();
    event.waitUntil(
        clients.matchAll({
            type: "window"
        }).then(function(clientList) {
            var url = "/";
            if (data != undefined && data.hasOwnProperty("url")) {
                url = data.url;
            }
            if(action) {
              var url_key = String(action)+'_url';
              if(data.hasOwnProperty(url_key)) {
                url = data[url_key];
              }
            }
            for (var i = 0; i < clientList.length; i++) {
                var client = clientList[i];
                if (client.url == url && "focus" in client)
                    return client.focus();
            }
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
    if (data.hasOwnProperty("sendReceipt") && data.sendReceipt == false) {
        return;
    }
    var receipt = {
        "notificationId": data["notificationId"]
    }
    qgLogEvent("notification_clicked", receipt);
});
