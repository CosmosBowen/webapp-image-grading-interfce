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

    const [jsonData, setJsonData] = useState<[] | null>(null);
    const downloadLinkRef = useRef<HTMLAnchorElement>(null);


    useEffect(() => {

        // fetch('http://localhost:8080/tags')
        fetch(`https://${host}/ermrest/catalog/eye-ai/attribute/eye-ai:Diagnosis_Tag/RID,Name`)
            .then(res => {
                return res.json();
            })
            .then((data: Tag[]) => {
                console.log("data:", data);
                setTags(data)
                setSelectedTag("empty");
                console.log("useEffect selectedTag:", selectedTag);

            })
    }, []);  // empty dependency array means this effect runs once on mount


    const handleTagsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const diagnosis_rid = event.target.value
        setSelectedTag(diagnosis_rid);
        console.log("choose:", diagnosis_rid);
        if (diagnosis_rid !== "empty") {
            const data_url = 'http://localhost:8080/data';
            // const data_url = `https://${host}/ermrest/catalog/eye-ai/attribute/Subject_Dataset:=eye-ai:Subject_Dataset/Dataset=${dataset_rid}/Subject:=left(Subject)=(eye-ai:Subject:RID)/Observation:=left(RID)=(eye-ai:Observation:Subject)/Image:=left(RID)=(eye-ai:Image:Observation)/Diagnosis:=left(RID)=(eye-ai:Diagnosis:Image)/Diagnosis_Tag=${diagnosis_rid}/Image_RID:=Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Image:Image_Quality_Vocab,Diagnosis:Cup%2FDisk_Ratio,Diagnosis_RID:=Diagnosis:RID,Diagnosis_Image_RID:=Diagnosis:Image`
            // const data_url = `https://${host}/ermrest/catalog/eye-ai/attribute/Subject_Dataset:=eye-ai:Subject_Dataset/Dataset=${dataset_rid}/Subject:=left(Subject)=(eye-ai:Subject:RID)/Observation:=left(RID)=(eye-ai:Observation:Subject)/Image:=left(RID)=(eye-ai:Image:Observation)/Diagnosis:=left(RID)=(eye-ai:Diagnosis:Image)/Diagnosis_Tag=${diagnosis_rid}/Image_RID:=Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Image:Image_Quality_Vocab,Diagnosis:Cup%2FDisk_Ratio,Diagnosis_RID:=Diagnosis:RID,Diagnosis_Image_RID:=Diagnosis:Image`
            // const data_url = `https://${host}/ermrest/catalog/eye-ai/attribute/Subject_Dataset:=eye-ai:Subject_Dataset/Dataset=${dataset_rid}/Subject:=left(Subject)=(eye-ai:Subject:RID)/Observation:=left(RID)=(eye-ai:Observation:Subject)/Image:=left(RID)=(eye-ai:Image:Observation)/Diagnosis:=left(RID)=(eye-ai:Diagnosis:Image)/Diagnosis_Tag=${diagnosis_rid}/Image_RID:=Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Image:Image_Quality_Vocab,Diagnosis:Cup%2FDisk_Ratio,Diagnosis_RID:=Diagnosis:RID,Diagnosis_Image_RID:=Diagnosis:Image`;
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



                </div>

                {/* {jsonData && <pre>{JSON.stringify(jsonData, null, 2)}</pre>} */}

                {jsonData && jsonData.length > 0 && (
                    <button className='chaise-btn chaise-btn-primary' onClick={saveData}>Quit</button>
                )}

            </div>
            {/* {jsonData === null && (
                <p> No available data. Please go back.</p>
            )} */}

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
