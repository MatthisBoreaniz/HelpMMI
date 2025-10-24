/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Aides = "Aides",
	Avatars = "Avatars",
	LogosAndImages = "LogosAndImages",
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

export type AidesRecord = {
	nom?: string
}

export type AvatarsRecord = {
	image?: string
	nom?: string
}

export type LogosAndImagesRecord = {
	image?: string
	nom?: string
}

export type UsersRecord = {
	name?: string
	relAvatars?: RecordIdString[]
	relFavoris?: RecordIdString[]
}

// Response types include system fields and match responses from the PocketBase API
export type AidesResponse<Texpand = unknown> = Required<AidesRecord> & BaseSystemFields<Texpand>
export type AvatarsResponse<Texpand = unknown> = Required<AvatarsRecord> & BaseSystemFields<Texpand>
export type LogosAndImagesResponse<Texpand = unknown> = Required<LogosAndImagesRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	Aides: AidesRecord
	Avatars: AvatarsRecord
	LogosAndImages: LogosAndImagesRecord
	users: UsersRecord
}

export type CollectionResponses = {
	Aides: AidesResponse
	Avatars: AvatarsResponse
	LogosAndImages: LogosAndImagesResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'Aides'): RecordService<AidesResponse>
	collection(idOrName: 'Avatars'): RecordService<AvatarsResponse>
	collection(idOrName: 'LogosAndImages'): RecordService<LogosAndImagesResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
