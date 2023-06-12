//queryString: ?dataset_rid=V76G
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
//dataset_rid: C0G2/V76G
const dataset_rid = urlParams.get('dataset_rid')
console.log("dataset_rid:", dataset_rid);
//diagnosis_rid: C1T4
//diagnosis_rid: M7NW
const diagnosis_rid = "C1T4";
// const diagnosis_rid = urlParams.get('diagnosis_rid')
// console.log("diagnosis_rid:", diagnosis_rid);

let newURL = '';
if (dataset_rid && diagnosis_rid) {
    // const newQueryParams = new URLSearchParams({ dataset_rid });
    // newURL = `https://eye-ai.org/app/annotate?${newQueryParams.toString()}`;
    // console.log("new url:", newURL);
    newURL = `https://dev.eye-ai.org/ermrest/catalog/eye-ai/attribute/Image_Dataset:=eye-ai:Image_Dataset/Dataset=${dataset_rid}/Image:=eye-ai:Image/Diagnosis:=eye-ai:Diagnosis/Diagnosis_Tag=${diagnosis_rid}/Image:RID,Image:URL,Image:Filename,Image:Length,Image:Image,Diagnosis:Cup%2FDisk_Ratio`
    console.log("new url:", newURL);
}




function UrlParamsComponent() {
    console.log("inside UrlParamsComponent")
    let newURL = '';
    if (dataset_rid) {
        const newQueryParams = new URLSearchParams({ dataset_rid });
        newURL = `https://eye-ai.org/app/annotate?${newQueryParams.toString()}`;
        console.log("so... new url:", newURL);
    }


    // ...

    return (
        <div>
            <h1>New URL: {newURL}</h1>
            {/* rest of your component */}
        </div>
    );
}

export default UrlParamsComponent;