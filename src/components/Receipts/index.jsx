import { connect } from 'react-redux'

import { useNavigate } from 'react-router-dom';

import { useGetReceiptsQuery } from '../../datamodel/rtkQuerySlice';

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Button from '@mui/material/Button';

import {
  Avatar,
  Card,
  Container,
  Rating,
  Tooltip,
} from '@mui/material';
import { StarBorder } from '@mui/icons-material';


const Receipts = ({ isLoggedIn }) => {

  const { data, error, isLoading, refetch, isUninitialized } = useGetReceiptsQuery(
    undefined,
    {
      skip: !isLoggedIn
    }
  );

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login/', { replace: true });
  };

  if (!isLoggedIn) {
    return <div>Not logged in yet and please <Button color="primary" onClick={handleLogin}>Log In</Button></div>
  }

  return (
    <div>
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
                  {data.obj.map((item) => (
                    <Card key={item.id}>
                      <ImageListItem sx={{ height: '100% !important' }}>
                        <ImageListItemBar
                          sx={{
                            background:
                              'linear-gradient(to bottom, rgba(0,0,0,0.7)0%, rgba(0,0,0,0.3)70%, rgba(0,0,0,0)100%)',
                          }}
                          title={item.totalAmount === 0 ? 'Free Stay' : '$' + item.totalAmount}
                          actionIcon={
                            <Tooltip title={item.companyName} sx={{ mr: '5px' }}>
                              <Avatar src={`https://api.ireceipts.au/Receipt/GetImage/${encodeURIComponent(item.imagePath)}`} />
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
                            <Rating
                              sx={{ color: 'rgba(255,255,255, 0.8)', mr: '5px' }}
                              name="item-rating"
                              defaultValue={3.5}
                              precision={0.5}
                              emptyIcon={
                                <StarBorder sx={{ color: 'rgba(255,255,255, 0.8)' }} />
                              }
                            />
                          }
                        />
                      </ImageListItem>
                    </Card>
                  ))}
                </ImageList>
              </Container>
            ) : null}
        </div>

      ) : (
        <>
        </>
      )}
    </div>
  )
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn
});

export default connect(mapStateToProps, {})(Receipts);

