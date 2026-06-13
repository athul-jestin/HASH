import { createModel } from '@rematch/core'
import type { ModalsState } from './types'

const initialState: ModalsState = {
  isMainModalOpen: false,
  isShareModalOpen: false,
  isCategoryModalOpen: false,
  isCastModalOpen: false,
  isImagePreviewOpen: false,
  selectedData: null,
}

export const modalsModel = createModel<ModalsState>()({
  state: initialState,
  reducers: {
    openMainModal(state: ModalsState, payload?: unknown) {
      return {
        ...state,
        isMainModalOpen: true,
        selectedData: payload || null,
      }
    },
    closeMainModal(state) {
      return {
        ...state,
        isMainModalOpen: false,
        selectedData: null,
      }
    },
    openShareModal(state, payload?: unknown) {
      return {
        ...state,
        isShareModalOpen: true,
        selectedData: payload || null,
      }
    },
    closeShareModal(state) {
      return {
        ...state,
        isShareModalOpen: false,
      }
    },
    openCategoryModal(state) {
      return {
        ...state,
        isCategoryModalOpen: true,
      }
    },
    closeCategoryModal(state) {
      return {
        ...state,
        isCategoryModalOpen: false,
      }
    },
    openCastModal(state) {
      return {
        ...state,
        isCastModalOpen: true,
      }
    },
    closeCastModal(state) {
      return {
        ...state,
        isCastModalOpen: false,
      }
    },
    openImagePreview(state, payload: string) {
      return {
        ...state,
        isImagePreviewOpen: true,
        selectedData: payload,
      }
    },
    closeImagePreview(state) {
      return {
        ...state,
        isImagePreviewOpen: false,
        selectedData: null,
      }
    },
  },
})
