import { ref, onBeforeUnmount } from 'vue'
import { pb } from '@/backend'
import type {
  NotificationsResponse,
  AidesResponse,
  NotificationsEtatResponse,
} from '@/pocketbase-types'

// --------------------------------------------------------
// 1. Définitions des Types
// --------------------------------------------------------

type NotificationExpand = {
  aide?: AidesResponse
}

// Type interne pour dire à TS que ces champs existent lors du fetch
type NotificationsWithSystem = NotificationsResponse & {
  created: string
  updated: string
  expand?: NotificationExpand
}

export type UINotification = {
  id: string
  titre: string
  message: string
  type: string
  read: boolean
  user: string
  created: string // Le champ qui posait problème
  aide?: AidesResponse
}

// État global partagé
const notifications = ref<UINotification[]>([])

export default function useNotifications(currentUserId: string) {
  let unsubscribeFunc: (() => void) | null = null

  // ------------------------------------------------------
  // Charger les notifications (Globales + Personnelles)
  // ------------------------------------------------------
  const loadNotifications = async () => {
    try {
      // 1. On charge les notifs (Les miennes OU celles pour tout le monde)
      // Notez le filtre avec '||'
      const notifsResult = await pb
        .collection('Notifications')
        .getFullList<NotificationsWithSystem>({
          filter: `user="${currentUserId}" || forAllUsers=true`,
          sort: '-created',
          expand: 'aide',
        })

      // 2. On charge les ÉTATS (lu/supprimé) spécifiques à l'utilisateur courant
      // (Si la collection n'existe pas encore, cela renverra un tableau vide ou une erreur gérée)
      let myStates: NotificationsEtatResponse[] = []
      try {
        myStates = await pb.collection('NotificationsEtat').getFullList<NotificationsEtatResponse>({
          filter: `user="${currentUserId}"`,
        })
      } catch (e) {
        // On ignore l'erreur si la collection "NotificationsEtat" n'existe pas encore
        console.warn('Table NotificationsEtat introuvable ou vide', e)
      }

      // 3. Fusion et Mapping
      const processedNotifs: UINotification[] = []

      for (const n of notifsResult) {
        // On cherche si j'ai un état personnel pour cette notif
        const state = myStates.find((s) => {
          // On extrait l'ID proprement, que ce soit un tableau ou une string
          const stateNotifId = Array.isArray(s.notification) ? s.notification[0] : s.notification

          return stateNotifId === n.id
        })

        // Si je l'ai supprimée localement, on ne l'affiche pas
        if (state?.isDeleted) {
          continue
        }

        // Gestion de l'expand (tableau ou objet)
        const expandedAide = Array.isArray(n.expand?.aide) ? n.expand.aide[0] : n.expand?.aide

        processedNotifs.push({
          id: n.id,
          titre: n.titre,
          message: n.message,
          type: n.type,
          // Elle est lue SI (état personnel existe et est lu) OU (le champ de base est true)
          read: state?.isRead || n.read,
          user: (Array.isArray(n.user) ? n.user[0] : n.user) || '',
          created: n.created, // Ici ça marche grâce au type NotificationsWithSystem
          aide: expandedAide,
        })
      }

      notifications.value = processedNotifs
    } catch (e) {
      console.error('Erreur lors du chargement des notifications:', e)
    }
  }

  // ------------------------------------------------------
  // Ajouter une notification (Manuellement)
  // ------------------------------------------------------
  const addNotification = async (notif: {
    titre: string
    message: string
    type: string
    aideId?: string
  }) => {
    try {
      // Création basique (par défaut non lue)
      const record = await pb.collection('Notifications').create<NotificationsWithSystem>({
        user: currentUserId,
        titre: notif.titre,
        message: notif.message,
        type: notif.type,
        read: false,
        aide: notif.aideId || null,
        forAllUsers: false, // Explicitement pour moi
      })

      // Ajout local pour l'UI
      notifications.value.unshift({
        id: record.id,
        titre: record.titre,
        message: record.message,
        type: record.type,
        read: false,
        user: currentUserId,
        created: record.created,
        aide: undefined,
      })
    } catch (e) {
      console.error('Erreur addNotification:', e)
    }
  }

  // ------------------------------------------------------
  // Marquer comme lu (Via Table d'État)
  // ------------------------------------------------------
  const markAsRead = async (id: string) => {
    // 1. Update UI immédiat
    const n = notifications.value.find((n) => n.id === id)
    if (n) n.read = true

    try {
      // 2. Chercher si un état existe déjà
      const existingState = await pb
        .collection('NotificationsEtat')
        .getFirstListItem(`user="${currentUserId}" && notification="${id}"`)
        .catch(() => null)

      if (existingState) {
        // Mise à jour de l'existant
        await pb.collection('NotificationsEtat').update(existingState.id, { isRead: true })
      } else {
        // Création du nouvel état
        await pb.collection('NotificationsEtat').create({
          user: currentUserId,
          notification: id,
          isRead: true,
          isDeleted: false,
        })
      }
    } catch (e) {
      console.error('Erreur markAsRead:', e)
    }
  }

  // ------------------------------------------------------
  // Supprimer (Soft Delete via Table d'État)
  // ------------------------------------------------------
  const deleteNotification = async (id: string) => {
    // 1. Update UI immédiat
    notifications.value = notifications.value.filter((n) => n.id !== id)

    try {
      const existingState = await pb
        .collection('NotificationsEtat')
        .getFirstListItem(`user="${currentUserId}" && notification="${id}"`)
        .catch(() => null)

      if (existingState) {
        await pb.collection('NotificationsEtat').update(existingState.id, { isDeleted: true })
      } else {
        await pb.collection('NotificationsEtat').create({
          user: currentUserId,
          notification: id,
          isDeleted: true,
          isRead: true, // Si supprimé, on peut considérer comme lu
        })
      }
    } catch (e) {
      console.error('Erreur deleteNotification:', e)
    }
  }

    // ------------------------------------------------------
    // Supprimer toutes les notifications
    // ------------------------------------------------------
    const deleteAllNotifications = async () => {
      const allIds = notifications.value.map((n) => n.id)
      // On lance toutes les suppressions en parallèle
      await Promise.all(allIds.map((id) => deleteNotification(id)))
    }
  // ------------------------------------------------------
  // Tout marquer comme lu
  // ------------------------------------------------------
  const markAllAsRead = async () => {
    const unread = notifications.value.filter((n) => !n.read)
    // On lance toutes les requêtes en parallèle
    await Promise.all(unread.map((n) => markAsRead(n.id)))
  }

  // ------------------------------------------------------
  // Realtime
  // ------------------------------------------------------
  const startRealtime = async () => {
    // On s'abonne à TOUT
    const sub = await pb.collection('Notifications').subscribe('*', (e) => {
      const record = e.record as unknown as NotificationsResponse

      // On recharge SI :
      // 1. C'est une notif pour moi (user == currentUserId)
      // 2. OU C'est une notif pour tout le monde (forAllUsers == true)

      // Note : on caste 'record.user' car l'event realtime peut renvoyer string ou string[]
      const targetUser = Array.isArray(record.user) ? record.user[0] : record.user

      // forAllUsers peut ne pas être dans les types générés s'ils sont vieux
      const isGlobal = (record as NotificationsResponse & { forAllUsers?: boolean }).forAllUsers === true

      if (targetUser === currentUserId || isGlobal) {
        loadNotifications()
      }
    })

    unsubscribeFunc = sub
  }

  // Initialisation
  startRealtime()

  onBeforeUnmount(() => {
    if (unsubscribeFunc) unsubscribeFunc()
  })

  return {
    notifications,
    loadNotifications,
    addNotification,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
    markAllAsRead,
  }
}
