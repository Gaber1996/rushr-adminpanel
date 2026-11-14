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
import EditIcon from '../features/categories/EditIcon'
import FilterMenu, { FilterLabel } from '../components/ui/FilterMenu'
import { toggleItem } from '../utils/list'
import {
  NO_ISSUE_TYPES,
  UPDATED_WITHIN_DAYS,
  filterCategories,
  issueTypeOptions,
} from '../features/categories/categoryFilters'
import { CATEGORIES_TEXT, COMMON_TEXT } from '../texts'

const TEXT = CATEGORIES_TEXT

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
  const [issueTypeFilter, setIssueTypeFilter] = useState([])
  const [updatedWithinDays, setUpdatedWithinDays] = useState(null)
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

  const filtered = filterCategories(categories ?? [], {
    search,
    issueTypes: issueTypeFilter,
    updatedWithinDays,
  })
  const activeFilterCount = issueTypeFilter.length + (updatedWithinDays === null ? 0 : 1)

  const filterSections = [
    {
      heading: TEXT.filter.issueTypesHeading,
      options: [
        ...issueTypeOptions((categories ?? []).filter((cat) => cat.active)),
        NO_ISSUE_TYPES,
      ].map((type) => ({
        key: type,
        label: type === NO_ISSUE_TYPES ? TEXT.filter.noIssueTypes : type,
        checked: issueTypeFilter.includes(type),
        onToggle: () => setIssueTypeFilter((prev) => toggleItem(prev, type)),
      })),
    },
    {
      heading: TEXT.filter.updatedHeading,
      // One choice at a time: picking the active one again turns it off.
      options: UPDATED_WITHIN_DAYS.map((days) => ({
        key: `updated-${days}`,
        label: TEXT.filter.updatedWithin(days),
        checked: updatedWithinDays === days,
        onToggle: () => setUpdatedWithinDays((prev) => (prev === days ? null : days)),
      })),
    },
  ]

  const tabs = [
    { key: 'categories', label: TEXT.tabs.categories },
    { key: 'fees', label: TEXT.tabs.fees },
    { key: 'cancellation', label: TEXT.tabs.cancellation },
  ]

  const columns = [
    {
      key: 'name',
      minWidth: '200px',
      header: TEXT.nameColumn,
      sortIndicator: true,
      cellClassName: 'text-sm text-heading',
      render: (cat) => cat.name,
    },
    {
      key: 'issueTypes',
      width: '382px',
      header: TEXT.issueTypesColumn,
      sortIndicator: true,
      cellClassName: 'text-sm text-muted',
      // One line, cut with "…" when the list is longer than the column.
      render: (cat) => <div className="truncate">{(cat.issueTypes || []).join(', ')}</div>,
    },
    {
      key: 'updated',
      width: '160px',
      header: TEXT.lastUpdateColumn,
      cellClassName: 'text-sm text-muted',
      render: (cat) => formatDate(cat.updatedAt),
    },
    {
      key: 'actions',
      width: '200px',
      header: TEXT.actionsColumn,
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
      <div className="flex overflow-x-auto md:overflow-visible">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-semibold transition-colors max-md:shrink-0 max-md:whitespace-nowrap"
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
          <div className="flex items-center gap-3 md:gap-6">
            <SearchInput value={search} onChange={setSearch} className="flex-1" />
            <FilterMenu
              renderTrigger={(props) => (
                <Button variant="outlineAccent" size="field" {...props}>
                  <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
                  <FilterLabel count={activeFilterCount} />
                </Button>
              )}
              sections={filterSections}
              onClear={() => {
                setIssueTypeFilter([])
                setUpdatedWithinDays(null)
              }}
            />
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
