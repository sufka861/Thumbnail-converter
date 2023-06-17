import '../App.css';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

function CameraComp ({setCameraOpen, handleCameraUpload}) {
    function handleTakePhoto (dataUri) {
        console.log('takePhoto');
        // console.log(dataUri)
        setCameraOpen(false)
        handleCameraUpload(dataUri)
    }

    return (
        <Camera
            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
        />
    );
}

export default CameraComp;