import '../App.css';
import axios from 'axios';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from './Checkbox';
import Input from '@mui/material/Input';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {useEffect, useState} from "react";
import CameraComp from './CameraComp';

// import 'react-html5-camera-photo/build/css/index.css';

function Main() {
    const [sizes, setSizes] = useState({
        '100': true,
        '200': false,
        '300': false
    });
    const [image, setImage] = useState(null);
    const [apiURL, setApiURL] = useState('');
    const [baseURL, setBaseURL] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState("success");
    const [alertMsg, setAlertMsg] = useState("Alert msg");
    const [cameraOpen, setCameraOpen] = useState(false);
    const [urlResponseShow, setUrlResponseShow] = useState(false);
    const [urlResponse, setUrlResponse] = useState(null);

    useEffect(() => {
        setBaseURL('https://sgm31cynbh.execute-api.eu-west-1.amazonaws.com/dev/thumbnails-source-bucket/');
    }, [image])

    useEffect(() => {
        if (urlResponse)
            setUrlResponseShow(true);
        //GET THE PRESIGNED URL LINK ?????
    }, [urlResponse])

    const handleChecked = (event, id) => {
        setSizes(prevSizes => {
            return {
                ...prevSizes,
                [id]: event.target.checked
            }
        })

    };

    const getFileExtension = (filename) => {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    };

    const getFileWithNoExtension = (fileName) => {
        const lastDotIndex = fileName.lastIndexOf('.');

        if (lastDotIndex === -1) {
            return fileName;
        }
        return fileName.substring(0, lastDotIndex);
    }

    const handleImageName = (fileName) => {
        let fileNameNoExtension = getFileWithNoExtension(fileName);
        const fileExtension = getFileExtension(fileName);
        let fileSizes = "-";
        let dot = '.';
        Object.keys(sizes).forEach((item, index, array) => {
            if (sizes[item] === true) {
                fileSizes += ((index + 1).toString())
                fileSizes += '-';
            }
        });
        fileSizes = fileSizes.slice(0, -1);
        let baseurl = baseURL
        const finalURL = (baseurl += fileNameNoExtension += fileSizes += dot += fileExtension);
        setApiURL(finalURL);
    }

    const getResizedUrls = () => {
        let baseResizedUrl = 'https://sgm31cynbh.execute-api.eu-west-1.amazonaws.com/dev/thumbnails-source-bucket-resized/';
        // baseResizedUrl +=
        // sizes.forEach(size)
    }

    const handleSubmit = () => {
        if (!image) {
            console.log("ERROR - No image selected");
            return;
        }
        console.log("image is: ", image)
        console.log("API URL : ", apiURL)
        let fileExtension = getFileExtension(image.name);
        if(fileExtension === 'jpg')
            fileExtension = "jpeg"
        axios
            .put(apiURL, image,
                {
                    headers: {
                        'Content-Type': `image/${fileExtension}`,
                    }
                }
            )
            .then((response) => {
                console.log('Image uploaded successfully!', response.data);
                setAlertMsg("Image uploaded successfully!");
                setAlertSeverity("success")
                setOpenSnackbar(true);
                //CALL THE GET ON LINK WITH PRESIGNED URL FOR setState for 'urlResponse'
                if (response.status === 200){
                    setTimeout(getResizedUrls, 2000);
                }
            })
            .catch((error) => {
                console.error('Error uploading image:', error);
                setAlertMsg("Problem uploading image...");
                setAlertSeverity("error")
                setOpenSnackbar(true);
            });
    }

    const handleUpload = (e) => {
        // setImage(URL.createObjectURL(e.target.files[0]));
        setImage(e.target.files[0]);
        handleImageName(e.target.files[0].name);
    }

    const handleOpenSnackbar = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleCameraClick = () => {
        setCameraOpen(true);
    }

    const handleURLdownload = () => {
        console.log("handle url download")
    }

    return (
        <div className="Main">
            <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Alert severity={alertSeverity} variant="filled">{alertMsg}</Alert>
            </Snackbar>
            <div className={"Main-Container"}>
                <h2>Welcome to Thumbnail converter</h2>
                <p>Upload your desired image from gallery or camera</p>
                <p>Choose your desired thumbnail size</p>
                <p>Click CONVERT</p>
                <p>Download your thumbnail from the link</p>
            </div>
            <div className={"Main-Container"}>
                <Input
                    type={"file"}
                    color={'primary'}
                    required={true}
                    accept="*.png, *.jpg, *.jpeg"
                    onChange={handleUpload}
                >
                </Input>
                <Button variant="outlined" onClick={handleCameraClick}>Take Photo</Button>
                {cameraOpen && <CameraComp setCameraOpen={setCameraOpen}/>}
                <p>Choose Thumbnail size: (Default: 100)</p>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox checked={sizes['100']} id={100} handleChecked={handleChecked}/>}
                        label="100X100"/>
                    <FormControlLabel
                        control={<Checkbox checked={sizes['200']} id={200} handleChecked={handleChecked}/>}
                        label="200X200"/>
                    <FormControlLabel
                        control={<Checkbox checked={sizes['300']} id={300} handleChecked={handleChecked}/>}
                        label="300X300"/>
                </FormGroup>
                <Button className="ConvertBtn" variant="contained" onClick={handleSubmit}>CONVERT</Button>
                {urlResponseShow && <p className={"urlDownloadLink"} onClick={handleURLdownload}>{urlResponse}</p>}
            </div>
        </div>

    );
}

export default Main;
