import React, { useState, useEffect } from 'react';
import SliderComponent from './NumberSlider';
import ImageComponent from './ImageComponent';
// import NumberChooser from './NumberPicker';
// import { MapInteractionCSS } from 'react-map-interaction';

type ImageData = {
    RID: string;
    URL: string;
    Filename: string;
    Length: number;
    Image: number;
    "Cup/Disk_Ratio": number;
    "Image_Quality_Vocab": string;
    "Image_Quality_Vocab.Name": string;
    "Diagnosis_Image_Vocab": string;
    "Diagnosis_Image_Vocab.Name": string;
    "Image_Output": string;
    "Image_Output.Name": string;
    "Image_Side_Vocab": string;
    "Image_Side_Vocab.Name": string;
    Comments?: string; // Optional Comments field
};

type Props = {
    jsonData: ImageData[];
};
const DetailsComponent = ({ jsonData }: Props) => {
    // const url = "https://blogs.smithsonianmag.com/smartnews/files/2012/11/544f0cc8686bd978ffa143777db1f287.jpeg";
    //Cup/Disk_Ratio
    const dropdown1 = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    //Image_Quality_Vocab.Name
    const dropdown2 = ["Good", "Bad"]
    //Diagnosis_Image_Vocab.Name
    const dropdown3 = ["No Glaucoma", "Suspected Glaucoma"]

    const numberMax = jsonData.length;
    const handleSliderChange = (value: number) => {
        setCurrentIndex(value - 1);
    };

    const [currentIndex, setCurrentIndex] = useState(0);
    const currentObject = jsonData[currentIndex];

    // const [imageUrl, setImageUrl] = useState('http://localhost:3001' + currentObject['URL']);
    const [imageUrl, setImageUrl] = useState('https://dev.eye-ai.org' + currentObject['URL']);
    const [selectedValue1, setSelectedValue1] = useState(currentObject['Cup/Disk_Ratio']);
    const [selectedValue2, setSelectedValue2] = useState(currentObject['Image_Quality_Vocab.Name']);
    const [selectedValue3, setSelectedValue3] = useState(currentObject['Diagnosis_Image_Vocab.Name']);
    const [comments, setComments] = useState(currentObject['Comments']);

    const [isPanelVisible, setPanelVisibility] = useState(true);


    useEffect(() => {
        // setImageUrl('http://localhost:3001' + currentObject['URL']);
        setImageUrl('https://dev.eye-ai.org' + currentObject['URL']);
        setSelectedValue1(currentObject['Cup/Disk_Ratio']);
        setSelectedValue2(currentObject['Image_Quality_Vocab.Name']);
        if (currentObject['Diagnosis_Image_Vocab.Name'] === '') {
            // console.log("initial value3")
            const initialValue3 = currentObject['Cup/Disk_Ratio'] > 0.7 ? "Suspected Glaucoma" : "No Glaucoma";
            currentObject['Diagnosis_Image_Vocab.Name'] = initialValue3;
            setSelectedValue3(initialValue3);
        } else {
            setSelectedValue3(currentObject['Diagnosis_Image_Vocab.Name']);
        }
        setComments(currentObject['Comments']);
    }, [currentObject]);


    const showNextObject = () => {
        saveAndShowData();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % jsonData.length);
        // setPanelVisibility(false);
    };

    const showPreviousObject = () => {
        saveAndShowData();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? jsonData.length - 1 : prevIndex - 1);
        // setPanelVisibility(false);
    };

    const saveAndShowData = () => {
        jsonData[currentIndex]['Cup/Disk_Ratio'] = selectedValue1;
        jsonData[currentIndex]['Image_Quality_Vocab.Name'] = selectedValue2;
        jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'] = selectedValue3;
        if (comments === undefined) {
            delete jsonData[currentIndex]['Comments'];
        } else {
            jsonData[currentIndex]['Comments'] = comments;
        }

        console.log("#current ", currentIndex);
        console.log("#1:", jsonData[currentIndex]['Cup/Disk_Ratio'])
        console.log("#2:", jsonData[currentIndex]['Image_Quality_Vocab.Name'])
        console.log("#3:", jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'])
        if (comments) {
            console.log("4:", jsonData[currentIndex]['Comments'])
        }
    }
    //#1-0.8-no
    //#2-0.9-no
    const handleValue1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValueStr = event.target.value;
        const selectedValue = parseFloat(selectedValueStr);
        setSelectedValue1(selectedValue);

        console.log("value1 change:", event.target.value);

        const updatedValue3 = selectedValue > 0.7 ? "Suspected Glaucoma" : "No Glaucoma";
        setSelectedValue3(updatedValue3);
        console.log("value1(", selectedValue, ")updates value3(", selectedValue3, ")");

        if ((selectedValue <= 0.7 && updatedValue3 === "No Glaucoma") || (selectedValue > 0.7 && updatedValue3 === "Suspected Glaucoma")) {
            console.log("no comments.")
            setComments(undefined);

        } else {
            console.log("add comments!")
            setComments('');
        }
    }

    const handleValue2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedValue2(selectedValue);

        console.log("value2 change:", event.target.value);
    }

    const handleValue3Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedValue3(selectedValue);

        console.log("value3 change:", selectedValue);

        console.log("value3 updates comments(", selectedValue, ")");
        if ((selectedValue1 > 0.7 && selectedValue === "No Glaucoma") || (selectedValue1 <= 0.7 && selectedValue === "Suspected Glaucoma")) {
            console.log("add comments!");
            if (currentObject['Comments'] === undefined) {
                setComments('');
            } else if (currentObject['Comments'] !== '') {
                setComments(currentObject['Comments']);
            } else {
                setComments('');
            }

        } else {
            console.log("no comments.")
            setComments(undefined);
        }

        // console.log("value3 updates comments(", selectedValue, ")");
        // if ((selectedValue1 > 0.7 && selectedValue == "No Glaucoma") | (selectedValue1 <= 0.7 && selectedValue == "Suspected Glaucoma")) {
        //     console.log("add comments!")
        //     setComments('');
        // } else {
        //     console.log("no comments.")
        //     setComments(undefined);
        // }
    }

    const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedComments = event.target.value;
        setComments(updatedComments);

        console.log("comments change:", updatedComments);
    };

    const handleShowPanel = () => {
        setPanelVisibility(true);
    }



    // const props = { width: 400, scale: 1.8, zoomPosition: "original", zoomWidth: 300, img: { imageUrl }, height: 300 };


    return (

        <div className='container-box'>


            <div className="container">
                <div className="group">
                    <div className='vertical-items'>
                        <button className='chaise-btn chaise-btn-primary' onClick={handleShowPanel}>
                            {currentIndex + 1}/{jsonData.length}
                        </button>
                        <SliderComponent maxNum={numberMax} onSelect={handleSliderChange} value={currentIndex
                            + 1} />
                        {/* {isPanelVisible && (
                            <SliderComponent maxNum={numberMax} onSelect={handleSliderChange} value={currentIndex
                                + 1} />
                            // <NumberChooser data={numbers} onSelect={handleSelect} />
                        )} */}
                    </div>



                    <button className='chaise-btn chaise-btn-primary' onClick={showPreviousObject}>Previous</button>
                    <button className='chaise-btn chaise-btn-primary' onClick={showNextObject}>Next</button>


                </div>
                <table className="center">
                    <tbody>
                        <tr key="image">
                            <td></td>
                            <td>
                                <div className='image-container'>
                                    {/* <MapInteractionCSS>
                                    <img src={imageUrl} />
                                </MapInteractionCSS> */}
                                    <ImageComponent imageUrl={imageUrl} />
                                    {/* <img className='myImage' src={imageUrl} alt='eye-ball' /> */}
                                    {/* <Zoom
                                    img={imageUrl}
                                    zoomScale={3}
                                    width={300}
                                    height={300}
                                /> */}
                                </div>

                                {/* <ThingMap url={imageUrl} /> */}

                                {/* <ReactImageZoom {...props} alt="Image" class="image-class" scale="1.8" /> */}
                                {/* <ImageZoom imageUrl={imageUrl} /> */}
                                {/* <img src={imageUrl} alt="Placeholder" class="image-class" /> */}
                            </td>
                        </tr>
                        <tr key="Cup/Disk_Ratio">
                            <td>Cup/Disk_Ratio</td>
                            <td>
                                <select className='chaise-input-group' value={selectedValue1} onChange={handleValue1Change}>
                                    {dropdown1.map((option) => (
                                        <option key={option} value={option}>
                                            {/* {option === selectedValue2 ? `${option}` : option} */}
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                        <tr key="Diagnosis">
                            <td>Diagnosis</td>
                            <td>
                                <select className='chaise-input-group' value={selectedValue3} onChange={handleValue3Change}>
                                    {dropdown3.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                        <tr key="Image_Quality">
                            <td>Image_Quality</td>
                            <td>
                                <select className='chaise-input-group' value={selectedValue2} onChange={handleValue2Change}>
                                    {dropdown2.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>

                        {comments !== undefined && (
                            <>
                                <tr key="Comment">
                                    <td>Comments</td>
                                    <td>
                                        <textarea placeholder="Explain your decision here ..." value={comments}
                                            onChange={handleTextareaChange}></textarea>
                                    </td>
                                </tr>
                            </>
                        )}


                    </tbody>
                </table>
                {/* <div className="group">
                    <button onClick={showNextObject}>Next</button>
                </div> */}
            </div>
        </div>


    );
}

export default DetailsComponent;