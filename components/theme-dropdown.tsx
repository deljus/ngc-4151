import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/outline"
import * as React from "react"

import themeData from "@/data/theme-data.json"

const THEME_KEY = "__theme__";
const DEFAULT_THEME = "light";

const initStateTheme = () => {
    if(typeof window !== 'undefined') {
        return localStorage.getItem(THEME_KEY) || DEFAULT_THEME
    }
    return DEFAULT_THEME
}

export function ThemeDropdown() {
  const [selectedTheme, setTheme] = React.useState(initStateTheme())

  React.useEffect(() => {
    document.documentElement.dataset.theme = selectedTheme
    localStorage.setItem(THEME_KEY, selectedTheme)
  }, [selectedTheme])

  return (
    <div title="Change Theme" className="dropdown dropdown-end">
      <div tabIndex={0} className="m-1 normal-case btn-ghost btn">
        <SparklesIcon className="h-4 w-4 mr-2" />
        <span className="hidden md:inline mr-2">Change Theme</span>
        <ChevronDownIcon className="h-4 w-4" />
      </div>
      <div
        tabIndex={0}
        className="mt-16 overflow-y-auto shadow-2xl top-px dropdown-content h-96 w-52 rounded-b-box bg-base-200 text-base-content"
      >
        <ul tabIndex={0} className="p-4 menu compact">
          {themeData.map(({ id, name, theme }) => (
            <li key={id}>
              <a
                className={`${selectedTheme === theme ? "active" : ""}`}
                onClick={() => setTheme(theme)}
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
