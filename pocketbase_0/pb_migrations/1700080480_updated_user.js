/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4yppp8iwbfs4d60")

  collection.indexes = []

  // remove
  collection.schema.removeField("dxk02xt8")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4yppp8iwbfs4d60")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_cpvAPWh` ON `user` (`userId`)"
  ]

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dxk02xt8",
    "name": "userId",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
})
