import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProVerification from './ProVerification'
import { apiRequest } from '../config/api'

vi.mock('../config/api', () => ({ apiRequest: vi.fn() }))

const QUEUE = [
  {
    contractorId: 1,
    firstName: 'Sara',
    lastName: 'Ahmed',
    stepStatuses: { GOV_ID: { status: 'APPROVED' } },
  },
  { contractorId: 2, firstName: 'Omar', lastName: 'Khaled', stepStatuses: {} },
  {
    contractorId: 3,
    firstName: 'Mona',
    lastName: null,
    stepStatuses: { LICENSE: { status: 'REJECTED' } },
  },
]

async function renderQueue() {
  render(
    <MemoryRouter>
      <ProVerification />
    </MemoryRouter>
  )
  await screen.findByText('Sara Ahmed')
}

const names = () =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent)

describe('ProVerification', () => {
  beforeEach(() => {
    apiRequest.mockResolvedValue({ success: true, data: QUEUE })
  })

  it('shows a missing last name as nothing, not "null"', async () => {
    await renderQueue()
    expect(names()).toEqual(['Sara Ahmed', 'Omar Khaled', 'Mona'])
  })

  it('searches by name, ignoring surrounding spaces', async () => {
    await renderQueue()
    await userEvent.type(screen.getByRole('textbox'), '  omar ')
    expect(names()).toEqual(['Omar Khaled'])
  })

  it('does not match "null" for a missing name', async () => {
    await renderQueue()
    await userEvent.type(screen.getByRole('textbox'), 'null')
    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('filters by document status and shows the count on the button', async () => {
    await renderQueue()
    await userEvent.click(screen.getByRole('button', { name: 'Filter' }))
    await userEvent.click(screen.getByRole('button', { name: 'Rejected' }))
    expect(names()).toEqual(['Mona'])
    expect(screen.getByRole('button', { name: /Filter \(1\)/ })).toBeInTheDocument()

    // Missing statuses count as pending, as the badges show them.
    await userEvent.click(screen.getByRole('button', { name: 'Pending' }))
    expect(names()).toEqual(['Sara Ahmed', 'Omar Khaled', 'Mona'])

    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }))
    expect(names()).toHaveLength(3)
  })
})
