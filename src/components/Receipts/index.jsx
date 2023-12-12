import { connect } from 'react-redux'

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


import { login, logout, authInit } from '../../redux/actions/authActions';//done

import { useGetReceiptsQuery } from '../../datamodel/rtkQuerySlice';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';

import dayjs from 'dayjs';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
  Avatar,
  Card,
  Container,
    Tooltip,
} from '@mui/material';

const Receipts = ({ isLoggedIn, authInit }) => {

  const location = useLocation();

  const updateSuccess = location.state?.updateSuccess;

  const { data, error, isLoading, refetch, isUninitialized } = useGetReceiptsQuery(
    undefined,
    {
      skip: !isLoggedIn
    }
  );

  const navigate = useNavigate();

  const handleLogin = () => {
    authInit();
    navigate('/login', { replace: true });
  };

  const onReceiptClick = (item) => {
    console.log('Receipt Clicked', item);
    navigate('/edit', { state: { item }, replace: true });
  };

  if (!isLoggedIn) {
    return <div>Not logged in yet and please <Button color="primary" onClick={handleLogin}>Log In</Button></div>
  }

  return (
    <div aria-label='All receipts'>
      {isLoggedIn ? (

        <div>
          {isLoading ? (
            <div>Loading...</div>
          ) : error ?
            (error.status === 401 ?
              <div>Authentication expired, please <Button color="primary" onClick={handleLogin}>Log In</Button> again.</div> :
              <div>Other error</div>)
            : data ? (
              <Container>
                <ImageList
                  gap={12}
                  sx={{
                    mb: 8,
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(280px, 1fr))!important',
                  }}
                >
                  {data.obj?.length > 0 ? data.obj.map((item) => (
                    <ImageListItem sx={{ height: '100% !important' }} onClick={() => onReceiptClick(item)}>
                      <ImageListItemBar
                        sx={{
                          background:
                            'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
                        }}
                        title={item.totalAmount === 0 ? '$0' : '$' + item.totalAmount}
                        actionIcon={
                          <Tooltip title={item.companyName} sx={{ mr: '5px' }}>
                            <Avatar
                              src={`https://api.ireceipts.au/Receipt/GetImage/${encodeURIComponent(item.imagePath)}`}
                              alt={item.companyName}
                            />
                          </Tooltip>
                        }
                        position="top"
                      />
                      <img
                        src={`https://api.ireceipts.au/Receipt/GetImage/${encodeURIComponent(item.imagePath)}`}
                        alt={item.companyName}
                        loading="lazy"
                        style={{ cursor: 'pointer' }}
                      />
                      <ImageListItemBar
                        title={item.companyName}
                        actionIcon={
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileDatePicker value={dayjs(item.receiptDatetime)} readOnly />
                          </LocalizationProvider>
                        }
                      />
                    </ImageListItem>
                  )): <h3>You don't have any receipts.</h3>}
                </ImageList>
              </Container>
            ) : <h3>You don't have any receipts.</h3>}
        </div>

      ) : (
        <div>Not logged in yet and please <Button color="primary" onClick={handleLogin}>Log In</Button></div>
      )}
    </div>
  )
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn,
  user: state.authx.user
});

export default connect(mapStateToProps, {authInit})(Receipts);

