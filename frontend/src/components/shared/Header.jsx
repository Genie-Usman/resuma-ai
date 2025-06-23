import { useContext } from "react"
import { Link } from "react-router-dom"
import { UserContext } from "../../context/userContext"

// Assets
import LOGO from "../../assets/logo.svg"

// Components
import ProfileInfoCard from "../Cards/ProfileInfoCard"

const Header = () => {
    const { user } = useContext(UserContext);

    return (
        <header className='flex justify-between items-center mb-16'>
            <div>
                {/* Image */}
                <img src={LOGO} alt="logo" className='w-[150px]' />
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
