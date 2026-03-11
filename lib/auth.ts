import { createHmac } from 'crypto'

export const ADMIN_COOKIE = 'pawpal_admin'
const PAYLOAD = 'authorized'

function getSecret() {
  return process.env.ADMIN_PASSWORD || 'changeme'
}

export function signToken(): string {
  const sig = createHmac('sha256', getSecret()).update(PAYLOAD).digest('hex')
  return Buffer.from(`${PAYLOAD}:${sig}`).toString('base64url')
}

export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, 'base64url').toString()
    const [payload, sig] = decoded.split(':')
    const expected = createHmac('sha256', getSecret()).update(payload).digest('hex')
    return payload === PAYLOAD && sig === expected
  } catch {
    return false
  }
}
