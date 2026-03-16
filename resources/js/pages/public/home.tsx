import PublicLayout from '@/layouts/public-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, MessageCircle, ShoppingBag, ChevronRight } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';

interface Props {
    latestNews: any[];
    activities: any[];
    latestDocuments: any[];
    openProcurements: any[];
    settings: Record<string, string>;
}

export default function Home({ latestNews, activities, latestDocuments, openProcurements, settings }: Props) {
    const locale = (usePage().props as any).locale ?? 'en';
    return (
        <PublicLayout title="Home">
            <Head title="Home | PIC TDFP" />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 py-24 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl">
                        <Badge className="mb-4 bg-blue-600 text-white">World Bank Funded Project</Badge>
                        <h1 className="mb-6 text-4xl font-bold leading-tight sm:text-5xl">
                            Tajikistan Digital Foundations Project
                        </h1>
                        <p className="mb-8 text-lg text-blue-100">
                            Strengthening Tajikistan's digital infrastructure through government e-services, digital authentication, cybersecurity and digital skills development.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                                <Link href="/project">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
                                <Link href="/grm/submit">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Submit Complaint
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-blue-800 py-8 text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
                        {[
                            { label: 'Project Components', value: '10+' },
                            { label: 'Budget (USD)', value: '$40M' },
                            { label: 'Activities', value: activities.length.toString() },
                            { label: 'Documents', value: latestDocuments.length.toString() + '+' },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <div className="text-sm text-blue-200">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Activities */}
            {activities.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Project Activities</h2>
                            <Link href="/activities" className="flex items-center text-sm text-blue-700 hover:underline">
                                View all <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {activities.slice(0, 6).map((activity) => {
                                const t = getTranslation(activity, locale);
                                return (
                                    <Card key={activity.id} className="hover:shadow-md transition-shadow">
                                        <CardHeader className="pb-2">
                                            <div className="flex items-center justify-between">
                                                <Badge variant={activity.status === 'in_progress' ? 'default' : 'secondary'}>
                                                    {activity.status?.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <CardTitle className="text-base mt-2">{t.title ?? 'Activity'}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500 line-clamp-2">{t.description}</p>
                                            <Link href={`/activities/${activity.slug}`} className="mt-3 flex items-center text-sm text-blue-700 hover:underline">
                                                Read more <ChevronRight className="ml-1 h-3 w-3" />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Latest News */}
            {latestNews.length > 0 && (
                <section className="bg-gray-50 py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
                            <Link href="/news" className="flex items-center text-sm text-blue-700 hover:underline">
                                View all <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {latestNews.slice(0, 3).map((item) => {
                                const t = getTranslation(item, locale);
                                return (
                                    <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        {item.featured_image && (
                                            <div className="aspect-video bg-gray-200 overflow-hidden">
                                                <img
                                                    src={`/storage/${item.featured_image}`}
                                                    alt={t.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <CardHeader className="pb-2">
                                            {item.category && (
                                                <Badge variant="outline" className="w-fit text-xs">{item.category.name}</Badge>
                                            )}
                                            <CardTitle className="text-base leading-snug">{t.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500 line-clamp-2">{t.summary}</p>
                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs text-gray-400">
                                                    {item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}
                                                </span>
                                                <Link href={`/news/${item.slug}`} className="text-sm text-blue-700 hover:underline">
                                                    Read more
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Procurement + Documents */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid gap-8 lg:grid-cols-2">
                        {/* Open Procurements */}
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-blue-700" />
                                    Open Procurement
                                </h2>
                                <Link href="/procurement" className="text-sm text-blue-700 hover:underline">View all</Link>
                            </div>
                            <div className="space-y-3">
                                {openProcurements.map((item) => {
                                    const t = getTranslation(item, locale);
                                    return (
                                        <div key={item.id} className="rounded-lg border p-4 hover:border-blue-300 transition-colors">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-sm">{t.title ?? 'Untitled'}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.reference_number}</p>
                                                </div>
                                                <Badge className="shrink-0">Open</Badge>
                                            </div>
                                            {item.deadline && (
                                                <p className="mt-2 text-xs text-orange-600">
                                                    Deadline: {new Date(item.deadline).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                                {openProcurements.length === 0 && (
                                    <p className="text-sm text-gray-500">No open procurement notices.</p>
                                )}
                            </div>
                        </div>

                        {/* GRM Shortcut */}
                        <div className="rounded-xl bg-orange-50 border border-orange-200 p-6">
                            <MessageCircle className="h-10 w-10 text-orange-600 mb-4" />
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Grievance Redress Mechanism</h2>
                            <p className="text-sm text-gray-600 mb-6">
                                Have concerns about project implementation? Submit a complaint or track an existing case through our transparent GRM system.
                            </p>
                            <div className="flex gap-3">
                                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                                    <Link href="/grm/submit">Submit Complaint</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href="/grm/track">Track Case</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
