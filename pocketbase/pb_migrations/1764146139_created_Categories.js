/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ugc9ll2nzc14in4",
    "created": "2025-11-26 08:35:39.819Z",
    "updated": "2025-11-26 08:35:39.819Z",
    "name": "Categories",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pmqgvfwr",
        "name": "nom",
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
  const collection = dao.findCollectionByNameOrId("ugc9ll2nzc14in4");

  return dao.deleteCollection(collection);
})
