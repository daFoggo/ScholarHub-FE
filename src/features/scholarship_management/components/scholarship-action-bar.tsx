import {
    DataTableActionBar,
    DataTableActionBarAction,
    DataTableActionBarSelection,
} from "@/components/ui/data-table-action-bar"
import { Separator } from "@/components/ui/separator"
import { Trash2 } from "lucide-react"
import type { IScholarshipActionBarProps } from "../utils/types"

export const ScholarshipActionBar = ({ table }: IScholarshipActionBarProps) => {
    return (
        <DataTableActionBar table={table}>
            <DataTableActionBarSelection table={table} />
            <Separator
                orientation="vertical"
                className="hidden sm:block data-[orientation=vertical]:h-5"
            />
            <div className="flex items-center gap-1.5">
                <DataTableActionBarAction
                    size="icon"
                    tooltip="Delete scholarships"
                    isPending={false}
                    variant="secondary"
                    className="bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 border-red-200 dark:border-red-900"
                >
                    <Trash2 className="size-4 text-red-500 dark:text-red-400" />
                </DataTableActionBarAction>
            </div>
        </DataTableActionBar>
    )
}
