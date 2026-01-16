import nishon from '@/assets/img/nishon.png';

const NishonLogo = () => {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white">
            <img src={nishon} alt="Nishon" className={'h-10 w-10'} />
        </div>
    );
};

export default NishonLogo;
