import React from 'react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to HASH</h1>
          <p className="text-gray-400 mb-8">Your personal movie hub</p>
          <a
            href="/movies"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Explore Movies
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home
