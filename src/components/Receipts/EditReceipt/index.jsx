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

export default function EditReceipt() {

  const [updateReceipt, { data, error, isLoading, isSuccess, isError }] = useUpdateReceiptMutation();

  const navigate = useNavigate();

  const location = useLocation();
  const item = location.state?.item;

  const handleConfirmClick = () => {
    console.log(`date is ${date} and receiptDate is ${dayjs(item?.receiptDatetime)}`);
    console.log((date.isSame(dayjs(item?.receiptDatetime))));
    console.log(`amount is ${amount} and receiptAmount is ${item?.totalAmount}`);
    console.log((amount === item?.totalAmount));
    console.log(`name is ${name} and receiptCompanyName is ${item?.companyName}`);
    console.log((name === item?.companyName));
    let modifiedData = {
      receiptDatetime: date.format('YYYY-MM-DD[T]hh:mm:ss'),
      totalAmount: amount * 1,
      companyName: name
    }
    let receiptData = {
      ...item,
      ...modifiedData
    };
    console.log(receiptData);

    if ((date.isSame(dayjs(item?.receiptDatetime))) && amount === item?.totalAmount && name === item?.companyName) {
      navigate('/receipts', { replace: true });
    } else {
      updateReceipt(receiptData).unwrap().then(
        () => {
          console.log('succeeded')
        }
      ).catch((error) => {
        console.log('error')
      });
    }
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
        <div>
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
              <ImageListItem sx={{ height: '100% !important' }}>
                <img
                  src={`https://api.ireceipts.au/Receipt/GetImage/${encodeURIComponent(item.imagePath)}`}
                  alt={item.companyName}
                  loading="lazy"
                                />
              </ImageListItem>
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
    </Box>
  );
}
