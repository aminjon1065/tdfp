import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { t } from '@/lib/i18n';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { SharedData } from '@/types';

interface EditorialPreviewButtonProps {
    endpoint: string;
    payload: FormData | Record<string, unknown>;
    disabled?: boolean;
}

export function EditorialPreviewButton({
    endpoint,
    payload,
    disabled = false,
}: EditorialPreviewButtonProps) {
    const { csrf_token: csrfToken, locale } = usePage<SharedData & { csrf_token?: string }>().props;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePreview = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
            const formData = payload instanceof FormData ? cloneFormData(payload) : toFormData(payload);

            if (csrfToken && !formData.has('_token')) {
                formData.append('_token', csrfToken);
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: formData,
            });

            const responseBody = await response.json().catch(() => ({}));

            if (!response.ok || typeof responseBody.preview_url !== 'string') {
                setErrorMessage(t(locale, 'admin.form.previewError'));

                return;
            }

            window.open(responseBody.preview_url, '_blank', 'noopener,noreferrer');
        } catch {
            setErrorMessage(t(locale, 'admin.form.previewError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            <Button
                type="button"
                variant="outline"
                onClick={handlePreview}
                disabled={disabled || isLoading}
            >
                {isLoading ? t(locale, 'admin.form.preparingPreview') : t(locale, 'admin.form.preview')}
            </Button>
            {errorMessage && (
                <Alert className="border-amber-300 bg-amber-50 text-amber-900">
                    <AlertTitle>{t(locale, 'admin.form.previewUnavailable')}</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}
        </div>
    );
}

function cloneFormData(source: FormData): FormData {
    const formData = new FormData();

    source.forEach((value, key) => {
        formData.append(key, value);
    });

    return formData;
}

function toFormData(payload: Record<string, unknown>): FormData {
    const formData = new FormData();

    appendValue(formData, payload);

    return formData;
}

function appendValue(formData: FormData, value: unknown, parentKey?: string): void {
    if (value === null || value === undefined) {
        return;
    }

    if (value instanceof File) {
        if (parentKey) {
            formData.append(parentKey, value);
        }

        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item, index) => {
            appendValue(formData, item, `${parentKey}[${index}]`);
        });

        return;
    }

    if (typeof value === 'object') {
        Object.entries(value as Record<string, unknown>).forEach(([key, nestedValue]) => {
            const nextKey = parentKey ? `${parentKey}[${key}]` : key;
            appendValue(formData, nestedValue, nextKey);
        });

        return;
    }

    if (parentKey) {
        formData.append(parentKey, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
    }
}
