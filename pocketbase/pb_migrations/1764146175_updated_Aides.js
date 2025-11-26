/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "gofhmn0q",
    "name": "relCategories",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "ugc9ll2nzc14in4",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd")

  // remove
  collection.schema.removeField("gofhmn0q")

  return dao.saveCollection(collection)
})
