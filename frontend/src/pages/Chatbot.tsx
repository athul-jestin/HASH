import React, { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AxiosError } from 'axios'
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa'
import { chatbotService } from '@services/index'
import { ChatMessage } from '../types'

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const mutation = useMutation({
    mutationFn: (message: string) => chatbotService.sendMessage(message),
    onSuccess: ({ data }) => {
      setMessages((prev) => [...prev, { role: 'assistant', content: data.replies }])
    },
    onError: (err: AxiosError<{ detail?: string }>) => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: err.response?.data?.detail || 'Something went wrong. Try again.' },
      ])
    },
  })

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || mutation.isPending) return
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    mutation.mutate(trimmed)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col px-4 py-6 sm:px-6">
      <h1 className="text-3xl">Chatbot</h1>
      <p className="mt-1 text-sm text-text-muted">Ask about movies, genres, or anything else on your mind.</p>

      <div className="mt-6 flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <div className="card flex items-center gap-3 p-4 text-sm text-text-muted">
            <FaRobot className="text-accent" />
            Try: &quot;Recommend a sci-fi movie&quot; or &quot;What should I watch tonight?&quot;
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {message.role === 'assistant' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-accent">
                <FaRobot size={14} />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2.5 text-sm ${
                message.role === 'user' ? 'bg-accent text-white' : 'card'
              }`}
            >
              {message.role === 'assistant' ? (
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                </div>
              ) : (
                message.content
              )}
            </div>
            {message.role === 'user' && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-text-muted">
                <FaUser size={12} />
              </div>
            )}
          </div>
        ))}

        {mutation.isPending && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-hover text-accent">
              <FaRobot size={14} />
            </div>
            <div className="card px-4 py-2.5 text-sm text-text-muted">Thinking…</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        className="mt-4 flex items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          className="input-field flex-1"
        />
        <button type="submit" disabled={mutation.isPending || !input.trim()} className="btn-primary !px-4">
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  )
}

export default Chatbot
