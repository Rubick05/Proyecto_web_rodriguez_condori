import React from 'react'
import type { SlideTypography, FontFamilyType, FontSizeScale, TextAlignType } from '../../models/Slide'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from 'lucide-react'

export interface FormattingToolbarProps {
  typography?: SlideTypography
  onUpdateTypography: (updated: SlideTypography) => void
}

const DEFAULT_TYPOGRAPHY: SlideTypography = {
  fontFamily: 'sans',
  titleSize: 'lg',
  contentSize: 'md',
  isBold: true,
  isItalic: false,
  textAlign: 'left',
}

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  typography = DEFAULT_TYPOGRAPHY,
  onUpdateTypography,
}) => {
  const current = { ...DEFAULT_TYPOGRAPHY, ...typography }

  const handleFontFamily = (family: FontFamilyType) => {
    onUpdateTypography({ ...current, fontFamily: family })
  }

  const handleTitleSize = (size: FontSizeScale) => {
    onUpdateTypography({ ...current, titleSize: size })
  }

  const handleBoldToggle = () => {
    onUpdateTypography({ ...current, isBold: !current.isBold })
  }

  const handleItalicToggle = () => {
    onUpdateTypography({ ...current, isItalic: !current.isItalic })
  }

  const handleAlign = (align: TextAlignType) => {
    onUpdateTypography({ ...current, textAlign: align })
  }

  return (
    <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 shadow-sm rounded-lg p-1 text-xs select-none z-10 transition-all">
      {/* Selector de Fuente */}
      <div className="flex items-center gap-0.5 bg-slate-100 rounded-md p-0.5 border border-slate-200">
        <button
          type="button"
          onClick={() => handleFontFamily('sans')}
          className={`px-2 py-0.5 rounded text-[11px] font-sans font-medium transition-colors ${
            current.fontFamily === 'sans'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Fuente Sans-Serif (Moderna)"
        >
          Sans
        </button>
        <button
          type="button"
          onClick={() => handleFontFamily('serif')}
          className={`px-2 py-0.5 rounded text-[11px] font-serif font-medium transition-colors ${
            current.fontFamily === 'serif'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Fuente Serif (Editorial)"
        >
          Serif
        </button>
        <button
          type="button"
          onClick={() => handleFontFamily('mono')}
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors ${
            current.fontFamily === 'mono'
              ? 'bg-white text-indigo-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Fuente Monoespaciada (Código/Técnica)"
        >
          Mono
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 mx-0.5" />

      {/* Escala de Tamaño */}
      <div className="flex items-center gap-0.5">
        <Type className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
        {(['sm', 'md', 'lg', 'xl'] as FontSizeScale[]).map((sz) => (
          <button
            key={sz}
            type="button"
            onClick={() => handleTitleSize(sz)}
            className={`px-1.5 py-0.5 rounded uppercase text-[10px] font-bold transition-colors ${
              current.titleSize === sz
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
            title={`Tamaño ${sz.toUpperCase()}`}
          >
            {sz}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-200 mx-0.5" />

      {/* Negrita e Itálica */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={handleBoldToggle}
          className={`p-1 rounded transition-colors ${
            current.isBold
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Negrita (Bold)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleItalicToggle}
          className={`p-1 rounded transition-colors ${
            current.isItalic
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Cursiva (Italic)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="h-4 w-px bg-slate-200 mx-0.5" />

      {/* Alineación */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => handleAlign('left')}
          className={`p-1 rounded transition-colors ${
            current.textAlign === 'left'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
          title="Alinear a la izquierda"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('center')}
          className={`p-1 rounded transition-colors ${
            current.textAlign === 'center'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
          title="Alinear al centro"
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('right')}
          className={`p-1 rounded transition-colors ${
            current.textAlign === 'right'
              ? 'bg-indigo-50 text-indigo-700'
              : 'text-slate-500 hover:bg-slate-100'
          }`}
          title="Alinear a la derecha"
        >
          <AlignRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
