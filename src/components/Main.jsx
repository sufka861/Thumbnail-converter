import '../App.css';
import axios from 'axios';
import CameraComp from './CameraComp';
import React, { useState, useRef, useEffect } from 'react';
import { FaCloudUploadAlt, FaCamera, FaGraduationCap } from 'react-icons/fa';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import { BsArrowClockwise } from 'react-icons/bs';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';


const Main = () => {
  let apiURL = '';
  const [printUrl, setPrintUrl] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [buttonSize, setButtonSize] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const filePickerRef = useRef(null);
  const [image, setImage] = useState(null);
  // const [apiURL, setApiURL] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMsg, setAlertMsg] = useState("Alert msg");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [urlResponseShow, setUrlResponseShow] = useState(false);
  const [urlResponse, setUrlResponse] = useState([]);
  const [cameraImgCount, setCameraImageCount] = useState(0);
  const [sizes, setSizes] = useState({
    '100': true,
    '200': false,
    '300': false
  });

  useEffect(() => {
    setBaseURL('https://sgm31cynbh.execute-api.eu-west-1.amazonaws.com/dev/thumbnails-source-bucket/');
  }, [image])

  // useEffect(() => {
  //   if (urlResponse)
  //     setUrlResponseShow(true);
  //   //GET THE PRESIGNED URL LINK ?????
  // }, [urlResponse])

  const handleChecked = (event, id) => {
    console.log(sizes);
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
    fileName = removeDashFromImageName(fileName)
    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex === -1) {
      return fileName;
    }
    return fileName.substring(0, lastDotIndex);
  }

  const removeDashFromImageName = (imgName) => {
    console.log(imgName);
    let name = imgName.replace(/-/g, '');
    name = name.replace(/\s/g, '');
    console.log(name);
    return name;
  }


  const handleImageName = (fileName) => {
    if (!fileName) {
      console.log("no filename given to handleImageName");
      return;
    }
    fileName = removeDashFromImageName(fileName)
    let fileNameNoExtension = getFileWithNoExtension(fileName);
    const fileExtension = getFileExtension(fileName);
    let fileSizes = "-";
    if (Object.values(sizes).every(value => value === false)) {
      setSizes({
        '100': true,
        '200': false,
        '300': false
      })
    }
    Object.keys(sizes).forEach((item, index, array) => {
      if (sizes[item] === true) {
        fileSizes += ((index + 1).toString())
        fileSizes += '-';
      }
    });
    fileSizes = fileSizes.slice(0, -1);
    // let baseurl = baseURL
    const finalURL = [baseURL, fileNameNoExtension, fileSizes, '.', fileExtension].join('');
    // const finalURL = (baseurl + fileNameNoExtension + fileSizes + dot + fileExtension);
    console.log("finalURL in handlename: ", finalURL)
    // setApiURL(finalURL);
    apiURL = finalURL;
    console.log("apiURL after setApiURL: ", apiURL)
  }

  useEffect(() => {
    handleImageName(image?.name);
  }, [sizes])


  const getResizedImg = (url) => {
    console.log(url);
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: url,
      headers: {
        'Content-Type': 'text/plain'
      }
    };
    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setAlertMsg("Resized Image Received!");
        setAlertSeverity("success")
        setOpenSnackbar(true);
        //ADD DISPLAY FOR THE URLS
        if (response.status === 200) {
          setUrlResponse((prevResponse => [...prevResponse, response.data]))
          setUrlResponseShow(true);
        }

      })
      .catch((error) => {
        console.error('Error Fetching the resized image:', error);
        setAlertMsg("Problem Fetching the resized image...");
        setAlertSeverity("error")
        setOpenSnackbar(true);
      });
  }

  const getResizedUrls = () => {
    let baseResizedUrl = 'https://sgm31cynbh.execute-api.eu-west-1.amazonaws.com/dev/thumbnails-source-bucket-resized/';
    const sizesArr = [];
    for (const key in sizes) {
      if (sizes[key] === true) {
        const numericKey = Number(key);
        if (!isNaN(numericKey)) {
          sizesArr.push(numericKey);
        }
      }
    }


    let resizedURL = [];
    sizesArr.forEach(size => {
      let fileName;
      let fileExtension;
      if (image) {
        fileName = getFileWithNoExtension(image.name);
        fileExtension = getFileExtension(image.name);

      } else {
        fileExtension = getFileExtension(`cameraImg${cameraImgCount}.png`);
        fileName = getFileWithNoExtension(`cameraImg${cameraImgCount}.png`);
      }
      resizedURL.push([baseResizedUrl, fileName, '-', size, '.', fileExtension].join(''))
    });

    resizedURL.forEach(url => getResizedImg(url))
  }


  function getImageSize(imageFile) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        const width = img.width;
        const height = img.height;
        resolve({ width, height });
      };
      img.onerror = function () {
        reject(new Error('Failed to load the image'));
      };
      const reader = new FileReader();
      reader.onload = function (event) {
        img.src = event.target.result;
      };
      reader.onerror = function () {
        reject(new Error('Failed to read the file'));
      };
      reader.readAsDataURL(imageFile);
    });
  }
  function checkImageSize(imageFile) {
    return getImageSize(imageFile)
      .then(({ width, height }) => {
        // console.log(`Image width: ${width}px`);
        // console.log(`Image height: ${height}px`);
        if ((sizes[0] && width > sizes[0] && height > sizes[0]) || (!sizes[0] && width > 100 && height > 100)) {
          return true
        } else {
          return false
        }
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  }

  const handleSubmit = () => {
    if (!image) {
      console.log("ERROR - No image selected");
      return;
    }
    console.log("image is: ", image)
    console.log("API URL : ", apiURL)
    let fileExtension = getFileExtension(image.name);
    if (fileExtension === 'jpg')
      fileExtension = "jpeg"

    checkImageSize(image)
      .then(r => {
        console.log("image size is OK")
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
            if (response.status === 200) {
              setTimeout(getResizedUrls, 2000);
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
            setAlertMsg("Problem uploading image...");
            setAlertSeverity("error")
            setOpenSnackbar(true);
          });
      })
      .catch(error => {
        console.error('Error image size smaller than thumbnail', error);
        setAlertMsg("image size smaller than thumbnail...");
        setAlertSeverity("error")
        setOpenSnackbar(true);
      });
  }


  const handleCameraClick = () => {
    setCameraOpen(true);
  };

  function getStringAfterFirstSlash(inputString) {
    const regex = /\/(.*)/;
    const match = inputString.match(regex);
    return match ? match[1] : inputString;
  }


  const handleUpload = (e) => {

    setImage(e.target.files[0]);
    handleImageName(e.target.files[0].name);
  };

  const handleImageChange = (event) => {
    handleUpload(event);
    setSelectedImage(event.target.files[0]);
    previewFile(event);
    handleUpload(event);
  };
  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmitCamera = (event) => {
    event.preventDefault();
    // Perform form submission logic here
    // You can use the selectedImage and selectedSize state values
    // Reset the form after submission
    setSelectedImage(null);
    setSelectedSize('');
  };

  const previewFile = (event) => {
    const reader = new FileReader();
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      reader.onload = (readerEvent) => {
        if (selectedFile.type.includes('image')) {
          setImagePreview(readerEvent.target.result);
          setVideoPreview(null);
        } else if (selectedFile.type.includes('video')) {
          setVideoPreview(readerEvent.target.result);
          setImagePreview(null);
        }
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const clearFiles = () => {
    setImagePreview(null);
    setVideoPreview(null);
  };

  const handleClick = () => {
    setShowInstructions(true);
  };

  const handleBackClick = () => {
    setShowInstructions(false);
    setShowForm(false);
    setShowComponent(false);
    setOpenSnackbar(false);
  };

  const handleClickUpload = () => {
    setShowForm(true);
  };

  const handleClickCamera = () => {
    setShowComponent(true);
    setPrintUrl(true);
  };

  useEffect(() => {
    const calculateButtonSize = () => {
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - 80; // Subtracting the margin around the buttons (30px top and 30px bottom)
      setButtonSize(availableHeight / 3 - 50);
    };

    calculateButtonSize();
    window.addEventListener('resize', calculateButtonSize);
    return () => window.removeEventListener('resize', calculateButtonSize);
  }, []);

  const handleCameraUpload = (dataURI) => {

    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    let cameraImgType = getStringAfterFirstSlash(dataURI.split(',')[0].split(':')[1].split(';')[0]);
    const cameraImgName = `cameraImg${cameraImgCount}.${cameraImgType}`;
    setCameraImageCount(prevCount => prevCount + 1)

    setImage(blob);

    handleImageName(cameraImgName);

    console.log("blob: ", blob);
    console.log("image: ", image);
    console.log("apiURL: ", apiURL);

    // const staticImgURL = `https://sgm31cynbh.execute-api.eu-west-1.amazonaws.com/dev/thumbnails-source-bucket/cameraImg${cameraImgCount}-1.png`;

    if (cameraImgType === "jpg")
      cameraImgType = "jpeg";

    console.log("camera img type: ", cameraImgType)

    axios.put(apiURL, blob, {
      headers: {
        'Content-Type': `image/${cameraImgType}`,
        // 'Content-Type': `image/png`,
      },
    }).then(response => {
      console.log('Image uploaded successfully!', response.data);
      setAlertMsg("Image uploaded successfully!");
      setAlertSeverity("success")
      setOpenSnackbar(true);

      if (response.status === 200) {
        setUrlResponse(prevResponse => [...prevResponse, response.data]);
        setTimeout(getResizedUrls, 2000);

      }
    }).catch(error => {
      console.error('Error uploading image:', error);
      setAlertMsg("Problem uploading image...");
      setAlertSeverity("error")
      setOpenSnackbar(true);
    });
  }
  console.log(urlResponseShow);
  function refreshPage() {
    window.location.reload();
  }


  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
      >
        <Alert severity={alertSeverity} variant="filled">{alertMsg}</Alert>
      </Snackbar>
      {urlResponseShow ? (
        <div style={{ marginTop: '20px' }}>
          <Card handleBackClick={handleBackClick}>
            <div>
              <h2>Image Download Links</h2>
              <div className="urlDownloadLink">
                {urlResponse.map((url, index) => {
                  if (printUrl === true && index === 0) {return}
                 
                  return (
                    <a href={url} key={url}>
                      <Button variant="dark" style={{ marginBottom: "10px" }} className="w-100" key={url}>
                        Image {index}
                      </Button>
                    </a>
                  );
                })}
              </div>
              <Button variant="warning" onClick={refreshPage}>
                <BsArrowClockwise color="white" size={20} />
              </Button>
            </div>

          </Card>
        </div>
      ) : (
        <>
          {showInstructions ? (
            <div style={{ marginTop: '20px' }}>
              <Card handleBackClick={handleBackClick}>
                <Instructions />
              </Card>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', height: '90vh', alignItems: 'center', justifyContent: 'center' }}>
                <MainButton handleClick={handleClickUpload} size={buttonSize} icon={<FaCloudUploadAlt size={buttonSize * 0.6} color='#FD9800' />} />
                <MainButton handleClick={handleClickCamera} size={buttonSize} icon={<FaCamera size={buttonSize * 0.55} color='#FD9800' />} />
                <MainButton handleClick={handleClick} size={buttonSize} icon={<FaGraduationCap size={buttonSize * 0.6} color='#FD9800' />} />
              </div>
              {/* {urlResponseShow && (
                <div style={{ marginTop: '20px' }}>
                  <Card handleBackClick={handleBackClick}>
                    <div>
                      <h2>Image Download Links</h2>
                      <div className="urlDownloadLink">
                        {urlResponse.map((url, index) => (
                      
                          <a href={url} key={url}> 
                            {index + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              )} */}
              {!urlResponseShow && showForm && (
                <div style={{ marginTop: '20px' }}>
                  <Card handleBackClick={handleBackClick}>
                    <div>
                      <h2>Image Upload</h2>
                      <br />
                      <div className="btn-container">
                        <input ref={filePickerRef} accept="image/*" onChange={handleImageChange} type="file" hidden />

                        <Button variant="outline-secondary" onClick={() => filePickerRef.current.click()}> Choose <FaCamera />  </Button>{' '}

                        {(imagePreview) && (
                          <button style={{ marginBottom: '10px' }} className="btn" onClick={clearFiles}>x</button>
                        )}
                      </div>

                      <div className="preview" style={{ maxHeight: 'calc(100vh - 400px)', overflow: 'auto' }}>
                        {imagePreview != null && (
                          <img src={imagePreview} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        )}
                        {videoPreview != null && (
                          <video controls src={videoPreview} style={{ maxWidth: '100%', maxHeight: '100%' }}></video>
                        )}
                      </div>

                      <form onSubmit={handleSubmitCamera}>
                        <br />
                        <div className="button-group">
                          <InputGroup className="mb-3">
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              checked={sizes['100']}
                              onChange={(event) => handleChecked(event, 100)}
                            />
                            <Form.Control aria-label="Text input with checkbox" readOnly placeholder='100*100' />
                          </InputGroup>
                          <InputGroup className="mb-3">
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              checked={sizes['200']}
                              onChange={(event) => handleChecked(event, 200)}
                            />
                            <Form.Control aria-label="Text input with checkbox" readOnly placeholder='200*200' />
                          </InputGroup>
                          <InputGroup className="mb-3">
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              checked={sizes['300']}
                              onChange={(event) => handleChecked(event, 300)}
                            />
                            <Form.Control aria-label="Text input with checkbox" readOnly placeholder='300*300' />
                          </InputGroup>
                        </div>
                        <Button className='submit-btn' type="submit" variant="warning" onClick={handleSubmit}>Submit</Button>
                      </form>


                    </div>
                  </Card>
                </div>
              )}

              {showComponent && (
                <div style={{ marginTop: '20px' }}>
                  <Card handleBackClick={handleBackClick}>
                    <div>
                      <h2 style={{ marginBottom: '5px' }}>Take Photo</h2>
                      <Button variant="outline-secondary" onClick={handleCameraClick} > <FaCamera />  </Button>{' '}
                      {cameraOpen && <CameraComp setCameraOpen={setCameraOpen} handleCameraUpload={handleCameraUpload} />}

                      <form onSubmit={handleSubmit}>
                        <br></br>
                        <div className="button-group">
                          <InputGroup className="mb-3">
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              checked={sizes['100']}
                              onChange={(event) => handleChecked(event, 100)}
                            />
                            <Form.Control aria-label="Text input with checkbox" readOnly placeholder='100*100' />
                          </InputGroup>
                          <InputGroup className="mb-3">
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              checked={sizes['200']}
                              onChange={(event) => handleChecked(event, 200)}
                            />
                            <Form.Control aria-label="Text input with checkbox" readOnly placeholder='200*200' />
                          </InputGroup>
                          <InputGroup className="mb-3">
                            <InputGroup.Checkbox
                              aria-label="Checkbox for following text input"
                              checked={sizes['300']}
                              onChange={(event) => handleChecked(event, 300)}
                            />
                            <Form.Control aria-label="Text input with checkbox" readOnly placeholder='300*300' />
                          </InputGroup>
                        </div>
                        <Button className='submit-btn' type="submit" variant="warning" onClick={handleSubmit}>Submit</Button>
                      </form>
                    </div>
                  </Card>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );

};

const MainButton = ({ handleClick, size, icon }) => {
  return (
    <button
      style={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '24px',
        border: 'none',
        borderRadius: '8px',
        background: 'white',
        margin: '15px',
      }}
      onClick={handleClick}
    >
      {icon}
    </button>
  );
};

const Card = ({ children, handleBackClick }) => {
  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'fixed',
          top: '0',
          left: '0',
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: '999',
        }}
      >
        <div
          style={{
            width: '80%',
            maxWidth: '500px',
            padding: '20px',
            background: '#fff',
            borderRadius: '8px',
            textAlign: 'center',
            overflow: 'auto',
            maxHeight: '80vh',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outline-secondary" onClick={handleBackClick} style={{ fontSize: "15px" }}>X</Button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};





const Instructions = () => {
  return (
    <div>
      <h3>Welcome to Thumbnail Maker </h3>
      <br></br>
      <p>1. Upload your desired image from gallery or camera</p>
      <p>2. Choose your desired thumbnail size</p>
      <p>3. Click CONVERT</p>
      <p>4. Download your thumbnail from the link</p>
      <br />
      <p>Naor Roni - Karmon Suf - Dekel Racheli</p>
    </div>
  );
};

export default Main;
