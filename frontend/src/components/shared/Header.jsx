import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../../context/userContext"

// Assets
import LOGO from "../../assets/logo.svg"

// Components
import ProfileInfoCard from "../Cards/ProfileInfoCard"

const Header = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    return (
        <header className='flex justify-between items-center mb-16 mx-0 pr-2 md:pr-0 md:mx-4'>
            <div>
                {/* Image */}
                <img src={LOGO} alt="logo" className='w-[150px] cursor-pointer' onClick={() => navigate('/')} />
            </div>
            {/* Account Button */}
            {user ? <ProfileInfoCard /> : <Link
                className='bg-purple-100 text-sm font-semibold text-black px-7 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition-colors cursor-pointer'
                to='/auth/login'
            >
                Login
            </Link>}
        </header>
    )
}

export default Header
