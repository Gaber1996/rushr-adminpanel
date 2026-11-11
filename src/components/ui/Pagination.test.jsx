import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination'

function setup(props = {}) {
  const handlers = { onPageChange: vi.fn(), onPerPageChange: vi.fn() }
  render(
    <Pagination
      page={1}
      totalPages={3}
      perPage={10}
      perPageOptions={[10, 20, 50]}
      {...handlers}
      {...props}
    />
  )
  return handlers
}

describe('Pagination', () => {
  it('shows where you are and disables Prev on the first page', () => {
    setup()
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Prev' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled()
  })

  it('disables Next on the last page', () => {
    setup({ page: 3 })
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('asks for the neighbouring page', async () => {
    const { onPageChange } = setup({ page: 2 })
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    await userEvent.click(screen.getByRole('button', { name: 'Prev' }))
    expect(onPageChange.mock.calls).toEqual([[3], [1]])
  })

  it('picks a page size from the menu and closes it', async () => {
    const { onPerPageChange } = setup()
    const toggle = screen.getByRole('button', { name: '10' })
    await userEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(screen.getByRole('button', { name: '20' }))
    expect(onPerPageChange).toHaveBeenCalledWith(20)
    expect(screen.queryByRole('button', { name: '50' })).not.toBeInTheDocument()
  })
})
