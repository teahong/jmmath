import { BarChart3, Calculator, Home, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import Dashboard from './components/Dashboard.jsx'
import MathGame from './components/MathGame.jsx'
import { getRecords } from './utils/storage.js'

function App() {
  const [view, setView] = useState('game')
  const [records, setRecords] = useState(() => getRecords())

  const refreshRecords = () => setRecords(getRecords())

  return (
    <main className="min-h-screen bg-[#fff7d6] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border-4 border-slate-900 bg-white p-4 shadow-pop sm:flex-row sm:items-center sm:justify-between">
          <button
            className="flex items-center gap-3 text-left"
            type="button"
            onClick={() => setView('game')}
          >
            <span className="grid h-14 w-14 place-items-center rounded-3xl bg-[#ffb703] text-slate-950">
              <Calculator size={34} strokeWidth={3} />
            </span>
            <span>
              <span className="block text-3xl font-black tracking-normal sm:text-4xl">재몬수학</span>
              <span className="flex items-center gap-1 text-sm font-extrabold text-slate-500">
                <Sparkles size={16} />
                손으로 쓰고 바로 채점해요
              </span>
            </span>
          </button>

          <nav className="grid grid-cols-2 gap-2 rounded-3xl bg-slate-100 p-2">
            <button
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-lg font-black transition ${
                view === 'game' ? 'bg-[#219ebc] text-white shadow-md' : 'text-slate-700'
              }`}
              type="button"
              onClick={() => setView('game')}
            >
              <Home size={22} />
              문제
            </button>
            <button
              className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-lg font-black transition ${
                view === 'dashboard' ? 'bg-[#fb5607] text-white shadow-md' : 'text-slate-700'
              }`}
              type="button"
              onClick={() => setView('dashboard')}
            >
              <BarChart3 size={22} />
              기록
            </button>
          </nav>
        </header>

        <section className="flex-1 py-6">
          {view === 'game' ? (
            <MathGame onSaved={refreshRecords} />
          ) : (
            <Dashboard records={records} onClear={refreshRecords} />
          )}
        </section>
      </div>
    </main>
  )
}

export default App
