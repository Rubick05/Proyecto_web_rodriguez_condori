import React, { useState, useEffect, useCallback } from 'react'
import { useProjectController } from '../controllers/useProjectController'
import { useSlideController } from '../controllers/useSlideController'
import { EditorView } from './containers/EditorView'
import { PresentationView } from './containers/PresentationView'
import { HtmlPresentationExporter } from '../infrastructure/HtmlPresentationExporter'
import { JsonProjectExporter } from '../infrastructure/JsonProjectExporter'
import { PdfPresentationExporter } from '../infrastructure/PdfPresentationExporter'
import { downloadResult } from '../utils/fileDownloader'
import { Loader2 } from 'lucide-react'

/**
 * App Principal (Capa View)
 * 
 * Orquesta los controladores de Proyecto y Diapositivas,
 * gestiona la alternancia entre Modo Edición y Modo Presentación,
 * sincroniza la persistencia reactiva en IndexedDB, coordina los exportadores (PDF, HTML, JSON)
 * y la importación de archivos de respaldo.
 */
export const App: React.FC = () => {
  const {
    project,
    isLoading,
    isSaving,
    saveProject,
    updateProjectMeta,
    setProject,
    importProjectFromJson,
  } = useProjectController()

  const {
    slides,
    currentIndex,
    activeSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    addSlide,
    deleteSlide,
    updateActiveSlide,
    reorderSlides,
    setSlides,
  } = useSlideController(project.slides)

  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false)

  // Sincronizar slides del proyecto cargado al controlador de slides
  useEffect(() => {
    if (project.slides && project.slides.length > 0) {
      setSlides(project.slides)
    }
  }, [project.id])

  // Sincronizar cambios de slides hacia el proyecto
  useEffect(() => {
    setProject(prev => ({
      ...prev,
      slides,
      updatedAt: new Date().toISOString(),
    }))
  }, [slides, setProject])

  // Handlers de exportación y descarga directa
  const handleDownloadPdf = useCallback(async () => {
    const exporter = new PdfPresentationExporter()
    const result = await exporter.export({ ...project, slides })
    downloadResult(result)
  }, [project, slides])

  const handleExportHtml = useCallback(async () => {
    const exporter = new HtmlPresentationExporter()
    const result = await exporter.export({ ...project, slides })
    downloadResult(result)
  }, [project, slides])

  const handleExportJson = useCallback(async () => {
    const exporter = new JsonProjectExporter()
    const result = await exporter.export({ ...project, slides })
    downloadResult(result)
  }, [project, slides])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  // Handler de importación de proyecto completo desde JSON
  const handleImportProject = useCallback(async (jsonString: string) => {
    const imported = await importProjectFromJson(jsonString)
    setSlides(imported.slides)
    goToSlide(0)
  }, [importProjectFromJson, setSlides, goToSlide])

  // Pantalla de carga mientras se inicializa IndexedDB
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-900 text-white gap-3">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        <span className="text-sm font-medium text-slate-400">
          Cargando tu espacio de trabajo desde IndexedDB...
        </span>
      </div>
    )
  }

  if (isPresentationMode) {
    return (
      <PresentationView
        project={project}
        slides={slides}
        currentIndex={currentIndex}
        onNextSlide={nextSlide}
        onPrevSlide={prevSlide}
        onExitPresentation={() => setIsPresentationMode(false)}
        onDownloadPdf={handleDownloadPdf}
        onPrint={handlePrint}
      />
    )
  }

  return (
    <EditorView
      project={project}
      slides={slides}
      currentIndex={currentIndex}
      activeSlide={activeSlide}
      onSelectSlide={goToSlide}
      onAddSlide={addSlide}
      onDeleteSlide={deleteSlide}
      onUpdateActiveSlide={updateActiveSlide}
      onReorderSlides={reorderSlides}
      onUpdateProjectMeta={updateProjectMeta}
      onSaveProject={() => saveProject({ ...project, slides })}
      onStartPresentation={() => setIsPresentationMode(true)}
      onExportHtml={handleExportHtml}
      onExportJson={handleExportJson}
      onDownloadPdf={handleDownloadPdf}
      onPrint={handlePrint}
      onImportProject={handleImportProject}
      isSaving={isSaving}
    />
  )
}

export default App
