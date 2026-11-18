import React from 'react';
import { Typography, Row, Col, Card, Input } from 'antd';
import moment from 'moment/moment';

import { useGetCryptoNewsQuery } from '../Services/cryptoNewsApi';
const {Text, Title} = Typography;

const demoImage = 'https://www.bing.com/th?id=OVFT.mpzuVZnv8dwIMRfQGPbOPC&pid=News';

const News = ({simplified}) => {
  const count = simplified ? 6 : 12;
  const {data, isFetching} = useGetCryptoNewsQuery({ count });
  const [searchTerm, setSearchTerm] = React.useState('');

  if(isFetching) return 'Loading...';

  const newsList = data?.items || [];
  const filteredNews = simplified || !searchTerm.trim()
    ? newsList
    : newsList.filter((news) =>
        `${news.title || ''} ${news.description || ''} ${news.content || ''}`
          .replace(/<[^>]+>/g, ' ')
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );

  return (
    <>
      {!simplified && (
        <div className='search-news'>
          <Input
            aria-label='Filter cryptocurrency news'
            placeholder='Search news by cryptocurrency (e.g. Bitcoin)'
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            allowClear
          />
        </div>
      )}
      {filteredNews.length === 0 ? (
        <p>{searchTerm.trim() ? 'No news found for that cryptocurrency.' : 'No news found.'}</p>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredNews.map((news, i) => (
            <Col xs={24} sm={12} lg={8} key={i}>
              <Card hoverable className='news-card'>
                <a href={news.link} target="_blank" rel="noreferrer">
                  <div className='news-image-container'>
                    <Title className='news-title' level={4}>{news.title}</Title>
                    <img
                      src={news.thumbnail || news.enclosure?.link || demoImage}
                      alt={news.title}
                      style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </div>
                  <p>
                    {news.description?.replace(/<[^>]+>/g, '').substring(0, 100)}...
                  </p>
                  <div className='provider-container'>
                    <Text>{news.author || 'CoinTelegraph'}</Text>
                    <Text>{moment(news.pubDate).fromNow()}</Text>
                  </div>
                </a>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  )
}

export default News
