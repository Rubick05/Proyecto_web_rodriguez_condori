import React, { useRef, useState } from 'react'
import type { SlideImageConfig } from '../../models/Slide'
import { clampPosition, clampWidth } from '../../utils/canvasMath'
import {
  Upload,
  Link as LinkIcon,
  Move,
  Maximize2,
  Trash2,
} from 'lucide-react'

export interface InteractiveCanvasImageProps {
  imageConfig?: SlideImageConfig
  fallbackUrl?: string
  altText?: string
  isEditable?: boolean
  onUpdateImage: (partial: { imageUrl?: string; imageCaption?: string; imageConfig?: SlideImageConfig }) => void
}

const DEFAULT_SAMPLE_IMAGE =
  'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80'

export const InteractiveCanvasImage: React.FC<InteractiveCanvasImageProps> = ({
  imageConfig,
  fallbackUrl,
  altText = 'Imagen de la diapositiva',
  isEditable = false,
  onUpdateImage,
}) => {
  const currentUrl = imageConfig?.url || fallbackUrl || DEFAULT_SAMPLE_IMAGE
  const currentCaption = imageConfig?.caption || ''
  const currentX = imageConfig?.x ?? 25
  const currentY = imageConfig?.y ?? 20
  const currentWidth = imageConfig?.width ?? 50

  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [tempUrl, setTempUrl] = useState('')

  // Drag handler con Pointer Events
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: currentX,
    initialY: currentY,
  })

  const handlePointerDownDrag = (e: React.PointerEvent) => {
    if (!isEditable) return
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentX,
      initialY: currentY,
    }
    setIsDragging(true)
  }

  const handlePointerMoveDrag = (e: React.PointerEvent) => {
    if (!isDragging || !isEditable) return
    const parent = containerRef.current?.parentElement
    if (!parent) return

    const parentRect = parent.getBoundingClientRect()
    const deltaX = ((e.clientX - dragStartRef.current.startX) / parentRect.width) * 100
    const deltaY = ((e.clientY - dragStartRef.current.startY) / parentRect.height) * 100

    const rawX = dragStartRef.current.initialX + deltaX
    const rawY = dragStartRef.current.initialY + deltaY

    // Aplicar clamp estricto dentro del canvas
    const safePos = clampPosition(rawX, rawY, currentWidth, 40)

    onUpdateImage({
      imageConfig: {
        url: currentUrl,
        caption: currentCaption,
        x: safePos.x,
        y: safePos.y,
        width: currentWidth,
      },
    })
  }

  const handlePointerUpDrag = (e: React.PointerEvent) => {
    if (isDragging) {
      const target = e.currentTarget as HTMLElement
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {}
      setIsDragging(false)
    }
  }

  // Resize handler con Pointer Events
  const resizeStartRef = useRef<{ startClientX: number; initialWidth: number }>({
    startClientX: 0,
    initialWidth: currentWidth,
  })

  const handlePointerDownResize = (e: React.PointerEvent) => {
    if (!isEditable) return
    e.stopPropagation()
    const target = e.currentTarget as HTMLElement
    target.setPointerCapture(e.pointerId)

    resizeStartRef.current = {
      startClientX: e.clientX,
      initialWidth: currentWidth,
    }
    setIsResizing(true)
  }

  const handlePointerMoveResize = (e: React.PointerEvent) => {
    if (!isResizing || !isEditable) return
    const parent = containerRef.current?.parentElement
    if (!parent) return

    const parentRect = parent.getBoundingClientRect()
    const deltaWidth = ((e.clientX - resizeStartRef.current.startClientX) / parentRect.width) * 100
    const rawWidth = resizeStartRef.current.initialWidth + deltaWidth

    const safeWidth = clampWidth(rawWidth, currentX)

    onUpdateImage({
      imageConfig: {
        url: currentUrl,
        caption: currentCaption,
        x: currentX,
        y: currentY,
        width: safeWidth,
      },
    })
  }

  const handlePointerUpResize = (e: React.PointerEvent) => {
    if (isResizing) {
      const target = e.currentTarget as HTMLElement
      try {
        target.releasePointerCapture(e.pointerId)
      } catch {}
      setIsResizing(false)
    }
  }

  // Carga de archivo local desde la computadora
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      onUpdateImage({
        imageUrl: base64,
        imageConfig: {
          url: base64,
          caption: currentCaption,
          x: currentX,
          y: currentY,
          width: currentWidth,
        },
      })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempUrl.trim()) return
    onUpdateImage({
      imageUrl: tempUrl.trim(),
      imageConfig: {
        url: tempUrl.trim(),
        caption: currentCaption,
        x: currentX,
        y: currentY,
        width: currentWidth,
      },
    })
    setShowUrlInput(false)
    setTempUrl('')
  }

  const handleClearImage = () => {
    onUpdateImage({
      imageUrl: '',
      imageCaption: '',
      imageConfig: {
        url: '',
        caption: '',
        x: 25,
        y: 20,
        width: 50,
      },
    })
  }

  // Render en Modo Presentación
  if (!isEditable) {
    return (
      <div
        ref={containerRef}
        className="absolute transition-all duration-150 flex flex-col items-center"
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          width: `${currentWidth}%`,
        }}
      >
        <div className="w-full rounded-xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-900">
          <img
            src={currentUrl}
            alt={altText}
            className="w-full h-auto max-h-[50vh] object-contain"
          />
        </div>
        {currentCaption && (
          <p className="text-xs text-slate-500 italic text-center mt-2 px-2">
            {currentCaption}
          </p>
        )}
      </div>
    )
  }

  // Render en Modo Edición
  return (
    <>
      {/* Input de archivo local oculto */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleLocalFileChange}
        className="hidden"
      />

      <div
        ref={containerRef}
        onPointerDown={handlePointerDownDrag}
        onPointerMove={handlePointerMoveDrag}
        onPointerUp={handlePointerUpDrag}
        className={`absolute group select-none transition-shadow ${
          isDragging ? 'cursor-grabbing ring-2 ring-indigo-500 shadow-2xl z-30' : 'cursor-grab hover:ring-2 hover:ring-indigo-400/60 z-20'
        }`}
        style={{
          left: `${currentX}%`,
          top: `${currentY}%`,
          width: `${currentWidth}%`,
          touchAction: 'none',
        }}
      >
        {/* Contenedor de Imagen */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-md border-2 border-indigo-400/40 bg-slate-900/95">
          <img
            src={currentUrl}
            alt={altText}
            className="w-full h-auto max-h-[45vh] object-contain pointer-events-none"
          />

          {/* Barra de Controles Flotante Sobre la Imagen */}
          <div
            className="absolute top-2 right-2 flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-lg border border-slate-700/80 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Subir imagen desde mi PC (Offline / Base64)"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Pegar URL de imagen externa"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleClearImage}
              className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Quitar imagen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicador de arrastre en el centro */}
          <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-75 transition-opacity pointer-events-none">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-white bg-slate-900/80 px-2 py-0.5 rounded-full shadow">
              <Move className="w-2.5 h-2.5" /> Arrastra para mover
            </span>
          </div>
        </div>

        {/* Tirador de Redimensionamiento en la esquina inferior derecha */}
        <div
          onPointerDown={handlePointerDownResize}
          onPointerMove={handlePointerMoveResize}
          onPointerUp={handlePointerUpResize}
          className="absolute -bottom-2 -right-2 w-5 h-5 bg-indigo-600 hover:bg-indigo-700 border-2 border-white rounded-full cursor-nwse-resize flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-40"
          style={{ touchAction: 'none' }}
          title="Arrastra para redimensionar (restringido al canvas)"
        >
          <Maximize2 className="w-2.5 h-2.5 text-white" />
        </div>

        {/* Modal / Popover para ingresar URL */}
        {showUrlInput && (
          <form
            onSubmit={handleUrlSubmit}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute -top-12 left-0 right-0 flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-lg shadow-xl z-50 text-xs"
          >
            <input
              type="text"
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="Pega la URL de la imagen..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-[11px]"
            >
              Listo
            </button>
          </form>
        )}

        {/* Pie de foto editable */}
        <div onPointerDown={(e) => e.stopPropagation()} className="mt-1.5 w-full">
          <input
            type="text"
            value={currentCaption}
            onChange={(e) =>
              onUpdateImage({
                imageCaption: e.target.value,
                imageConfig: {
                  url: currentUrl,
                  caption: e.target.value,
                  x: currentX,
                  y: currentY,
                  width: currentWidth,
                },
              })
            }
            placeholder="Pie de foto descriptivo..."
            className="w-full text-center text-xs text-slate-500 italic bg-transparent border-b border-dashed border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:outline-none py-0.5"
          />
        </div>
      </div>
    </>
  )
}
