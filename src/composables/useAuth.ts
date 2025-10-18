import { ref, computed } from 'vue'
import { pb } from '@/backend'
import type { UsersResponse, UsersRecord, AvatarsResponse } from '@/pocketbase-types'

type UsersCreatePayload = UsersRecord & {
  email: string
  password: string
  passwordConfirm: string
}

const currentUser = ref<UsersResponse<{relAvatars: AvatarsResponse}> | null>(pb.authStore.record as UsersResponse<{relAvatars: AvatarsResponse}> | null)

async function refreshUser() {
  if (!pb.authStore.record) return null
  try {
    const user = await pb
      .collection<UsersResponse<{ relAvatars: AvatarsResponse }>>('users')
      .getOne(pb.authStore.record.id, {
        expand: "relAvatars",
      })
    currentUser.value = user 
    return user
  } catch (e) {
    console.error('Erreur refreshUser:', e)
    return null
  }
}

pb.authStore.onChange(() => {
  if (pb.authStore.isValid) {
    refreshUser()
  } else {
    currentUser.value = null
  }
})

async function register(email: string, password: string, name: string) {
  try {
    const data: UsersCreatePayload = {
      email,
      password,
      passwordConfirm: password,
      name,
    }

    const record = await pb.collection('users').create(data)
    await pb.collection('users').authWithPassword(email, password)
    await refreshUser()
    return record
  } catch (err) {
    console.error('❌ Erreur lors de l’inscription :', err)
    throw err
  }
}

async function login(email: string, password: string) {
  try {
    await pb.collection('users').authWithPassword(email, password)
    await refreshUser()
  } catch (err) {
    console.error('❌ Erreur de connexion :', err)
    throw err
  }
}

function logout() {
  pb.authStore.clear()
  currentUser.value = null
}

const isLoggedIn = computed(() => !!pb.authStore.token)

export default function useAuth() {
  return { pb, currentUser, isLoggedIn, register, login, logout, refreshUser }
}
