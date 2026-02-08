
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NavLinks } from '@/components/layout/nav-links'

// Mock next/navigation
vi.mock('next/navigation', () => ({
    usePathname: () => '/dashboard'
}))

describe('Navigation Role-based Links', () => {
    it('shows Operator specific links', () => {
        render(<NavLinks role="operator" canViewRecords={false} isAdmin={false} />)
        expect(screen.getByText('Hourly Logs')).toBeInTheDocument()
        expect(screen.queryByText('Shift Summary')).not.toBeInTheDocument()
        expect(screen.queryByText('Admin')).not.toBeInTheDocument()
    })

    it('shows Manager specific links', () => {
        render(<NavLinks role="manager" canViewRecords={true} isAdmin={false} />)
        expect(screen.getByText('Shift Summary')).toBeInTheDocument()
        expect(screen.queryByText('Hourly Logs')).not.toBeInTheDocument()
        expect(screen.queryByText('Breakdown')).not.toBeInTheDocument()
    })

    it('shows Engineer/Admin specific links', () => {
        render(<NavLinks role="engineer" canViewRecords={true} isAdmin={true} />)
        expect(screen.getByText('Shift Summary')).toBeInTheDocument()
        expect(screen.getByText('Admin')).toBeInTheDocument()
        expect(screen.getByText('Attendance')).toBeInTheDocument()
    })
})
