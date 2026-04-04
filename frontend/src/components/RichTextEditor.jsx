import { useRef, useEffect } from 'react'
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react'

export default function RichTextEditor({ value, onChange, placeholder }) {
  const editorRef = useRef(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  }, [value])

  const handleInput = () => {
    if (onChange && editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const formatCommand = (command, e) => {
    e.preventDefault()
    document.execCommand(command, false, null)
    editorRef.current.focus()
  }

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-toolbar">
        <button onMouseDown={(e) => formatCommand('bold', e)} title="Negrito" type="button"><Bold size={14} /></button>
        <button onMouseDown={(e) => formatCommand('italic', e)} title="Itálico" type="button"><Italic size={14} /></button>
        <button onMouseDown={(e) => formatCommand('underline', e)} title="Sublinhado" type="button"><Underline size={14} /></button>
        <div className="toolbar-divider" />
        <button onMouseDown={(e) => formatCommand('insertUnorderedList', e)} title="Lista" type="button"><List size={14} /></button>
        <button onMouseDown={(e) => formatCommand('insertOrderedList', e)} title="Lista Numerada" type="button"><ListOrdered size={14} /></button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
      />
    </div>
  )
}
