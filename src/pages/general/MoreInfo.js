import { useEffect, useState } from 'react';
import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';
import { DarkLogo } from '../../components/Logo';
import LandingNav from "./LandingNav";

export default function MoreInfo() {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const [articles, setArticles] = useState(null);
  const theme = useTheme();

  const getData = () => {
    fetch('static/moreInfo.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(async (response) => {
        console.log(response);
        return response.json();
      })
      .then((myJson) => {
        setArticles(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ backgroundColor: theme.palette.primary.dark, height: '100%' }} title="Learn More">
      <LandingNav/>
      <div style={{ backgroundColor: theme.palette.primary.dark, height: '100%' }}>
        {articles ? (
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
                <Stack paddingLeft={"15px"} paddingRight={"10px"} position={"sticky"} top={"65px"}>
                  {articles.map((article, articleIndex) => {
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
                            <Typography fontWeight={600} fontSize={17} color={!disableRipple ? theme.palette.primary.dark : theme.palette.primary.light}>{article.title}</Typography>
                          </Button>
                          {articleIndex !== articles.length-1 ? <hr style={{border: 0, height: '1px', backgroundColor: "lightgrey", color: "lightgrey", width: "70%", marginLeft: "3.5%", marginTop:"2px", marginBottom: '2px'}} /> : <div/>}
                        </div>
                    );
                  })}
                </Stack>
              </div>
              <Typography overflow={'auto'} paddingRight={"20px"}>
                <ReactMarkdown>{articles[selectedArticleIndex].body}</ReactMarkdown>
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
