
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ShiftLogActions } from '@/components/records/shift-log-actions'

// Mock dependencies
vi.mock('next/navigation', () => ({
    useRouter: () => ({ refresh: vi.fn() })
}))

vi.mock('@/lib/log-actions', () => ({
    updateShiftLog: vi.fn()
}))

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: { error: vi.fn(), success: vi.fn() }
}))

const mockLog = {
    id: 123,
    date: "2024-01-01",
    shift: "A",
    boilerId: "B1",
    operatorName: "John Doe",
    startTime: "06:00",
    endTime: "14:00",
    steamPressure: 10,
    steamTemp: 100,
    steamFlowStart: 1000,
    steamFlowEnd: 2000,
    fuelType: "Coal",
    fuelConsumed: 500,
    remarks: "Test Log",
    createdAt: new Date().toISOString(),
    blowdownPerformed: false
}

describe('ShiftLogActions', () => {
    it('renders View button for all roles', () => {
        render(<ShiftLogActions log={mockLog} role="operator" />)
        // Check for the eye icon button using its title attribute
        const viewBtn = screen.getByTitle('View Details')
        expect(viewBtn).toBeInTheDocument()
    })

    it('hides Edit button for operators', () => {
        render(<ShiftLogActions log={mockLog} role="operator" />)
        // Query by title, should not exist
        const editBtn = screen.queryByTitle('Edit Log')
        expect(editBtn).not.toBeInTheDocument()
    })

    it('shows Edit button for managers', () => {
        render(<ShiftLogActions log={mockLog} role="manager" />)
        const editBtn = screen.getByTitle('Edit Log')
        expect(editBtn).toBeInTheDocument()
    })

    it('shows Edit button for engineers', () => {
        render(<ShiftLogActions log={mockLog} role="engineer" />)
        const editBtn = screen.getByTitle('Edit Log')
        expect(editBtn).toBeInTheDocument()
    })
})
