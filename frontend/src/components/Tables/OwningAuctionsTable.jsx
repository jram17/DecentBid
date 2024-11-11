import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import AuctionDialog from '../AuctionDisplay/AuctionDialog';
import { MdCancel } from 'react-icons/md';
const DataTable = ({ data }) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [columns, setColumns] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);

  const showDialog = (auction) => {
    if (isDialogVisible) return;
    setSelectedAuction(auction);
    setIsDialogVisible(true);
  };

  const handleDialogClose = () => {
    setIsDialogVisible(false);
    setSelectedAuction(null);
  };

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
      {
        title: 'Actions',
        key: 'actions',
        render: (text, record) => (
          <Button type="primary" onClick={() => showDialog(record)}>
            View Details
          </Button>
        ),
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
    <div className="flex flex-col items-center">
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table columns={columns} dataSource={data} onChange={handleChange} />

      {isDialogVisible && (
        <div className="fixed top-1/4 left-0 right-0 flex justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg shadow-lg">
            <span
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => handleDialogClose()}
            >
              <MdCancel size={20} />
            </span>
            <AuctionDialog auction={selectedAuction} />
          </div>
        </div>
      )}
    </div>
  );
};
export { DataTable };
