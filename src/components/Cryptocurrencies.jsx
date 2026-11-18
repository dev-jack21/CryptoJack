import React, { useState, useEffect } from 'react'
import millify from 'millify'
import {Link} from 'react-router-dom';
import {Card, Row, Col, Input} from 'antd';

import {useGetCoinsQuery} from '../Services/cryptoApi';

const Cryptocurrencies = ({ simplified }) => {
  const count = simplified ? 10 : 50;
  const {data: coinsList, isFetching} = useGetCoinsQuery(count);
  const [cryptos, setCryptos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const filteredData = coinsList?.filter((coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setCryptos(filteredData || []);
  }, [coinsList, searchTerm]);

  if (isFetching) return <div>Loading...</div>;

  return (
    <div>
      {!simplified && (
        <div className="search-crypto">
          <Input placeholder="Search Cryptocurrency" onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      )}
      <Row gutter={[32, 32]} className="crypto-card-container">
        {cryptos?.map((currency) => (
          <Col xs={24} sm={12} md={8} lg={6} className="crypto-card" key={currency.id}>
            <Link to={`/crypto/${currency.id}`}>
              <Card
                title={`${currency.market_cap_rank}. ${currency.name}`}
                extra={<img className="crypto-image" src={currency.image} alt={currency.name} style={{width: 35}} />}
                hoverable
              >
                <p>Price: ${millify(currency.current_price)}</p>
                <p>Market Cap: ${millify(currency.market_cap)}</p>
                <p>Daily Change: {currency.price_change_percentage_24h?.toFixed(2)}%</p>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Cryptocurrencies
