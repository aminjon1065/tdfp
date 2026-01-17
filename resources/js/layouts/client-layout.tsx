import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

import { BVIPanel } from '@/components/bvi/bvi-panel';
import Footer from '@/components/footer';
import Header from '@/components/header';
import TopBar from '@/components/top-bar';
import { BVIProvider } from '@/providers/bvi-provider';
import '../../css/bvi.css';

const ClientLayout = ({ children }: PropsWithChildren) => {
    return (
        <BVIProvider>
            <div className="min-h-screen bg-white font-sans text-slate-900">
                <Head title="Основы цифровизации Таджикистана" />
                <BVIPanel />
                <TopBar />
                <Header />
                {children}
                <Footer />
            </div>
        </BVIProvider>
    );
};

export default ClientLayout;
