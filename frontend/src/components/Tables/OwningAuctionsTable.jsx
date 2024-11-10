import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
const DataTable = ({ data }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    setColumns([
      {
        title: 'Unique Id',
        dataIndex: 'auctionId',
        key: 'auctionId',
        filters: data.map((ele) => ({
          text: ele.auctionId,
          value: ele.auctionId,
        })),
        filteredValue: filteredInfo.auctionId || null,
        onFilter: (value, record) => record.auctionId.includes(value),
        sorter: (a, b) => a.auctionId.length - b.auctionId.length,
        sortOrder:
          sortedInfo.columnKey === 'auctionId' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Auction Name',
        dataIndex: 'auctionname',
        key: 'auctionname',
        filters: data.map((ele) => ({
          text: ele.auctionId,
          value: ele.auctionId,
        })),
        filteredValue: filteredInfo.auctionId || null,
        onFilter: (value, record) => record.auctionId.includes(value),
        sorter: (a, b) => a.auctionId.length - b.auctionId.length,
        sortOrder:
          sortedInfo.columnKey === 'auctionId' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Auction Product',
        dataIndex: 'auctionproduct',
        key: 'auctionproduct',
        filters: data.map((ele) => ({
          text: ele.auctionproduct,
          value: ele.auctionproduct,
        })),
        filteredValue: filteredInfo.auctionproduct || null,
        onFilter: (value, record) => record.auctionproduct.includes(value),
        sorter: (a, b) => a.auctionproduct.localeCompare(b.auctionproduct),
        sortOrder:
          sortedInfo.columnKey === 'auctionproduct' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Started At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        filters: data.map(async (ele) => {
          return {
            text: ele.createdAt,
            value: ele.createdAt,
          };
        }),
        filteredValue: filteredInfo.createdAt || null,
        onFilter: (value, record) => record.createdAt.includes(value),
        sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        sortOrder:
          sortedInfo.columnKey === 'createdAt' ? sortedInfo.order : null,
        ellipsis: true,
      },
      {
        title: 'Winner',
        dataIndex: 'isWinnedAnnounced',
        key: 'isWinnedAnnounced',
        filters: data.map((ele) => {
          return {
            text: ele.isWinnedAnnounced,
            value: ele.isWinnedAnnounced,
          };
        }),
        filteredValue: filteredInfo.isWinnedAnnounced || null,
        onFilter: (value, record) => record.isWinnedAnnounced.includes(value),
        sorter: (a, b) =>
          a.isWinnedAnnounced.localeCompare(b.isWinnedAnnounced),
        sortOrder:
          sortedInfo.columnKey === 'isWinnedAnnounced'
            ? sortedInfo.order
            : null,
        ellipsis: true,
      },
    ]);
  }, [data, filteredInfo, sortedInfo]);

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => setFilteredInfo({});
  const clearAll = () => {
    setFilteredInfo({});
    setSortedInfo({});
  };

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />
    </>
  );
};
export { DataTable };
