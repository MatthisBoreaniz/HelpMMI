import { ref, computed } from 'vue'
import { pb } from '@/backend'
import type { UsersResponse, UsersRecord } from '@/pocketbase-types'


type UsersCreatePayload = UsersRecord & {
  email: string
  password: string
  passwordConfirm: string
}

const currentUser = ref<UsersResponse | null>(pb.authStore.model as UsersResponse | null)

pb.authStore.onChange(() => {
  currentUser.value = pb.authStore.model as UsersResponse | null
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
    currentUser.value = pb.authStore.model as UsersResponse
    return record
  } catch (err) {
    console.error('❌ Erreur lors de l’inscription :', err)
    throw err
  }
}

async function login(email: string, password: string) {
  try {
    const authData = await pb.collection('users').authWithPassword(email, password)
    currentUser.value = authData.record as UsersResponse
    return authData
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
  return { pb, currentUser, isLoggedIn, register, login, logout }
}
