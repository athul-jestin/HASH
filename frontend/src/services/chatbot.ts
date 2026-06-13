import api from './api'
import { ChatbotResponse } from '../types'

export const chatbotService = {
  sendMessage: (message: string) =>
    api.post<ChatbotResponse>('/chatbot', { message }),

  streamMessage: (message: string, onChunk: (chunk: string) => void): Promise<void> => {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('token')
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chatbot/stream`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ message }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const reader = response.body?.getReader()
          if (!reader) throw new Error('No response body')

          const decoder = new TextDecoder()
          const read = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                resolve()
                return
              }
              const chunk = decoder.decode(value, { stream: true })
              chunk.split('\n').forEach((line) => {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6)
                  if (data) {
                    onChunk(data)
                  }
                }
              })
              read()
            })
          }
          read()
        })
        .catch(reject)
    })
  },
}
