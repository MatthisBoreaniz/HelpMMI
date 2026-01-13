import { ref, computed } from 'vue'
import { pb } from '@/backend'
// import type { UsersResponse, AvatarsResponse, AidesResponse, EtapesResponse } from '@/pocketbase-types'
import type { UserExpanded } from '@/composables/types/users'

// // --- Types ---
// type UsersExpanded = UsersResponse<{
//   relAvatars: AvatarsResponse
//   relFavoris: AidesResponse[]
//   mes_aides: AidesResponse[]
//   etapes_validees: EtapesResponse[]
//   aides_obtenues: AidesResponse[]
// }>

// --- Etat utilisateur ---
const currentUser = ref<UserExpanded | null>(null)

// --- Locks pour éviter les bugs ---
let isRefreshing = false
let isLoggingOut = false

const loadingUser = ref(true)

// --- Refresh sécurisé ---
async function refreshUser() {
  if (!pb.authStore.model) return null

  // Empêche plusieurs refresh simultanés
  if (isRefreshing) return
  isRefreshing = true
  loadingUser.value = true

  try {
    const user = await pb
      .collection('users')
      .getOne<UserExpanded>(pb.authStore.model.id, {
        expand: 'relAvatars, relFavoris, mes_aides, etapes_validees, aides_obtenues',
      })

    // Mette à jour l'authStore + user
    pb.authStore.save(pb.authStore.token, user)
    currentUser.value = user

    return user
  } catch (e) {
    console.error('Erreur refreshUser:', e)
    return null
  } finally {
    isRefreshing = false
    loadingUser.value = false
  }
}

// --- Déclenchement auto lorsque authStore change ---
pb.authStore.onChange(() => {
  // Si logout en cours → on ne refresh PAS
  if (isLoggingOut) {
    isLoggingOut = false
    return
  }

  // Refresh normal
  if (pb.authStore.isValid) {
    refreshUser()
  } else {
    currentUser.value = null
  }
})

// --- Inscription ---
async function register(email: string, password: string, username: string) {
  try {
    const data = {
      username,
      email,
      emailVisibility: true,
      password,
      passwordConfirm: password,
    }

    const record = await pb.collection('users').create(data)

    await pb.collection('users').authWithPassword(email, password)
    await refreshUser()

    return record
  } catch (err) {
    console.error('Erreur inscription:', err)
    throw err
  }
}

// --- Connexion ---
async function login(email: string, password: string) {
  try {
    await pb.collection('users').authWithPassword(email, password)
    await refreshUser()
  } catch (err) {
    console.error('Erreur connexion:', err)
    throw err
  }
}

// --- Déconnexion stable ---
function logout() {
  isLoggingOut = true
  pb.authStore.clear()
  currentUser.value = null
}

// --- Suppression du compte ---
async function DeleteUser() {
  const user = pb.authStore.model
  if (!user) return

  try {
    await pb.collection('users').delete(user.id)
    isLoggingOut = true
    pb.authStore.clear()
    currentUser.value = null
  } catch (error) {
    console.error('Erreur suppression:', error)
  }
}

// --- Mise à jour user ---
async function updateUser(data: FormData | Record<string, string | number | boolean>) {
  const user = pb.authStore.model
  if (!user) return

  try {
    const updatedRecord = await pb.collection('users').update(user.id, data)
    await refreshUser()
    return updatedRecord
  } catch (err) {
    console.error('Erreur update profil:', err)
    throw err
  }
}

const isLoggedIn = computed(() => !!pb.authStore.token)
const authReady = ref(false)

async function ensureAuthReady() {
  // Déjà prêt → on ne refait rien
  if (authReady.value) return

  // Si connecté → on hydrate le user
  if (pb.authStore.isValid) {
    await refreshUser()
  }

  // Dans tous les cas, l’auth est maintenant prête
  authReady.value = true
}

// --- Export composable ---
export default function useAuth() {
  return {
    pb,
    currentUser,
    isLoggedIn,
    loadingUser,
    ensureAuthReady,
    register,
    login,
    logout,
    refreshUser,
    DeleteUser,
    updateUser,
  }
}
