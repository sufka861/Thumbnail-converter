import '../App.css';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';

function CameraComp ({setCameraOpen}) {
    function handleTakePhoto (dataUri) {
        // Do stuff with the photo...
        console.log('takePhoto');
        console.log(dataUri)
        setCameraOpen(false)
    }

    return (
        <Camera
            onTakePhoto = { (dataUri) => { handleTakePhoto(dataUri); } }
        />
    );
}

export default CameraComp;