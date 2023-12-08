import { connect } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import Tile from './Tile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const HomePage = () => {

  const navigate = useNavigate();

  const selectImage = async () => {
    navigate('/camera', { replace: true });
  };

  return (
    <div>
      <Tile onClick={selectImage} post={
        {
          description: 'Snap Your Receipt',
          title: 'Please Snap Your Receipt'
        }
      } icon={<CameraAltIcon sx={{ fontSize: 72 }} />}>
      </Tile>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isLoggedIn: state.authx.isLoggedIn,
  user: state.authx.user
});

export default connect(mapStateToProps, {})(HomePage)