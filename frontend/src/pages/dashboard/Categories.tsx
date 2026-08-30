import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa'
import { categoriesService } from '@services/index'
import { ConfirmDialog } from '@components/ConfirmDialog'
import { Loader } from '@components/Loader'
import { Category } from '../../types'

const DashboardCategories: React.FC = () => {
  const queryClient = useQueryClient()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<Category | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['categories'] })

  const createMutation = useMutation({
    mutationFn: (title: string) => categoriesService.createCategory({ title }),
    onSuccess: () => {
      toast.success('Category created')
      setIsCreating(false)
      setDraftTitle('')
      invalidate()
    },
    onError: (err: AxiosError<{ detail?: string }>) => toast.error(err.response?.data?.detail || 'Could not create category'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => categoriesService.updateCategory(id, { title }),
    onSuccess: () => {
      toast.success('Category updated')
      setEditingCategory(null)
      invalidate()
    },
    onError: (err: AxiosError<{ detail?: string }>) => toast.error(err.response?.data?.detail || 'Could not update category'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesService.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category removed')
      setPendingDelete(null)
      invalidate()
    },
    onError: (err: AxiosError<{ detail?: string }>) => {
      toast.error(err.response?.data?.detail || 'Could not delete category')
      setPendingDelete(null)
    },
  })

  const categories = data?.data ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">Categories</h2>
        <button className="btn-primary" onClick={() => setIsCreating(true)}>
          <FaPlus size={12} /> New Category
        </button>
      </div>

      {isCreating && (
        <form
          className="card mt-4 flex items-center gap-3 p-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (draftTitle.trim()) createMutation.mutate(draftTitle.trim())
          }}
        >
          <input
            autoFocus
            className="input-field flex-1"
            placeholder="Category title"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
          />
          <button type="submit" disabled={createMutation.isPending} className="btn-primary !py-2">
            Save
          </button>
          <button type="button" className="btn-secondary !py-2" onClick={() => setIsCreating(false)}>
            Cancel
          </button>
        </form>
      )}

      {isLoading && <Loader />}

      {!isLoading && (
        <ul className="mt-6 divide-y divide-border">
          {categories.map((category) => (
            <li key={category.id} className="flex items-center justify-between py-3">
              {editingCategory?.id === category.id ? (
                <form
                  className="flex flex-1 items-center gap-3"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (draftTitle.trim()) updateMutation.mutate({ id: category.id, title: draftTitle.trim() })
                  }}
                >
                  <input
                    autoFocus
                    className="input-field flex-1"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                  />
                  <button type="submit" disabled={updateMutation.isPending} className="btn-primary !py-2">
                    Save
                  </button>
                  <button type="button" className="btn-secondary !py-2" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <span>{category.title}</span>
                  <div className="flex gap-3 text-text-muted">
                    <button
                      onClick={() => {
                        setEditingCategory(category)
                        setDraftTitle(category.title)
                      }}
                      className="hover:text-text"
                      aria-label="Edit"
                    >
                      <FaPen size={14} />
                    </button>
                    <button onClick={() => setPendingDelete(category)} className="hover:text-accent" aria-label="Delete">
                      <FaTrash size={14} />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
          {categories.length === 0 && <p className="py-6 text-text-muted">No categories yet.</p>}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete category?"
        description={`"${pendingDelete?.title}" will be removed. Movies using this category must be reassigned first.`}
        isLoading={deleteMutation.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  )
}

export default DashboardCategories
