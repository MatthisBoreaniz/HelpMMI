/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Aides = "Aides",
	Avatars = "Avatars",
	Categories = "Categories",
	Etapes = "Etapes",
	LogosAndImages = "LogosAndImages",
	Questions = "Questions",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AidesRecord<TConditions = unknown> = {
	Astuce?: HTMLString
	Conditions?: null | TConditions
	Contact?: HTMLString
	Description?: HTMLString
	Document?: HTMLString
	imageCard?: string
	nom?: string
	relCategories?: RecordIdString[]
}

export type AvatarsRecord = {
	image?: string
	nom?: string
}

export type CategoriesRecord = {
	nom?: string
}

export type EtapesRecord = {
	contenu?: HTMLString
	ordre?: number
	relAide?: RecordIdString[]
	titre?: string
}

export type LogosAndImagesRecord = {
	image?: string
	nom?: string
}

export enum QuestionsCategorieOptions {

}
export type QuestionsRecord<Toptions = unknown> = {
	categorie?: string
	options?: null | Toptions
	question?: string
	slug?: string
}

export type UsersRecord<Treponses = unknown> = {
	Adress?: string
	BirthDate?: IsoDateString
	Formation?: string
	Phone?: number
	aides_obtenues?: RecordIdString[]
	etapes_validees?: RecordIdString[]
	firstName?: string
	mes_aides?: RecordIdString[]
	name?: string
	relAvatars?: RecordIdString[]
	relFavoris?: RecordIdString[]
	reponses?: null | Treponses
}

// Response types include system fields and match responses from the PocketBase API
export type AidesResponse<TConditions = unknown, Texpand = unknown> = Required<AidesRecord<TConditions>> & BaseSystemFields<Texpand>
export type AvatarsResponse<Texpand = unknown> = Required<AvatarsRecord> & BaseSystemFields<Texpand>
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type EtapesResponse<Texpand = unknown> = Required<EtapesRecord> & BaseSystemFields<Texpand>
export type LogosAndImagesResponse<Texpand = unknown> = Required<LogosAndImagesRecord> & BaseSystemFields<Texpand>
export type QuestionsResponse<Toptions = unknown, Texpand = unknown> = Required<QuestionsRecord<Toptions>> & BaseSystemFields<Texpand>
export type UsersResponse<Treponses = unknown, Texpand = unknown> = Required<UsersRecord<Treponses>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	Aides: AidesRecord
	Avatars: AvatarsRecord
	Categories: CategoriesRecord
	Etapes: EtapesRecord
	LogosAndImages: LogosAndImagesRecord
	Questions: QuestionsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	Aides: AidesResponse
	Avatars: AvatarsResponse
	Categories: CategoriesResponse
	Etapes: EtapesResponse
	LogosAndImages: LogosAndImagesResponse
	Questions: QuestionsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'Aides'): RecordService<AidesResponse>
	collection(idOrName: 'Avatars'): RecordService<AvatarsResponse>
	collection(idOrName: 'Categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'Etapes'): RecordService<EtapesResponse>
	collection(idOrName: 'LogosAndImages'): RecordService<LogosAndImagesResponse>
	collection(idOrName: 'Questions'): RecordService<QuestionsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
