import React, { useState, useEffect, useRef } from 'react';

import SliderComponent from './NumberSlider';
import { HotKeys } from 'react-hotkeys';
import UrlParamsComponent from './urlParams';

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


    const element1Ref = useRef<HTMLSelectElement | null>(null);
    const element2Ref = useRef<HTMLSelectElement | null>(null);
    const element3Ref = useRef<HTMLSelectElement | null>(null);

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

    const [imageUrl, setImageUrl] = useState(currentObject['URL']);
    // const [imageUrl, setImageUrl] = useState(currentObject['URL']);
    const [selectedValue1, setSelectedValue1] = useState(currentObject['Cup/Disk_Ratio']);
    const [selectedValue2, setSelectedValue2] = useState(currentObject['Image_Quality_Vocab.Name']);
    const [selectedValue3, setSelectedValue3] = useState(currentObject['Diagnosis_Image_Vocab.Name']);
    const [comments, setComments] = useState(currentObject['Comments']);
    const [showComments, setShowComments] = useState(
        (currentObject['Comments'] === undefined || currentObject['Comments'] === '') ? false : true
    )


    // console.log("#NOW ", currentIndex);
    // console.log("#1:", jsonData[currentIndex]['Cup/Disk_Ratio'])
    // console.log("#2:", jsonData[currentIndex]['Image_Quality_Vocab.Name'])
    // console.log("#3:", jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'])
    // console.log("#4:", jsonData[currentIndex]['Comments'])
    // console.log("#5:", showComments)

    // if (comments) {
    // if (jsonData[currentIndex]['Comments']) {
    //     console.log("4:", jsonData[currentIndex]['Comments'])
    // }

    const [isPanelVisible, setPanelVisibility] = useState(true);

    const [, forceUpdate] = useState('')

    useEffect(() => {

        console.log("#NOW ", currentIndex);
        console.log("#1:", jsonData[currentIndex]['Cup/Disk_Ratio'])
        console.log("#2:", jsonData[currentIndex]['Image_Quality_Vocab.Name'])
        console.log("#3:", jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'])
        console.log("#4:", jsonData[currentIndex]['Comments'])
        console.log("#5:", showComments)

        // console.log("initiate new object");
        setImageUrl(currentObject['URL']);
        // setImageUrl(currentObject['URL']);
        // console.log("image:", imageUrl);
        setSelectedValue1(currentObject['Cup/Disk_Ratio']);
        setSelectedValue2(currentObject['Image_Quality_Vocab.Name']);
        // console.log("current 1:", currentObject['Cup/Disk_Ratio']);
        // setSelectedValue3(currentObject['Diagnosis_Image_Vocab.Name']);
        if (currentObject['Diagnosis_Image_Vocab.Name'] === '') {
            // console.log("initial value3")
            const initialValue3 = currentObject['Cup/Disk_Ratio'] >= 0.6 ? "Suspected Glaucoma" : "No Glaucoma";
            currentObject['Diagnosis_Image_Vocab.Name'] = initialValue3;
            setSelectedValue3(initialValue3);
            // console.log("*1:", currentObject['Cup/Disk_Ratio']);
            // console.log("*3:", initialValue3);
        } else {
            setSelectedValue3(currentObject['Diagnosis_Image_Vocab.Name']);
        }

        if (currentObject['Comments'] === undefined || currentObject['Comments'] === '') {
            setShowComments(false)
        } else {
            setShowComments(true)
            setComments(currentObject['Comments']);
        }
    }, [currentObject]);


    const showNextObject = () => {
        saveAndShowData();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % jsonData.length);

    };

    const showPreviousObject = () => {
        saveAndShowData();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? jsonData.length - 1 : prevIndex - 1);

    };

    const saveAndShowData = () => {
        // jsonData[currentIndex]['Cup/Disk_Ratio'] = element1Ref.current.value;
        // jsonData[currentIndex]['Image_Quality_Vocab.Name'] = element2Ref.current.value;
        // jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'] = element3Ref.current.value;
        jsonData[currentIndex]['Cup/Disk_Ratio'] = selectedValue1;
        jsonData[currentIndex]['Image_Quality_Vocab.Name'] = selectedValue2;
        jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'] = selectedValue3;
        if (showComments) {
            jsonData[currentIndex]['Comments'] = comments;
        } else {
            jsonData[currentIndex]['Comments'] = '';
        }

        console.log("#saved ", currentIndex);
        console.log("#1:", jsonData[currentIndex]['Cup/Disk_Ratio'])
        console.log("#2:", jsonData[currentIndex]['Image_Quality_Vocab.Name'])
        console.log("#3:", jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'])
        console.log("#4:", jsonData[currentIndex]['Comments'])
        console.log("#5:", showComments)


        // if (comments) {
        // if (jsonData[currentIndex]['Comments'] !== '' && currentIndex['Comments'] !== undefined) {
        //     console.log("4:", jsonData[currentIndex]['Comments'])
        // }

    }
    //#1-0.8-no
    //#2-0.9-no
    const handleValue1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValueStr = event.target.value;
        const selectedValue = parseFloat(selectedValueStr);
        setSelectedValue1(selectedValue);
        if (element1Ref.current) {
            console.log("value 1 handle change:\nselectedValue:", selectedValue, "\nref:", element1Ref.current.value);
        }

        // console.log("value1 change:", event.target.value);

        const updatedValue3 = selectedValue >= 0.6 ? "Suspected Glaucoma" : "No Glaucoma";
        setSelectedValue3(updatedValue3);
        // console.log("value1(", selectedValue, ")updates value3(", selectedValue3, ")");

        if ((selectedValue < 0.6 && updatedValue3 === "No Glaucoma") || (selectedValue >= 0.6 && updatedValue3 === "Suspected Glaucoma")) {
            console.log("no comments.")
            setComments('');
            setShowComments(false);

        } else {
            console.log("add comments!")
            setComments('');
            setShowComments(true);
        }
        // forceUpdate();
    }

    //Image Quality
    const handleValue2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedValue2(selectedValue);
        if (element2Ref.current) {
            console.log("value 2 handle change:\nselectedValue:", selectedValue, "\nref:", element2Ref.current.value);

        }
        // console.log("value2 change:", event.target.value);

    }

    //Diaognosis
    const handleValue3Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        setSelectedValue3(selectedValue);

        if (element3Ref.current) {
            console.log("value 3 handle change:\nselectedValue:", selectedValue, "\nref:", element3Ref.current.value);
            // console.log("value3 change:", selectedValue);
        }

        // console.log("value3 updates comments(", selectedValue, ")");
        if (element1Ref.current) {
            const ref_value = parseFloat(element1Ref.current.value)
            if ((ref_value >= 0.6 && selectedValue === "No Glaucoma") || (ref_value < 0.6 && selectedValue === "Suspected Glaucoma")) {
                setShowComments(true);
                setComments('');
            } else {
                setShowComments(false);
                setComments('');
            }
        }
        // if ((element1Ref.current.value >= 0.6 && selectedValue === "No Glaucoma") | (element1Ref.current.value < 0.6 && selectedValue === "Suspected Glaucoma")) {
        //     console.log("add comments!");
        //     if (currentObject['Comments'] === undefined | currentObject['Comments'] === '') {
        //         console.log("no preassigned comments")
        //         setShowComments(true);
        //         setComments('');
        //     } else if (currentObject['Comments'] !== '') {
        //         setComments(currentObject['Comments']);
        //     } else {
        //         setComments('');
        //     }

        // } else {
        //     console.log("no comments.")
        //     setComments(undefined);
        // }

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

    // const handleShowPanel = () => {
    //     setPanelVisibility(true);
    // }


    ////////////////////////////////////////////////////////////////////////////////////////
    // Add Hotkeys Support
    ////////////////////////////////////////////////////////////////////////////////////////
    const keyMap = {
        // Navigation
        CTRL_N: 'ctrl+n', // next
        CTRL_P: 'ctrl+p', // previous

        // C/D controls
        NUM1: '1', // c/d 0.1
        NUM2: '2', // c/d 0.2
        NUM3: '3', // c/d 0.3
        NUM4: '4', // c/d 0.4
        NUM5: '5', // c/d 0.5
        NUM6: '6', // c/d 0.6
        NUM7: '7', // c/d 0.7
        NUM8: '8', // c/d 0.8
        NUM9: '9', // c/d 0.9

        // Quality controls
        QUALG: 'g', // quality good
        QUALB: 'b', // quality bad

        // Diagnosis controls
        DIAGN: 'w', // no glaucoma ("without glaucoma")
        DIAGS: 's' // suspected glaucoma
    };

    const handleCtrlN = showNextObject
    const handleCtrlP = showPreviousObject

    // const setValue1AndTrigger = (v: string) => {
    //     setSelectedValue1(v)
    //     handleValue1Change({ target: { value: v } as any })
    // }
    const setValue1AndTrigger = (v: string) => {
        setSelectedValue1(parseInt(v, 10));
        const syntheticEvent = {
            target: { value: v },
        } as React.ChangeEvent<HTMLSelectElement>;
        handleValue1Change(syntheticEvent);
    }

    const setValue2AndTrigger = (v: string) => {
        setSelectedValue2(v)
        const syntheticEvent = {
            target: { value: v },
        } as React.ChangeEvent<HTMLSelectElement>;
        handleValue2Change(syntheticEvent)
    }
    const setValue3AndTrigger = (v: string) => {
        setSelectedValue3(v)
        const syntheticEvent = {
            target: { value: v },
        } as React.ChangeEvent<HTMLSelectElement>;
        handleValue3Change(syntheticEvent)
    }

    const handle1 = () => { setValue1AndTrigger("0.1") }
    const handle2 = () => { setValue1AndTrigger("0.2") }
    const handle3 = () => { setValue1AndTrigger("0.3") }
    const handle4 = () => { setValue1AndTrigger("0.4") }
    const handle5 = () => { setValue1AndTrigger("0.5") }
    const handle6 = () => { setValue1AndTrigger("0.6") }
    const handle7 = () => { setValue1AndTrigger("0.7") }
    const handle8 = () => { setValue1AndTrigger("0.8") }
    const handle9 = () => { setValue1AndTrigger("0.9") }

    const handleG = () => { setValue2AndTrigger("Good") }
    const handleB = () => { setValue2AndTrigger("Bad") }

    const handleW = () => { setValue3AndTrigger("No Glaucoma") }
    const handleS = () => { setValue3AndTrigger("Suspected Glaucoma") }

    const handlers = {
        CTRL_N: handleCtrlN,
        CTRL_P: handleCtrlP,

        NUM1: handle1, // c/d 0.1
        NUM2: handle2, // c/d 0.2
        NUM3: handle3, // c/d 0.3
        NUM4: handle4, // c/d 0.4
        NUM5: handle5, // c/d 0.5
        NUM6: handle6, // c/d 0.6
        NUM7: handle7, // c/d 0.7
        NUM8: handle8, // c/d 0.8
        NUM9: handle9, // c/d 0.9

        // Quality controls
        QUALG: handleG, // quality good
        QUALB: handleB, // quality bad

        // Diagnosis controls
        DIAGN: handleW, // no glaucoma ("without glaucoma")
        DIAGS: handleS // glaucoma
    };


    // const props = { width: 400, scale: 1.8, zoomPosition: "original", zoomWidth: 300, img: { imageUrl }, height: 300 };


    return (
        <div className='container-box'>
            {/* <UrlParamsComponent /> */}
            <HotKeys keyMap={keyMap} handlers={handlers}>

                <div className="container">

                    <table className="center">
                        <tbody>
                            <tr key="image">
                                <td></td>
                                <td>
                                    <div className='image-container'>
                                        {/* <MapInteractionCSS>
                                            <ImageComponent imageUrl={imageUrl} />
                                        </MapInteractionCSS> */}
                                        <img className="myImage" src={imageUrl} alt='eye-ball' />
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
                                    <select className='chaise-input-group' value={selectedValue1} onChange={handleValue1Change} ref={element1Ref}>
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
                                    <select className='chaise-input-group' value={selectedValue3} onChange={handleValue3Change} ref={element3Ref}>
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
                                    <select className='chaise-input-group' value={selectedValue2} onChange={handleValue2Change} ref={element2Ref}>
                                        {dropdown2.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            {showComments && (
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

                    <div className="group">
                        <div className='vertical-items'>
                            <button className='chaise-btn chaise-btn-primary'>
                                {currentIndex + 1}/{jsonData.length}
                            </button>
                            <SliderComponent maxNum={numberMax} onSelect={handleSliderChange} value={currentIndex
                                + 1} />
                            {/* {isPanelVisible && (
                                <SliderComponent maxNum={numberMax} onSelect={handleSliderChange} />
                                // <NumberChooser data={numbers} onSelect={handleSelect} />
                            )} */}
                        </div>



                        <button className='chaise-btn chaise-btn-primary' onClick={showPreviousObject}>Previous</button>
                        <button className='chaise-btn chaise-btn-primary' onClick={showNextObject}>Next</button>


                    </div>
                </div>
            </HotKeys>
        </div>

    );
}

export default DetailsComponent;