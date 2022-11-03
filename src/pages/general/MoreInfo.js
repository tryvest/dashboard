import { useEffect, useState } from 'react';
import {Button, Card, CardContent, CircularProgress, Grid, Stack, Typography} from '@mui/material';
import Page from '../../components/Page';

export default function MoreInfo() {
  const [selectedArticleIndex, setSelectedArticleIndex] = useState(0);
  const [articles, setArticles] = useState(null);

  const getData = () => {
    fetch('static/moreInfo.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    }).then(async (response) => {
      console.log(response);
      return response.json();
    }).then((myJson) => {
        setArticles(myJson)
    })
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Page title="Learn More">
      {articles ? (
        <div
          style={{
            margin: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '95vh',
            backgroundColor: 'white',
          }}
        >
          <Stack direction={'row'}>
            <Stack>
              {articles.map((article, articleIndex) => {
                return (
                  <Button style={{width: "25vw"}}
                    onClick={() => setSelectedArticleIndex(articleIndex)}
                    onKeyDown={() => setSelectedArticleIndex(articleIndex)}
                  >
                    <Typography variant={'h6'}>{article.title}</Typography>
                  </Button>
                );
              })}
            </Stack>
            <div style={{whiteSpace: 'pre-wrap'}}>{articles[selectedArticleIndex].body}</div>
          </Stack>
        </div>
      ) : (
        <div style={{ width: '100%', height: '100%' }}>
          <CircularProgress />
        </div>
      )}
    </Page>
  );
}
