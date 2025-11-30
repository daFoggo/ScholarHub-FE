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
                    "relative justify-start bg-muted/50 shadow-none sm:pr-12 rounded-[0.5rem] w-full md:w-40 lg:w-56 xl:w-64 h-8 font-normal text-muted-foreground text-sm"
                )}
                onClick={() => setOpen(true)}
                {...props}
            >
                <span className="hidden lg:inline-flex">Search on website...</span>
                <span className="lg:hidden inline-flex">Search...</span>
                <kbd className="hidden top-[0.3rem] right-[0.3rem] absolute sm:flex items-center gap-1 bg-muted opacity-100 px-1.5 border rounded h-5 font-mono font-medium text-[10px] pointer-events-none select-none">
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
                                    <div className="flex justify-center items-center mr-2 size-4">
                                        <Circle className="w-3 h-3" />
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
