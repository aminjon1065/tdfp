import { Link } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';

import NishonLogo from '@/components/nishon-logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
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
                        <Link
                            href="/"
                            prefetch
                            className="flex shrink-0 items-center gap-3"
                        >
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
                                        <Link
                                            href="/about"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            О нас
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link
                                            href="/projects"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Проекты
                                        </Link>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <Link
                                            href="/activities"
                                            prefetch
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Мероприятия
                                        </Link>
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
                            href="/projects"
                            prefetch
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Проекты
                        </Link>
                        <Link
                            href="/activities"
                            prefetch
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Мероприятия
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
