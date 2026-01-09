/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "xmelut0b",
    "name": "Description",
    "type": "editor",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "convertUrls": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd")

  // remove
  collection.schema.removeField("xmelut0b")

  return dao.saveCollection(collection)
})
