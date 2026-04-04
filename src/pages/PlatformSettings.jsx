import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Plus, Pencil, Trash2, ChevronDown, Loader2, X, Upload } from 'lucide-react'
import { apiRequest } from '../config/api'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Add / Edit Modal ────────────────────────────────────────────────
function CategoryModal({ isOpen, onClose, onSubmit, loading, category }) {
  const isEdit = !!category
  const [name, setName] = useState('')
  const [iconName, setIconName] = useState('')
  const [issueTypes, setIssueTypes] = useState('')
  const [description, setDescription] = useState('')
  const [searchKeywords, setSearchKeywords] = useState('')
  const [displayOrder, setDisplayOrder] = useState(1)

  useEffect(() => {
    if (category) {
      setName(category.name || '')
      setIconName(category.iconName || '')
      setIssueTypes((category.issueTypes || []).join(', '))
      setDescription(category.description || '')
      setSearchKeywords(category.searchKeywords || '')
      setDisplayOrder(category.displayOrder || 1)
    } else {
      setName('')
      setIconName('')
      setIssueTypes('')
      setDescription('')
      setSearchKeywords('')
      setDisplayOrder(1)
    }
  }, [category, isOpen])

  if (!isOpen) return null

  function buildPayload() {
    return {
      name: name.trim(),
      description: description.trim() || name.trim(),
      iconName: iconName.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
      searchKeywords: searchKeywords.trim() || name.trim().toLowerCase(),
      active: true,
      displayOrder,
      issueTypes: issueTypes.split(',').map(s => s.trim()).filter(Boolean),
    }
  }

  function handleSubmit(e, addAnother = false) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(buildPayload(), addAnother)
    if (addAnother) {
      setName('')
      setIconName('')
      setIssueTypes('')
      setDescription('')
      setSearchKeywords('')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[520px] shadow-xl">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <h3 className="font-montserrat font-bold text-xl text-[#202020]">
            {isEdit ? 'Edit New Category' : 'Add New Category'}
          </h3>
          <button onClick={onClose} className="text-[#6A6A6A] hover:text-[#202020] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="px-6 pb-6 flex flex-col gap-5">
          {/* Category Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat font-medium text-sm text-[#0F0F0F]">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Plumbing"
              required
              className="w-full h-12 rounded-xl border px-3 outline-none font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-blue-400 transition-colors"
              style={{ borderColor: '#D9D9D9' }}
            />
          </div>

          {/* Category Icon */}
          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat font-medium text-sm text-[#0F0F0F]">Category Icon</label>
            <div
              className="w-full h-12 rounded-xl border px-3 flex items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors"
              style={{ borderColor: '#D9D9D9' }}
            >
              <Upload className="w-4 h-4 text-[#6A6A6A]" />
              <input
                type="text"
                value={iconName}
                onChange={(e) => setIconName(e.target.value)}
                placeholder="Upload Category Icon"
                className="flex-1 outline-none bg-transparent font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A]"
              />
            </div>
          </div>

          {/* Issue Types */}
          <div className="flex flex-col gap-1.5">
            <label className="font-montserrat font-medium text-sm text-[#0F0F0F]">Issue Types (comma separated)</label>
            <input
              type="text"
              value={issueTypes}
              onChange={(e) => setIssueTypes(e.target.value)}
              placeholder="e.g. Leaking pipe, Running toilet, Clogged drain, Broken faucet"
              className="w-full h-12 rounded-xl border px-3 outline-none font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-blue-400 transition-colors"
              style={{ borderColor: '#D9D9D9' }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-2">
            {!isEdit && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={!name.trim() || loading}
                className="flex-1 h-12 rounded-xl border font-montserrat font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                style={{ borderColor: '#0067DE', color: '#0067DE' }}
              >
                Save , Add Another
              </button>
            )}
            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="flex-1 h-12 rounded-xl font-montserrat font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: '#0067DE' }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Modal ────────────────────────────────────────────────────
function DeleteModal({ isOpen, onClose, onConfirm, loading, categoryName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-[420px] shadow-xl px-6 py-8 flex flex-col items-center gap-5">
        {/* Trash icon */}
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <Trash2 className="w-10 h-10 text-[#DC2626]" />
        </div>

        <h3 className="font-montserrat font-bold text-xl text-[#202020] text-center">
          Delete This Category ?
        </h3>
        <p className="font-montserrat text-sm text-[#6A6A6A] text-center">
          Are you sure you want to delete this category? This action cannot be undone.
        </p>

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border font-montserrat font-semibold text-sm text-[#6A6A6A] hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#D9D9D9' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 h-12 rounded-xl font-montserrat font-bold text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            style={{ backgroundColor: '#DC2626' }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Category
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function PlatformSettings() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('categories')

  // Modal states
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(null) // category object or null
  const [deleteModal, setDeleteModal] = useState(null) // category object or null
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    setError('')
    try {
      const res = await apiRequest('/api/admin/categories')
      if (res.success) {
        setCategories(res.data)
      } else {
        setError(res.message || 'Failed to load categories.')
      }
    } catch (err) {
      setError('Unable to connect to server.')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddCategory(payload, addAnother) {
    setActionLoading(true)
    try {
      const res = await apiRequest('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      if (res.success) {
        await fetchCategories()
        if (!addAnother) setAddModal(false)
      } else {
        alert(res.message || 'Failed to add category.')
      }
    } catch (err) {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleEditCategory(payload) {
    if (!editModal) return
    setActionLoading(true)
    try {
      const res = await apiRequest(`/api/admin/categories/${editModal.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      if (res.success) {
        await fetchCategories()
        setEditModal(null)
      } else {
        alert(res.message || 'Failed to update category.')
      }
    } catch (err) {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDeleteCategory() {
    if (!deleteModal) return
    setActionLoading(true)
    try {
      const res = await apiRequest(`/api/admin/categories/${deleteModal.id}`, {
        method: 'DELETE',
      })
      if (res.success) {
        await fetchCategories()
        setDeleteModal(null)
      } else {
        alert(res.message || 'Failed to delete category.')
      }
    } catch (err) {
      alert('Unable to connect to server.')
    } finally {
      setActionLoading(false)
    }
  }

  const filtered = categories.filter((cat) =>
    cat.active && cat.name.toLowerCase().includes(search.toLowerCase())
  )

  const tabs = [
    { key: 'categories', label: 'Service Categories' },
    { key: 'fees', label: 'Platform Fee Configuration' },
    { key: 'cancellation', label: 'Cancellation Fee Settings' },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="font-montserrat font-extrabold text-[#202020]" style={{ fontSize: '40px', lineHeight: '40px' }}>
            Platform Settings
          </h1>
          <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '20px', lineHeight: '24px' }}>
            Manage all your platform setting
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 rounded-xl font-montserrat font-extrabold text-white px-6"
          style={{ backgroundColor: '#0067DE', height: '56px', fontSize: '16px' }}
        >
          <Plus className="w-5 h-5" />
          Add New Category
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 font-montserrat font-semibold text-sm transition-colors relative ${
              activeTab === tab.key
                ? 'text-[#0067DE]'
                : 'text-[#6A6A6A] hover:text-[#202020]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-full bg-[#0067DE]" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'categories' ? (
        <>
          {/* Search & Filter */}
          <div className="flex items-center gap-6">
            <div
              className="flex-1 flex items-center gap-2 rounded-xl border px-3"
              style={{ borderColor: '#D9D9D9', height: '56px', backgroundColor: '#FEFEFE' }}
            >
              <Search className="w-6 h-6 text-[#6A6A6A]" />
              <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 outline-none bg-transparent font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A]"
              />
            </div>
            <button
              className="flex items-center gap-2 rounded-xl border px-4 font-montserrat font-semibold"
              style={{ borderColor: '#D9D9D9', height: '56px', fontSize: '16px', color: '#0067DE' }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filter
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[#0067DE]" />
            </div>
          ) : error ? (
            <div className="px-4 py-3 rounded-xl text-sm font-montserrat font-medium" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                      <span className="flex items-center gap-1">Category Name <ChevronDown className="w-4 h-4" /></span>
                    </th>
                    <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                      <span className="flex items-center gap-1">Issue Types <ChevronDown className="w-4 h-4" /></span>
                    </th>
                    <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                      Last Update
                    </th>
                    <th className="text-left px-4 py-4 font-montserrat font-semibold text-sm text-[#6A6A6A]">
                      <span className="flex items-center gap-1">Actions <ChevronDown className="w-4 h-4" /></span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-montserrat text-sm text-[#202020]">
                        {cat.name}
                      </td>
                      <td className="px-4 py-4 font-montserrat text-sm text-[#6A6A6A] max-w-[300px] truncate">
                        {(cat.issueTypes || []).join(', ')}
                      </td>
                      <td className="px-4 py-4 font-montserrat text-sm text-[#6A6A6A]">
                        {formatDate(cat.updatedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditModal(cat)}
                            className="flex items-center gap-1 font-montserrat text-sm text-[#0067DE] hover:underline"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal(cat)}
                            className="flex items-center gap-1 font-montserrat text-sm text-[#DC2626] hover:underline"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center font-montserrat text-sm text-[#6A6A6A]">
                        No categories found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Footer / Pagination */}
              <div className="flex items-center justify-center gap-4 px-4 py-4 border-t border-gray-100">
                <span className="font-montserrat text-sm text-[#6A6A6A]">Per page</span>
                <div className="flex items-center gap-1 border rounded-lg px-3 py-1.5" style={{ borderColor: '#D9D9D9' }}>
                  <span className="font-montserrat text-sm">5</span>
                  <ChevronDown className="w-4 h-4 text-[#6A6A6A]" />
                </div>
                <button
                  className="px-4 py-2 rounded-lg border font-montserrat text-sm font-medium"
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
          <p className="font-montserrat text-xl font-bold text-gray-300">Coming Soon</p>
        </div>
      )}

      {/* Add Category Modal */}
      <CategoryModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleAddCategory}
        loading={actionLoading}
        category={null}
      />

      {/* Edit Category Modal */}
      <CategoryModal
        isOpen={!!editModal}
        onClose={() => setEditModal(null)}
        onSubmit={handleEditCategory}
        loading={actionLoading}
        category={editModal}
      />

      {/* Delete Category Modal */}
      <DeleteModal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteCategory}
        loading={actionLoading}
        categoryName={deleteModal?.name}
      />
    </div>
  )
}
