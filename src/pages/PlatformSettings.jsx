import { useState } from 'react'
import { SlidersHorizontal, Plus, Trash2, ChevronDown, Loader2 } from 'lucide-react'
import { apiRequest } from '../config/api'
import { useApiResource } from '../hooks/useApiResource'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'
import ErrorState from '../components/ui/ErrorState'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import CategoryDialog from '../features/categories/CategoryDialog'
import DeleteCategoryDialog from '../features/categories/DeleteCategoryDialog'

function EditIcon({ className = '' }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.0399 3.02L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96C22.3399 6.6 22.9799 5.02 20.9799 3.02C18.9799 1.02 17.3999 1.66 16.0399 3.02Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9102 4.15C15.5802 6.54 17.4502 8.41 19.8502 9.09"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Add / Edit Modal (Figma: 1055w, radius 44, gap 24) ─────────────
// ─── Main Page ───────────────────────────────────────────────────────
export default function PlatformSettings() {
  const {
    data: categories,
    loading,
    error,
    reload: reloadCategories,
  } = useApiResource(ENDPOINTS.categories, {
    errorMessage: 'Failed to load categories.',
    networkErrorMessage: 'Unable to connect to server.',
  })
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('categories')

  // Modal states
  const [addOpen, setAddOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  async function handleAddCategory(payload, addAnother) {
    setActionLoading(true)
    try {
      const res = await apiRequest(ENDPOINTS.categories, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (res.success) {
        reloadCategories()
        if (!addAnother) setAddOpen(false)
      } else {
        alert(res.message || 'Failed to add category.')
      }
    } catch {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleEditCategory(payload) {
    if (!editingCategory) return
    setActionLoading(true)
    try {
      const res = await apiRequest(ENDPOINTS.category(editingCategory.id), {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      if (res.success) {
        reloadCategories()
        setEditingCategory(null)
      } else {
        alert(res.message || 'Failed to update category.')
      }
    } catch {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeleteCategory() {
    if (!deletingCategory) return
    setActionLoading(true)
    try {
      const res = await apiRequest(ENDPOINTS.category(deletingCategory.id), {
        method: 'DELETE',
      })
      if (res.success) {
        reloadCategories()
        setDeletingCategory(null)
      } else {
        alert(res.message || 'Failed to delete category.')
      }
    } catch {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = (categories ?? []).filter(
    (cat) => cat.active && cat.name.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { key: 'categories', label: 'Service Categories' },
    { key: 'fees', label: 'Platform Fee Configuration' },
    { key: 'cancellation', label: 'Cancellation Fee Settings' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Platform Settings"
        subtitle="Manage all your platform setting"
        textGapClassName="gap-3"
        subtitleClassName="text-base font-semibold leading-tight text-muted md:text-2xl md:leading-[30px]"
        actions={
          <Button size="lgCompact" onClick={() => setAddOpen(true)}>
            <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            Add New Category
          </Button>
        }
      />

      {/* Tabs - Figma style: filled active tab */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-semibold transition-colors"
            style={{
              padding: '16px 16px',
              fontSize: '18px',
              backgroundColor: activeTab === tab.key ? '#0067DE' : '#F7F7F7',
              color: activeTab === tab.key ? '#FEFEFE' : '#6A6A6A',
              border: '1px solid #D9D9D9',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'categories' ? (
        <>
          {/* Filter is not wired to the API yet — later. */}
          <div className="flex items-center gap-3 md:gap-6">
            <SearchInput value={search} onChange={setSearch} className="flex-1" />
            <Button variant="outlineAccent" size="field">
              <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
              Filter
            </Button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <ErrorState message={error} />
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                      <span className="flex items-center gap-1">
                        Category Name <ChevronDown className="h-4 w-4" />
                      </span>
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                      <span className="flex items-center gap-1">
                        Issue Types <ChevronDown className="h-4 w-4" />
                      </span>
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                      Last Update
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold text-muted">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-4 text-sm text-heading">{cat.name}</td>
                      <td className="max-w-[350px] truncate px-4 py-4 text-sm text-muted">
                        {(cat.issueTypes || []).join(', ')}
                      </td>
                      <td className="px-4 py-4 text-sm text-muted">{formatDate(cat.updatedAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => setEditingCategory(cat)}
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                          >
                            <EditIcon />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingCategory(cat)}
                            className="flex items-center gap-1.5 text-sm text-danger hover:underline"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Footer / Pagination */}
              <div className="flex items-center justify-center gap-4 border-t border-gray-100 px-4 py-4">
                <span className="text-sm text-muted">Per page</span>
                <div
                  className="flex items-center gap-1 rounded-lg border px-3 py-1.5"
                  style={{ borderColor: '#D9D9D9' }}
                >
                  <span className="text-sm">5</span>
                  <ChevronDown className="h-4 w-4 text-muted" />
                </div>
                <button
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                  style={{ borderColor: '#D9D9D9', color: '#6A6A6A' }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl font-bold text-gray-300">Coming Soon</p>
        </div>
      )}

      <CategoryDialog
        open={addOpen || Boolean(editingCategory)}
        category={editingCategory}
        onClose={() => {
          setAddOpen(false)
          setEditingCategory(null)
        }}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        loading={actionLoading}
      />

      <DeleteCategoryDialog
        open={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleDeleteCategory}
        loading={actionLoading}
      />
    </div>
  )
}
