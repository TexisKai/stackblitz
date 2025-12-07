/**
 * DU Email Validation
 * Only emails from Delhi University approved domains are allowed
 */

const APPROVED_DU_DOMAINS = [
  '@du.ac.in',
  '@cluster.edu',
  '@student.du.ac.in'
]

export function isValidDUEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }

  const lowercaseEmail = email.toLowerCase().trim()
  
  return APPROVED_DU_DOMAINS.some(domain => 
    lowercaseEmail.endsWith(domain)
  )
}

export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' }
  }

  return { valid: true }
}

export function extractCollegeFromEmail(email: string): string | null {
  const match = email.match(/@([^.]+)\./)  
  return match ? match[1] : null
}
