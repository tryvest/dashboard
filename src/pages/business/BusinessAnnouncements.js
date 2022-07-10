import {useState} from "react";
// material
import {
    Grid,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Button,
    Stack,
    Box,
    Modal,
    TextField, InputAdornment, IconButton, FormControlLabel, Checkbox, Link, MenuItem, Select
} from '@mui/material';
import CardActions from '@mui/material/CardActions';

// components
import rehypeSanitize from "rehype-sanitize";
import {styled, useTheme} from "@mui/material/styles";
import AddIcon from '@mui/icons-material/Add';
import { useFormik, Form, FormikProvider } from 'formik';
import * as Yup from "yup";
import {LoadingButton} from "@mui/lab";
import MDEditor from "@uiw/react-md-editor";
import {truncate} from "../../utils/sharedMethods";
import {business} from "../../App";
import {apiBusinesses} from "../../utils/api/api-businesses";
import Page from '../../components/Page';

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
    const theme = useTheme();

    // modal stuff
    const [addModalOpen, setAddModalOpen] = useState(false)
    const handleOpen = () => setAddModalOpen(true);
    const handleClose = () => setAddModalOpen(false);

    // create announcement form stuff
    const LoginSchema = Yup.object().shape({
        category: Yup.string().required('Please select your announcement category'),
        title: Yup.string().required('Your announcement title cannot be boank'),
        body: Yup.string().required('Your announcement body cannot be empty')
    });

    const [bodyText, setBodyText] = useState()

    const creationFormik = useFormik({
        initialValues: {
            category: "",
            title: "",
            body: "",
        },
        validationSchema: LoginSchema,
        onSubmit: ({category, title, body}) => {
            console.log("got into here")
            const announcementData = {
                businessID: business.businessID,
                category,
                title,
                body,
                viewStatus: true
            }
            apiBusinesses.createAnnouncement(announcementData).then((result) => {
                console.log(result)
            })
        },
    });

    const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = creationFormik;

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "60vw",
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: '20px'
    };

    return (
        <Page title="Dashboard: Announcements">
            <Container>
                {business ? (
                    <Grid container>
                            <Grid item xs={12} sm={12} md={12}>
                                <div>
                                    <Button
                                        sx={{m: 3}} size={"large"}
                                        style={{backgroundColor: theme.palette.primary.dark, marginBottom: "0px"}}
                                        variant={"contained"}
                                        onClick={handleOpen}
                                    >
                                        <Stack alignItems={'center'} direction={"row"} spacing={1}>
                                            <AddIcon/>
                                            <Typography fontSize={18} fontWeight={800}>
                                                Add Announcement
                                            </Typography>
                                        </Stack>
                                    </Button>
                                    <Modal
                                        open={addModalOpen}
                                        onClose={handleClose}
                                    >
                                        <Box sx={modalStyle}>
                                            <FormikProvider value={creationFormik}>
                                                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                                                    <Stack spacing={3}>
                                                        {/* <Select
                                                            fullWidth
                                                            autoComplete="category"
                                                            label="Category"
                                                            {...getFieldProps('category')}
                                                            error={Boolean(touched.category && errors.category)}
                                                            helperText={touched.category && errors.category}
                                                        >
                                                            <MenuItem color={"white"} value={"funding"}>Funding</MenuItem>
                                                            <MenuItem value={"organizational"}>Organizational</MenuItem>
                                                            <MenuItem value={"productLaunch"}>Product Launch</MenuItem>
                                                        </Select> */}

                                                        <TextField
                                                            fullWidth
                                                            autoComplete="title"
                                                            label="Title"
                                                            {...getFieldProps('title')}
                                                            error={Boolean(touched.title && errors.title)}
                                                            helperText={touched.title && errors.title}
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            autoComplete="body"
                                                            label="Body"
                                                            {...getFieldProps('body')}
                                                            error={Boolean(touched.body && errors.body)}
                                                            helperText={touched.body && errors.body}
                                                        />

                                                        <TextField
                                                            fullWidth
                                                            autoComplete="category"
                                                            label="Category"
                                                            {...getFieldProps('category')}
                                                            error={Boolean(touched.category && errors.category)}
                                                            helperText={touched.category && errors.category}
                                                        />
                                                        {/* <div data-color-mode={"light"}>
                                                            <MDEditor
                                                                fullWidth
                                                                autoComplete="announcementBody"
                                                                label="Body Text"
                                                                value={bodyText}
                                                                onChange={setBodyText}
                                                                previewOptions={{
                                                                    rehypePlugins: [[rehypeSanitize]],
                                                                }}
                                                                preview={"edit"}
                                                                minHeight={200}
                                                                maxHeight={600}
                                                                // {...getFieldProps('body')}
                                                                error={Boolean(touched.body && errors.body)}
                                                                helperText={touched.body && errors.body}
                                                            />
                                                        </div> */}

                                                    </Stack>
                                                    <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
                                                        Save Edits
                                                    </LoadingButton>
                                                </Form>
                                            </FormikProvider>
                                        </Box>
                                    </Modal>
                                </div>

                            </Grid>
                            <Grid item xs={12} sm={12} md={12}>
                                <Card key='a' sx={{m: 3, backgroundColor: '#0e2433'}}>
                                    <CardContent>
                                        <Typography variant='h2' sx={{color: "#fff"}}>
                                            Keye has grown!
                                        </Typography>
                                        <Typography variant='subtitle1' sx={{color: "#f8f8f8", mb: 4}} gutterBottom>
                                            Congrats! You have earned money based on Keye's growth
                                        </Typography>

                                        <Typography variant='h4' sx={{color: "#fff", fontWeight: 200}}>
                                            Keye's previous valuation
                                        </Typography>
                                        <Typography variant='h3' sx={{color: "#fff"}}>
                                            $2,000,000
                                        </Typography>
                                        <Typography variant='h4' sx={{color: "#fff", fontWeight: 200}}>
                                            Keye's current valuation
                                        </Typography>
                                        <Typography variant='h3' sx={{color: "#fff"}}>
                                            $4,000,000
                                        </Typography>
                                        <Typography variant='h3' sx={{color: "#61d3a2"}}>
                                            Your earnings:
                                        </Typography>
                                        <Typography variant='h3' sx={{color: "#61d3a2"}}>
                                            $246
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            {ANNOUNCEMENTS.map((announcement) => (
                                <Grid item>
                                    <Card key={announcement.id} sx={{m: 3}}>
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
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography variant='h2'>
                            User not logged in
                        </Typography>
                    )
                }
            </Container>
        </Page>
    );
}

export default Announcements;