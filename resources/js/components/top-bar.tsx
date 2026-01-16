import { MapPin, Phone } from 'lucide-react';

const TopBar = () => {
    return (
        <div className="bg-slate-900 py-2 text-xs text-white">
            <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-center gap-4">
                    <span className="flex cursor-pointer items-center gap-1 opacity-80 hover:opacity-100">
                        <MapPin className="h-3 w-3" />
                        Душанбе
                    </span>
                    <span className="hidden cursor-pointer items-center gap-1 opacity-80 hover:opacity-100 sm:flex">
                        <Phone className="h-3 w-3" />
                        +992 (37) 221-00-00
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="cursor-pointer opacity-80 hover:opacity-100">
                        Версия для слабовидящих
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="cursor-pointer font-bold">RU</span>
                        <span className="cursor-pointer opacity-50 hover:opacity-100">
                            TJ
                        </span>
                        <span className="cursor-pointer opacity-50 hover:opacity-100">
                            EN
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
