import { useContext } from 'react'
import { UserContext } from '../../context/userContext';

// Components
import Header from '../shared/Header';

const DashboardLayout = ({ activeMenu, children }) => {
    const { user } = useContext(UserContext);
    return (
        <div className='container mx-auto px-4 py-6'>
            <Header activeMenu={activeMenu} />
            {/* Header */}
                
            {user && <div className='container mx-auto pt-4 pb-4'>{children}</div>}
        </div>
    )
}

export default DashboardLayout
