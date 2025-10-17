/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("5dziifx9btjilrd");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "5dziifx9btjilrd",
    "created": "2025-10-17 13:15:48.350Z",
    "updated": "2025-10-17 13:15:48.350Z",
    "name": "marco",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "vefgovxj",
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
})
