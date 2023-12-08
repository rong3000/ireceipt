import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';

import { Card, CardContent, Typography, IconButton, Stack, Box, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux'

const ServiceBaseUrl = process.env.REACT_APP_SERVER

const UploadReceiptImages = ServiceBaseUrl + "Receipt/UploadReceiptImages/0";

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

function ImagePicker({user}) {
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const hiddenAnchorRef = useRef(null);
  const blobUrlRef = useRef('');
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect, setAspect] = useState(16 / 9);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleCancel = async () => {
    navigate('/', { replace: true });
  }

  useEffect(() => {
    // Programmatically trigger the click event of the file input
    fileInputRef.current.click();
  }, []);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result ? reader.result.toString() : '')
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onDownloadCropClick() {
    if (!previewCanvasRef.current) {
      throw new Error('Crop canvas does not exist');
    }

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to create blob');
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      blobUrlRef.current = URL.createObjectURL(blob);
      hiddenAnchorRef.current.href = blobUrlRef.current;
      console.log(hiddenAnchorRef.current.href);
      hiddenAnchorRef.current.click();
    });
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate]
  );

  function getAPIVersion() {
    return "0.1";
  }

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      const newCrop = centerAspectCrop(width, height, 16 / 9);
      setCrop(newCrop);
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    }
  }

  const handleConfirmClick = async () => {
    if (!previewCanvasRef.current) {
      return;
    }

    const croppedCanvas = previewCanvasRef.current;
    const blob = await new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(blob);
      });
    });
    try {
      
      const headers = new Headers();
      headers.append("api-version", getAPIVersion());
      const accessToken = user?.accessToken;

      if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
      }
      // headers.append("Authorization", "Bearer " + token);

      const file = new File([blob], "receipt.png", {
        type: blob.type,
      });

      console.log('file is ', file);

      const formData = new FormData();
      formData.append("file", file, file.name);

      const requestOptions = {
        method: "POST",
        headers: headers,
        body: formData
      };

      const response = await fetch(UploadReceiptImages, requestOptions);
      console.log(response.status);
      if (response.status === 200) {
        const data = await response.json();
        console.log('data is ', data);
        return data;
      } else {
        return {
          msgCode: response.status,
          msg: "HTTP response code: " + response.status.toString(),
        }
      }
    } catch (error) {
      if (error.name === "TimeoutError") {
        return {
          msgCode: 9000,
          msg: "Time out!",
        }
      } else {
        // Log an error
        return {
          msgCode: -1,
          msg: error.toString(),
        }
      }
    }

  };

  return (
    <div className="App">
      <div className="Crop-Controls">
        <Box display="flex" alignItems="center" justifyContent="center" spacing={2}>
          <label htmlFor="file-input" style={{ cursor: 'pointer' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onSelectFile}
              id="file-input"
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<PhotoCamera />}
            >
            </Button>
          </label>
          <div>
            <Button onClick={handleConfirmClick}>Confirm</Button>
            <a
              ref={hiddenAnchorRef}
              download
              style={{
                position: 'absolute',
                top: '-200vh',
                visibility: 'hidden',
              }}
            >
              Hidden download
            </a>
          </div>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={onDownloadCropClick}>Download</Button>
          
        </Box>
      </div>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={undefined}
        >
          <img
            ref={imgRef}
            alt="Crop me"
            src={imgSrc}
            style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
      {!!completedCrop && (
        <>
          <div>
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: completedCrop.width,
                height: completedCrop.height,
              }}
            />
          </div>

        </>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn,
  user: state.authx.user
});

export default connect(mapStateToProps, { })(ImagePicker);

