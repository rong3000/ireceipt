import { useLocation } from 'react-router-dom';

import {
  Box,
  Card,
  ImageListItem,
  Button
} from '@mui/material';

export default function EditReceipt() {

  const location = useLocation();
  const item = location.state?.item;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
      {item ? (
        // Render content when itemId is available
            <Card>
              <ImageListItem sx={{ height: '100% !important' }}>
                <img
                  src={`https://api.ireceipts.au/Receipt/GetImage/${encodeURIComponent(item.imagePath)}`}
                  alt={item.companyName}
                  loading="lazy"
                />
              </ImageListItem>
            </Card>
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
