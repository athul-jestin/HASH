import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { AxiosError } from 'axios'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { moviesService, categoriesService } from '@services/index'
import { UploadField } from '@components/UploadField'
import { Loader } from '@components/Loader'
import { MovieCreateInput } from '../../types'

const movieSchema = z.object({
  name: z.string().min(1, 'Required'),
  desc: z.string().min(1, 'Required'),
  categoryId: z.string().min(1, 'Select a category'),
  language: z.string().min(1, 'Required'),
  year: z.coerce.number().int().min(1900).max(2100),
  time: z.coerce.number().int().min(1, 'Minutes'),
})

type MovieFormValues = z.infer<typeof movieSchema>

interface CastDraft {
  name: string
  path: string | null
  previewUrl: string | null
}

const MovieForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [titleImage, setTitleImage] = useState<{ path: string | null; url: string | null }>({ path: null, url: null })
  const [image, setImage] = useState<{ path: string | null; url: string | null }>({ path: null, url: null })
  const [video, setVideo] = useState<{ path: string | null; url: string | null }>({ path: null, url: null })
  const [existingCastNames, setExistingCastNames] = useState<string[]>([])
  const [casts, setCasts] = useState<CastDraft[]>([])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  })

  const { data: movieData, isLoading: loadingMovie } = useQuery({
    queryKey: ['movie', id],
    queryFn: () => moviesService.getMovieById(id!),
    enabled: isEdit,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormValues>({ resolver: zodResolver(movieSchema) })

  useEffect(() => {
    if (movieData?.data && categoriesData?.data) {
      const movie = movieData.data
      const matchedCategory = categoriesData.data.find((cat) => cat.title === movie.category)
      reset({
        name: movie.name,
        desc: movie.desc,
        categoryId: matchedCategory?.id ?? '',
        language: movie.language,
        year: movie.year,
        time: movie.time,
      })
      setExistingCastNames(movie.casts.map((c) => c.name))
    }
  }, [movieData, categoriesData, reset])

  const addCast = () => setCasts((prev) => [...prev, { name: '', path: null, previewUrl: null }])
  const removeCast = (index: number) => setCasts((prev) => prev.filter((_, i) => i !== index))
  const updateCastName = (index: number, name: string) =>
    setCasts((prev) => prev.map((c, i) => (i === index ? { ...c, name } : c)))
  const updateCastImage = (index: number, path: string | null, previewUrl: string | null) =>
    setCasts((prev) => prev.map((c, i) => (i === index ? { ...c, path, previewUrl } : c)))

  const mutation = useMutation({
    mutationFn: (values: MovieFormValues) => {
      const castsPayload =
        casts.length > 0
          ? casts.filter((c) => c.name && c.path).map((c) => ({ name: c.name, image: c.path! }))
          : undefined

      if (isEdit) {
        const payload: Record<string, unknown> = { ...values }
        if (!titleImage.path) delete payload.titleImage
        else payload.titleImage = titleImage.path
        if (!image.path) delete payload.image
        else payload.image = image.path
        if (video.path) payload.video = video.path
        if (castsPayload) payload.casts = castsPayload
        return moviesService.updateMovie(id!, payload)
      }

      const payload: MovieCreateInput = {
        ...values,
        titleImage: titleImage.path!,
        image: image.path!,
        video: video.path,
        casts: castsPayload ?? [],
      }
      return moviesService.createMovie(payload)
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Movie updated' : 'Movie created')
      queryClient.invalidateQueries({ queryKey: ['dashboard-movies'] })
      queryClient.invalidateQueries({ queryKey: ['movie', id] })
      navigate('/dashboard/movies')
    },
    onError: (err: AxiosError<{ detail?: string }>) => {
      toast.error(err.response?.data?.detail || 'Could not save movie')
    },
  })

  const onSubmit = (values: MovieFormValues) => {
    if (!isEdit && (!titleImage.path || !image.path)) {
      toast.error('Upload a title image and a poster image first')
      return
    }
    mutation.mutate(values)
  }

  if (isEdit && loadingMovie) return <Loader />

  return (
    <div>
      <h2 className="text-2xl">{isEdit ? 'Edit Movie' : 'New Movie'}</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 max-w-2xl space-y-5">
        <div>
          <label className="field-label">Name</label>
          <input className="input-field" {...register('name')} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>

        <div>
          <label className="field-label">Description</label>
          <textarea className="input-field min-h-24" {...register('desc')} />
          {errors.desc && <p className="field-error">{errors.desc.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Category</label>
            <select className="input-field" {...register('categoryId')}>
              <option value="">Select…</option>
              {(categoriesData?.data ?? []).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="field-error">{errors.categoryId.message}</p>}
          </div>
          <div>
            <label className="field-label">Language</label>
            <input className="input-field" {...register('language')} />
            {errors.language && <p className="field-error">{errors.language.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="field-label">Year</label>
            <input type="number" className="input-field" {...register('year')} />
            {errors.year && <p className="field-error">{errors.year.message}</p>}
          </div>
          <div>
            <label className="field-label">Duration (minutes)</label>
            <input type="number" className="input-field" {...register('time')} />
            {errors.time && <p className="field-error">{errors.time.message}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <UploadField
            label={isEdit ? 'Title image (upload to replace)' : 'Title image (poster)'}
            kind="image"
            path={titleImage.path}
            previewUrl={titleImage.url ?? (isEdit ? movieData?.data.titleImage ?? null : null)}
            onChange={(path, url) => setTitleImage({ path, url })}
          />
          <UploadField
            label={isEdit ? 'Backdrop image (upload to replace)' : 'Backdrop image'}
            kind="image"
            path={image.path}
            previewUrl={image.url ?? (isEdit ? movieData?.data.image ?? null : null)}
            onChange={(path, url) => setImage({ path, url })}
          />
          <UploadField
            label={isEdit ? 'Video (upload to replace)' : 'Video (optional)'}
            kind="video"
            path={video.path}
            previewUrl={video.url ?? (isEdit ? movieData?.data.video ?? null : null)}
            onChange={(path, url) => setVideo({ path, url })}
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="field-label !mb-0">Cast</label>
            <button type="button" onClick={addCast} className="btn-secondary !py-1.5 !px-3 text-xs">
              <FaPlus size={10} /> Add cast member
            </button>
          </div>

          {isEdit && existingCastNames.length > 0 && casts.length === 0 && (
            <p className="mt-2 text-xs text-text-muted">
              Current cast: {existingCastNames.join(', ')}. Adding a cast member below will replace this entire list.
            </p>
          )}

          <div className="mt-3 space-y-3">
            {casts.map((cast, index) => (
              <div key={index} className="card flex items-center gap-3 p-3">
                <UploadField
                  label=""
                  kind="image"
                  path={cast.path}
                  previewUrl={cast.previewUrl}
                  onChange={(path, url) => updateCastImage(index, path, url)}
                />
                <input
                  className="input-field flex-1"
                  placeholder="Cast member name"
                  value={cast.name}
                  onChange={(e) => updateCastName(index, e.target.value)}
                />
                <button type="button" onClick={() => removeCast(index)} className="text-text-muted hover:text-accent">
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isSubmitting || mutation.isPending} className="btn-primary">
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Movie'}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard/movies')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default MovieForm
