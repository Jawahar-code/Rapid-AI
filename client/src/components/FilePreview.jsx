import React from 'react'
import { FileText, X } from 'lucide-react'

const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FilePreview = ({ file, onRemove, accentClass = 'text-primary' }) => {
    if (!file) return null

    return (
        <div className='mb-5 flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-200 dark:border-slate-700'>
            <FileText className={`w-5 h-5 shrink-0 ${accentClass}`} />
            <div className='flex-1 min-w-0'>
                <p className='text-xs font-medium text-slate-700 dark:text-slate-200 truncate' title={file.name}>{file.name}</p>
                <p className='text-[11px] text-slate-400 dark:text-slate-500'>{formatFileSize(file.size)}</p>
            </div>
            {onRemove && (
                <button
                    type='button'
                    onClick={onRemove}
                    aria-label={`Remove ${file.name}`}
                    className='p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer'
                >
                    <X className='w-4 h-4' />
                </button>
            )}
        </div>
    )
}

export default FilePreview
