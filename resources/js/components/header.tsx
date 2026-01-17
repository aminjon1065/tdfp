import { Globe, Menu, Search, User } from 'lucide-react';
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
                        <div className="flex shrink-0 items-center gap-3">
                            <NishonLogo />
                            <div className="hidden md:block">
                                <div className="text-lg leading-none font-bold text-slate-900">
                                    DIGITAL
                                </div>
                                <div className="text-xs font-medium tracking-wider text-slate-500">
                                    TAJIKISTAN
                                </div>
                            </div>
                        </div>

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
                                                        <a
                                                            className="flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b from-blue-600 to-blue-700 p-6 no-underline outline-none select-none focus:shadow-md"
                                                            href="/"
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
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            href="#"
                                                            className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-100 focus:bg-slate-100"
                                                        >
                                                            <div className="text-sm leading-none font-medium">
                                                                Руководство
                                                            </div>
                                                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                                                                Информация о
                                                                руководящем
                                                                составе.
                                                            </p>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            href="#"
                                                            className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-100 focus:bg-slate-100"
                                                        >
                                                            <div className="text-sm leading-none font-medium">
                                                                Структура
                                                            </div>
                                                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                                                                Организационная
                                                                структура
                                                                ведомства.
                                                            </p>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                                <li>
                                                    <NavigationMenuLink asChild>
                                                        <a
                                                            href="#"
                                                            className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-100 focus:bg-slate-100"
                                                        >
                                                            <div className="text-sm leading-none font-medium">
                                                                История
                                                            </div>
                                                            <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                                                                История развития
                                                                цифровизации.
                                                            </p>
                                                        </a>
                                                    </NavigationMenuLink>
                                                </li>
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger>
                                            Проекты
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <ul className="grid w-100 gap-3 p-4 md:w-125 md:grid-cols-2 lg:w-150">
                                                {[
                                                    {
                                                        title: 'Электронное правительство',
                                                        desc: 'Цифровизация госуслуг',
                                                    },
                                                    {
                                                        title: 'Умный город',
                                                        desc: 'Технологии для городской среды',
                                                    },
                                                    {
                                                        title: 'Цифровое образование',
                                                        desc: 'Внедрение IT в школах',
                                                    },
                                                    {
                                                        title: 'Кибербезопасность',
                                                        desc: 'Защита данных и инфраструктуры',
                                                    },
                                                ].map((component) => (
                                                    <li key={component.title}>
                                                        <NavigationMenuLink
                                                            asChild
                                                        >
                                                            <a
                                                                href="#"
                                                                className="block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-slate-100 focus:bg-slate-100"
                                                            >
                                                                <div className="text-sm leading-none font-medium">
                                                                    {
                                                                        component.title
                                                                    }
                                                                </div>
                                                                <p className="line-clamp-2 text-sm leading-snug text-slate-500">
                                                                    {
                                                                        component.desc
                                                                    }
                                                                </p>
                                                            </a>
                                                        </NavigationMenuLink>
                                                    </li>
                                                ))}
                                            </ul>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a
                                            href="#"
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Новости
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a
                                            href="#"
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Документы
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a
                                            href="#"
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Обратная связь
                                        </a>
                                    </NavigationMenuItem>
                                    <NavigationMenuItem>
                                        <a
                                            href="#"
                                            className={navigationMenuTriggerStyle()}
                                        >
                                            Контакты
                                        </a>
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
                            <Button className="hidden bg-blue-600 hover:bg-blue-700 sm:flex">
                                <User className="mr-2 h-4 w-4" />
                                Кабинет
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
                        <a
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            О нас
                        </a>
                        <a
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Проекты
                        </a>
                        <a
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Новости
                        </a>
                        <a
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Документы
                        </a>
                        <a
                            href="#"
                            className="block rounded-md px-3 py-2 text-base font-medium text-slate-900 hover:bg-slate-50"
                        >
                            Контакты
                        </a>
                    </nav>
                </div>
            )}
        </>
    );
};

export default Header;
