import { createContext, useContext, useEffect, useState } from "react"

const THEME_STORAGE_KEY = "hireflow-theme"

const ThemeContext = createContext({
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = THEME_STORAGE_KEY,
}) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === "undefined") return defaultTheme
    try {
      const stored = localStorage.getItem(storageKey)
      return stored || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (typeof window === "undefined") return "light"
    if (theme === "dark" || theme === "light") return theme
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  })

  useEffect(() => {
    const root = document.documentElement

    const applyTheme = (currentTheme) => {
      let resolved = currentTheme
      if (currentTheme === "system") {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      }

      root.classList.remove("light", "dark")
      root.classList.add(resolved)
      root.style.colorScheme = resolved
      setResolvedTheme(resolved)
    }

    applyTheme(theme)

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (theme === "system") {
        applyTheme("system")
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme])

  const setTheme = (newTheme) => {
    try {
      localStorage.setItem(storageKey, newTheme)
    } catch {
      // Ignore write errors (e.g. storage disabled)
    }
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export { ThemeContext }

