import { useRef, useState } from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';
import uploadImage from '../../utils/uploadImage';

const ProfilePhotoSelector = ({ image, setImage, preview, setPreview, onImageUploaded }) => {
    const inputRef = useRef();
    const [previewURL, setPreviewURL] = useState(null);

    const handleImageChange = async (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage(file); // just in case needed
            const preview = URL.createObjectURL(file);
            setPreview?.(preview);
            setPreviewURL(preview);

            try {
                const response = await uploadImage(file);
                if (response?.imageUrl) {
                    onImageUploaded?.(response.imageUrl);
                }
            } catch (err) {
                console.error("Image upload failed:", err);
            }
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewURL(null);
        setPreview?.(null);
        inputRef.current.value = null;
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {!image ? (
                <div className='w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer'>
                    <LuUser className='text-4xl text-purple-500' />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={preview || previewURL}
                        alt="Profile Photo"
                        className='w-20 h-20 rounded-full object-cover'
                    />
                    <button
                        type='button'
                        className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
                        onClick={handleRemoveImage}
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoSelector;