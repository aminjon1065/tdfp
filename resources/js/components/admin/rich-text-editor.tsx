import { usePage } from '@inertiajs/react';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import {
    Table,
    TableCell,
    TableHeader,
    TableRow,
} from '@tiptap/extension-table';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    Bold,
    Heading2,
    ImagePlus,
    Italic,
    Link2,
    List,
    ListOrdered,
    Quote,
    Redo2,
    Table2,
    Underline as UnderlineIcon,
    Undo2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { t } from '@/lib/i18n';
import { SharedData } from '@/types';

interface RichTextEditorProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
}

export function RichTextEditor({ id, value, onChange }: RichTextEditorProps) {
    const [previewMode, setPreviewMode] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [imageAlt, setImageAlt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUploadError, setImageUploadError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const { csrf_token: csrfToken, locale } = usePage<
        SharedData & { csrf_token?: string }
    >().props;
    const currentLocale = locale ?? 'en';

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                defaultProtocol: 'https',
            }),
            Image.configure({
                allowBase64: false,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'min-h-[220px] rounded-b-md border border-t-0 border-input bg-background px-4 py-3 text-sm focus:outline-none prose prose-slate max-w-none',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const currentHtml = editor.getHTML();

        if (currentHtml !== value) {
            editor.commands.setContent(value, {
                emitUpdate: false,
            });
        }
    }, [editor, value]);

    function openLinkDialog(): void {
        setLinkUrl(editor?.getAttributes('link').href ?? '');
        setLinkDialogOpen(true);
    }

    function saveLink(): void {
        if (!editor) {
            return;
        }

        const sanitizedUrl = linkUrl.trim();

        if (sanitizedUrl === '') {
            editor.chain().focus().unsetLink().run();
        } else {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: sanitizedUrl })
                .run();
        }

        setLinkDialogOpen(false);
    }

    async function insertImage(): Promise<void> {
        if (!editor) {
            return;
        }

        setImageUploadError('');

        if (imageFile) {
            setUploadingImage(true);

            const formData = new FormData();
            formData.append('image', imageFile);

            if (imageAlt.trim() !== '') {
                formData.append('alt', imageAlt.trim());
            }

            if (csrfToken) {
                formData.append('_token', csrfToken);
            }

            const response = await fetch('/admin/media/editor-image', {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            const payload = await response.json();

            setUploadingImage(false);

            if (!response.ok) {
                const firstError = payload?.errors
                    ? Object.values(payload.errors)[0]
                    : null;

                setImageUploadError(
                    Array.isArray(firstError)
                        ? String(firstError[0])
                        : t(currentLocale, 'admin.form.imageUploadFailed'),
                );

                return;
            }

            editor
                .chain()
                .focus()
                .setImage({
                    src: payload.url,
                    alt: imageAlt.trim(),
                })
                .run();
        } else if (imageUrl.trim() !== '') {
            editor
                .chain()
                .focus()
                .setImage({
                    src: imageUrl.trim(),
                    alt: imageAlt.trim(),
                })
                .run();
        } else {
            setImageUploadError(
                t(currentLocale, 'admin.form.imageSourceRequired'),
            );

            return;
        }

        setImageDialogOpen(false);
        setImageUrl('');
        setImageAlt('');
        setImageFile(null);
    }

    const toolbarButtons = [
        {
            label: 'Bold',
            icon: Bold,
            action: () => editor?.chain().focus().toggleBold().run(),
            active: editor?.isActive('bold') ?? false,
        },
        {
            label: 'Italic',
            icon: Italic,
            action: () => editor?.chain().focus().toggleItalic().run(),
            active: editor?.isActive('italic') ?? false,
        },
        {
            label: 'Underline',
            icon: UnderlineIcon,
            action: () => editor?.chain().focus().toggleUnderline().run(),
            active: editor?.isActive('underline') ?? false,
        },
        {
            label: 'Heading',
            icon: Heading2,
            action: () =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run(),
            active: editor?.isActive('heading', { level: 2 }) ?? false,
        },
        {
            label: 'Bullet list',
            icon: List,
            action: () => editor?.chain().focus().toggleBulletList().run(),
            active: editor?.isActive('bulletList') ?? false,
        },
        {
            label: 'Ordered list',
            icon: ListOrdered,
            action: () => editor?.chain().focus().toggleOrderedList().run(),
            active: editor?.isActive('orderedList') ?? false,
        },
        {
            label: 'Quote',
            icon: Quote,
            action: () => editor?.chain().focus().toggleBlockquote().run(),
            active: editor?.isActive('blockquote') ?? false,
        },
        {
            label: 'Link',
            icon: Link2,
            action: openLinkDialog,
            active: editor?.isActive('link') ?? false,
        },
        {
            label: 'Image',
            icon: ImagePlus,
            action: () => setImageDialogOpen(true),
            active: false,
        },
        {
            label: 'Table',
            icon: Table2,
            action: () =>
                editor
                    ?.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run(),
            active: editor?.isActive('table') ?? false,
        },
    ];

    return (
        <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-input bg-muted/30 p-2">
                <div className="flex flex-wrap items-center gap-1">
                    {toolbarButtons.map((button) => {
                        const Icon = button.icon;

                        return (
                            <Button
                                key={button.label}
                                type="button"
                                variant={button.active ? 'default' : 'outline'}
                                size="sm"
                                onClick={button.action}
                                disabled={!editor || previewMode}
                                aria-label={button.label}
                            >
                                <Icon className="h-4 w-4" />
                            </Button>
                        );
                    })}

                    <div className="mx-1 h-6 w-px bg-border" />

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().undo().run()}
                        disabled={
                            !editor?.can().chain().focus().undo().run() ||
                            previewMode
                        }
                        aria-label="Undo"
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => editor?.chain().focus().redo().run()}
                        disabled={
                            !editor?.can().chain().focus().redo().run() ||
                            previewMode
                        }
                        aria-label="Redo"
                    >
                        <Redo2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="inline-flex rounded-md border bg-background p-1">
                    <button
                        type="button"
                        className="rounded px-2.5 py-1 text-xs font-medium data-[active=true]:bg-muted"
                        data-active={!previewMode}
                        onClick={() => setPreviewMode(false)}
                    >
                        {t(currentLocale, 'admin.form.write')}
                    </button>
                    <button
                        type="button"
                        className="rounded px-2.5 py-1 text-xs font-medium data-[active=true]:bg-muted"
                        data-active={previewMode}
                        onClick={() => setPreviewMode(true)}
                    >
                        {t(currentLocale, 'admin.form.previewTab')}
                    </button>
                </div>
            </div>

            {!previewMode ? (
                <div id={id}>
                    <EditorContent editor={editor} />
                </div>
            ) : (
                <div
                    className="prose prose-slate min-h-[220px] max-w-none rounded-md border border-input bg-background px-4 py-3 text-sm"
                    dangerouslySetInnerHTML={{
                        __html:
                            value ||
                            `<p class="text-slate-500">${t(currentLocale, 'admin.form.nothingToPreview')}</p>`,
                    }}
                />
            )}

            <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t(currentLocale, 'admin.form.insertLink')}
                        </DialogTitle>
                        <DialogDescription>
                            {t(currentLocale, 'admin.form.linkDescription')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor={`${id}-link-url`}>
                            {t(currentLocale, 'admin.form.url')}
                        </Label>
                        <Input
                            id={`${id}-link-url`}
                            value={linkUrl}
                            onChange={(event) => setLinkUrl(event.target.value)}
                            placeholder="https://example.com"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setLinkDialogOpen(false)}
                        >
                            {t(currentLocale, 'common.cancel')}
                        </Button>
                        <Button type="button" onClick={saveLink}>
                            {t(currentLocale, 'admin.form.saveLink')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t(currentLocale, 'admin.form.insertImage')}
                        </DialogTitle>
                        <DialogDescription>
                            {t(currentLocale, 'admin.form.imageDescription')}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`${id}-image-file`}>
                                {t(currentLocale, 'admin.form.uploadImage')}
                            </Label>
                            <Input
                                id={`${id}-image-file`}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={(event) => {
                                    setImageFile(
                                        event.target.files?.[0] ?? null,
                                    );
                                    setImageUploadError('');
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`${id}-image-url`}>
                                {t(currentLocale, 'admin.form.imageUrl')}
                            </Label>
                            <Input
                                id={`${id}-image-url`}
                                value={imageUrl}
                                onChange={(event) => {
                                    setImageUrl(event.target.value);
                                    setImageUploadError('');
                                }}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`${id}-image-alt`}>
                                {t(currentLocale, 'admin.form.altText')}
                            </Label>
                            <Input
                                id={`${id}-image-alt`}
                                value={imageAlt}
                                onChange={(event) =>
                                    setImageAlt(event.target.value)
                                }
                                placeholder={t(
                                    currentLocale,
                                    'admin.form.describeImage',
                                )}
                            />
                        </div>

                        {imageUploadError && (
                            <p className="text-sm text-destructive">
                                {imageUploadError}
                            </p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setImageDialogOpen(false)}
                        >
                            {t(currentLocale, 'common.cancel')}
                        </Button>
                        <Button
                            type="button"
                            onClick={insertImage}
                            disabled={uploadingImage}
                        >
                            {uploadingImage
                                ? t(
                                      currentLocale,
                                      'admin.form.currentlyUploading',
                                  )
                                : t(currentLocale, 'admin.form.insertImage')}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
