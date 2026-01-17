import { Button } from '@/components/ui/button';
import { useBVI } from '@/providers/bvi-provider';

export function BVIButton() {
    const { state, setState } = useBVI();

    return (
        <Button
            variant="outline"
            onClick={() => setState((s) => ({ ...s, enabled: !s.enabled }))}
        >
            Версия для слабовидящих
        </Button>
    );
}
