import { init, RematchDispatch, RematchRootState, Models } from '@rematch/core'
import immerPlugin from '@rematch/immer'
import { moviesModel } from './models/movies'
import { modalsModel } from './models/modals'
import { notificationsModel } from './models/notifications'

export interface RootModel extends Models<RootModel> {
  moviesModel: typeof moviesModel
  modalsModel: typeof modalsModel
  notificationsModel: typeof notificationsModel
}

export const models: RootModel = {
  moviesModel,
  modalsModel,
  notificationsModel,
}

export const store = init<RootModel>({
  models,
  plugins: [immerPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel>
