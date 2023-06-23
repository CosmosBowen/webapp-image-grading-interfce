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

type Tag = {
    RID: string;
    Name: string;
};

type Props = {
    jsonData: ImageData[];
    Image_Quality: Tag[];
    Diagnosis_Vocab: Tag[];
};


const DetailsComponent = ({ jsonData, Image_Quality, Diagnosis_Vocab }: Props) => {


    const Ref_CDR = useRef<HTMLSelectElement | null>(null);
    const Ref_Image_Quality = useRef<HTMLSelectElement | null>(null);
    const Ref_Diagnosis_Vocab = useRef<HTMLSelectElement | null>(null);

    const CDR_list = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]

    // const element1Ref = useRef<HTMLSelectElement | null>(null);
    // const element2Ref = useRef<HTMLSelectElement | null>(null);
    // const element3Ref = useRef<HTMLSelectElement | null>(null);

    //Cup/Disk_Ratio
    // const dropdown1 = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
    //Image_Quality_Vocab.Name
    // const dropdown2 = ["Good", "Bad"]
    //Diagnosis_Image_Vocab.Name
    // const dropdown3 = ["No Glaucoma", "Suspected Glaucoma"]

    const numberMax = jsonData.length;
    const handleSliderChange = (value: number) => {
        setCurrentIndex(value - 1);
    };


    const [currentIndex, setCurrentIndex] = useState(0);
    // const currentObject = jsonData[currentIndex];

    const [imageUrl, setImageUrl] = useState(jsonData[currentIndex]['URL']);
    // const [imageUrl, setImageUrl] = useState(currentObject['URL']);



    const [selected_CDR, setSelected_CDR] = useState(jsonData[currentIndex]['Cup/Disk_Ratio']);
    const [selected_Image_Quality, setSelected_Image_Quality] = useState(jsonData[currentIndex]['Image_Quality_Vocab.Name']);
    const [selected_Diagnosis_Vocab, setSelected_Diagnosis_Vocab] = useState(jsonData[currentIndex]['Diagnosis_Image_Vocab.Name']);

    // const [selectedValue1, setSelectedValue1] = useState(currentObject['Cup/Disk_Ratio']);
    // const [selectedValue2, setSelectedValue2] = useState(currentObject['Image_Quality_Vocab.Name']);
    // const [selectedValue3, setSelectedValue3] = useState(currentObject['Diagnosis_Image_Vocab.Name']);
    const [comments, setComments] = useState(jsonData[currentIndex]['Comments']);
    const [showComments, setShowComments] = useState(
        (jsonData[currentIndex]['Comments'] === undefined || jsonData[currentIndex]['Comments'] === '') ? false : true
    )

    const [isPanelVisible, setPanelVisibility] = useState(true);

    const [, forceUpdate] = useState('')

    useEffect(() => {

        console.log("# ", currentIndex);
        console.log("CDR:", jsonData[currentIndex]['Cup/Disk_Ratio'])
        console.log("Image_Quality:", jsonData[currentIndex]['Image_Quality_Vocab.Name'])
        console.log("Diagnosis_Vocab:", jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'])
        console.log("Comments", jsonData[currentIndex]['Comments'])
        console.log("showComments:", showComments)
        console.log("-------------------")

        // console.log("initiate new object");
        setImageUrl(jsonData[currentIndex]['URL']);
        setSelected_CDR(jsonData[currentIndex]['Cup/Disk_Ratio']);
        setSelected_Image_Quality(jsonData[currentIndex]['Image_Quality_Vocab.Name']);

        if (jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'] === '') {
            const initial_Diagnosis_Vocab = jsonData[currentIndex]['Cup/Disk_Ratio'] >= 0.6 ? "Suspected Glaucoma" : "No Glaucoma";
            jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'] = initial_Diagnosis_Vocab;
            setSelected_Diagnosis_Vocab(initial_Diagnosis_Vocab);
        } else {
            setSelected_Diagnosis_Vocab(jsonData[currentIndex]['Diagnosis_Image_Vocab.Name']);
        }

        if (jsonData[currentIndex]['Comments'] === undefined || jsonData[currentIndex]['Comments'] === '') {
            setShowComments(false)
        } else {
            setShowComments(true)
            setComments(jsonData[currentIndex]['Comments']);
        }
    }, [jsonData[currentIndex]]);


    const showNextObject = () => {
        saveAndShowData();
        setCurrentIndex((prevIndex) => (prevIndex + 1) % jsonData.length);

    };

    const showPreviousObject = () => {
        saveAndShowData();
        setCurrentIndex((prevIndex) => prevIndex === 0 ? jsonData.length - 1 : prevIndex - 1);

    };


    async function post_put_data(imageData: updateImageData) {
        try {
            const data = await saveImageChanges(imageData);
            console.log("new Function, responseData:\n", data);
        } catch (error) {
            console.error("Oops, Error:", error);
        }
    }

    const saveAndShowData = () => {

        //POST:insert
        // const data: updateImageData = {
        //     "Cup/Disk_Ratio": "0.9",
        //     Image: "8GEJ",
        //     Process: "C1NC",
        //     Diagnosis_Vocab: "2SKA",
        //     Diagnosis_Tag: "C1T4",
        //     Diagnosis_Status: "C1SW",
        //     Comments: "this is a test 1 Bowen"
        // };
        //PUT:update
        const data: updateImageData = {
            RID: "0",
            "Cup/Disk_Ratio": "0.5",
            Image: "1",
            Process: "2",
            Diagnosis_Vocab: "3",
            Diagnosis_Tag: "4",
            Diagnosis_Status: "5",
            Comments: "this is a test 2 PUT/update Bowen"
        };

        post_put_data(data)


        jsonData[currentIndex]['Cup/Disk_Ratio'] = selected_CDR;
        jsonData[currentIndex]['Image_Quality_Vocab.Name'] = selected_Image_Quality;
        jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'] = selected_Diagnosis_Vocab;
        if (showComments) {
            jsonData[currentIndex]['Comments'] = comments;
        } else {
            jsonData[currentIndex]['Comments'] = '';
        }


        console.log("Saved! ");
        console.log("$  ", currentIndex);
        console.log("CDR:", jsonData[currentIndex]['Cup/Disk_Ratio'])
        console.log("Image_Quality:", jsonData[currentIndex]['Image_Quality_Vocab.Name'])
        console.log("Diagnosis_Vocab:", jsonData[currentIndex]['Diagnosis_Image_Vocab.Name'])
        console.log("Comments", jsonData[currentIndex]['Comments'])
        console.log("showComments:", showComments)
        console.log("-------------------")


        // if (comments) {
        // if (jsonData[currentIndex]['Comments'] !== '' && currentIndex['Comments'] !== undefined) {
        //     console.log("4:", jsonData[currentIndex]['Comments'])
        // }

    }
    //#1-0.8-no
    //#2-0.9-no
    const handle_CDR_Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const CDR_Str = event.target.value;
        const CDR = parseFloat(CDR_Str);
        setSelected_CDR(CDR);
        if (Ref_CDR.current) {
            console.log("choose <CDR>:", CDR);
            // console.log("value 1 handle change:\nselectedValue:", selectedValue, "\nref:", Ref_CDR.current.value);
        }

        // console.log("value1 change:", event.target.value);

        const updated_Diagnosis_Vocab = CDR >= 0.6 ? "Suspected Glaucoma" : "No Glaucoma";
        setSelected_Diagnosis_Vocab(updated_Diagnosis_Vocab);
        // console.log("value1(", selectedValue, ")updates value3(", selectedValue3, ")");

        if ((CDR < 0.6 && updated_Diagnosis_Vocab === "No Glaucoma") || (CDR >= 0.6 && updated_Diagnosis_Vocab === "Suspected Glaucoma")) {
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
    const handle_Image_Quality_Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const Image_Quality_RID = event.target.value;
        setSelected_Image_Quality(Image_Quality_RID);
        if (Ref_Image_Quality.current) {
            console.log("choose <Image_Quality>:", Image_Quality_RID);
            // console.log("value 2 handle change:\nselectedValue:", selectedValue, "\nref:", Ref_Image_Quality.current.value);

        }

    }

    //Diaognosis
    const handle_Diagnosis_Vocab_Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const Diagnosis_Vocab_RID = event.target.value;
        setSelected_Diagnosis_Vocab(Diagnosis_Vocab_RID);

        if (Ref_Diagnosis_Vocab.current) {
            console.log("choose <Diagnosis_Vocab>:", Diagnosis_Vocab_RID);
            // console.log("value 3 handle change:\nselectedValue:", selectedValue, "\nref:", Ref_Diagnosis_Vocab.current.value);

        }

        if (Ref_CDR.current) {
            const value_Ref_CDR = parseFloat(Ref_CDR.current.value)
            if ((value_Ref_CDR >= 0.6 && Diagnosis_Vocab_RID === "No Glaucoma") || (value_Ref_CDR < 0.6 && Diagnosis_Vocab_RID === "Suspected Glaucoma")) {
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
    const set_CDR_AndTrigger = (v: string) => {
        setSelected_CDR(parseInt(v, 10));
        const syntheticEvent = {
            target: { value: v },
        } as React.ChangeEvent<HTMLSelectElement>;
        handle_CDR_Change(syntheticEvent);
    }

    //Image_Quality Value2
    const set_Image_Quality_AndTrigger = (v: string) => {
        setSelected_Image_Quality(v)
        const syntheticEvent = {
            target: { value: v },
        } as React.ChangeEvent<HTMLSelectElement>;
        handle_Image_Quality_Change(syntheticEvent)
    }
    const set_Diagnosis_Vocab_AndTrigger = (v: string) => {
        setSelected_Diagnosis_Vocab(v)
        const syntheticEvent = {
            target: { value: v },
        } as React.ChangeEvent<HTMLSelectElement>;
        handle_Diagnosis_Vocab_Change(syntheticEvent)
    }

    const handle1 = () => { set_CDR_AndTrigger("0.1") }
    const handle2 = () => { set_CDR_AndTrigger("0.2") }
    const handle3 = () => { set_CDR_AndTrigger("0.3") }
    const handle4 = () => { set_CDR_AndTrigger("0.4") }
    const handle5 = () => { set_CDR_AndTrigger("0.5") }
    const handle6 = () => { set_CDR_AndTrigger("0.6") }
    const handle7 = () => { set_CDR_AndTrigger("0.7") }
    const handle8 = () => { set_CDR_AndTrigger("0.8") }
    const handle9 = () => { set_CDR_AndTrigger("0.9") }

    const handleG = () => { set_Image_Quality_AndTrigger("Good") }
    const handleB = () => { set_Image_Quality_AndTrigger("Bad") }

    const handleW = () => { set_Diagnosis_Vocab_AndTrigger("No Glaucoma") }
    const handleS = () => { set_Diagnosis_Vocab_AndTrigger("Suspected Glaucoma") }

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
                                </td>
                            </tr>
                            <tr key="Cup/Disk_Ratio">
                                <td>Cup/Disk_Ratio</td>
                                <td>
                                    <select className='chaise-input-group' value={selected_CDR} onChange={handle_CDR_Change} ref={Ref_CDR}>
                                        <option value="empty">- null -</option>
                                        {CDR_list.map((option) => (
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
                                    <select className='chaise-input-group' value={selected_Diagnosis_Vocab} onChange={handle_Diagnosis_Vocab_Change} ref={Ref_Diagnosis_Vocab}>
                                        <option value="empty">- null -</option>
                                        {Diagnosis_Vocab.map((option) => (
                                            <option key={option.RID} value={option.RID}>
                                                {option.Name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>

                            <tr key="Image_Quality">
                                <td>Image_Quality</td>
                                <td>
                                    <select className='chaise-input-group' value={selected_Image_Quality} onChange={handle_Image_Quality_Change} ref={Ref_Image_Quality}>
                                        <option value="empty">- null -</option>
                                        {Image_Quality.map((option) => (
                                            <option key={option.RID} value={option.RID}>
                                                {option.Name}
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
                            <div>
                                <button className='chaise-btn chaise-btn-primary' onClick={showPreviousObject}>{"-"}</button>
                                <button className='chaise-btn chaise-btn-primary'>
                                    {currentIndex + 1}/{jsonData.length}
                                </button>
                                <button className='chaise-btn chaise-btn-primary' onClick={showNextObject}>{"+"}</button>
                            </div>

                            <SliderComponent maxNum={numberMax} onSelect={handleSliderChange} value={currentIndex
                                + 1} />
                            {/* {isPanelVisible && (
                                <SliderComponent maxNum={numberMax} onSelect={handleSliderChange} />
                                // <NumberChooser data={numbers} onSelect={handleSelect} />
                            )} */}
                        </div>






                    </div>
                </div>
            </HotKeys>
        </div>

    );
}

export default DetailsComponent;


type updateImageData = {
    RID?: string,
    "Cup/Disk_Ratio": string,
    Image: string,
    Process: string,
    Diagnosis_Vocab: string,
    Diagnosis_Tag: string,
    Diagnosis_Status: string,
    Comments: string
};

async function saveImageChanges(imageData: updateImageData) {
    const method = imageData.RID ? 'PUT' : 'POST';
    let url = null;
    console.log("Now - ", method, "with data:\n", imageData);
    if (method == 'PUT') { // Update
        url = `http://localhost:8080/imageData/${imageData.RID}`;
    } else { // Insert
        imageData.RID = "5"
        url = `http://localhost:8080/imageData`;
    }

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(imageData)
    };

    const response = await fetch(url, options);

    if (response.ok) {
        const data = await response.json()
        console.log("response.ok:\n", data)
        return data;
    }

    throw new Error('Erro saving image data');
}