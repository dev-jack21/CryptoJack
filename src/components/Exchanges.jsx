import React, { useMemo, useState } from 'react';
import millify from 'millify';
import { Avatar, Input, Space, Table, Typography } from 'antd';
import Loader from './Loader';
import { useGetExchangesQuery } from '../Services/cryptoApi';

const { Title } = Typography;

const columns = [
  {
    title: 'Rank',
    dataIndex: 'trust_score_rank',
    key: 'rank',
    render: (rank) => rank || '-',
    width: 90,
  },
  {
    title: 'Exchange',
    dataIndex: 'name',
    key: 'name',
    render: (name, exchange) => (
      <Space>
        <Avatar src={exchange.image} alt="" className="exchange-image">
          {name?.[0]}
        </Avatar>
        {exchange.url ? (
          <Typography.Link href={exchange.url} target="_blank" rel="noreferrer">
            {name}
          </Typography.Link>
        ) : name}
      </Space>
    ),
  },
  {
    title: 'Country',
    dataIndex: 'country',
    key: 'country',
    render: (country) => country || '-',
  },
  {
    title: 'Established',
    dataIndex: 'year_established',
    key: 'year_established',
    render: (year) => year || '-',
  },
  {
    title: 'Trust Score',
    dataIndex: 'trust_score',
    key: 'trust_score',
    render: (score) => score ?? '-',
  },
  {
    title: '24h Volume (BTC)',
    dataIndex: 'trade_volume_24h_btc',
    key: 'trade_volume_24h_btc',
    render: (volume) => volume == null ? '-' : millify(volume),
  },
];

const Exchanges = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: exchanges = [], isFetching, isError } = useGetExchangesQuery();

  const filteredExchanges = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    if (!search) return exchanges;

    return exchanges.filter((exchange) =>
      [exchange.name, exchange.country, exchange.id]
        .some((value) => value?.toLowerCase().includes(search))
    );
  }, [exchanges, searchTerm]);

  if (isFetching) return <Loader />;
  if (isError) return <p>Unable to load exchanges. Please try again later.</p>;

  return (
    <div>
      <Title level={2}>Cryptocurrency Exchanges</Title>
      <div className="search-exchanges">
        <Input
          aria-label="Search exchanges"
          placeholder="Search by exchange or country"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredExchanges}
        rowKey="id"
        pagination={{ pageSize: 20, showSizeChanger: false }}
        scroll={{ x: 800 }}
        locale={{ emptyText: searchTerm ? 'No exchanges match your search.' : 'No exchanges found.' }}
      />
    </div>
  );
};

export default Exchanges;
