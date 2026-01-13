/* eslint-disable */
/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateRequest((e) => {
  // e.record est l'Aide qui vient d'être créée
  const newAide = e.record

  // On cherche la collection Notifications
  const collection = $app.dao().findCollectionByNameOrId('Notifications')

  // On prépare la nouvelle notification
  const notif = new Record(collection)
  notif.set('nom', 'Nouvelle aide ajoutée')
  notif.set('message', `Une aide "${newAide.get('nom')}" a été ajoutée.`) // ou "nom" selon votre champ
  notif.set('type', 'info')
  notif.set('read', false)
  notif.set('forAllUsers', true)
  notif.set('aide', newAide.id)

  $app.dao().saveRecord(notif)
}, 'Aides')
