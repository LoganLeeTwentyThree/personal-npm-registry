db = db.getSiblingDB('private-npm');
db.createCollection('temp-uuids')
db.getCollection('temp-uuids').createIndex({"inserttime": 1}, {expireAfterSeconds: 300})