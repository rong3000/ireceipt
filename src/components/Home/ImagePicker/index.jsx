import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  convertToPixelCrop,
} from 'react-image-crop';
import { canvasPreview } from './canvasPreview';
import { useDebounceEffect } from './useDebounceEffect';

import 'react-image-crop/dist/ReactCrop.css';

import { Box, Button } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { CircularProgress, Modal } from '@mui/material';
import { useUploadReceiptMutation } from '../../../datamodel/rtkQuerySlice';
import "./index.css"

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

function ImagePicker({ user }) {
  const [uploadReceipt, { data, error, isLoading, isSuccess, isError }] = useUploadReceiptMutation();

  const [isProgressing, setIsProgressing] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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
    // Programmatically trigger the click event of the file input with a slight delay
    let timeout = setTimeout(() => {
      fileInputRef.current.click();
    }, 100);

    return () => {
      clearTimeout(timeout)
    }
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

    setIsProgressing(true);

    if (!previewCanvasRef.current) {
      return;
    }

    const croppedCanvas = previewCanvasRef.current;
    const blob = await new Promise((resolve) => {
      croppedCanvas.toBlob((blob) => {
        resolve(blob);
      });
    });

    const file = new File([blob], "receipt.png", {
      type: blob?.type,
    });

    const formData = new FormData();
    formData.append("file", file, file.name);

    if (user) {
      uploadReceipt(formData).unwrap().then(
        () => {
          setIsProgressing(false);

          setIsSuccessModalOpen(true);
        }
      ).catch((error) => {
        setIsProgressing(false);

        setIsErrorModalOpen(true); // Open error modal
      });
    } else {
      navigate('/login', { replace: true });

    }
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    let origItem = {
      ...data.obj[0]
    };
    let keysToRemove = ['decodedContent', 'extractedContent', 'image', 'imageFileExtension', 'productIds', 'statusName', 'statusUpdateDatetime', 'submittedContent'];
    let item = (({ [keysToRemove[0]]: _, [keysToRemove[1]]: __, [keysToRemove[2]]: ___, [keysToRemove[3]]: ____, [keysToRemove[4]]: _____, [keysToRemove[5]]: ______, [keysToRemove[6]]: _______, [keysToRemove[7]]: ________, ...rest }) => rest)(origItem);

    navigate('/edit', { state: { item }, replace: true });
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
        </Box>
        <Modal open={isProgressing}>
          <div className="modal-content">
            <CircularProgress />
          </div>
        </Modal>

        <Modal open={isErrorModalOpen}>
          <div className="modal-content">
            <h2>Error</h2>
            <p>{isError ? `${error.status} ${JSON.stringify(error.data)}` : 'An error occurred.'}</p>
            <Button onClick={closeErrorModal}>Close</Button>
          </div>
        </Modal>

        <Modal open={isSuccessModalOpen}>
          <div className="modal-content">
            <h2>Success</h2>
            <p>Receipt Uploaded Successfully</p>
            <Button onClick={closeSuccessModal}>Close</Button>
          </div>
        </Modal>
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