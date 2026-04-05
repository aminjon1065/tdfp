import { usePage } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { getStatusLabel } from '@/lib/i18n';
import { type SharedData } from '@/types';

const statusConfig: Record<
    string,
    {
        label: string;
        variant: 'default' | 'secondary' | 'destructive' | 'outline';
    }
> = {
    draft: { label: 'Draft', variant: 'secondary' },
    published: { label: 'Published', variant: 'default' },
    archived: { label: 'Archived', variant: 'outline' },
    planned: { label: 'Planned', variant: 'secondary' },
    in_progress: { label: 'In Progress', variant: 'default' },
    completed: { label: 'Completed', variant: 'outline' },
    open: { label: 'Open', variant: 'default' },
    closed: { label: 'Closed', variant: 'secondary' },
    awarded: { label: 'Awarded', variant: 'outline' },
    submitted: { label: 'Submitted', variant: 'secondary' },
    under_review: { label: 'Under Review', variant: 'default' },
    investigation: { label: 'Investigation', variant: 'destructive' },
    resolved: { label: 'Resolved', variant: 'outline' },
};

export function StatusBadge({ status }: { status: string }) {
    const { props } = usePage<SharedData>();
    const locale = props.locale ?? 'en';
    const config = statusConfig[status] ?? {
        label: status,
        variant: 'secondary' as const,
    };
    return (
        <Badge variant={config.variant}>
            {getStatusLabel(status, locale) || config.label}
        </Badge>
    );
}
