import React, { useState, useRef } from 'react';
import { FaCamera } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import CameraComp from './CameraComp';

function TakeAPicture() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [cameraOpen, setCameraOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission logic here
    // You can use the selectedImage and selectedSize state values
    // Reset the form after submission
    setSelectedImage(null);
    setSelectedSize('');
  };

  const handleCameraClick = () => {
    setCameraOpen(true);
  };

  const clearFiles = () => {
    setSelectedImage(null);
  };

  return (
    <div>
      <h2 style={{marginBottom:'5px'}}>Take Photo</h2>

      <Button variant="outline-secondary" onClick={handleCameraClick} > <FaCamera />  </Button>{' '}

      {cameraOpen && <CameraComp setCameraOpen={setCameraOpen} />}
    
      <form onSubmit={handleSubmit}>
      <br></br>
        <div className="button-group">
          <InputGroup className="mb-3">
            <InputGroup.Checkbox aria-label="Checkbox for following text input" />
            <Form.Control
              aria-label="Text input with checkbox"
              readOnly
              placeholder="100*100"
              value="100*100"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Checkbox aria-label="Checkbox for following text input" />
            <Form.Control
              aria-label="Text input with checkbox"
              readOnly
              placeholder="200*200"
              value="200*200"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Checkbox aria-label="Checkbox for following text input" />
            <Form.Control
              aria-label="Text input with checkbox"
              readOnly
              placeholder="300*300"
              value="300*300"
            />
          </InputGroup>
        </div>
        <Button type="submit" variant="warning">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default TakeAPicture;
