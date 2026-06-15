let successAudio = null
let prepared = false

function getSuccessAudio() {
  successAudio = successAudio ?? new Audio('/sounds/success.wav')
  successAudio.preload = 'auto'
  successAudio.volume = 0.9
  return successAudio
}

export function prepareSuccessSound() {
  if (prepared) return

  const audio = getSuccessAudio()
  audio.muted = true
  audio.currentTime = 0

  audio
    .play()
    .then(() => {
      audio.pause()
      audio.currentTime = 0
      audio.muted = false
      prepared = true
    })
    .catch(() => {
      audio.muted = false
    })
}

export function playSuccessSound() {
  const audio = getSuccessAudio()
  audio.muted = false
  audio.currentTime = 0
  audio.play().catch(() => {})
}
