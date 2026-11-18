import React from 'react'
import millify from 'millify';
import { Typography, Row, Col, Statistic } from 'antd'; 
import {Link} from 'react-router-dom';
import { useGetCryptosQuery } from '../Services/cryptoApi';
import Cryptocurrencies from './Cryptocurrencies';
import News from './News';

const {Title} = Typography;

const Homepage = () => {
  const { data, isFetching, isError } = useGetCryptosQuery();
  const globalStats = data?.data;

  if (isFetching) return <div>Loading...</div>;
  if (isError) return <div>Unable to load crypto data.</div>;

  return (
    <div>
        <Title level={2} className="heading">Global Crypto Stats</Title>
        <Row>
            <Col span={12}><Statistic title="Total Cryptocurrencies" value={globalStats?.active_cryptocurrencies}></Statistic></Col>
            <Col span={12}><Statistic title="Total Exchanges" value={millify(globalStats?.markets ?? 0)}></Statistic></Col>
            <Col span={12}><Statistic title="Total Market Capitalization" value={millify(globalStats?.total_market_cap?.usd ?? 0)}></Statistic></Col>
            <Col span={12}><Statistic title="Total 24h Volume" value={millify(globalStats?.total_volume?.usd ?? 0)}></Statistic></Col>
            <Col span={12}><Statistic title="Total Markets" value={millify(globalStats?.markets ?? 0)}></Statistic></Col>
        </Row>

        <div className="home-heading-container">
          <Title level={2} className="home-title">Top 10 Cryptocurrencies</Title>
          <Title level={3} className="show-more"><Link to="/cryptocurrencies">Show More</Link></Title>
        </div>
        <Cryptocurrencies simplified={true} />

        <div className="home-heading-container">
          <Title level={2} className="home-title">Latest Crypto News</Title>
          <Title level={3} className="show-more"><Link to="/news">Show More</Link></Title>
        </div>
        <News simplified={true} />
    </div>
  )
}

export default Homepage
