import { useEffect, useState } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';
import { DarkLogo } from '../../components/Logo';
import LandingNav from "./LandingNav";

export default function Legal() {
  const [jsonInfo, setJsonInfo] = useState(null);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const [articleTitles, setArticleTitles] = useState(null);
  const theme = useTheme();

  const getData = () => {
    fetch('static/legal.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        return response.json();
      })
      .then((myJson) => {
        setJsonInfo(myJson);
        console.log(myJson)
        setArticleTitles(Object.keys(myJson))
        console.log(Object.keys(myJson))
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ backgroundColor: theme.palette.primary.light, height: '100%' }} title="Learn More">
      <LandingNav/>
      <div style={{ backgroundColor: theme.palette.primary.light, height: '100%', paddingBottom: '10px'}}>
        {articleTitles ? (
          <div
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <div style={{ padding: '20px 0px 0px 15px', position: "sticky", top: "0px"}}/>
            <Stack direction={'row'}>
              <div>
                <Stack paddingLeft={'15px'} paddingRight={'10px'} position={'sticky'} top={'10px'}>
                  <div>
                    {articleTitles.map((article, articleIndex) => {
                      const variant = selectedArticleIndex === articleIndex ? "contained" : "text"
                      const disableRipple = selectedArticleIndex === articleIndex
                      return (
                          <div>
                            <Button
                                disableFocusRipple
                                disableRipple={disableRipple}
                                disableElevation={disableRipple}
                                style={{ width: '22vw', textAlign:'start', justifyContent: 'flex-start'}}
                                variant={variant}
                                onClick={() => setSelectedArticleIndex(articleIndex)}
                                onKeyDown={() => setSelectedArticleIndex(articleIndex)}
                            >
                              <Typography fontWeight={600} fontSize={17} color={!disableRipple ? theme.palette.primary.dark : theme.palette.primary.light}>{articleTitles[articleIndex]}</Typography>
                            </Button>
                            {articleIndex !== articleTitles.length-1 ? <hr style={{border: 0, height: '1px', backgroundColor: "lightgrey", color: "lightgrey", width: "70%", marginLeft: "3.5%", marginTop:"2px", marginBottom: '2px'}} /> : <div/>}
                          </div>
                      );
                    })}
                  </div>
                </Stack>
              </div>
              <Typography overflow={'auto'} paddingRight={'20px'}>
                <ReactMarkdown>{jsonInfo[articleTitles[selectedArticleIndex]]}</ReactMarkdown>
              </Typography>
            </Stack>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%' }}>
            <CircularProgress />
          </div>
        )}
      </div>
    </div>
  );
}
