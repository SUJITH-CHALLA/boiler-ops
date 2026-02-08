
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getShiftLogs, getBreakdownLogs } from '@/lib/data'

// Mock the database
vi.mock('@/db', () => ({
    db: {
        select: vi.fn(() => ({
            from: vi.fn(() => ({
                leftJoin: vi.fn(() => ({
                    orderBy: vi.fn(() => ({
                        limit: vi.fn(() => Promise.resolve([{ id: 1, boilerId: 'B1', reportedBy: 'Admin' }]))
                    }))
                })),
                orderBy: vi.fn(() => ({
                    limit: vi.fn(() => Promise.resolve([{ id: 1, boilerId: 'B1' }]))
                }))
            }))
        }))
    }
}))

describe('Data Fetching Layer', () => {
    it('successfully retrieves shift logs', async () => {
        const logs = await getShiftLogs()
        expect(logs).toHaveLength(1)
        expect(logs[0].boilerId).toBe('B1')
    })

    it('successfully retrieves breakdown logs with joined user data', async () => {
        const breakdowns = await getBreakdownLogs()
        expect(breakdowns).toHaveLength(1)
        expect(breakdowns[0].reportedBy).toBe('Admin')
    })
})
