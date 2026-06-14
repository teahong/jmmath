import { CalendarDays, Medal, RotateCcw, Timer, Trophy } from 'lucide-react'
import React from 'react'
import { clearRecords } from '../utils/storage.js'
import { formatDuration } from '../utils/time.js'

function Dashboard({ records, onClear }) {
  const totalScore = records.reduce((sum, item) => sum + item.score, 0)
  const totalCorrect = records.reduce((sum, item) => sum + item.correct, 0)
  const totalSolved = records.reduce((sum, item) => sum + item.total, 0)
  const timedRecords = records.filter((item) => item.durationMs)
  const bestDuration = timedRecords.reduce(
    (best, item) => (best === null || item.durationMs < best ? item.durationMs : best),
    null
  )

  const clear = () => {
    clearRecords()
    onClear()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <section className="rounded-[2rem] border-4 border-slate-900 bg-[#219ebc] p-5 text-white shadow-pop">
        <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white text-[#fb5607]">
          <Trophy size={36} fill="currentColor" />
        </div>
        <h1 className="mt-4 text-4xl font-black">학습 기록</h1>
        <div className="mt-6 grid gap-3">
          <Stat label="누적 점수" value={`${totalScore}점`} />
          <Stat label="맞은 문제" value={`${totalCorrect}개`} />
          <Stat label="푼 문제" value={`${totalSolved}개`} />
          <Stat label="최고 기록" value={bestDuration ? formatDuration(bestDuration) : '-'} />
        </div>
        <button
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-lg font-black text-slate-900 shadow-md transition active:scale-95"
          type="button"
          onClick={clear}
        >
          <RotateCcw size={22} />
          기록 지우기
        </button>
      </section>

      <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-pop">
        {records.length === 0 ? (
          <div className="grid min-h-[360px] place-items-center rounded-[1.5rem] bg-[#fff7d6] text-center">
            <div>
              <Medal className="mx-auto text-[#ffb703]" size={72} fill="currentColor" />
              <p className="mt-4 text-2xl font-black">아직 저장된 기록이 없어요</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {records.map((record) => (
              <article
                key={record.id}
                className="grid gap-3 rounded-[1.5rem] bg-slate-100 p-4 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ffb703]">
                    <CalendarDays size={25} />
                  </span>
                  <div>
                    <p className="text-xl font-black">{record.date}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-extrabold text-slate-500">
                      <span>{record.level.toUpperCase()} · {record.correct}/{record.total} 정답</span>
                      {record.durationMs && (
                        <span className="inline-flex items-center gap-1">
                          <Timer size={16} />
                          {formatDuration(record.durationMs)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="rounded-2xl bg-white px-5 py-3 text-2xl font-black text-[#fb5607]">
                  {record.score}점
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/95 px-4 py-3 text-slate-950">
      <p className="text-sm font-black text-slate-500">{label}</p>
      <p className="text-3xl font-black">{value}</p>
    </div>
  )
}

export default Dashboard
