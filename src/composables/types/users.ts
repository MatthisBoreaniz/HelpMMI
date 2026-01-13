import type {
  UsersResponse,
  AvatarsResponse,
  AidesResponse,
  EtapesResponse,
  CategoriesResponse,
} from '@/pocketbase-types'

export type UserReponses = Record<string, string | number | boolean>

export type UserExpanded = UsersResponse<UserReponses> & {
  expand?: {
    relAvatars?: AvatarsResponse
    relFavoris?: AidesResponse<{
      relCategories: CategoriesResponse
    }>[]
    mes_aides?: AidesResponse<{
      relCategories: CategoriesResponse
    }>[]
    aides_obtenues?: AidesResponse<{
      relCategories: CategoriesResponse
    }>[]
    etapes_validees?: EtapesResponse[]
  }
}
