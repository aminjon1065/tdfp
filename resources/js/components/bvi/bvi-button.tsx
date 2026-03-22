import { Button } from '@/components/ui/button';
import { useBVI } from '@/providers/bvi-provider';
import { Accessibility } from 'lucide-react';

interface BVIButtonProps {
    className?: string;
    label?: string;
}

export function BVIButton({ className, label = 'Версия для слабовидящих' }: BVIButtonProps) {
    const { state, setState } = useBVI();

    return (
        <Button
            variant="outline"
            onClick={() => setState((s) => ({ ...s, enabled: !s.enabled }))}
            className={className}
        >
            <Accessibility className="mr-2 h-4 w-4" />
            {label}
        </Button>
    );
}
