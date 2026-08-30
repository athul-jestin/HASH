import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { FaTrash } from 'react-icons/fa'
import { userService } from '@services/index'
import { ConfirmDialog } from '@components/ConfirmDialog'
import { Loader } from '@components/Loader'
import { User } from '../../types'

const DashboardUsers: React.FC = () => {
  const queryClient = useQueryClient()
  const [pendingDelete, setPendingDelete] = useState<User | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  })

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: () => {
      toast.success('User removed')
      setPendingDelete(null)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (err: AxiosError<{ detail?: string }>) => {
      toast.error(err.response?.data?.detail || 'Could not delete user')
      setPendingDelete(null)
    },
  })

  const users = data?.data ?? []

  return (
    <div>
      <h2 className="text-2xl">Users</h2>

      {isLoading && <Loader />}

      {!isLoading && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-text-muted">
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt={user.fullName} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-hover text-xs">
                          {user.fullName.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-text-muted">{user.email}</td>
                  <td className="py-3 pr-4">
                    {user.isAdmin ? (
                      <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-xs text-accent">Admin</span>
                    ) : (
                      <span className="text-xs text-text-muted">Member</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {!user.isAdmin && (
                      <div className="flex justify-end text-text-muted">
                        <button onClick={() => setPendingDelete(user)} className="hover:text-accent" aria-label="Delete">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="mt-6 text-text-muted">No users yet.</p>}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Remove user?"
        description={`${pendingDelete?.fullName} will lose access immediately. This cannot be undone.`}
        isLoading={deleteMutation.isPending}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />
    </div>
  )
}

export default DashboardUsers
