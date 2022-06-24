// material
import {Grid, Container, Typography, Card, CardContent, Avatar, Button} from '@mui/material';
import CardActions from '@mui/material/CardActions';

// components
import {styled, useTheme} from "@mui/material/styles";
import ReactReduxContext, {connect, useSelector, useStore} from 'react-redux';
import {useState} from "react";
import Page from '../components/Page';

import ACCOUNT from "../_mock/account";
import {truncate} from "../utils/sharedMethods";

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(15%)',
});


const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 220,
  height: 220,
  position: 'absolute',
  left: theme.spacing(5),
  bottom: theme.spacing(0),


}));

// ----------------------------------------------------------------------

const ANNOUNCEMENTS = [
  { id: 5,
    color: '#118C4F',
    type: 'Funding',
    title: "Keye just completed their Series B funding round!",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta orci in ante placerat, quis dignissim mi semper. Curabitur tortor nulla, ultrices a libero ac, blandit sollicitudin neque. Morbi ullamcorper, ligula at dapibus consequat, urna purus porta turpis, vitae interdum tortor justo vitae turpis. Vestibulum scelerisque vehicula urna ut tempus. Maecenas ut tincidunt metus. Pellentesque interdum orci at pretium posuere. Sed quis magna tortor. Fusce eget odio dapibus, venenatis magna in, euismod ipsum. Donec nisi diam, gravida eu augue at, euismod laoreet elit. Nulla sollicitudin eros non tempor blandit. Maecenas tempor nibh leo. Mauris hendrerit in orci vel sodales.\n" +
        "\n" +
        "Fusce lectus dolor, laoreet ut velit eget, rhoncus fermentum augue. Donec eu turpis vel risus aliquet vehicula at sit amet sapien. Quisque non urna tincidunt, porta odio at, iaculis nulla. Nulla ultrices, lacus quis accumsan ullamcorper, magna nunc rhoncus justo, nec ultricies justo felis in magna. Nullam ullamcorper nulla ex, in finibus nisl elementum nec. Morbi tincidunt imperdiet velit quis vulputate. Vivamus in iaculis nunc. Nunc non sollicitudin ligula, sed hendrerit lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus a dolor sit amet tortor vestibulum ornare. Nullam consequat nec diam ut fermentum. Vestibulum lobortis arcu consequat, ornare felis eget, egestas mauris. Nam dignissim enim sit amet massa tempus blandit. Vivamus gravida arcu non ante volutpat, at tempor erat cursus.\n" +
        "\n",
  },
  { id: 4,
    color: '#f57c00',
    type: 'Product Launch',
    title: "Keye has been launched in Europe",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta orci in ante placerat, quis dignissim mi semper. Curabitur tortor nulla, ultrices a libero ac, blandit sollicitudin neque. Morbi ullamcorper, ligula at dapibus consequat, urna purus porta turpis, vitae interdum tortor justo vitae turpis. Vestibulum scelerisque vehicula urna ut tempus. Maecenas ut tincidunt metus. Pellentesque interdum orci at pretium posuere. Sed quis magna tortor. Fusce eget odio dapibus, venenatis magna in, euismod ipsum. Donec nisi diam, gravida eu augue at, euismod laoreet elit. Nulla sollicitudin eros non tempor blandit. Maecenas tempor nibh leo. Mauris hendrerit in orci vel sodales.\n" +
        "\n" +
        "Fusce lectus dolor, laoreet ut velit eget, rhoncus fermentum augue. Donec eu turpis vel risus aliquet vehicula at sit amet sapien. Quisque non urna tincidunt, porta odio at, iaculis nulla. Nulla ultrices, lacus quis accumsan ullamcorper, magna nunc rhoncus justo, nec ultricies justo felis in magna. Nullam ullamcorper nulla ex, in finibus nisl elementum nec. Morbi tincidunt imperdiet velit quis vulputate. Vivamus in iaculis nunc. Nunc non sollicitudin ligula, sed hendrerit lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus a dolor sit amet tortor vestibulum ornare. Nullam consequat nec diam ut fermentum. Vestibulum lobortis arcu consequat, ornare felis eget, egestas mauris. Nam dignissim enim sit amet massa tempus blandit. Vivamus gravida arcu non ante volutpat, at tempor erat cursus.\n" +
        "\n",
  },
  { id: 3,
    color: '#c71ac9',
    type: 'Organizational',
    title: "Clayton Greenberg has been appointed as CEO",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta orci in ante placerat, quis dignissim mi semper. Curabitur tortor nulla, ultrices a libero ac, blandit sollicitudin neque. Morbi ullamcorper, ligula at dapibus consequat, urna purus porta turpis, vitae interdum tortor justo vitae turpis. Vestibulum scelerisque vehicula urna ut tempus. Maecenas ut tincidunt metus. Pellentesque interdum orci at pretium posuere. Sed quis magna tortor. Fusce eget odio dapibus, venenatis magna in, euismod ipsum. Donec nisi diam, gravida eu augue at, euismod laoreet elit. Nulla sollicitudin eros non tempor blandit. Maecenas tempor nibh leo. Mauris hendrerit in orci vel sodales.\n" +
        "\n" +
        "Fusce lectus dolor, laoreet ut velit eget, rhoncus fermentum augue. Donec eu turpis vel risus aliquet vehicula at sit amet sapien. Quisque non urna tincidunt, porta odio at, iaculis nulla. Nulla ultrices, lacus quis accumsan ullamcorper, magna nunc rhoncus justo, nec ultricies justo felis in magna. Nullam ullamcorper nulla ex, in finibus nisl elementum nec. Morbi tincidunt imperdiet velit quis vulputate. Vivamus in iaculis nunc. Nunc non sollicitudin ligula, sed hendrerit lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus a dolor sit amet tortor vestibulum ornare. Nullam consequat nec diam ut fermentum. Vestibulum lobortis arcu consequat, ornare felis eget, egestas mauris. Nam dignissim enim sit amet massa tempus blandit. Vivamus gravida arcu non ante volutpat, at tempor erat cursus.\n" +
        "\n",
  },
  { id: 2,
    color: '#118C4F',
    type: 'Funding',
    title: "Keye just completed their Series A funding round!",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta orci in ante placerat, quis dignissim mi semper. Curabitur tortor nulla, ultrices a libero ac, blandit sollicitudin neque. Morbi ullamcorper, ligula at dapibus consequat, urna purus porta turpis, vitae interdum tortor justo vitae turpis. Vestibulum scelerisque vehicula urna ut tempus. Maecenas ut tincidunt metus. Pellentesque interdum orci at pretium posuere. Sed quis magna tortor. Fusce eget odio dapibus, venenatis magna in, euismod ipsum. Donec nisi diam, gravida eu augue at, euismod laoreet elit. Nulla sollicitudin eros non tempor blandit. Maecenas tempor nibh leo. Mauris hendrerit in orci vel sodales.\n" +
        "\n" +
        "Fusce lectus dolor, laoreet ut velit eget, rhoncus fermentum augue. Donec eu turpis vel risus aliquet vehicula at sit amet sapien. Quisque non urna tincidunt, porta odio at, iaculis nulla. Nulla ultrices, lacus quis accumsan ullamcorper, magna nunc rhoncus justo, nec ultricies justo felis in magna. Nullam ullamcorper nulla ex, in finibus nisl elementum nec. Morbi tincidunt imperdiet velit quis vulputate. Vivamus in iaculis nunc. Nunc non sollicitudin ligula, sed hendrerit lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus a dolor sit amet tortor vestibulum ornare. Nullam consequat nec diam ut fermentum. Vestibulum lobortis arcu consequat, ornare felis eget, egestas mauris. Nam dignissim enim sit amet massa tempus blandit. Vivamus gravida arcu non ante volutpat, at tempor erat cursus.\n" +
        "\n",
  },
  { id: 1,
    color: '#118C4F',
    type: 'Funding',
    title: "Keye just completed their seed funding round!",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porta orci in ante placerat, quis dignissim mi semper. Curabitur tortor nulla, ultrices a libero ac, blandit sollicitudin neque. Morbi ullamcorper, ligula at dapibus consequat, urna purus porta turpis, vitae interdum tortor justo vitae turpis. Vestibulum scelerisque vehicula urna ut tempus. Maecenas ut tincidunt metus. Pellentesque interdum orci at pretium posuere. Sed quis magna tortor. Fusce eget odio dapibus, venenatis magna in, euismod ipsum. Donec nisi diam, gravida eu augue at, euismod laoreet elit. Nulla sollicitudin eros non tempor blandit. Maecenas tempor nibh leo. Mauris hendrerit in orci vel sodales.\n" +
        "\n" +
        "Fusce lectus dolor, laoreet ut velit eget, rhoncus fermentum augue. Donec eu turpis vel risus aliquet vehicula at sit amet sapien. Quisque non urna tincidunt, porta odio at, iaculis nulla. Nulla ultrices, lacus quis accumsan ullamcorper, magna nunc rhoncus justo, nec ultricies justo felis in magna. Nullam ullamcorper nulla ex, in finibus nisl elementum nec. Morbi tincidunt imperdiet velit quis vulputate. Vivamus in iaculis nunc. Nunc non sollicitudin ligula, sed hendrerit lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vivamus a dolor sit amet tortor vestibulum ornare. Nullam consequat nec diam ut fermentum. Vestibulum lobortis arcu consequat, ornare felis eget, egestas mauris. Nam dignissim enim sit amet massa tempus blandit. Vivamus gravida arcu non ante volutpat, at tempor erat cursus.\n" +
        "\n",
  },

]
const Announcements = () => {
  const user = useSelector((state) => state.auth?.user)
  const theme = useTheme();


  return (
      <Page title="Dashboard: Announcements">
        <Container>
          {user ?
              ANNOUNCEMENTS.map((announcement) => (
                <Card key={announcement.id} sx={{m: 4}}>
                  <CardContent>
                    <Typography color={announcement.color} gutterBottom>
                      {announcement.type}
                    </Typography>
                    <Typography variant='h3'>
                      {announcement.title}
                    </Typography>
                    <Typography variant='p'>
                      {truncate(announcement.description, 400)}
                    </Typography>

                  </CardContent>
                  <CardActions>
                    <Button size='small' variant='outlined' sx={{color: theme.palette.common.black, ml: 2, mb: 2}}>Read More</Button>
                  </CardActions>
                </Card>
              ))
              :
              <Typography variant='h2'>
                User not logged in
              </Typography>
          }

        </Container>
      </Page>
  );
}

export default Announcements;