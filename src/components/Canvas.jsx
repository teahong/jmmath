import { Eraser, RotateCcw } from 'lucide-react'
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

const CANVAS_SIZE = 320

const Canvas = forwardRef(function Canvas({ disabled = false }, ref) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastPointRef = useRef(null)
  const [penSize, setPenSize] = useState(22)

  const clear = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  useImperativeHandle(ref, () => ({
    clear,
    getCanvas: () => canvasRef.current
  }))

  useEffect(() => {
    clear()
  }, [])

  const getPoint = (event) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * canvas.width,
      y: ((event.clientY - rect.top) / rect.height) * canvas.height,
      pressure: event.pressure || 0.7
    }
  }

  const drawLine = (from, to) => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#13213c'
    ctx.lineWidth = Math.max(10, penSize * to.pressure)
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  const startDrawing = (event) => {
    if (disabled) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drawingRef.current = true
    lastPointRef.current = getPoint(event)
  }

  const draw = (event) => {
    if (!drawingRef.current || disabled) return
    const point = getPoint(event)
    drawLine(lastPointRef.current, point)
    lastPointRef.current = point
  }

  const stopDrawing = () => {
    drawingRef.current = false
    lastPointRef.current = null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[2rem] border-4 border-slate-900 bg-white p-3 shadow-pop">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="aspect-square w-full cursor-crosshair rounded-[1.5rem] bg-white touch-none"
          aria-label="숫자 손글씨 입력 칸"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerCancel={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[1.5rem] bg-white p-3 shadow-md">
        <label className="flex items-center gap-3 text-sm font-black text-slate-600">
          <Eraser size={20} />
          굵기
          <input
            className="w-full accent-[#fb5607]"
            type="range"
            min="12"
            max="34"
            value={penSize}
            onChange={(event) => setPenSize(Number(event.target.value))}
          />
        </label>
        <button
          className="grid h-12 w-12 place-items-center rounded-2xl bg-[#ff006e] text-white shadow-md transition active:scale-95"
          type="button"
          onClick={clear}
          aria-label="지우기"
        >
          <RotateCcw size={24} strokeWidth={3} />
        </button>
      </div>
    </div>
  )
})

export default Canvas
