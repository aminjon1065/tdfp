import { Accessibility } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useBVI } from '@/providers/bvi-provider';

interface BVIButtonProps {
    className?: string;
    label?: string;
}

export function BVIButton({
    className,
    label = 'Версия для слабовидящих',
}: BVIButtonProps) {
    const { state, setState } = useBVI();

    return (
        <Button
            variant="outline"
            aria-pressed={state.enabled}
            onClick={() => setState((s) => ({ ...s, enabled: !s.enabled }))}
            className={className}
        >
            <Accessibility className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
