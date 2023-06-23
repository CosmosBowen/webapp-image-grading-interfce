import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import DetailsComponent from './detail-hotkey';


//queryString: ?dataset_rid=V76G
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
//dataset_rid: C0G2/V76G
const dataset_rid = urlParams.get('dataset_rid')
console.log("dataset_rid:", dataset_rid);
//diagnosis_rid: C1T4
//diagnosis_rid: M7NW
const diagnosis_rid = "C1T4";

let newURL = '';
if (dataset_rid) { // && diagnosis_rid
    // const newQueryParams = new URLSearchParams({ dataset_rid });
    // newURL = `https://eye-ai.org/app/annotate?${newQueryParams.toString()}`;
    // console.log("new url:", newURL);
    newURL = `https://dev.eye-ai.org/ermrest/catalog/eye-ai/attribute/Image_Dataset:=eye-ai:Image_Dataset/Dataset=${dataset_rid}/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=${diagnosis_rid}/Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Diagnosis:Cup%2FDisk_Ratio`
    console.log("new url:", newURL);
}


const UrlReaderComponent = () => {
    const [jsonData, setJsonData] = useState(null);
    const downloadLinkRef = useRef<HTMLAnchorElement>(null);


    useEffect(() => {
        const fetchData = async () => {
            const data_url = 'https://dev.eye-ai.org/ermrest/catalog/eye-ai/attribute/Image_Dataset:=eye-ai:Image_Dataset/Dataset=68X4/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=M7NW/Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Diagnosis:Cup%2FDisk_Ratio';
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
    }, []);  // empty dependency array means this effect runs once on mount



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
                {jsonData && (
                    <button className='chaise-btn chaise-btn-primary' onClick={saveData}>Quit</button>
                )}

            </div>

            {/* {jsonData && (
                <>
                    <DetailsComponent jsonData={jsonData} />
                    <a ref={downloadLinkRef} style={{ display: 'none' }}>Download</a>
                </>


            )} */}
        </div>


    );
};

export default UrlReaderComponent;
