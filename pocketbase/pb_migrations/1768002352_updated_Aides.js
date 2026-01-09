/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6ndwxzhh",
    "name": "Conditions",
    "type": "json",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd")

  // remove
  collection.schema.removeField("6ndwxzhh")

  return dao.saveCollection(collection)
})
