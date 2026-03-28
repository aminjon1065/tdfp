import { Link } from '@inertiajs/react';
import { Globe, Menu, Search } from 'lucide-react';
import { useState } from 'react';

import NishonLogo from '@/components/nishon-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-50 border-b bg-white">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between gap-8">
                        {/* Logo */}
                        <Link href="/" prefetch className="flex shrink-0 items-center gap-3">
                            <NishonLogo />
                            <div className="hidden md:block">
                                <div className="text-lg leading-none font-bold text-slate-900">
                                    DIGITAL
                                </div>
                                <div className="text-xs font-medium tracking-wider text-slate-500">
                                    TAJIKISTAN
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden flex-1 lg:block">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            О нас
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid gap-3 p-6 md:w-100 lg:w-125 lg:grid-cols-[.75fr_1fr]">
                                                <li className="row-span-3">
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-blue-600 to-blue-700 p-6 no-underline outline-none select-none focus:shadow-md"
                                                            href="/"
                                                            prefetch
                                                        >
                                                            <Globe className="h-6 w-6 text-white" />
                                                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                                                                Основы
                                                                цифровизации
                                                            </div>
                                                            <p className="text-sm leading-tight text-white/90">
                                                                Стратегия
                                                                развития
                                                                цифровой
                                                                экономики и
                                                                внедрения
                                                                инноваций.
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href="/about"
                                                            prefetch
                                                            className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-100 focus:bg-slate-100"
                                                        >
                                                            <div className="text-sm leading-none font-medium">
                                                                О центре
                                                            </div>
                                                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                                                                Информация о
                                                                руководящем
                                                                составе и структуре.
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <Link
                                                            href="/project"
                                                            prefetch
                                                            className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-100 focus:bg-slate-100"
                                                        >
                                                            <div className="text-sm leading-none font-medium">
                                                                Проект
                                                            </div>
                                                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                                                                Цели, компоненты и финансирование.
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>

                                    <NavigationMenuItem>
                                        <Link
                                            href="/news"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Новости
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link
                                            href="/documents"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Документы
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link
                                            href="/procurement"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Закупки
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link
                                            href="/contact"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Контакты
                                        </Link>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>

                        {/* Search and Actions */}
                        <div className="flex items-center gap-3">
                            <div className="relative hidden w-64 md:block">
                                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
                                <Input
                                    type="search"
                                    placeholder="Поиск по сайту..."
                                    className="w-full border-slate-200 bg-slate-50 pl-9 focus-visible:ring-blue-600"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="md:hidden"
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() =>
                                    setIsMobileMenuOpen(!isMobileMenuOpen)
                                }
                            >
                                <Menu className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>
            {isMobileMenuOpen && (
                <div className="border-b bg-white p-4 lg:hidden">
                    <nav className="flex flex-col space-y-2">
                        <Link
                            href="/about"
                            prefetch
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            О нас
                        </Link>
                        <Link
                            href="/news"
                            prefetch
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Новости
                        </Link>
                        <Link
                            href="/documents"
                            prefetch
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Документы
                        </Link>
                        <Link
                            href="/contact"
                            prefetch
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Контакты
                        </Link>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Header;
