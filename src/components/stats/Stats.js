/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DataService, { playersSubject } from '../../services/DataService';
import UpdatePlayer from '../players/UpdatePlayer';
import { SearchOutlined } from '@ant-design/icons';
import { Space, Row, Col, Table, Drawer, Layout, Select, Button } from 'antd';
import dayjs from 'dayjs';

var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const { Content } = Layout;

const Stats = (props) => {
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
      title: 'P',
      dataIndex: 'P',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['P'] > b['P'],
    },
    {
      title: 'C',
      dataIndex: 'C',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['C'] > b['C'],
    },
    {
      title: '1B',
      dataIndex: '1B',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['1B'] > b['1B'],
    },
    {
      title: '2B',
      dataIndex: '2B',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['2B'] > b['2B'],
    },
    {
      title: '3B',
      dataIndex: '3B',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['3B'] > b['3B'],
    },
    {
      title: 'SS',
      dataIndex: 'SS',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['SS'] > b['SS'],
    },
    {
      title: 'LF',
      dataIndex: 'LF',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['LF'] > b['LF'],
    },
    {
      title: 'CF',
      dataIndex: 'CF',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['CF'] > b['CF'],
    },
    {
      title: 'RF',
      dataIndex: 'RF',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['RF'] > b['RF'],
    },
    {
      title: 'BN',
      dataIndex: 'BN',
      render(text, record) {
        return {
          props: {
            style: { background: record.backgroundColor, color: record.textColor },
          },
          children: text,
        };
      },

      sorter: (a, b) => a['BN'] > b['BN'],
    },
  ];

  const openPlayer = (item) => {
    setItem(item.originalItem);
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

  const buildPlayerStats = async () => {
    const statsByPlayer = {};
    const lineupGroups = await DataService.getLineups(selectedSeason, selectedYear);
    for (let lineupGroup of lineupGroups) {
      let lineups = lineupGroup.lineups;
      for (let lineup of lineups) {
        for (let j = 0; j < lineup.playing.length; j++) {
          let fs = {};
          let player = lineup.playing[j];
          let fullName = player.firstName + player.lastName;
          if (statsByPlayer[fullName]) {
            fs = statsByPlayer[fullName];
          } else {
            fs = {
              P: 0,
              C: 0,
              '1B': 0,
              '2B': 0,
              '3B': 0,
              SS: 0,
              LF: 0,
              CF: 0,
              RF: 0,
              BN: 0,
            };
          }
          const numInningsFinished = lineup.numInningsFinished;
          let innings = player.innings;
          for (let k = 0; k < innings.length; k++) {
            if (k < numInningsFinished) {
              const inning = innings[k];
              const positionAbbr = inning.abbr;
              let count = 0;
              if (fs[positionAbbr]) {
                count = fs[positionAbbr];
              }
              count++;
              fs[positionAbbr] = count;
            }
          }
          statsByPlayer[fullName] = fs;
        }
      }
    }
    return statsByPlayer;
  };

  useEffect(() => {
    const playersSubscription = playersSubject.getPlayers().subscribe(async (players) => {
      if (players) {
        let index = 1;
        let playerStats = await buildPlayerStats();
        players = players.map((element) => {
          element.index = index;
          const original = { ...element };
          let fullName = element.firstName + element.lastName;
          let pStats = playerStats[fullName];
          let updatedPlayer = { ...element, ...pStats };
          updatedPlayer.originalItem = original;
          return updatedPlayer;
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
            scroll={{ x: '75vw', y: 900 }}
            rowKey="id"
            style={{ width: '100%', maxWidth: 'calc(90vw)' }}
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

export default Stats;
