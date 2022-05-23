import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import {  styled } from '@mui/material/styles';
import {  Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
// utils

//
import SvgIconStyle from '../../../components/SvgIconStyle';
import ACCOUNT from '../../../_mock/account'
// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(15%)',
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 300,
  height: 300,
  position: 'absolute',
  left: theme.spacing(18),
  bottom: theme.spacing(-21),
  borderWidth: 2,
  borderColor: '#000',
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled,
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '200%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

// ----------------------------------------------------------------------

ProfileCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function   ProfileCard({ post, index }) {
  const { cover, title, view, comment, share, author, createdAt } = post;
  const latestPostLarge = false;
  const latestPost = false;

  const POST_INFO = [
    { number: comment, icon: 'eva:message-circle-fill' },
    { number: view, icon: 'eva:eye-fill' },
    { number: share, icon: 'eva:share-fill' },
  ];

  return (
    <Grid item xs={12} sm={12} md={12}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle>
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 500,
              height: 350,
              zIndex: 9,
              bottom: -140,
              position: 'absolute',
              color: 'background.paper',
              ...((latestPostLarge || latestPost) && { display: 'none' }),
            }}
          />
          <AvatarStyle
            alt={author.name}
            src='https://directory.seas.upenn.edu/wp-content/uploads/2020/03/Greenberg-Clayton.jpg'
          />

          <CoverImgStyle alt={title} src={cover} />

        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4,

          }}
        >

          <TitleStyle
            to="#"
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
            sx={{
               typography: 'h3x', height: 450, zIndex: 1,
            }}
          >
            {ACCOUNT.displayName}
          </TitleStyle>

        </CardContent>
      </Card>
    </Grid>
  );
}
