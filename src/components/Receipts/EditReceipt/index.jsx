import { useLocation } from 'react-router-dom';

import React, { useEffect, useState, useRef } from 'react';

import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  Box,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  TextField,
  Card,
  ImageListItem,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUpdateReceiptMutation } from '../../../datamodel/rtkQuerySlice';
import { CircularProgress, Modal } from '@mui/material';
import "./index.css";

export default function EditReceipt() {

  const [updateReceipt, { data, error, isLoading, isSuccess, isError }] = useUpdateReceiptMutation();
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const item = location.state?.item;

  const handleConfirmClick = () => {
    let modifiedData = {
      receiptDatetime: date.format('YYYY-MM-DD[T]hh:mm:ss'),
      totalAmount: amount * 1,
      companyName: name
    }
    let receiptData = {
      ...item,
      ...modifiedData
    };

    if ((date.isSame(dayjs(item?.receiptDatetime))) && amount === item?.totalAmount && name === item?.companyName) {
      navigate('/receipts', { replace: true });
    } else {
      updateReceipt(receiptData).unwrap().then(
        () => {
          setIsSuccessModalOpen(true);
        }
      ).catch((error) => {
        setIsErrorModalOpen(true);
      });
    }
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate('/receipts', { state: { updateSuccess: true }, replace: true });
  };

  const handleCancel = async () => {
    navigate('/receipts', { replace: true });
  };

  const [date, setDate] = useState(dayjs(item?.receiptDatetime));
  const [amount, setAmount] = useState(item?.totalAmount);
  const [name, setName] = useState(item?.companyName);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {item ? (
        // Render content when itemId is available
        <div aria-label='form'>
          <Button onClick={handleConfirmClick}>Confirm</Button>
          <Button onClick={handleCancel}>Cancel</Button>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                  label="Purchase Date"
                  value={date}
                  onChange={(newValue) => setDate(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>
            <FormControl fullWidth sx={{ m: 1 }}>
              <InputLabel htmlFor="outlined-adornment-amount">Total Amount</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                label="TotalAmount"
                defaultValue={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                }}
              />
            </FormControl>
            <TextField
              id="outlined-controlled"
              label="Shop/Vendor"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
            <Card>
              <img
                src={`https://api.ireceipts.au/Receipt/GetImage/${encodeURIComponent(item.imagePath)}`}
                alt={item.companyName}
                loading="lazy"
                style={{ width: '100%' }}
              />
            </Card>
          </div>
        </div>
      ) : (
        // Render content when itemId is not available
        <div>
          <h4>No receipt item selected.</h4>
          <Button onClick={handleCancel}>Cancel</Button>

        </div>
      )}

      <Modal open={isLoading}>
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
          <p>'Receipt Updated Successfully'</p>
          <Button onClick={closeSuccessModal}>Close</Button>
        </div>
      </Modal>
    </Box>
  );
}
