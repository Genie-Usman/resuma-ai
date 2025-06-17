import { Link } from 'react-router-dom';

// Assets
import LOGO from "../../assets/logo.svg"
import BG_AUTH from '../../assets/bg-auth.jpg';

const AuthLayout = ({ children }) => {
    return (
        <div className="flex h-screen w-screen">

            {/* Left panel (Login area) */}
            <div className="relative flex w-full flex-col justify-center gap-y-8 px-12 sm:mx-auto sm:basis-[420px] sm:px-0 lg:basis-[480px] lg:px-12">
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <img src={LOGO} alt="logo" className='w-[150px]' />
                    </Link>
                </div>

                {/* Render the (Login/SignUp) */}
                <div>
                    {children}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-x-4">
                    <hr className="flex-1" />
                    <span className="text-xs font-medium text-gray-500">
                        or continue with
                    </span>
                    <hr className="flex-1" />
                </div>
            </div>

            {/* Right panel (Image) */}
            <div className="relative hidden lg:block lg:flex-1">
                <img
                    width={1920}
                    height={1080}
                    alt="Open books on a table"
                    className="h-screen w-full object-cover object-center"
                    src={BG_AUTH}
                />
            </div>
        </div>
    );
};

export default AuthLayout;
