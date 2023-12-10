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

export default function EditReceipt() {

  const location = useLocation();
  const item = location.state?.item;

  const [date, setDate] = useState(dayjs(item?.receiptDatetime));
  const [amount, setAmount] = useState(item?.totalAmount);
  const [name, setName] = useState(item?.companyName);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {item ? (
        // Render content when itemId is available
        <div>
          <Button onClick={() => { console.log('confirm') }}>Confirm</Button>
          <Button onClick={() => { console.log('cancel') }}>Cancel</Button>
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
          <Button onClick={console.log('cancel')}>Cancel</Button>
        </div>
      )}
    </Box>
  );
}
