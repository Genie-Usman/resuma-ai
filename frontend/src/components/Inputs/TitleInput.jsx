import { useState } from 'react'
import { LuCheck, LuPencil } from "react-icons/lu"

const TitleInput = ({ title, setTitle }) => {
    const [showInput, setShowInput] = useState(false);
    return (
        <div className='flex items-center gap-2 min-w-0 max-w-full'>
            {showInput ? (
                <>
                    <input
                        type="text"
                        placeholder='Resume Title'
                        className='text-sm md:text-base bg-transparent outline-none text-slate-800 font-semibold border-b border-purple-500 pb-0.5 min-w-[120px] max-w-[240px]'
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') setShowInput(false);
                        }}
                    />

                    <button className='cursor-pointer text-purple-600 hover:text-purple-700 p-0.5' title="Confirm title">
                        <LuCheck
                            className='text-base'
                            onClick={() => setShowInput(false)}
                        />
                    </button>
                </>
            ) : (
                <>
                    <h2
                        className='text-sm md:text-base font-semibold text-slate-800 truncate'
                        title={title}
                    >
                        {title}
                    </h2>
                    <button
                        className='cursor-pointer text-slate-400 hover:text-purple-600 p-0.5 transition-colors shrink-0'
                        title="Edit title"
                        onClick={() => setShowInput(true)}
                    >
                        <LuPencil className='text-sm' />
                    </button>
                </>
            )}
        </div>
    )
}

export default TitleInput
