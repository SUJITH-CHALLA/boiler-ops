import { describe, it, expect, vi } from 'vitest'

// Mock next-auth and auth first
vi.mock('next-auth', () => ({
    AuthError: class extends Error {
        type: string;
        constructor(type: string) {
            super(type);
            this.type = type;
        }
    }
}))

vi.mock('@/auth', () => ({
    signIn: vi.fn()
}))

import { authenticate } from '@/lib/actions'
import { signIn } from '@/auth'

describe('Authentication Action', () => {
    it('calls signIn when credentials are submitted', async () => {
        const formData = new FormData()
        formData.append('email', 'test@test.com')
        formData.append('password', 'password123')

        await authenticate(undefined, formData)

        expect(signIn).toHaveBeenCalledWith('credentials', formData)
    })
})
