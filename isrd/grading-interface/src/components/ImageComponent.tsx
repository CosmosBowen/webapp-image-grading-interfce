import axios from 'axios';
import { useEffect, useState } from 'react';

interface ImageComponentProps {
    imageUrl: string;
}

// const ImageComponent = (imageUrl: string) => {
const ImageComponent: React.FC<ImageComponentProps> = ({ imageUrl }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);

    useEffect(() => {
        const fetchImage = async () => {
            // const imageUrl = 'http://localhost:3001/images/scans/subject/1000355/observation/1440097/image/14360314/cee45653be1a0ad4462eb7d9f216871e.jpg';

            try {
                const response = await axios.get(imageUrl, {
                    responseType: 'blob',
                });

                // Create an object URL for the blob
                const imageSrc = URL.createObjectURL(response.data);

                setImgSrc(imageSrc);

                console.log("setImgSrc:", setImgSrc);
            } catch (error) {
                console.error('Failed to fetch image:', error);
            }
        };

        fetchImage();
    }, [imgSrc]);  // only run once on mount

    return (
        <div className='image-container'>
            {imgSrc ? <img src={imgSrc} alt="My Fetched Image" /> : 'Loading...'}
        </div>
    );
};

export default ImageComponent;
