import { FiGithub } from "react-icons/fi";

const Footer = () => {
    return (
        <div className="text-sm bg-gray-50 text-gray-600 text-center py-4 mt-5">
            <div className="flex justify-center items-center gap-2">
                <span>Made by Usman. Visit</span>
                <a
                    href="https://github.com/Genie-Usman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-black transition-colors"
                >
                    <FiGithub className="w-4 h-4" />
                </a>
            </div>
        </div>
    )
}

export default Footer
