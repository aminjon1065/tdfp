import {
    ArrowRight,
    Building2,
    FileText,
    LayoutGrid,
    Users,
} from 'lucide-react';

import backgroundImg from '@/assets/img/background.jpg';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ClientLayout from '@/layouts/client-layout';
const Home = () => {
    return (
        <ClientLayout>
            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-slate-900 py-20 md:py-32">
                    <div className="absolute inset-0 opacity-20">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${backgroundImg})` }}
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/90 to-transparent" />
                    </div>
                    <div className="relative z-10 container mx-auto px-4">
                        <div className="max-w-3xl">
                            <div className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-sm">
                                <span className="mr-2 flex h-2 w-2 animate-pulse rounded-full bg-blue-500"></span>
                                Цифровая трансформация
                            </div>
                            <h1 className="mb-6 text-4xl leading-tight font-bold text-white md:text-6xl">
                                Основы цифровизации <br />
                                <span className="text-blue-500">
                                    Таджикистана
                                </span>
                            </h1>
                            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                                Единая платформа для развития цифровой
                                экономики, внедрения инновационных технологий и
                                повышения качества жизни граждан.
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="bg-blue-600 px-8 text-base hover:bg-blue-700"
                                >
                                    Наши проекты
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="px-8 text-base"
                                >
                                    Узнать больше
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Access Grid */}
                <section className="relative z-20 -mt-10 bg-slate-50 py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    icon: FileText,
                                    title: 'Госуслуги',
                                    desc: 'Портал государственных услуг',
                                },
                                {
                                    icon: Building2,
                                    title: 'Бизнес',
                                    desc: 'Регистрация и поддержка',
                                },
                                {
                                    icon: Users,
                                    title: 'Гражданам',
                                    desc: 'Социальная поддержка',
                                },
                                {
                                    icon: LayoutGrid,
                                    title: 'Реестры',
                                    desc: 'Открытые данные',
                                },
                            ].map((item, i) => (
                                <Card
                                    key={i}
                                    className="group cursor-pointer border-none shadow-md transition-all duration-300 hover:shadow-xl"
                                >
                                    <CardContent className="flex items-start gap-4 p-6">
                                        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="mb-1 text-lg font-semibold text-slate-900">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* News Section */}
                <section className="bg-white py-16">
                    <div className="container mx-auto px-4">
                        <div className="mb-10 flex items-end justify-between">
                            <div>
                                <h2 className="mb-2 text-3xl font-bold text-slate-900">
                                    Новости и события
                                </h2>
                                <p className="text-slate-500">
                                    Последние обновления в сфере цифровизации
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                className="hidden text-blue-600 hover:bg-blue-50 hover:text-blue-700 sm:flex"
                            >
                                Все новости
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                {
                                    date: '12 Октября 2023',
                                    title: 'Запуск нового портала электронного правительства',
                                    desc: 'Теперь граждане могут получать более 50 услуг онлайн без посещения ведомств.',
                                    tag: 'Госуслуги',
                                },
                                {
                                    date: '10 Октября 2023',
                                    title: 'Конференция Digital Tajikistan 2023',
                                    desc: 'Ведущие эксперты обсудили будущее цифровой экономики страны.',
                                    tag: 'Мероприятия',
                                },
                                {
                                    date: '05 Октября 2023',
                                    title: 'Новые IT-парки в регионах',
                                    desc: 'Открытие центров разработки и обучения в Худжанде и Бохтаре.',
                                    tag: 'Инфраструктура',
                                },
                            ].map((news, i) => (
                                <div key={i} className="group cursor-pointer">
                                    <div className="relative mb-4 aspect-video overflow-hidden rounded-xl bg-slate-100">
                                        <div className="absolute inset-0 bg-slate-200 transition-transform duration-500 group-hover:scale-105" />
                                        <div className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-blue-700 backdrop-blur">
                                            {news.tag}
                                        </div>
                                    </div>
                                    <div className="mb-2 text-sm text-slate-500">
                                        {news.date}
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                        {news.title}
                                    </h3>
                                    <p className="line-clamp-2 text-slate-600">
                                        {news.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            className="mt-8 w-full sm:hidden"
                        >
                            Все новости
                        </Button>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="bg-slate-900 py-20 text-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
                            {[
                                { number: '500+', label: 'Электронных услуг' },
                                { number: '2M+', label: 'Пользователей' },
                                { number: '95%', label: 'Охват интернетом' },
                                { number: '24/7', label: 'Поддержка' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="mb-2 text-4xl font-bold text-blue-500 md:text-5xl">
                                        {stat.number}
                                    </div>
                                    <div className="font-medium text-slate-400">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Useful Links */}
                <section className="bg-slate-50 py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="mb-8 text-2xl font-bold text-slate-900">
                            Полезные ресурсы
                        </h2>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
                            {[1, 2, 3, 4, 5, 6].map((_, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="flex items-center justify-center rounded-lg border bg-white p-6 opacity-70 grayscale transition-all hover:border-blue-300 hover:opacity-100 hover:shadow-md hover:grayscale-0"
                                >
                                    <div className="h-8 w-24 rounded bg-slate-200"></div>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </ClientLayout>
    );
};

export default Home;
