'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { themeConfig } from '@/lib/theme-config'

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={themeConfig.defaultTheme}
      enableSystem={false}
      storageKey={themeConfig.storageKey}
      forcedTheme="dark"
    >
      {children}
    </NextThemesProvider>
  )
} 