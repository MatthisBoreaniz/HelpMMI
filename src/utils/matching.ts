/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AidesResponse } from '@/pocketbase-types'

// On définit à quoi ressemble le JSON à l'intérieur de "Conditions"
export type AideConditions = Record<string, string | string[] | boolean | number>

/**
 * Vérifie si une valeur utilisateur correspond à une condition
 */
const checkCondition = (userValue: any, conditionValue: any): boolean => {
  if (conditionValue === undefined || conditionValue === null) return true

  if (Array.isArray(conditionValue)) {
    return conditionValue.includes(userValue)
  }

  return conditionValue === userValue
}

/**
 * Filtre la liste des aides
 * On utilise le type générique <AideConditions> pour dire à TS ce qu'il y a dans le champ JSON
 */
export const trouverAidesEligibles = (
  toutesLesAides: AidesResponse<AideConditions>[],
  reponsesUser: Record<string, any>,
) => {
  return toutesLesAides.filter((aide) => {
    // ATTENTION : Dans ton fichier d.ts, c'est "Conditions" avec une majuscule !
    const conditions = aide.Conditions || {}

    if (Object.keys(conditions).length === 0) return true

    for (const [key, valCondition] of Object.entries(conditions)) {
      const valUser = reponsesUser[key]

      // Si l'utilisateur n'a pas répondu, on considère que c'est non
      if (valUser === undefined || valUser === null) return false

      if (!checkCondition(valUser, valCondition)) {
        return false
      }
    }

    return true
  })
}
