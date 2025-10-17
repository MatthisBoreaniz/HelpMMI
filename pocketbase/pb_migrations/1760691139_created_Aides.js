/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "k5e72euc0a5uqnd",
    "created": "2025-10-17 08:52:19.896Z",
    "updated": "2025-10-17 08:52:19.896Z",
    "name": "Aides",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jktasgyz",
        "name": "name",
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
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("k5e72euc0a5uqnd");

  return dao.deleteCollection(collection);
})
