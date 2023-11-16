/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "8lb27x7gbhh6te6",
    "created": "2023-11-16 06:05:04.335Z",
    "updated": "2023-11-16 06:05:04.335Z",
    "name": "question",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "sto71hx0",
        "name": "questionText",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  const collection = dao.findCollectionByNameOrId("8lb27x7gbhh6te6");

  return dao.deleteCollection(collection);
})
