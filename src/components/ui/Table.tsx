import { cn } from "@/lib/utils";

interface Column<T> {
    key: string;
    header: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
    className?: string;
}

export function Table<T extends Record<string, any>>({
    columns, data, emptyMessage = "No data found", className,
}: TableProps<T>) {
    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className={cn("px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider", col.className)}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                {columns.map((col) => (
                                    <td key={col.key} className={cn("px-4 py-3 text-gray-700", col.className)}>
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}