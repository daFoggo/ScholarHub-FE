import { Circle, File, Laptop, Moon, Sun } from "lucide-react"
import * as React from "react"
import { useTheme } from "@/contexts/theme-context"

import { DOCS_CONFIG } from "@/configs/docs"
import { cn } from "@/lib/utils"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "./button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./command"
import type { DialogProps } from "@radix-ui/react-dialog"


export function CommandMenu({ ...props }: DialogProps) {
    const [open, setOpen] = React.useState(false)
    const { setTheme } = useTheme()
    const navigate = useNavigate()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
                if (
                    (e.target instanceof HTMLElement && e.target.isContentEditable) ||
                    e.target instanceof HTMLInputElement ||
                    e.target instanceof HTMLTextAreaElement ||
                    e.target instanceof HTMLSelectElement
                ) {
                    return
                }

                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
                )}
                onClick={() => setOpen(true)}
                {...props}
            >
                <span className="hidden lg:inline-flex">Search on website...</span>
                <span className="inline-flex lg:hidden">Search...</span>
                <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Links">
                        {DOCS_CONFIG.mainNav
                            .filter((navitem) => !navitem.external)
                            .map((navItem) => (
                                <CommandItem
                                    key={navItem.href}
                                    value={navItem.title}
                                    onSelect={() => {
                                        runCommand(() => navigate({ to: navItem.href as string, search: { scrollToTop: "true" } }))
                                    }}
                                >
                                    <File />
                                    {navItem.title}
                                </CommandItem>
                            ))}
                    </CommandGroup>
                    {DOCS_CONFIG.sidebarNav.map((group) => (
                        <CommandGroup key={group.title} heading={group.title}>
                            {group.items && group.items.map((navItem) => (
                                <CommandItem
                                    key={navItem.href}
                                    value={navItem.title}
                                    onSelect={() => {
                                        runCommand(() => navigate({ to: navItem.href as string, search: { scrollToTop: "true" } }))
                                    }}
                                >
                                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                                        <Circle className="h-3 w-3" />
                                    </div>
                                    {navItem.title}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    ))}
                    <CommandSeparator />
                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun />
                            Light
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon />
                            Dark
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop />
                            System
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
