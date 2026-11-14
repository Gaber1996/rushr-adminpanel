import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterMenu, { FilterLabel } from './FilterMenu'

function setup({ checked = false } = {}) {
  const onToggle = vi.fn()
  const onClear = vi.fn()
  render(
    <div>
      <FilterMenu
        renderTrigger={(props) => <button {...props}>Filter</button>}
        sections={[
          { heading: 'Status', options: [{ key: 'a', label: 'Approved', checked, onToggle }] },
        ]}
        onClear={onClear}
      />
      <p>Outside</p>
    </div>
  )
  return { onToggle, onClear, trigger: screen.getByRole('button', { name: 'Filter' }) }
}

describe('FilterMenu', () => {
  it('opens the options from the button and toggles one', async () => {
    const { onToggle, trigger } = setup()
    expect(screen.queryByText('Approved')).not.toBeInTheDocument()
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Status')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Approved' }))
    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('marks a chosen option as pressed and offers Clear all', async () => {
    const { onClear, trigger } = setup({ checked: true })
    await userEvent.click(trigger)
    expect(screen.getByRole('button', { name: 'Approved' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('offers Clear all only while an option is on', async () => {
    const { trigger } = setup()
    await userEvent.click(trigger)
    expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument()
  })

  it('closes on Esc, returning focus to the button', async () => {
    const { trigger } = setup()
    await userEvent.click(trigger)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByText('Approved')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes on a click outside', async () => {
    const { trigger } = setup()
    await userEvent.click(trigger)
    await userEvent.click(screen.getByText('Outside'))
    expect(screen.queryByText('Approved')).not.toBeInTheDocument()
  })
})

describe('FilterLabel', () => {
  it('reads "Filter" or "Filter (n)", with the widest form kept only for layout', () => {
    const { rerender } = render(
      <button>
        <FilterLabel count={0} />
      </button>
    )
    expect(screen.getByRole('button', { name: 'Filter' })).toBeInTheDocument()
    rerender(
      <button>
        <FilterLabel count={2} />
      </button>
    )
    expect(screen.getByRole('button', { name: 'Filter (2)' })).toBeInTheDocument()
  })
})
