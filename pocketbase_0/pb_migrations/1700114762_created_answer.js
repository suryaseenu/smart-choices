/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1bpu7sxjy9wo5d4",
    "created": "2023-11-16 06:06:02.929Z",
    "updated": "2023-11-16 06:06:02.929Z",
    "name": "answer",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "i6sabt2m",
        "name": "answerText",
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
  const collection = dao.findCollectionByNameOrId("1bpu7sxjy9wo5d4");

  return dao.deleteCollection(collection);
})
