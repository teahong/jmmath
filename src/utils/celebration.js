let audioContext = null

export function playSuccessSound() {
  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext
  if (!AudioContextClass) return

  audioContext = audioContext ?? new AudioContextClass()
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }

  const start = audioContext.currentTime
  const notes = [
    { frequency: 523.25, at: 0, duration: 0.12 },
    { frequency: 659.25, at: 0.1, duration: 0.12 },
    { frequency: 783.99, at: 0.2, duration: 0.16 },
    { frequency: 1046.5, at: 0.36, duration: 0.22 }
  ]

  notes.forEach((note) => {
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const noteStart = start + note.at
    const noteEnd = noteStart + note.duration

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(note.frequency, noteStart)
    gain.gain.setValueAtTime(0.001, noteStart)
    gain.gain.exponentialRampToValueAtTime(0.22, noteStart + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, noteEnd)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(noteStart)
    oscillator.stop(noteEnd + 0.03)
  })
}
