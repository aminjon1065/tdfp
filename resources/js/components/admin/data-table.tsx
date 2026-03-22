import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { t } from '@/lib/i18n';
import { Search } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { type SharedData } from '@/types';

interface Column<T> {
    key: keyof T | string;
    header: string;
    render?: (row: T) => React.ReactNode;
}

interface Pagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface DataTableProps<T> {
    data: { data: T[] } & Pagination;
    columns: Column<T>[];
    searchable?: boolean;
    onSearch?: (value: string) => void;
}

export function DataTable<T extends { id: number }>({
    data,
    columns,
    searchable = false,
    onSearch,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(search);
    };

    return (
        <div className="space-y-4">
            {searchable && (
                <form onSubmit={handleSearch} className="flex gap-2">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t(locale, 'common.searchPlaceholder')}
                        className="max-w-sm"
                    />
                    <Button type="submit" variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            )}

            <div className="rounded-md border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/50">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-4 py-8 text-center text-muted-foreground"
                                >
                                    {t(locale, 'common.noItemsFound')}
                                </td>
                            </tr>
                        ) : (
                            data.data.map((row) => (
                                <tr key={row.id} className="border-b hover:bg-muted/25">
                                    {columns.map((col) => (
                                        <td key={String(col.key)} className="px-4 py-3">
                                            {col.render
                                                ? col.render(row)
                                                : String((row as any)[col.key] ?? '')}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {data.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {t(locale, 'admin.content.pageSummary')} {data.current_page} {t(locale, 'admin.content.of')} {data.last_page} ({data.total} {t(locale, 'admin.content.total')})
                    </p>
                    <div className="flex gap-1">
                        {data.links.map((link, i) => (
                            <Button
                                key={i}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
