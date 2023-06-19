import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DetailsComponent from './detail-hotkey';

const host = window.location.href//https://dev.eye-ai.org/
console.log("window.location.href:", host);
const split = host.split('eye-ai.org/');
console.log("split:", split, split[0])
console.log("if it's dev:", "https://dev." === split[0])

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

    const [jsonData, setJsonData] = useState(null);
    const downloadLinkRef = useRef<HTMLAnchorElement>(null);


    useEffect(() => {

        // fetch('http://localhost:8080/tags')
        fetch('https://dev.eye-ai.org/ermrest/catalog/eye-ai/attribute/eye-ai:Diagnosis_Tag/RID,Name')
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
            // if(host.split('eye-ai.org/'))
            const data_url = `https://dev.eye-ai.org/ermrest/catalog/eye-ai/attribute/Image_Dataset:=eye-ai:Image_Dataset/Dataset=${dataset_rid}/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=${diagnosis_rid}/Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Diagnosis:Cup%2FDisk_Ratio`
            // const url = `https://dev.eye-ai.org/Dataset=${dataset_rid}//Diagnosis_Tag=${diagnosis_rid}/Diagnosis:Cup%2FDisk_Ratio`
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

                    setJsonData(response.data);

                    console.log("Fetched data:", response.data);
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
                            <option value="empty">--Please choose an option--</option>
                            {tags.map((option) => (
                                <option key={option.RID} value={option.RID}>
                                    {option.Name}
                                </option>
                            ))}
                        </select>
                    }



                </div>
                {jsonData && (
                    <button className='chaise-btn chaise-btn-primary' onClick={saveData}>Quit</button>
                )}

            </div>

            {jsonData && (
                <>
                    <DetailsComponent jsonData={jsonData} />
                    <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
                </>


            )}
        </div>


    );
};

export default UrlReaderComponent;
