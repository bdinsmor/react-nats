/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DataService, { playersSubject } from '../../services/DataService';
import UpdatePlayer from './UpdatePlayer';
import { SearchOutlined } from '@ant-design/icons';
import { Space, Row, Col, Table, Drawer, Layout, Select, Button } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const { Content } = Layout;

const Players = (props) => {
  const [isNew, setIsNew] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false);
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({});
  const [selectedSeason, setSelectedSeason] = useState('fall');
  const [selectedYear, setSelectedYear] = useState('2021');

  const seasonOptions = [
    { key: 'fall', value: 'fall', label: 'Fall' },
    { key: 'spring', value: 'spring', label: 'Spring' },
  ];
  const yearOptions = [
    { key: '2021', value: '2021', label: '2021' },
    { key: '2022', label: '2022', value: '2022' },
  ];

  const loadData = async () => {
    if (!selectedSeason || selectedSeason === '' || !selectedYear || selectedYear === '') {
      setItems([]);
      return;
    }

    const res = await DataService.getPlayers(selectedYear, selectedSeason);
    setIsDataLoading(true);

    setItems(res);
    setIsDataLoading(false);
    setItems(res);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      width: '50px',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: 'Jersey',
      dataIndex: 'jersey',
      width: '75px',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },
      sorter: (a, b) => a.jersey - b.jersey,
    },
    {
      title: 'Name',
      dataIndex: 'nickname',
      width: '150px',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a.nickname.localeCompare(b.nickname),
    },
    {
      title: 'Date of Birth',
      dataIndex: 'dateOfBirth',
      width: '100px',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },
      sorter: (a, b) => moment(a.dateOfBirth).unix() - moment(b.dateOfBirth).unix(),
    },
    {
      title: 'Days until Birthday',
      dataIndex: 'daysTilBirthday',
      width: '200px',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },
      sorter: (a, b) => a.daysTilBirthday - b.daysTilBirthday,
    },
  ];

  const openPlayer = (item) => {
    setItem(item);
    setIsNew(false);
    setShowUpdateDrawer(true);
  };

  const onUpdateSuccess = () => {
    setShowUpdateDrawer(false);
  };

  const onCurrentYearChange = async (value) => {
    setSelectedYear(value);
  };

  const onCurrentSeasonChange = async (value) => {
    setSelectedSeason(value);
  };

  const onAdd = async () => {
    setIsNew(true);
    setItem({
      year: selectedYear,
      season: selectedSeason,
      nickname: '',
      jersey: 1,
    });
    setShowUpdateDrawer(true);
  };

  useEffect(() => {
    const playersSubscription = playersSubject.getPlayers().subscribe((players) => {
      console.log('players: ' + JSON.stringify(players, null, 2));
      if (players) {
        let index = 1;
        players.forEach(function (element) {
          element.index = index;
          index++;
        });
        setItems(players);
      } else {
        setItems([]);
      }
    });
    DataService.subscribeToPlayers(selectedSeason, selectedYear);
    return function cleanup() {
      if (playersSubscription) {
        playersSubscription.unsubscribe();
      }
    };
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <Content
          style={{
            paddingTop: 24,
            marginTop: 8,
            marginLeft: 8,
            marginRight: 8,
            paddingLeft: 16,
            paddingRight: 16,
            backgroundColor: 'white',
            height: 'calc(100vh - 64px)',
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Space>
                <Col>
                  <h5>Year</h5>
                  <Select options={yearOptions} defaultValue={2021} style={{ width: 120 }} onChange={onCurrentYearChange}></Select>
                </Col>
                <Col>
                  <h5>Season</h5>
                  <Select options={seasonOptions} defaultValue={'fall'} style={{ width: 120 }} onChange={onCurrentSeasonChange}></Select>
                </Col>
                <Col>
                  <h5>&nbsp;</h5>
                  <Button type="ghost" onClick={() => loadData()} icon={<SearchOutlined />}>
                    Load Roster
                  </Button>
                </Col>
              </Space>
            </Row>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Button type="primary" onClick={() => onAdd()}>
              Add Player
            </Button>
          </div>
          <Table
            loading={isDataLoading}
            columns={columns}
            dataSource={items}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  openPlayer(record);
                }, // click row
              };
            }}
            scroll={{ x: 500, y: 900 }}
            rowKey="id"
            style={{ width: '100%', maxWidth: 'calc(100vw - 275px)' }}
            pagination={{
              hideOnSinglePage: true,
              pageSize: items ? items.length : 10,
            }}
          />
        </Content>
      </Layout>
      <Drawer placement="right" closable={false} onClose={() => setShowUpdateDrawer(false)} visible={showUpdateDrawer} width={600}>
        <UpdatePlayer player={item} isNew={isNew} onSaveSuccess={onUpdateSuccess} onCancel={() => setShowUpdateDrawer(false)}></UpdatePlayer>
      </Drawer>
    </React.Fragment>
  );
};

export default Players;
