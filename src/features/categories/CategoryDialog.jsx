import { useState } from 'react'
import { Upload } from 'lucide-react'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import TextField from '../../components/ui/TextField'

const FIELD_LABEL = 'text-[18px] font-semibold text-ink'
const TITLE_ID = 'category-dialog-title'
/** Panel size shared with DeleteCategoryDialog. */
export const CATEGORY_DIALOG_CLASS = 'w-[1055px] rounded-3xl bg-surface'

/** The request body the categories endpoint expects, with the backend's defaults filled in. */
export function buildCategoryPayload(form) {
  const name = form.name.trim()
  return {
    name,
    description: form.description.trim() || name,
    iconName: form.iconName.trim() || name.toLowerCase().replace(/\s+/g, '-'),
    searchKeywords: form.searchKeywords.trim() || name.toLowerCase(),
    active: true,
    displayOrder: form.displayOrder,
    issueTypes: form.issueTypes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  }
}

function formFrom(category) {
  return {
    name: category?.name || '',
    iconName: category?.iconName || '',
    issueTypes: (category?.issueTypes || []).join(', '),
    description: category?.description || '',
    searchKeywords: category?.searchKeywords || '',
    displayOrder: category?.displayOrder || 1,
  }
}

/**
 * Add or edit a service category. Pass `category` to edit it; omit it to add.
 * `onSubmit(payload, addAnother)` — "Save , Add Another" keeps the dialog open with a blank form.
 */
export default function CategoryDialog({ open, category, onClose, onSubmit, loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={TITLE_ID}
      backdropClassName="backdrop:bg-black/50"
      className={CATEGORY_DIALOG_CLASS}
    >
      {/* Mounted per open, so the form always starts from `category`. */}
      <CategoryForm category={category} onSubmit={onSubmit} loading={loading} />
    </Modal>
  )
}

function CategoryForm({ category, onSubmit, loading }) {
  const isEdit = Boolean(category)
  const [form, setForm] = useState(() => formFrom(category))
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  function submit(addAnother) {
    if (!form.name.trim()) return
    onSubmit(buildCategoryPayload(form), addAnother)
    if (addAnother) setForm((f) => ({ ...formFrom(null), displayOrder: f.displayOrder }))
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10">
      <div className="flex flex-col gap-8">
        <h3 id={TITLE_ID} className="text-2xl font-bold leading-none text-ink md:text-[32px]">
          {isEdit ? 'Edit New Category' : 'Add New Category'}
        </h3>

        <div className="flex flex-col gap-5">
          <TextField
            label="Category Name"
            labelClassName={FIELD_LABEL}
            value={form.name}
            onChange={set('name')}
            placeholder="e.g. Plumbing"
            required
          />
          <TextField
            label="Category Icon"
            labelClassName={FIELD_LABEL}
            inputClassName="h-12"
            leading={<Upload className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />}
            value={form.iconName}
            onChange={set('iconName')}
            placeholder="Upload Category Icon"
          />
          <TextField
            label="Issue Types (comma separated)"
            labelClassName={FIELD_LABEL}
            value={form.issueTypes}
            onChange={set('issueTypes')}
            placeholder="e.g. Leaking pipe, Running toilet, Clogged drain, Broken faucet"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
        {!isEdit && (
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            disabled={!form.name.trim() || loading}
            onClick={() => submit(true)}
          >
            Save , Add Another
          </Button>
        )}
        <Button
          size="lg"
          className="flex-1"
          loading={loading}
          disabled={!form.name.trim()}
          onClick={() => submit(false)}
        >
          {isEdit ? 'Save Changes' : 'Save Category'}
        </Button>
      </div>
    </div>
  )
}
