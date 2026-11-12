import type { SlideTypography } from '../models/Slide'

export function getFontFamilyClass(family?: string): string {
  switch (family) {
    case 'serif':
      return 'font-serif'
    case 'mono':
      return 'font-mono'
    case 'sans':
    default:
      return 'font-sans'
  }
}

export function getTitleSizeClass(size?: string): string {
  switch (size) {
    case 'sm':
      return 'text-xl sm:text-2xl'
    case 'md':
      return 'text-2xl sm:text-3xl'
    case 'xl':
      return 'text-4xl sm:text-6xl'
    case 'lg':
    default:
      return 'text-3xl sm:text-5xl'
  }
}

export function getContentSizeClass(size?: string): string {
  switch (size) {
    case 'sm':
      return 'text-sm sm:text-base'
    case 'lg':
      return 'text-xl sm:text-2xl'
    case 'md':
    default:
      return 'text-base sm:text-lg'
  }
}

export function getTextAlignClass(align?: string): string {
  switch (align) {
    case 'center':
      return 'text-center'
    case 'right':
      return 'text-right'
    case 'left':
    default:
      return 'text-left'
  }
}

export function getTypographyClasses(typography?: SlideTypography) {
  const family = getFontFamilyClass(typography?.fontFamily)
  const titleSize = getTitleSizeClass(typography?.titleSize)
  const contentSize = getContentSizeClass(typography?.contentSize)
  const align = getTextAlignClass(typography?.textAlign)
  const bold = (typography?.isBold ?? true) ? 'font-extrabold' : 'font-normal'
  const italic = typography?.isItalic ? 'italic' : 'not-italic'

  return {
    family,
    titleSize,
    contentSize,
    align,
    bold,
    italic,
    titleCombined: `${family} ${titleSize} ${bold} ${italic} ${align}`,
    contentCombined: `${family} ${contentSize} ${italic} ${align}`,
  }
}
