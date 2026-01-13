import PocketBase from 'pocketbase'
import { type TypedPocketBase, type UsersResponse } from './pocketbase-types'
import { ref } from 'vue'

export const pb = new PocketBase(import.meta.env.VITE_URL_POCKETBASE) as TypedPocketBase

/** Utilisteur connecté */
export const user = ref<UsersResponse | null>(null) //par defaut la valeur de ref est nulle ((null)) mais ensuite elle sera remplie par le model de l'utilisateur connecté (<UserResponse | null>)
pb.authStore.onChange((token, model) => {
  user.value = model as UsersResponse
}, true)

/** Utilisteur déconnection */
export function logout() {
  pb.authStore.clear()
  location.reload() // recharger la page
}

/** Utilisteur connecté via Github */
export async function LogInWithGithub() {
  const authData = await pb.collection('users').authWithOAuth2({ provider: 'github' })
  console.log('LogInWithGithub', authData)
}

/** Utilisteur connecté via Google */
export async function LogInWithGoogle() {
  const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
  console.log('LogInWithGoogle', authData)
}

