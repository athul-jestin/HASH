import { init, RematchDispatch, RematchRootState } from '@rematch/core'
import immerPlugin from '@rematch/immer'
import { moviesModel } from './models/movies'
import { modalsModel } from './models/modals'
import { notificationsModel } from './models/notifications'

export const models = {
  moviesModel,
  modalsModel,
  notificationsModel,
} as const

export type RootModel = typeof models

export const store = init<RootModel>({
  models,
  plugins: [immerPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
