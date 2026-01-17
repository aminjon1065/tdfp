import { Button } from '@/components/ui/button';
import { useBVI } from '@/providers/bvi-provider';

export function BVIPanel() {
    const { state, setState } = useBVI();

    if (!state.enabled) return null;

    return (
        <div className="w-full border-b bg-background p-4">
            <div className="container mx-auto flex flex-wrap gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({ ...s, fontSize: 'normal' }))
                    }
                    className={state.fontSize === 'normal' ? 'border-primary ring-1 ring-primary' : ''}
                >
                    A
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({ ...s, fontSize: 'large' }))
                    }
                    className={state.fontSize === 'large' ? 'border-primary ring-1 ring-primary' : ''}
                >
                    A+
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({ ...s, fontSize: 'xlarge' }))
                    }
                    className={state.fontSize === 'xlarge' ? 'border-primary ring-1 ring-primary' : ''}
                >
                    A++
                </Button>

                <div className="mx-2 h-8 w-px bg-border" />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({ ...s, contrast: 'default' }))
                    }
                    className={state.contrast === 'default' ? 'border-primary ring-1 ring-primary' : ''}
                >
                    Обычный
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({ ...s, contrast: 'high' }))
                    }
                    className={state.contrast === 'high' ? 'border-primary ring-1 ring-primary' : ''}
                >
                    Контраст
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({ ...s, contrast: 'invert' }))
                    }
                    className={state.contrast === 'invert' ? 'border-primary ring-1 ring-primary' : ''}
                >
                    Инверсия
                </Button>

                <div className="mx-2 h-8 w-px bg-border" />

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        setState((s) => ({
                            ...s,
                            images: s.images === 'on' ? 'off' : 'on',
                        }))
                    }
                >
                    {state.images === 'on' ? 'Выкл. изображения' : 'Вкл. изображения'}
                </Button>

                <div className="flex-1" />

                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setState({ ...state, enabled: false })}
                >
                    Закрыть панель
                </Button>
            </div>
        </div>
    );
}
