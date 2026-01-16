import footerBackground from '@/assets/img/footer.svg';
import { Globe, HelpCircle, MapPin, Phone } from 'lucide-react';
const Footer = () => {
    return (
        <footer className="border-t bg-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="mb-6 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 text-white">
                                <Globe className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold text-slate-900">
                                DIGITAL TAJIKISTAN
                            </span>
                        </div>
                        <p className="mb-6 text-slate-500">
                            Официальный портал по вопросам цифровизации и
                            развития информационных технологий.
                        </p>
                        <div className="flex gap-4">
                            {[1, 2, 3].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-blue-600 hover:text-white"
                                >
                                    <Globe className="h-5 w-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold text-slate-900">
                            Организация
                        </h4>
                        <ul className="space-y-4 text-slate-500">
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    О нас
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Руководство
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Структура
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Вакансии
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold text-slate-900">
                            Деятельность
                        </h4>
                        <ul className="space-y-4 text-slate-500">
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Проекты
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Документы
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Статистика
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-blue-600">
                                    Открытые данные
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-6 font-bold text-slate-900">
                            Контакты
                        </h4>
                        <ul className="space-y-4 text-slate-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 shrink-0 text-blue-600" />
                                <span>г. Душанбе, пр. Рудаки, 1</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 shrink-0 text-blue-600" />
                                <span>+992 (37) 221-00-00</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HelpCircle className="h-5 w-5 shrink-0 text-blue-600" />
                                <span>info@digital.tj</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-slate-500 md:flex-row">
                    <div>
                        © {`${new Date().getFullYear()}`} Основы цифровизации Таджикистана. Все права
                        защищены.
                    </div>
                    <div>
                        <img className={'w-150'} src={footerBackground} />
                    </div>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-900">
                            Политика конфиденциальности
                        </a>
                        <a href="#" className="hover:text-slate-900">
                            Условия использования
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
