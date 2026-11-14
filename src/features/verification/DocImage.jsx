// Loads a verification document and shows it as an image or an embedded PDF.
import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import Skeleton from '../../components/ui/Skeleton'
import { loadDocumentFile } from '../../utils/documentFile'
import { VERIFICATION_TEXT } from '../../texts'

const TEXT = VERIFICATION_TEXT.details

export default function DocImage({ fileUrl, mimeType, alt }) {
  const [file, setFile] = useState(null) // { url, isPdf } from loadDocumentFile
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    let loaded = null
    loadDocumentFile(fileUrl, mimeType, controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return URL.revokeObjectURL(result.url)
        loaded = result
        setFile(result)
      })
      .catch(() => {
        if (!controller.signal.aborted) setHasError(true)
      })
    return () => {
      controller.abort()
      if (loaded) URL.revokeObjectURL(loaded.url)
    }
  }, [fileUrl, mimeType])

  return (
    <div className="flex flex-1 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
      {hasError ? (
        <div className="flex flex-col items-center gap-2 p-8 text-gray-400">
          <FileText className="h-12 w-12" strokeWidth={1.5} />
          <span className="text-sm">{TEXT.documentLoadError}</span>
        </div>
      ) : !file ? (
        <Skeleton className="h-full min-h-[300px] w-full self-stretch" rounded="rounded-xl" />
      ) : file.isPdf ? (
        // An <img> can't display a PDF, so it opens in the browser's PDF viewer.
        // #view=FitH fits the page to the panel's width.
        <iframe
          src={`${file.url}#view=FitH`}
          title={alt}
          className="min-h-[400px] w-full self-stretch border-0"
        />
      ) : (
        <img
          src={file.url}
          alt={alt}
          className="h-full w-full object-contain"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  )
}
