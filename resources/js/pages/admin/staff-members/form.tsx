import { TranslationTabs } from '@/components/admin/translation-tabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

interface ParentOption {
    id: number;
    translations: Array<{
        language: string;
        full_name: string;
    }>;
}

interface StaffMemberPayload {
    id?: number;
    parent_id: number | null;
    email: string;
    phone: string;
    photo_path?: string | null;
    is_leadership: boolean;
    is_published: boolean;
    sort_order: number;
    translations: Record<string, {
        full_name: string;
        job_title: string;
        department: string;
        biography: string;
    }>;
}

interface StaffMemberFormProps {
    action: string;
    method: 'post' | 'put';
    parentOptions: ParentOption[];
    submitLabel: string;
    staffMember?: StaffMemberPayload;
}

export default function StaffMemberForm({
    action,
    method,
    parentOptions,
    submitLabel,
    staffMember,
}: StaffMemberFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<{
        parent_id: string;
        email: string;
        phone: string;
        photo: File | null;
        is_leadership: boolean;
        is_published: boolean;
        sort_order: number;
        translations: Record<string, {
            full_name: string;
            job_title: string;
            department: string;
            biography: string;
        }>;
    }>({
        parent_id: staffMember?.parent_id ? String(staffMember.parent_id) : '',
        email: staffMember?.email ?? '',
        phone: staffMember?.phone ?? '',
        photo: null,
        is_leadership: staffMember?.is_leadership ?? false,
        is_published: staffMember?.is_published ?? true,
        sort_order: staffMember?.sort_order ?? 0,
        translations: staffMember?.translations ?? {
            en: { full_name: '', job_title: '', department: '', biography: '' },
            ru: { full_name: '', job_title: '', department: '', biography: '' },
            tj: { full_name: '', job_title: '', department: '', biography: '' },
        },
    });

    function handleTranslationChange(lang: string, field: string, value: string): void {
        setData('translations', {
            ...data.translations,
            [lang]: {
                ...data.translations[lang],
                [field]: value,
            },
        });
    }

    function submit(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (method === 'put') {
            put(action);

            return;
        }

        post(action);
    }

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="parent_id">Reports to</Label>
                    <select
                        id="parent_id"
                        value={data.parent_id}
                        onChange={(event) => setData('parent_id', event.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="">Top level</option>
                        {parentOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.translations.find((translation) => translation.language === 'en')?.full_name
                                    ?? option.translations[0]?.full_name
                                    ?? `#${option.id}`}
                            </option>
                        ))}
                    </select>
                    {errors.parent_id && <p className="text-sm text-destructive">{errors.parent_id}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="sort_order">Sort order</Label>
                    <Input
                        id="sort_order"
                        type="number"
                        min={0}
                        value={data.sort_order}
                        onChange={(event) => setData('sort_order', Number(event.target.value))}
                    />
                    {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        value={data.phone}
                        onChange={(event) => setData('phone', event.target.value)}
                    />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="photo">Photo</Label>
                    <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(event) => setData('photo', event.target.files?.[0] ?? null)}
                    />
                    {staffMember?.photo_path && ! data.photo && (
                        <p className="text-sm text-muted-foreground">Current photo is already uploaded.</p>
                    )}
                    {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                </div>
            </div>

            <div className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                <label className="flex items-start gap-3">
                    <Checkbox
                        checked={data.is_leadership}
                        onCheckedChange={(checked) => setData('is_leadership', checked === true)}
                    />
                    <span>
                        <span className="block text-sm font-medium">Leadership</span>
                        <span className="block text-sm text-muted-foreground">
                            Highlight this profile in the leadership section.
                        </span>
                    </span>
                </label>

                <label className="flex items-start gap-3">
                    <Checkbox
                        checked={data.is_published}
                        onCheckedChange={(checked) => setData('is_published', checked === true)}
                    />
                    <span>
                        <span className="block text-sm font-medium">Published</span>
                        <span className="block text-sm text-muted-foreground">
                            Unpublished staff stay in admin only.
                        </span>
                    </span>
                </label>
            </div>

            <div className="space-y-2">
                <Label>Translations</Label>
                <TranslationTabs
                    fields={[
                        { name: 'full_name', label: 'Full name', type: 'input', required: true },
                        { name: 'job_title', label: 'Job title', type: 'input', required: true },
                        { name: 'department', label: 'Department', type: 'input' },
                        { name: 'biography', label: 'Biography', type: 'textarea' },
                    ]}
                    data={data.translations}
                    onChange={handleTranslationChange}
                    errors={errors}
                />
            </div>

            <div className="flex gap-3">
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving…' : submitLabel}
                </Button>
                <Button type="button" variant="outline" onClick={() => history.back()}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
