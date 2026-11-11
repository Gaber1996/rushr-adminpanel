import { useState } from 'react'
import { SlidersHorizontal, Plus, Trash2 } from 'lucide-react'
import { apiRequest } from '../config/api'
import { useApiResource } from '../hooks/useApiResource'
import { ENDPOINTS } from '../config/endpoints'
import { formatDate } from '../utils/format'
import Button from '../components/ui/Button'
import DataTable from '../components/ui/DataTable'
import ErrorState from '../components/ui/ErrorState'
import { PaginationPlaceholder } from '../components/ui/Pagination'
import PageHeader from '../components/ui/PageHeader'
import SearchInput from '../components/ui/SearchInput'
import CategoryDialog from '../features/categories/CategoryDialog'
import DeleteCategoryDialog from '../features/categories/DeleteCategoryDialog'
import { CATEGORIES_TEXT, COMMON_TEXT } from '../texts'

const TEXT = CATEGORIES_TEXT

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
    errorMessage: TEXT.loadError,
    networkErrorMessage: COMMON_TEXT.networkError,
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
        alert(res.message || TEXT.addError)
      }
    } catch {
      alert(COMMON_TEXT.networkError)
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
        alert(res.message || TEXT.updateError)
      }
    } catch {
      alert(COMMON_TEXT.networkError)
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
        alert(res.message || TEXT.deleteError)
      }
    } catch {
      alert(COMMON_TEXT.networkError)
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = (categories ?? []).filter(
    (cat) => cat.active && cat.name.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { key: 'categories', label: TEXT.tabs.categories },
    { key: 'fees', label: TEXT.tabs.fees },
    { key: 'cancellation', label: TEXT.tabs.cancellation },
  ]

  const columns = [
    {
      key: 'name',
      header: TEXT.nameColumn,
      sortIndicator: true,
      cellClassName: 'text-sm text-heading',
      render: (cat) => cat.name,
    },
    {
      key: 'issueTypes',
      header: TEXT.issueTypesColumn,
      sortIndicator: true,
      cellClassName: 'max-w-[350px] truncate text-sm text-muted',
      render: (cat) => (cat.issueTypes || []).join(', '),
    },
    {
      key: 'updated',
      header: TEXT.lastUpdateColumn,
      cellClassName: 'text-sm text-muted',
      render: (cat) => formatDate(cat.updatedAt),
    },
    {
      key: 'actions',
      header: TEXT.actionsColumn,
      cardLabel: null,
      render: (cat) => (
        <div className="flex items-center gap-5">
          <button
            onClick={() => setEditingCategory(cat)}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <EditIcon />
            {TEXT.edit}
          </button>
          <button
            onClick={() => setDeletingCategory(cat)}
            className="flex items-center gap-1.5 text-sm text-danger hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            {TEXT.delete}
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={TEXT.title}
        subtitle={TEXT.subtitle}
        textGapClassName="gap-3"
        subtitleClassName="text-base font-semibold leading-tight text-muted md:text-2xl md:leading-[30px]"
        actions={
          <Button size="lgCompact" onClick={() => setAddOpen(true)}>
            <Plus className="h-5 w-5" strokeWidth={3} aria-hidden="true" />
            {TEXT.addCategory}
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
              {COMMON_TEXT.filter}
            </Button>
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : (
            <DataTable
              columns={columns}
              rows={filtered}
              rowKey={(cat) => cat.id}
              loading={loading}
              loadingLabel={TEXT.loading}
              emptyMessage={TEXT.empty}
              footer={<PaginationPlaceholder />}
            />
          )}
        </>
      ) : (
        <div className="flex items-center justify-center py-20">
          <p className="text-xl font-bold text-gray-300">{COMMON_TEXT.comingSoon}</p>
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
