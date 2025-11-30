

import { cn } from "@/lib/utils"
import { Moon, Sun } from "lucide-react"
import { useTheme, type Theme } from "@/contexts/theme-context"

interface ThemeToggleProps {
    className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme()

    const isDark = theme === "dark"

    const handleSetTheme = (theme: Theme) => {
        setTheme(theme)
    }
    // next-themes
    // const { resolvedTheme, setTheme } = useTheme()
    // const isDark = resolvedTheme === "dark"
    // onClick={() => setTheme(isDark ? "light" : "dark")}

    return (
        <div
            className={cn(
                "flex p-1 rounded-full w-16 h-8 transition-all duration-300 cursor-pointer select-none",
                isDark
                    ? "bg-zinc-950 border border-zinc-800"
                    : "bg-white border border-zinc-200",
                className
            )}
            onClick={handleSetTheme.bind(null, isDark ? "light" : "dark")}
            role="button"
            tabIndex={0}
        >
            <div className="flex justify-between items-center w-full">
                <div
                    className={cn(
                        "flex justify-center items-center rounded-full w-6 h-6 transition-transform duration-300",
                        isDark
                            ? "transform translate-x-0 bg-zinc-800"
                            : "transform translate-x-8 bg-gray-200"
                    )}
                >
                    {isDark ? (
                        <Moon
                            className="size-4 text-white"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Sun
                            className="size-4 text-muted-foreground"
                            strokeWidth={1.5}
                        />
                    )}
                </div>
                <div
                    className={cn(
                        "flex justify-center items-center rounded-full w-6 h-6 transition-transform duration-300",
                        isDark
                            ? "bg-transparent"
                            : "transform -translate-x-8"
                    )}
                >
                    {isDark ? (
                        <Sun
                            className="size-4 text-muted-foreground"
                            strokeWidth={1.5}
                        />
                    ) : (
                        <Moon
                            className="size-4"
                            strokeWidth={1.5}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}