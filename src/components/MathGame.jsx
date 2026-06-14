import { CheckCircle2, Loader2, PartyPopper, Play, Timer, XCircle } from 'lucide-react'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Canvas from './Canvas.jsx'
import { playSuccessSound } from '../utils/celebration.js'
import { createProblem, levels } from '../utils/math.js'
import { saveRecord } from '../utils/storage.js'
import { formatDuration } from '../utils/time.js'
import { recognizeAnswer, useVisionRecognizer } from '../utils/vision.js'

const ROUND_SIZE = 10

function MathGame({ onSaved }) {
  const canvasRef = useRef(null)
  const { recognizer } = useVisionRecognizer()
  const [level, setLevel] = useState('lv1')
  const [problem, setProblem] = useState(() => createProblem('lv1'))
  const [round, setRound] = useState({ total: 0, correct: 0, score: 0 })
  const [result, setResult] = useState(null)
  const [checking, setChecking] = useState(false)
  const [roundActive, setRoundActive] = useState(false)
  const [roundStartedAt, setRoundStartedAt] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(0)

  const currentLevel = useMemo(() => levels.find((item) => item.id === level), [level])

  useEffect(() => {
    setProblem(createProblem(level))
    setResult(null)
    setRound({ total: 0, correct: 0, score: 0 })
    setRoundActive(false)
    setRoundStartedAt(null)
    setElapsedMs(0)
    canvasRef.current?.clear()
  }, [level])

  useEffect(() => {
    if (!roundActive || !roundStartedAt) return undefined

    const intervalId = window.setInterval(() => {
      setElapsedMs(Date.now() - roundStartedAt)
    }, 250)

    return () => window.clearInterval(intervalId)
  }, [roundActive, roundStartedAt])

  const startRound = () => {
    setRound({ total: 0, correct: 0, score: 0 })
    setResult(null)
    setProblem(createProblem(level))
    setRoundStartedAt(Date.now())
    setElapsedMs(0)
    setRoundActive(true)
    canvasRef.current?.clear()
  }

  const nextProblem = () => {
    setProblem(createProblem(level))
    setResult(null)
    canvasRef.current?.clear()
  }

  const checkAnswer = async () => {
    if (!recognizer || checking || !roundActive || (result && !result.error)) return
    setChecking(true)
    try {
      const prediction = await recognizeAnswer(recognizer, canvasRef.current.getCanvas())
      const isCorrect = prediction.value === problem.answer
      const nextRound = {
        total: round.total + 1,
        correct: round.correct + (isCorrect ? 1 : 0),
        score: round.score + (isCorrect ? currentLevel.points : 0)
      }
      setRound(nextRound)
      setResult({ ...prediction, isCorrect, answer: problem.answer })
      if (isCorrect) {
        playSuccessSound()
      }

      if (nextRound.total >= ROUND_SIZE) {
        const durationMs = Date.now() - roundStartedAt
        saveRecord({
          level,
          total: nextRound.total,
          correct: nextRound.correct,
          score: nextRound.score,
          durationMs
        })
        onSaved()
        setElapsedMs(durationMs)
        setRoundActive(false)
        setRoundStartedAt(null)
        setRound({ total: 0, correct: 0, score: 0 })
      }
    } catch (error) {
      setResult({
        text: '?',
        value: Number.NaN,
        confidence: 0,
        isCorrect: false,
        answer: problem.answer,
        error: error.message
      })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-pop">
        <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <p className="text-sm font-black text-[#fb5607]">{currentLevel.label}</p>
            <h1 className="text-3xl font-black sm:text-5xl">빈칸의 답을 써요</h1>
            <p className="mt-1 text-sm font-extrabold text-slate-500">{currentLevel.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex min-w-[220px] items-center gap-3 rounded-[1.5rem] border-4 border-slate-900 bg-[#ffb703] px-4 py-3 shadow-md">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white">
                <Timer className="text-[#fb5607]" size={26} />
              </span>
              <div>
                <p className="text-xs font-black text-slate-700">라운드 시간</p>
                <p className="text-2xl font-black">{roundActive ? formatDuration(elapsedMs) : '대기 중'}</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {levels.map((item) => (
                <button
                  key={item.id}
                  className={`rounded-2xl border-[3px] border-slate-900 px-2 py-3 text-sm font-black transition active:scale-95 sm:text-base ${
                    level === item.id ? 'bg-[#ffb703] text-slate-950 shadow-md' : 'bg-slate-100'
                  }`}
                  type="button"
                  onClick={() => setLevel(item.id)}
                >
                  {item.short}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px] xl:items-start">
          <div className="flex min-h-[320px] flex-col justify-center rounded-[2rem] bg-[#8ecae6] p-5 text-center shadow-inner">
            <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-4 rounded-[2rem] bg-white px-4 py-8 text-5xl font-black shadow-soft sm:text-7xl">
              <span>{problem.left}</span>
              <span className="text-[#fb5607]">{problem.operator}</span>
              <span>{problem.right}</span>
              <span>=</span>
              <span className="text-[#ff006e]">?</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-white px-3 py-4">
                <p className="text-xs font-black text-slate-500">이번 라운드</p>
                <p className="text-2xl font-black">{round.total}/{ROUND_SIZE}</p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-4">
                <p className="text-xs font-black text-slate-500">맞은 개수</p>
                <p className="text-2xl font-black">{round.correct}</p>
              </div>
              <div className="rounded-2xl bg-white px-3 py-4">
                <p className="text-xs font-black text-slate-500">점수</p>
                <p className="text-2xl font-black">{round.score}</p>
              </div>
            </div>
          </div>

          <Canvas ref={canvasRef} disabled={checking} />
        </div>
      </section>

      <aside className="flex flex-col gap-4">
        <button
          className="flex min-h-16 items-center justify-center gap-3 rounded-[1.75rem] border-4 border-slate-900 bg-[#ffb703] px-5 py-4 text-2xl font-black text-slate-950 shadow-pop transition active:translate-y-1 active:shadow-md"
          type="button"
          onClick={startRound}
        >
          <Timer size={30} />
          {roundActive ? '다시 시작' : '타이머 시작'}
        </button>

        <button
          className="flex min-h-16 items-center justify-center gap-3 rounded-[1.75rem] border-4 border-slate-900 bg-[#06d6a0] px-5 py-4 text-2xl font-black text-slate-950 shadow-pop transition active:translate-y-1 active:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
          type="button"
          disabled={!recognizer || checking || !roundActive || (result && !result.error)}
          onClick={checkAnswer}
        >
          {checking ? <Loader2 className="animate-spin" size={28} /> : <CheckCircle2 size={30} />}
          채점하기
        </button>

        <button
          className="flex min-h-14 items-center justify-center gap-3 rounded-[1.5rem] bg-[#219ebc] px-5 py-3 text-xl font-black text-white shadow-md transition active:scale-95"
          type="button"
          onClick={nextProblem}
        >
          <Play size={26} fill="currentColor" />
          다음 문제
        </button>

        {result && (
          <div
            className={`rounded-[2rem] border-4 border-slate-900 p-5 shadow-pop ${
              result.isCorrect ? 'celebration-card relative overflow-hidden bg-[#06d6a0]' : 'bg-[#ff006e] text-white'
            }`}
          >
            {result.isCorrect && <CelebrationBurst />}
            <div className="flex items-center gap-3">
              {result.isCorrect ? <PartyPopper size={38} /> : <XCircle size={38} />}
              <p className="text-3xl font-black">{result.isCorrect ? '정답!' : '다시 도전!'}</p>
            </div>
            <p className="mt-3 text-lg font-black">
              AI가 본 숫자: {result.text} · 정답: {result.answer}
            </p>
            {result.error ? (
              <p className="text-sm font-extrabold opacity-90">{result.error}</p>
            ) : (
              <p className="text-sm font-extrabold opacity-80">Google Vision OCR</p>
            )}
          </div>
        )}
      </aside>
    </div>
  )
}

function CelebrationBurst() {
  const pieces = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: 8 + ((index * 29) % 84),
    delay: (index % 6) * 0.05,
    color: ['#ff006e', '#ffb703', '#219ebc', '#ffffff', '#fb5607'][index % 5]
  }))

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="success-ring absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-white/70" />
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece absolute top-[-18px] h-4 w-2 rounded-sm"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`
          }}
        />
      ))}
      <span className="sparkle-pop absolute right-8 top-6 text-4xl font-black text-white">★</span>
      <span className="sparkle-pop absolute bottom-7 left-8 text-3xl font-black text-[#ff006e]">★</span>
    </div>
  )
}

export default MathGame
