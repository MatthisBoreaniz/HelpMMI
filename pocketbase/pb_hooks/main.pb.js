/* eslint-disable */
/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateRequest((e) => {
  // e.record est l'Aide qui vient d'être créée
  const newAide = e.record

  // On cherche la collection Notifications
  const collection = $app.dao().findCollectionByNameOrId('Notifications')

  // On prépare la nouvelle notification
  const notif = new Record(collection)
  notif.set('titre', 'Nouvelle aide ajoutée')
  notif.set('message', `Une aide "${newAide.get('nom')}" a été ajoutée.`) 
  notif.set('type', 'info')
  notif.set('read', false)
  notif.set('forAllUsers', true)
  notif.set('aide', newAide.id)

  $app.dao().saveRecord(notif)
}, 'Aides')

onRecordAfterDeleteRequest((e) => {
    const deletedAide = e.record;
    const notificationCollection = $app.dao().findCollectionByNameOrId("Notifications");

    const notif = new Record(notificationCollection);
    
    // On récupère le nom de l'aide supprimée pour le message
    const nomAide = deletedAide.get("nom") || "Aide supprimée";

    notif.set("titre", "Aide supprimée");
    notif.set("message", `L'aide "${nomAide}" a été supprimée.`);
    notif.set("type", "warning");
    notif.set("read", false);
    notif.set("forAllUsers", true);
    // Pas d'ID 'aide' car elle n'existe plus

    $app.dao().saveRecord(notif);
}, "Aides")

// Ce Cron tourne tous les 3 jours à 4h00 du matin
cronAdd("clean_orphans", "0 4 */3 * *", () => {
    
    $app.dao().db().newQuery(`
        DELETE FROM NotificationsEtat
        WHERE notification NOT IN (SELECT id FROM Notifications)
    `).execute();

    console.log("Nettoyage des états orphelins terminé (Cycle de 3 jours).");
})
