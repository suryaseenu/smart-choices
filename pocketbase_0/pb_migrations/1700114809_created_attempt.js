/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "wkkoshgx36rh1z2",
    "created": "2023-11-16 06:06:49.455Z",
    "updated": "2023-11-16 06:06:49.455Z",
    "name": "attempt",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "l9mnhe7h",
        "name": "result",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "ws6u2f6j",
        "name": "dateOfAttempt",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("wkkoshgx36rh1z2");

  return dao.deleteCollection(collection);
})
