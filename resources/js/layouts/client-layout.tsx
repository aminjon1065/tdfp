import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

import Footer from '@/components/footer';
import Header from '@/components/header';
import TopBar from '@/components/top-bar';

const ClientLayout = ({ children }: PropsWithChildren) => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <Head title="Основы цифровизации Таджикистана" />
            <TopBar />
            <Header />
            {children}
            <Footer />
        </div>
    );
};

export default ClientLayout;
