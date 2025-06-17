import { Link } from "react-router-dom"

// Assets
import LOGO from "../../assets/logo.svg"

const Header = () => {
    return (
        <header className='flex justify-between items-center mb-16'>
            <div>
                {/* Image */}
                <img src={LOGO} alt="logo" className='w-[150px]' />
            </div>
            {/* Account Button */}
            <Link
                className='bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer'
                to='/auth/login'
            >
                Login
            </Link>
        </header>
    )
}

export default Header
