import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DataTable from './DataTable'

const columns = [
  { key: 'name', header: 'Name', render: (r) => r.name },
  {
    key: 'action',
    header: 'Action',
    render: (r) => <button>Open {r.name}</button>,
  },
]
const rows = [
  { id: 1, name: 'Sara' },
  { id: 2, name: 'Omar' },
]
const table = () => screen.getByRole('table')

describe('DataTable', () => {
  it('renders a row per item under the column headers', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    expect(
      within(table())
        .getAllByRole('columnheader')
        .map((th) => th.textContent)
    ).toEqual(['Name', 'Action'])
    expect(within(table()).getByText('Sara')).toBeInTheDocument()
    expect(within(table()).getAllByRole('row')).toHaveLength(3)
  })

  it('shows skeleton rows on the first load', () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        rowKey={(r) => r.id}
        loading
        skeletonRows={4}
        loadingLabel="Loading…"
      />
    )
    const body = table().querySelector('tbody')
    expect(body).toHaveAttribute('aria-busy', 'true')
    expect(within(body).getAllByRole('row')).toHaveLength(4)
    expect(within(table()).queryByText('No results found.')).not.toBeInTheDocument()
    expect(within(table()).getByText('Loading…')).toBeInTheDocument()
  })

  it('shows the empty message when there are no rows', () => {
    render(<DataTable columns={columns} rows={[]} rowKey={(r) => r.id} emptyMessage="Nothing" />)
    expect(within(table()).getByText('Nothing')).toBeInTheDocument()
  })

  it('shows the error with a working Try again', async () => {
    const onRetry = vi.fn()
    render(
      <DataTable columns={columns} rows={[]} rowKey={(r) => r.id} error="Boom" onRetry={onRetry} />
    )
    expect(within(table()).getByText('Boom')).toBeInTheDocument()
    await userEvent.click(within(table()).getByRole('button', { name: 'Try again' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('renders only the table (no phone cards), in a sideways-scrolling wrapper', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} />)
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(table().parentElement).toHaveClass('overflow-x-auto')
  })

  it('accepts a per-row cell class', () => {
    const cols = [{ ...columns[0], cellClassName: (r) => (r.id === 2 ? 'is-red' : 'is-plain') }]
    render(<DataTable variant="grid" columns={cols} rows={rows} rowKey={(r) => r.id} />)
    expect(within(table()).getByText('Omar')).toHaveClass('is-red')
    expect(within(table()).getByText('Sara')).toHaveClass('is-plain')
  })

  it('keeps the current rows (no skeleton) while reloading', () => {
    render(<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} loading />)
    expect(within(table()).getByText('Sara')).toBeInTheDocument()
    expect(table().querySelector('tbody')).toHaveAttribute('aria-busy', 'true')
  })

  it('shows an error without a retry button when none is given', () => {
    render(<DataTable columns={columns} rows={[]} rowKey={(r) => r.id} error="Boom" />)
    expect(within(table()).getByText('Boom')).toBeInTheDocument()
    expect(within(table()).queryByRole('button', { name: 'Try again' })).not.toBeInTheDocument()
  })

  it('paints high-impact rows red, including the edge above them', () => {
    render(
      <DataTable
        variant="grid"
        columns={columns.slice(0, 1)}
        rows={rows}
        rowKey={(r) => r.id}
        isHighlighted={(r) => r.id === 2}
      />
    )
    const [sara, omar] = ['Sara', 'Omar'].map((n) => within(table()).getByText(n))
    expect(omar).toHaveClass('border-danger')
    expect(sara).toHaveClass('border-danger') // the shared edge above the red row
    expect(within(table()).getByRole('columnheader')).toHaveClass('border-line')
  })
})
