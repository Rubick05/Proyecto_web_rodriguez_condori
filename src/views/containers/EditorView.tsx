import React, { useState } from 'react'
import type { Project } from '../../models/Project'
import type { Slide, SlideLayoutType } from '../../models/Slide'
import { SlideRenderer } from '../components/SlideRenderer'
import {
  Play,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  LayoutTemplate,
  Type,
  Image as ImageIcon,
  Columns2,
  Save,
  CheckCircle2,
  FileText,
} from 'lucide-react'

export interface EditorViewProps {
  project: Project
  slides: Slide[]
  currentIndex: number
  activeSlide: Slide | undefined
  onSelectSlide: (index: number) => void
  onAddSlide: (layout?: SlideLayoutType) => void
  onDeleteSlide: (index: number) => void
  onUpdateActiveSlide: (partial: Partial<Slide>) => void
  onReorderSlides: (fromIndex: number, toIndex: number) => void
  onUpdateProjectMeta: (meta: Partial<Pick<Project, 'title' | 'author'>>) => void
  onSaveProject: () => Promise<void>
  onStartPresentation: () => void
  isSaving?: boolean
}

/**
 * Contenedor EditorView (Capa View)
 * 
 * Interfaz de creación y edición en tiempo real con panel de miniaturas,
 * barra de herramientas de layout y edición en vivo.
 */
export const EditorView: React.FC<EditorViewProps> = ({
  project,
  slides,
  currentIndex,
  activeSlide,
  onSelectSlide,
  onAddSlide,
  onDeleteSlide,
  onUpdateActiveSlide,
  onReorderSlides,
  onUpdateProjectMeta,
  onSaveProject,
  onStartPresentation,
  isSaving = false,
}) => {
  const [showNotes, setShowNotes] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleManualSave = async () => {
    await onSaveProject()
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2000)
  }

  const layouts: { type: SlideLayoutType; label: string; icon: React.ReactNode }[] = [
    { type: 'text-only', label: 'Texto', icon: <Type className="w-3.5 h-3.5" /> },
    { type: 'image-only', label: 'Imagen', icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { type: 'text-and-image', label: 'Dividido', icon: <Columns2 className="w-3.5 h-3.5" /> },
  ]

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 overflow-hidden font-sans">
      {/* Barra Superior de Herramientas */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <LayoutTemplate className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0 flex-1 max-w-md">
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateProjectMeta({ title: e.target.value })}
              className="text-sm font-bold text-slate-800 bg-transparent hover:bg-slate-50 focus:bg-white border border-transparent focus:border-indigo-400 rounded px-1.5 py-0.5 focus:outline-none transition-all truncate"
              placeholder="Título del proyecto..."
            />
            <span className="text-[11px] text-slate-400 px-1.5">
              Almacenado localmente en IndexedDB
            </span>
          </div>
        </div>

        {/* Selector de Layout de la Diapositiva Activa */}
        {activeSlide && (
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            {layouts.map((l) => (
              <button
                key={l.type}
                onClick={() => onUpdateActiveSlide({ layout: l.type })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeSlide.layout === l.type
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {l.icon}
                {l.label}
              </button>
            ))}
          </div>
        )}

        {/* Acciones principales: Guardar y Presentar */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Guardado</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-500" />
                <span>{isSaving ? 'Guardando...' : 'Guardar'}</span>
              </>
            )}
          </button>

          <button
            onClick={onStartPresentation}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Presentar</span>
          </button>
        </div>
      </header>

      {/* Cuerpo Principal: Sidebar + Canvas + Panel de Notas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Barra Lateral Izquierda: Miniaturas y Lista de Diapositivas */}
        <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Diapositivas ({slides.length})
            </span>
            <button
              onClick={() => onAddSlide('text-only')}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>

          {/* Lista de miniaturas */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {slides.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => onSelectSlide(idx)}
                className={`group relative flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border ${
                  idx === currentIndex
                    ? 'bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white/60 hover:bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Número */}
                <span className="text-[11px] font-mono font-bold text-slate-400 w-4 text-right shrink-0">
                  {idx + 1}
                </span>

                {/* Previsualización en miniatura */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">
                    {s.title || `Diapositiva ${idx + 1}`}
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    {s.layout}
                  </div>
                </div>

                {/* Acciones de reordenamiento y eliminación */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                  <button
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      onReorderSlides(idx, idx - 1)
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Subir"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === slides.length - 1}
                    onClick={(e) => {
                      e.stopPropagation()
                      onReorderSlides(idx, idx + 1)
                    }}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Bajar"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {slides.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteSlide(idx)
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Área Central: Canvas del Diapositiva */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden relative">
          <div className="w-full max-w-4xl aspect-[16/9] max-h-[75vh]">
            {activeSlide ? (
              <SlideRenderer
                slide={activeSlide}
                isEditable={true}
                onUpdate={onUpdateActiveSlide}
                projectTitle={project.title}
                author={project.author}
                currentSlideIndex={currentIndex}
                totalSlides={slides.length}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
                Selecciona o crea una diapositiva
              </div>
            )}
          </div>

          {/* Botón flotante para Notas del Orador */}
          <div className="absolute bottom-4 right-6">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm transition-all border ${
                showNotes
                  ? 'bg-indigo-600 text-white border-indigo-700'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notas del Orador</span>
            </button>
          </div>

          {/* Drawer / Panel Desplegable de Notas del Orador */}
          {showNotes && activeSlide && (
            <div className="absolute bottom-16 right-6 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 z-20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Notas para el orador
                </span>
                <span className="text-[10px] text-slate-400">Solo visibles al editar</span>
              </div>
              <textarea
                value={activeSlide.notes || ''}
                onChange={(e) => onUpdateActiveSlide({ notes: e.target.value })}
                placeholder="Escribe tus apuntes y recordatorios para esta diapositiva..."
                rows={4}
                className="w-full text-xs text-slate-600 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:border-indigo-500 resize-none bg-slate-50"
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
