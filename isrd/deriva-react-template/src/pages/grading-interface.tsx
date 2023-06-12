import '@isrd-isi-edu/deriva-react-app/src/assets/scss/example.scss';

import { createRoot } from 'react-dom/client';
import AppWrapper from '@isrd-isi-edu/chaise/src/components/app-wrapper';
import { ID_NAMES } from '@isrd-isi-edu/chaise/src/utils/constants';

import FileReaderComponent from '@isrd-isi-edu/deriva-react-app/src/components/FileReader';
import UrlReaderComponent from '../components/UrlReader';
import UrlParamsComponent from '../components/urlParams';
// import ExampleComponent from '@isrd-isi-edu/deriva-react-app/src/components/example';


const myappSettings = {
    appName: 'app/grading-interface',
    appTitle: 'Grading-interface App',
    overrideHeadTitle: false,
    overrideImagePreviewBehavior: false,
    overrideDownloadClickBehavior: false,
    overrideExternalLinkBehavior: false
};
const MyApp = (): JSX.Element => {
    return (
        <div className='body'>
            <UrlReaderComponent />
            {/* <FileReaderComponent /> */}
            {/* <UrlParamsComponent /> */}
        </div>
    )
};

const root = createRoot(document.getElementById(ID_NAMES.APP_ROOT) as HTMLElement);

// TODO if testing locally, you can add dontFetchSession to skip the authn request
root.render(
    <AppWrapper appSettings={myappSettings} includeNavbar displaySpinner ignoreHashChange>
        <MyApp />
    </AppWrapper>
);
