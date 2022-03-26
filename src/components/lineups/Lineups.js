/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import DataService, { lineupsSubject, positionsSubject, playersSubject, settingsSubject } from '../../services/DataService';
import { Col, Typography, Layout, Button, message } from 'antd';
import dayjs from 'dayjs';
import LineupCard from './LineupCard';

var localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const { Content } = Layout;
const { Text } = Typography;

const Lineups = (props) => {
  const [items, setItems] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('spring');
  const [selectedYear, setSelectedYear] = useState('2022');
  const [positions, setPositions] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [settings, setSettings] = useState({});
  /* const seasonOptions = [
    { key: 'fall', value: 'fall', label: 'Fall' },
    { key: 'spring', value: 'spring', label: 'Spring' },
  ];
  const yearOptions = [
    { key: '2021', value: '2021', label: '2021' },
    { key: '2022', label: '2022', value: '2022' },
  ];*/

  const loadData = async () => {
    if (!selectedSeason || selectedSeason === '' || !selectedYear || selectedYear === '') {
      return [];
    }
    try {
      const res = await DataService.getLineups(selectedYear, selectedSeason);
      setItems(res);
    } catch (err) {
      console.error(err);
      message.error('Unknown error occurred loading lineups');
    }
  };

  /*
  const onPlayerUpdated = async (updatedPlayer) => {
    let saved = false;
    for (let lineupGroup of items) {
      let found = false;
      let lineups = lineupGroup.lineups;
      for (let lineup of lineups) {
        if (lineup.notPlaying) {
          for (let i = 0; i < lineup.notPlaying.length; i++) {
            if (lineup.notPlaying[i].id === updatedPlayer.id) {
              let player = lineup.playing[i];
              player.firstName = updatedPlayer.firstName;
              player.lastName = updatedPlayer.lastName;
              player.textColor = updatedPlayer.textColor;
              player.backgroundColor = updatedPlayer.backgroundColor;
              player.dateOfBirth = updatedPlayer.dateOfBirth;
              player.jersey = updatedPlayer.jersey;
              player.nickname = updatedPlayer.nickname;
              lineup.notPlaying[i] = player;
              lineup.notPlaying = [...lineup.notPlaying];
              found = true;
              break;
            }
          }
        }

        if (!found) {
          for (let j = 0; j < lineup.playing.length; j++) {
            if (lineup.playing[j].id === updatedPlayer.id) {
              let player = lineup.playing[j];
              console.log('will update ' + player.backgroundColor + ' to ' + updatedPlayer.backgroundColor);
              player.firstName = updatedPlayer.firstName;
              player.lastName = updatedPlayer.lastName;
              player.textColor = updatedPlayer.textColor;
              player.backgroundColor = updatedPlayer.backgroundColor;
              player.dateOfBirth = updatedPlayer.dateOfBirth;
              player.jersey = updatedPlayer.jersey;
              player.nickname = updatedPlayer.nickname;
              lineup.playing[j] = player;
              found = true;

              lineup.playing = [...lineup.playing];
              break;
            }
          }
        }
        if (found) {
          await DataService.updateLineup(lineup);
          saved = true;
        }
      }
    }
    if (saved) {
      //  getOtherData();
    }
  };*/

  /* const onCurrentYearChange = async (value) => {
    setSelectedYear(value);
  };

  const onCurrentSeasonChange = async (value) => {
    setSelectedSeason(value);
  };*/

  /*const getOtherData = async function () {
    const getPositions = async () => {
      setPositions(await DataService.getPositions());
    };

    const getAllPlayers = async () => {
      setAllPlayers(await DataService.getPlayers());
    };

    getPositions();
    getAllPlayers();
  };*/

  const getPositionByNumber = (number) => {
    var numChoices = positions.length;
    for (var i = 0; i < numChoices; i++) {
      if (positions[i].number === number) {
        return positions[i];
      }
    }
    return positions[0];
  };

  const onSaveLineup = async (lineup) => {
    try {
      await DataService.updateLineup(lineup);
    } catch (err) {
      message.error('An error occurred saving this lineup.');
    }
    message.success('Lineup saved successfully');

    loadData();
  };

  const onAdd = async () => {
    try {
      const playersPlaying = [];
      let playerIndex = 1;
      allPlayers.forEach((player) => {
        const p = { ...player };
        const innings = [];
        for (let j = 0; j < 6; j++) {
          const position = getPositionByNumber(playerIndex);
          const inning = {
            inning: j + 1,
            abbr: position.abbr,
            number: position.number,
          };
          innings.push(inning);
        }
        p.index = playerIndex;
        p.innings = innings;
        playersPlaying.push(p);
        playerIndex++;
      });

      const validations = [];
      console.log(JSON.stringify(settings, null, 2));
      for (let i = 0; i < settings.numInnings; i++) {
        validations.push({ msg: '' });
      }

      const newLineup = {
        date: dayjs(new Date()).format('MM/DD/YYYY'),
        location: settings.fieldName,
        opponent: '',
        season: selectedSeason,
        year: parseInt(selectedYear),
        playing: playersPlaying,
        inningValidations: validations,
        settings: settings,
      };
      await DataService.updateLineup(newLineup);
      loadData();
    } catch (err) {
      console.log('caught error: ', err);
    }
  };

  useEffect(() => {
    const lineupsSubscription = lineupsSubject.getLineups().subscribe((lineups) => {
      if (lineups) {
        setItems(lineups);
      } else {
        setItems([]);
      }
      /* if (!initialLoad) {
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (lineups) {
                setItems(lineups);
              } else {
                setItems([]);
              }

              notification.destroy();
            }}
          >
            Click to Refresh
          </Button>
        );
        notification.open({
          message: 'Lineups Updated',
          duration: 0,
          btn,
        });
      }
      if (initialLoad) {
        if (lineups) {
          setItems(lineups);
        } else {
          setItems([]);
        }
        initialLoad = false;
      }*/
    });
    const playersSubscription = playersSubject.getPlayers().subscribe((players) => {
      if (players) {
        setAllPlayers(players);
      } else {
        setAllPlayers([]);
      }
      /*if (!initialPlayersLoad) {
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => {
              if (players) {
                setAllPlayers(players);
              } else {
                setAllPlayers([]);
              }

              notification.destroy();
            }}
          >
            Click to Refresh
          </Button>
        );
        notification.open({
          message: 'Players Have Been Updated',
          duration: 0,
          btn,
        });
      }
      if (initialPlayersLoad) {
        if (players) {
          setAllPlayers(players);
        } else {
          setAllPlayers([]);
        }
        initialPlayersLoad = false;
      }*/
    });
    const positionsSubscription = positionsSubject.getPositions().subscribe((positions) => {
      setPositions(positions);
    });
    const settingsSubscription = settingsSubject.getSettings().subscribe((settings) => {
      setSettings(settings);
    });
    DataService.subscribeToLineups(selectedSeason, selectedYear);
    DataService.subscribeToPlayers(selectedSeason, selectedYear);
    DataService.subscribeToPositions();
    DataService.subscribeToSettings();
    setSelectedSeason('spring');
    setSelectedYear(2022);
    return function cleanup() {
      if (lineupsSubscription) {
        lineupsSubscription.unsubscribe();
      }
      if (playersSubscription) {
        playersSubscription.unsubscribe();
      }
      if (positionsSubscription) {
        positionsSubscription.unsubscribe();
      }
      if (settingsSubscription) {
        settingsSubscription.unsubscribe();
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
          {/* <div style={{ marginBottom: 8 }}>
            <Row gutter={12}>
              <Space>
                <Col>
                  <h5>Year</h5>
                  <Select options={yearOptions} defaultValue={2022} style={{ width: 120 }} onChange={onCurrentYearChange}></Select>
                </Col>
                <Col>
                  <h5>Season</h5>
                  <Select options={seasonOptions} defaultValue={'spring'} style={{ width: 120 }} onChange={onCurrentSeasonChange}></Select>
                </Col>
                <Col>
                  <h5>&nbsp;</h5>
                  <Button type="ghost" onClick={() => loadData()} icon={<SearchOutlined />}>
                    Load Lineups
                  </Button>
                </Col>
              </Space>
            </Row>
        </div>*/}
          <div style={{ marginBottom: '38px' }}>
            <Button type="primary" onClick={() => onAdd()}>
              Add Lineup
            </Button>
          </div>
          <div style={{ marginBottom: '8', maxHeight: '75vh', overflow: 'auto' }}>
            {items &&
              items.map((item, index) => {
                return (
                  <Col key={`lineup_col_${index}`}>
                    <Text type="secondary">{item.month}</Text>
                    {item.lineups &&
                      item.lineups.map(function (lineup, i) {
                        return <LineupCard key={lineup.key} lineup={lineup} allPlayers={allPlayers} settings={settings} positions={positions} onSaveLineup={onSaveLineup} />;
                      })}
                  </Col>
                );
              })}
            {(!items || items.length === 0) && (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h5 className="muted-text">No Lineups</h5>
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </React.Fragment>
  );
};

export default Lineups;
