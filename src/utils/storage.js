const STORAGE_KEY = 'jmmath.records'

export function getRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const records = raw ? JSON.parse(raw) : []
    return Array.isArray(records) ? records : []
  } catch {
    return []
  }
}

export function saveRecord(record) {
  const records = getRecords()
  const nextRecord = {
    id: crypto.randomUUID(),
    date: new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    }).format(new Date()),
    createdAt: new Date().toISOString(),
    ...record
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([nextRecord, ...records].slice(0, 50)))
}

export function clearRecords() {
  localStorage.removeItem(STORAGE_KEY)
}
