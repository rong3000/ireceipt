import PropTypes from 'prop-types';

import { Typography, Grid, Card, CardActionArea, CardContent } from '@mui/material';

function Tile(props) {
    const { post, onClick, icon } = props;

    return (
        <Grid item xs={12} md={6}>
            <CardActionArea component="a" onClick={onClick}>
                <Card sx={{ display: 'flex' }}>
                    <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5">
                            {post.title}
                        </Typography>
                        {icon}
                    </CardContent>
                </Card>
            </CardActionArea>
        </Grid>
    );
}

Tile.propTypes = {
    post: PropTypes.shape({
        title: PropTypes.string.isRequired,
    }).isRequired,
};

export default Tile;