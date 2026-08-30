import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="card w-full max-w-sm p-6">
              <Dialog.Title className="text-xl">{title}</Dialog.Title>
              {description && <Dialog.Description className="mt-2 text-sm text-text-muted">{description}</Dialog.Description>}
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={onConfirm} disabled={isLoading}>
                  {isLoading ? 'Working…' : confirmLabel}
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
