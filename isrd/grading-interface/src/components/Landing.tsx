import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DetailsComponent from './detail-hotkey';

const host = window.location.host;
// const host_url = host.split('.')[0];
console.log("window.location.host:", host);

//queryString: ?dataset_rid=V76G
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
//dataset_rid: C0G2/V76G
const dataset_rid = urlParams.get('dataset_rid')
console.log("dataset_rid:", dataset_rid);


const UrlReaderComponent = () => {

    type Tag = {
        RID: string;
        Name: string;
    };

    const [tags, setTags] = useState<Tag[] | null>(null);
    const [selectedTag, setSelectedTag] = useState("empty");

    const [Image_Quality, set_Image_Quality] = useState<Tag[] | null>(null);
    const [selected_Image_Quality, setSelected_Image_Quality] = useState("empty");

    const [Diagnosis_Vocab, set_Diagnosis_Vocab] = useState<Tag[] | null>(null);
    const [selected_Diagnosis_Vocab, setSelected_Diagnosis_Vocab] = useState("empty");

    const [jsonData, setJsonData] = useState<[] | null>(null);
    const downloadLinkRef = useRef<HTMLAnchorElement>(null);


    useEffect(() => {

        // fetch('http://localhost:8080/tags')
        fetch(`https://${host}/ermrest/catalog/eye-ai/attribute/eye-ai:Diagnosis_Tag/RID,Name`)
            .then(res => {
                return res.json();
            })
            .then((data: Tag[]) => {
                console.log("Image_Quality options:", data);
                setTags(data)
                setSelectedTag("empty");
                console.log("useEffect selectedTag:", selectedTag);

            })

        fetch(`https://${host}/ermrest/catalog/eye-ai/attribute/eye-ai:Image_Quality_Vocab/RID,Name`)
            .then(res => {
                return res.json();
            })
            .then((data: Tag[]) => {
                console.log("Diagnosis_Vocab options:", data);
                set_Image_Quality(data)
                setSelected_Image_Quality("empty");
                console.log("useEffect selectedTag:", selectedTag);

            })

        fetch(`https://${host}/ermrest/catalog/eye-ai/entity/Diagnosis_Image_Vocab:=eye-ai:Diagnosis_Image_Vocab`)
            .then(res => {
                return res.json();
            })
            .then((data: Tag[]) => {
                console.log("diagnosis_tag options:", data);
                set_Diagnosis_Vocab(data)
                setSelected_Diagnosis_Vocab("empty");
                console.log("useEffect selectedTag:", selectedTag);

            })
    }, []);  // empty dependency array means this effect runs once on mount

    const handle_Image_Quality_Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const Image_Quality_RID = event.target.value
        setSelected_Image_Quality(Image_Quality_RID);
        console.log("choose <Image_Quality>:", Image_Quality_RID);
    }

    const handle_Diagnosis_Vocab_Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const Diagnosis_Vocab_RID = event.target.value
        setSelected_Diagnosis_Vocab(Diagnosis_Vocab_RID);
        console.log("choose <Diagnosis_Vocab>:", Diagnosis_Vocab_RID);
    }

    const handleTagsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const diagnosis_rid = event.target.value
        setSelectedTag(diagnosis_rid);
        console.log("choose:", diagnosis_rid);
        if (diagnosis_rid !== "empty") {
            // const data_url = 'http://localhost:8080/data';
            const data_url = `https://${host}/ermrest/catalog/eye-ai/attribute/Subject_Dataset:=eye-ai:Subject_Dataset/Dataset=${dataset_rid}/Subject:=left(Subject)=(eye-ai:Subject:RID)/Observation:=left(RID)=(eye-ai:Observation:Subject)/Image:=left(RID)=(eye-ai:Image:Observation)/Diagnosis:=left(RID)=(eye-ai:Diagnosis:Image)/Diagnosis_Tag=${diagnosis_rid}/Image_RID:=Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Image:Image_Quality_Vocab,Diagnosis:Cup%2FDisk_Ratio,Diagnosis_RID:=Diagnosis:RID,Diagnosis_Image_RID:=Diagnosis:Image`;
            console.log("generate url:", data_url);

            const fetchData = async () => {
                // const data_url = 'https://dev.eye-ai.org/ermrest/catalog/eye-ai/attribute/Image_Dataset:=eye-ai:Image_Dataset/Dataset=68X4/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=M7NW/Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Diagnosis:Cup%2FDisk_Ratio';
                // const data_url = newURL;

                // const givenUrl = '/ermrest/catalog/eye-ai/attribute/Image_Dataset:=eye-ai:Image_Dataset/Dataset=68X4/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=M7NW/Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Diagnosis:Cup%2FDisk_Ratio';
                // const givenUrl0 = '/ermrest/catalog/eye-ai/entity/Image_Dataset:=eye-ai:Image_Dataset/Dataset=68X4/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=M7NW';
                // const url = 'http://localhost:3001' + givenUrl;

                try {
                    // const response = await axios.get(url);
                    const response = await axios.get(data_url);
                    if (response.data.Length !== 0) {
                        console.log("GET DATA!", response.data);
                        setJsonData(response.data);
                    } else {
                        console.log("Fetched data NULL", response.data);
                    }

                } catch (error) {
                    console.error('Failed to fetch data:', error);
                }
            };

            fetchData();
        }

    }

    const saveData = () => {
        console.log("data updated!");

        const dataStr = JSON.stringify(jsonData, null, 2); // format JSON nicely
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        if (downloadLinkRef.current) {
            downloadLinkRef.current.href = url;
            downloadLinkRef.current.download = 'updated-data.json';
            downloadLinkRef.current.click();
        }

    }

    return (
        <div className="container" style={{ marginTop: '15px' }}>
            <div className='group'>
                <div>

                    {tags && Array.isArray(tags) &&
                        <select className='chaise-input-group' value={selectedTag} onChange={handleTagsChange}>
                            <option value="empty">--Select a Diagnosis Tag--</option>
                            {tags.map((option) => (
                                <option key={option.RID} value={option.RID}>
                                    {option.Name}
                                </option>
                            ))}
                        </select>
                    }

                    {Image_Quality && Array.isArray(Image_Quality) &&
                        <>
                            <p>Image_Quality</p>
                            <select className='chaise-input-group' value={selected_Image_Quality} onChange={handle_Image_Quality_Change}>
                                <option value="empty">- null -</option>
                                {Image_Quality.map((option) => (
                                    <option key={option.RID} value={option.RID}>
                                        {option.Name}
                                    </option>
                                ))}
                            </select>
                        </>
                    }

                    {Diagnosis_Vocab && Array.isArray(Diagnosis_Vocab) &&
                        <>
                            <p>Diagnosis_Vocab</p>
                            <select className='chaise-input-group' value={selected_Diagnosis_Vocab} onChange={handle_Diagnosis_Vocab_Change}>
                                <option value="empty">- null -</option>
                                {Diagnosis_Vocab.map((option) => (
                                    <option key={option.RID} value={option.RID}>
                                        {option.Name}
                                    </option>
                                ))}
                            </select>
                        </>
                    }



                </div>

                {/* {jsonData && <pre>{JSON.stringify(jsonData, null, 2)}</pre>} */}

                {/* {jsonData && jsonData.length > 0 && (
                    <button className='chaise-btn chaise-btn-primary' onClick={saveData}>Quit</button>
                )} */}

            </div>
            {jsonData && jsonData.length === 0 && (
                <p> No available data. Please go back.</p>
            )}

            {jsonData && jsonData.length > 0 && (
                <>
                    <DetailsComponent jsonData={jsonData} />
                    <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
                </>


            )}
        </div>


    );
};

export default UrlReaderComponent;
