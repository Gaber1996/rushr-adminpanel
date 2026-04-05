import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Plus, Trash2, ChevronDown, Loader2, Upload } from 'lucide-react'
import { apiRequest } from '../config/api'

function EditIcon({ className = '' }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16.0399 3.02L8.15988 10.9C7.85988 11.2 7.55988 11.79 7.49988 12.22L7.06988 15.23C6.90988 16.32 7.67988 17.08 8.76988 16.93L11.7799 16.5C12.1999 16.44 12.7899 16.14 13.0999 15.84L20.9799 7.96C22.3399 6.6 22.9799 5.02 20.9799 3.02C18.9799 1.02 17.3999 1.66 16.0399 3.02Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14.9102 4.15C15.5802 6.54 17.4502 8.41 19.8502 9.09" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// ─── Add / Edit Modal (Figma: 1055w, radius 44, gap 24) ─────────────
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[#FEFEFE] shadow-xl" style={{ width: '1055px', borderRadius: '44px', padding: '40px' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-6" style={{ width: '975px', margin: '0 auto' }}>
          {/* Fields */}
          <div className="flex flex-col gap-8">
            <h3 className="font-montserrat font-bold text-[#0F0F0F]" style={{ fontSize: '32px', lineHeight: '32px' }}>
              {isEdit ? 'Edit New Category' : 'Add New Category'}
            </h3>

            <div className="flex flex-col gap-5">
              {/* Category Name */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-semibold text-[#0F0F0F]" style={{ fontSize: '18px' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Plumbing"
                  required
                  className="w-full rounded-xl border px-3 outline-none font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-blue-400 transition-colors"
                  style={{ borderColor: '#D9D9D9', height: '56px' }}
                />
              </div>

              {/* Category Icon */}
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-semibold text-[#0F0F0F]" style={{ fontSize: '18px' }}>
                  Category Icon
                </label>
                <div
                  className="w-full rounded-xl border px-3 flex items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors"
                  style={{ borderColor: '#D9D9D9', height: '48px' }}
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
              <div className="flex flex-col gap-2">
                <label className="font-montserrat font-semibold text-[#0F0F0F]" style={{ fontSize: '18px' }}>
                  Issue Types (comma separated)
                </label>
                <input
                  type="text"
                  value={issueTypes}
                  onChange={(e) => setIssueTypes(e.target.value)}
                  placeholder="e.g. Leaking pipe, Running toilet, Clogged drain, Broken faucet"
                  className="w-full rounded-xl border px-3 outline-none font-montserrat text-sm text-[#0F0F0F] placeholder:text-[#6A6A6A] focus:border-blue-400 transition-colors"
                  style={{ borderColor: '#D9D9D9', height: '56px' }}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-6">
            {!isEdit && (
              <button
                type="button"
                onClick={(e) => handleSubmit(e, true)}
                disabled={!name.trim() || loading}
                className="flex-1 rounded-xl border font-montserrat font-extrabold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-blue-50 transition-colors"
                style={{ borderColor: '#0067DE', color: '#0052B0', height: '56px', fontSize: '18px' }}
              >
                Save , Add Another
              </button>
            )}
            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              disabled={!name.trim() || loading}
              className="flex-1 rounded-xl font-montserrat font-extrabold text-[#FEFEFE] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: '#0067DE', height: '56px', fontSize: '18px' }}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Save Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Modal (Figma: 1055w, radius 44, trash SVG) ──────────────
function DeleteModal({ isOpen, onClose, onConfirm, loading, categoryName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-[#FEFEFE] shadow-xl flex flex-col items-center" style={{ width: '1055px', borderRadius: '44px', padding: '40px' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center gap-1" style={{ width: '975px' }}>
          {/* Trash Icon SVG matching Figma */}
          <svg width="160" height="160" viewBox="0 0 322 322" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="322" height="322" rx="161" fill="white"/>
            <g transform="translate(75, 60)">
              <rect x="28" y="0" width="116" height="6" rx="3" fill="#9CA3AF"/>
              <rect x="20" y="10" width="132" height="18" rx="4" fill="#F9AFAF"/>
              <path d="M12 35 L16 185 Q17 195 27 195 L145 195 Q155 195 156 185 L160 35 Z" fill="#C20A0A"/>
              <rect x="0" y="28" width="172" height="14" rx="7" fill="#C20A0A"/>
              <rect x="50" y="55" width="14" height="120" rx="7" fill="#FFF7F7"/>
              <rect x="80" y="55" width="14" height="118" rx="7" fill="#FFF7F7"/>
              <rect x="110" y="55" width="14" height="117" rx="7" fill="#FFF7F7"/>
            </g>
          </svg>

          {/* Text */}
          <div className="flex flex-col items-center gap-6" style={{ width: '871px' }}>
            <h3 className="font-montserrat font-extrabold text-[#0F0F0F] text-center" style={{ fontSize: '40px', lineHeight: '40px' }}>
              Delete This Category ?
            </h3>
            <p className="font-montserrat font-semibold text-[#6A6A6A] text-center" style={{ fontSize: '24px', lineHeight: '24px' }}>
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-6 w-full mt-8" style={{ width: '975px' }}>
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border font-montserrat font-extrabold flex items-center justify-center hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#D9D9D9', color: '#6A6A6A', height: '56px', fontSize: '18px' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl font-montserrat font-extrabold text-[#FEFEFE] flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
              style={{ backgroundColor: '#C20A0A', height: '56px', fontSize: '18px' }}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              Delete Category
            </button>
          </div>
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
  const [editModal, setEditModal] = useState(null)
  const [deleteModal, setDeleteModal] = useState(null)
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
        <div className="flex flex-col gap-3">
          <h1 className="font-montserrat font-extrabold text-[#202020]" style={{ fontSize: '40px', lineHeight: '40px' }}>
            Platform Settings
          </h1>
          <p className="font-montserrat font-semibold text-[#6A6A6A]" style={{ fontSize: '24px', lineHeight: '30px' }}>
            Manage all your platform setting
          </p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 rounded-xl font-montserrat font-extrabold text-white px-6"
          style={{ backgroundColor: '#0067DE', height: '56px', fontSize: '16px' }}
        >
          <Plus className="w-5 h-5" strokeWidth={3} />
          Add New Category
        </button>
      </div>

      {/* Tabs - Figma style: filled active tab */}
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="font-montserrat font-semibold transition-colors"
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
              style={{ borderColor: '#0067DE', height: '56px', fontSize: '16px', color: '#0067DE' }}
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((cat) => (
                    <tr key={cat.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-4 font-montserrat text-sm text-[#202020]">
                        {cat.name}
                      </td>
                      <td className="px-4 py-4 font-montserrat text-sm text-[#6A6A6A] max-w-[350px] truncate">
                        {(cat.issueTypes || []).join(', ')}
                      </td>
                      <td className="px-4 py-4 font-montserrat text-sm text-[#6A6A6A]">
                        {formatDate(cat.updatedAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-5">
                          <button
                            onClick={() => setEditModal(cat)}
                            className="flex items-center gap-1.5 font-montserrat text-sm text-[#0067DE] hover:underline"
                          >
                            <EditIcon />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteModal(cat)}
                            className="flex items-center gap-1.5 font-montserrat text-sm text-[#C20A0A] hover:underline"
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
      />
    </div>
  )
}
