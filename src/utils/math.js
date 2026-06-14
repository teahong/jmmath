export const levels = [
  {
    id: 'lv1',
    short: 'LV1',
    label: 'LV1 · 한 자리 + 한 자리, 답 10 이하',
    points: 10,
    description: '한 자리수 + 한 자리수'
  },
  {
    id: 'lv2',
    short: 'LV2',
    label: 'LV2 · 덧셈, 답 15 이하',
    points: 15,
    description: '한 자리수 + 한 자리수 또는 두 자리수 + 한 자리수'
  },
  {
    id: 'lv3',
    short: 'LV3',
    label: 'LV3 · 한 자리 - 한 자리, 답 10 이하',
    points: 15,
    description: '한 자리수 - 한 자리수'
  },
  {
    id: 'lv4',
    short: 'LV4',
    label: 'LV4 · 두 자리 - 한 자리, 답 10 이하',
    points: 20,
    description: '두 자리수 - 한 자리수'
  },
  {
    id: 'lv5',
    short: 'LV5',
    label: 'LV5 · LV1~LV4 혼합',
    points: 25,
    description: '덧셈과 뺄셈 섞어서 풀기'
  }
]

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export function createProblem(levelId) {
  if (levelId === 'lv5') {
    return createProblem(['lv1', 'lv2', 'lv3', 'lv4'][randomInt(0, 3)])
  }

  if (levelId === 'lv2') return createLevel2Problem()
  if (levelId === 'lv3') return createLevel3Problem()
  if (levelId === 'lv4') return createLevel4Problem()

  return createLevel1Problem()
}

function createLevel1Problem() {
  const answer = randomInt(2, 10)
  const left = randomInt(1, Math.min(9, answer - 1))
  const right = answer - left
  return { left, right, operator: '+', answer }
}

function createLevel2Problem() {
  const useTwoDigitLeft = Math.random() > 0.5
  const answer = randomInt(useTwoDigitLeft ? 11 : 2, 15)
  const left = useTwoDigitLeft ? randomInt(10, answer - 1) : randomInt(1, Math.min(9, answer - 1))
  const right = answer - left
  return { left, right, operator: '+', answer }
}

function createLevel3Problem() {
  const left = randomInt(1, 9)
  const right = randomInt(0, left)
  return { left, right, operator: '-', answer: left - right }
}

function createLevel4Problem() {
  const answer = randomInt(1, 10)
  const right = randomInt(Math.max(1, 10 - answer), 9)
  const left = answer + right
  return { left, right, operator: '-', answer }
}
