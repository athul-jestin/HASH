import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { FaUpload, FaTimes } from 'react-icons/fa'
import { uploadService } from '@services/index'

interface UploadFieldProps {
  label: string
  kind: 'image' | 'video'
  path: string | null
  previewUrl: string | null
  onChange: (path: string | null, previewUrl: string | null) => void
}

export const UploadField: React.FC<UploadFieldProps> = ({ label, kind, path, previewUrl, onChange }) => {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setIsUploading(true)
    try {
      const { data } = kind === 'image' ? await uploadService.uploadImage(file) : await uploadService.uploadVideo(file)
      onChange(data.path, data.url)
    } catch (err) {
      const message = (err as AxiosError<{ detail?: string }>).response?.data?.detail || `Could not upload ${kind}`
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <label className="field-label">{label}</label>

      {previewUrl ? (
        <div className="relative w-40">
          {kind === 'image' ? (
            <img src={previewUrl} alt={label} className="aspect-[2/3] w-40 rounded-md object-cover" />
          ) : (
            <video src={previewUrl} controls className="w-40 rounded-md" />
          )}
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white"
          >
            <FaTimes size={10} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="btn-secondary"
        >
          <FaUpload size={12} />
          {isUploading ? 'Uploading…' : `Upload ${kind}`}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={kind === 'image' ? 'image/*' : 'video/mp4'}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
      {path && <p className="mt-1 truncate text-xs text-text-muted">{path}</p>}
    </div>
  )
}
