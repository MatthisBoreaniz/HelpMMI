import { ref, computed } from 'vue'
import { pb } from '@/backend'
import type { UsersResponse, AvatarsResponse, AidesResponse } from '@/pocketbase-types'

// --- Payload de création minimal ---
type UsersCreatePayload = {
  email: string
  password: string
  passwordConfirm: string
  username?: string
}

// --- Utilisateur courant avec expansions ---
const currentUser = ref<UsersResponse<{
  relAvatars: AvatarsResponse
  relFavoris: AidesResponse[]
}> | null>(null)

// --- Rafraîchir le user loggé ---
async function refreshUser() {
  if (!pb.authStore.model) return null

  try {
    const user = await pb.collection('users').getOne<UsersResponse<{
      relAvatars: AvatarsResponse
      relFavoris: AidesResponse[]
    }>>(pb.authStore.model.id, {
      expand: 'relAvatars, relFavoris',
    })

    pb.authStore.save(pb.authStore.token, user)
    currentUser.value = user
    return user
  } catch (e) {
    console.error('Erreur refreshUser:', e)
    return null
  }
}

// --- Mise à jour automatique quand authStore change ---
pb.authStore.onChange(() => {
  if (pb.authStore.isValid) refreshUser()
  else currentUser.value = null
})

async function register(email: string, password: string, username: string) {
  try {
    const data = {
      username,
      email,
      emailVisibility: true, // recommandé pour PB
      password,
      passwordConfirm: password,
    }

    const record = await pb.collection('users').create(data)

    await pb.collection('users').authWithPassword(email, password)
    await refreshUser()

    return record
  } catch (err) {
    console.error('Erreur lors de l’inscription :', err)
    throw err
  }
}

// --- Connexion ---
async function login(email: string, password: string) {
  try {
    await pb.collection('users').authWithPassword(email, password)
    await refreshUser()
  } catch (err) {
    console.error('Erreur de connexion :', err)
    throw err
  }
}

// --- Déconnexion ---
function logout() {
  pb.authStore.clear()
  currentUser.value = null
}

// --- Suppression ---
async function DeleteUser() {
  const user = pb.authStore.model

  if (!user) {
    console.error('Aucun user connecté, impossible de supprimer.')
    return
  }

  try {
    await pb.collection('users').delete(user.id)
    pb.authStore.clear()
    currentUser.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression :', error)
  }
}

const isLoggedIn = computed(() => !!pb.authStore.token)

export default function useAuth() {
  return {
    pb,
    currentUser,
    isLoggedIn,
    register,
    login,
    logout,
    refreshUser,
    DeleteUser,
  }
}
