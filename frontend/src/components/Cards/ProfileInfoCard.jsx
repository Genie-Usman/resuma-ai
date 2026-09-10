import { useContext } from "react"
import { UserContext } from "../../context/userContext"
import { useNavigate } from "react-router-dom";


const ProfileInfoCard = () => {
    const { user, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate('/')
    }

    return user && (
        <div className="flex items-center">

            {/* Image */}
            {user.profileImageURL ? (
                <img 
                    src={user.profileImageURL} 
                    alt={user.name || "User"} 
                    className="w-11 h-11 bg-gray-300 rounded-full mr-3 object-cover"
                />
            ) : (
                <div className="w-11 h-11 bg-purple-100 text-purple-700 font-bold rounded-full mr-3 flex items-center justify-center text-sm select-none">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
            )}

            <div>
                {/* User Name */}
                <div className="text-[15px] font-bold leading-3">{user.name || ''}</div>
                {/* Logout Button */}
                <button
                className="text-purple-500 text-sm font-semibold cursor-pointer hover:underline"
                onClick={handleLogout}
                >
                    Logout
                </button>
            </div>

        </div>
    )
}

export default ProfileInfoCard
