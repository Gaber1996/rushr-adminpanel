import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { CATEGORY_DIALOG_CLASS } from './CategoryDialog'

const TITLE_ID = 'delete-category-title'

/** The trash illustration from Figma. */
function TrashIllustration() {
  return (
    <svg
      viewBox="0 0 322 322"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-28 w-28 md:h-40 md:w-40"
    >
      <rect width="322" height="322" rx="161" fill="white" />
      <g transform="translate(75, 60)">
        <rect x="28" y="0" width="116" height="6" rx="3" fill="#9CA3AF" />
        <rect x="20" y="10" width="132" height="18" rx="4" fill="#F9AFAF" />
        <path
          d="M12 35 L16 185 Q17 195 27 195 L145 195 Q155 195 156 185 L160 35 Z"
          fill="#C20A0A"
        />
        <rect x="0" y="28" width="172" height="14" rx="7" fill="#C20A0A" />
        <rect x="50" y="55" width="14" height="120" rx="7" fill="#FFF7F7" />
        <rect x="80" y="55" width="14" height="118" rx="7" fill="#FFF7F7" />
        <rect x="110" y="55" width="14" height="117" rx="7" fill="#FFF7F7" />
      </g>
    </svg>
  )
}

/** "Delete This Category ?" confirmation. */
export default function DeleteCategoryDialog({ open, onClose, onConfirm, loading }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={TITLE_ID}
      backdropClassName="backdrop:bg-black/50"
      className={CATEGORY_DIALOG_CLASS}
    >
      <div className="flex flex-col items-center gap-1 p-6 md:p-10">
        <TrashIllustration />

        <div className="flex max-w-[871px] flex-col items-center gap-4 md:gap-6">
          <h3
            id={TITLE_ID}
            className="text-center text-2xl font-extrabold leading-none text-ink md:text-[40px]"
          >
            Delete This Category ?
          </h3>
          <p className="text-center text-base font-semibold leading-tight text-muted md:text-2xl md:leading-6">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col-reverse gap-3 sm:flex-row sm:gap-6">
          <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="lg"
            className="flex-1"
            loading={loading}
            onClick={onConfirm}
          >
            Delete Category
          </Button>
        </div>
      </div>
    </Modal>
  )
}
