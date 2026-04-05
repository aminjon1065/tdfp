import logo from '@/assets/img/logo_200.webp';
const Logo = () => {
    return (
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white">
            <img src={logo} alt="Logo" className={'h-10 w-10'} />
        </div>
    );
};

export default Logo;
