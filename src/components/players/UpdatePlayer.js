/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import DataService from '../../services/DataService';
import { notification, Input, Card, Statistic, Tabs, Button, Row, DatePicker, Col, Form, InputNumber, Space, Divider, Typography, Skeleton } from 'antd';
import moment from 'moment';
import 'rc-color-picker/assets/index.css';
import { ReactComponent as BallSvg } from '../../baseball.svg';
import { ReactComponent as BatSvg } from '../../bat.svg';
import ColorPicker from 'rc-color-picker';
import Icon from '@ant-design/icons';
import { SaveOutlined, CloseOutlined, IdcardOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TabPane } = Tabs;

const UpdatePlayer = (props) => {
  const [form] = Form.useForm();
  const [battingOrderStats, setBattingOrderStats] = useState({});
  const [fieldingStats, setFieldingStats] = useState({});
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState({ color: '#fff' });
  const [selectedColor, setSelectedColor] = useState({ color: '#000' });

  const BallIcon = (props) => <Icon component={BallSvg} {...props} />;
  const BatIcon = (props) => <Icon component={BatSvg} {...props} />;

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setStatsLoaded(false);
      if (props.positions) {
        setPositions(props.positions);
      }
      if (props.player.textColor) {
        setSelectedColor({ color: props.player.textColor });
      }
      if (props.player.backgroundColor) {
        setSelectedBackgroundColor({ color: props.player.backgroundColor });
      }
      if (props.player.dateOfBirth) {
        props.player.dateOfBirth = moment(props.player.dateOfBirth, 'MM/DD/YYYY');
      } else {
        props.player.dateOfBirth = moment();
      }

      form.setFieldsValue(props.player);
      buildStats();
      setIsLoading(false);
    };
    init();
  }, [props.player]);

  const onColorChange = async (value) => {
    setSelectedColor(value);
  };

  const onBackgroundColorChange = async (value) => {
    setSelectedBackgroundColor(value);
  };

  const ordinalSuffix = (i) => {
    var j = i % 10,
      k = i % 100;
    if (j === 1 && k !== 11) {
      return i + 'st';
    }
    if (j === 2 && k !== 12) {
      return i + 'nd';
    }
    if (j === 3 && k !== 13) {
      return i + 'rd';
    }
    return i + 'th';
  };

  const buildStats = async () => {
    const fs = {
      P: { positionClassName: 'pitcher', count: 0 },
      C: { positionClassName: 'catcher', count: 0 },
      '1B': { positionClassName: 'first', count: 0 },
      '2B': { positionClassName: 'second', count: 0 },
      '3B': { positionClassName: 'third', count: 0 },
      SS: { positionClassName: 'short', count: 0 },
      LF: { positionClassName: 'leftfield', count: 0 },
      CF: { positionClassName: 'centerfield', count: 0 },
      RF: { positionClassName: 'rightfield', count: 0 },
      restricted: 0,
      outfield: 0,
      0: 0,
    };
    const bs = {};
    const lineupGroups = await DataService.getLineups(props.player.season, props.player.year);
    for (let lineupGroup of lineupGroups) {
      let lineups = lineupGroup.lineups;
      for (let lineup of lineups) {
        for (let j = 0; j < lineup.playing.length; j++) {
          if (lineup.playing[j].id === props.player.id) {
            let player = lineup.playing[j];
            let order = j + 1;
            if (!bs[order]) {
              bs[order] = { label: ordinalSuffix(order), count: 1 };
            } else {
              bs[order].count = bs[order].count++;
            }
            const numInningsFinished = 6;
            // numInningsFinished = lineup.numInningsFinished;
            let innings = player.innings;
            for (let k = 0; k < innings.length; k++) {
              if (k < numInningsFinished) {
                const inning = innings[k];
                const positionAbbr = inning.abbr;
                const positionNumber = inning.number;
                if (!fs[positionAbbr]) {
                  fs[positionAbbr] = {
                    count: 0,
                    positionClassName: positionAbbr,
                  };
                }
                let count = fs[positionAbbr].count;
                count++;
                fs[positionAbbr].count = count;
                if (positionNumber > 6) {
                  fs['outfield'] = fs['outfield']++;
                } else if (positionNumber === 1 || positionNumber === 3) {
                  fs['restricted'] = fs['restricted']++;
                }
              }
            }
          }
        }
      }
    }
    setStatsLoaded(true);
    setFieldingStats(fs);
    setBattingOrderStats(bs);
  };

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        id: props.player.id,
        firstName: values.firstName,
        lastName: values.lastName,
        nickname: values.nickname,
        jersey: values.jersey,
        dateOfBirth: dayjs(values.dateOfBirth).format('MM/DD/YYYY'),
        season: props.player.season,
        year: String(props.player.year),
        backgroundColor: selectedBackgroundColor.color,
        textColor: selectedColor.color,
      };

      await DataService.updatePlayer(updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: 'Player Updated',
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess(updates);
    } catch (e) {
      console.log('err: ', e);
      notification.error({
        message: 'Error Updating Player',
        duration: 2,
      });
      setIsLoading(false);
    }
  };

  const cancel = () => {
    form.resetFields();
    if (props.onCancel) props.onCancel();
  };

  return (
    <Space direction="vertical" style={{ width: '100%', borderRadius: '4px' }}>
      <Skeleton active loading={isLoading}></Skeleton>
      <div hidden={isLoading}>
        <Row align="left" style={{ paddingLeft: '8px', paddingTop: '16px', backgroundColor: selectedBackgroundColor.color }}>
          <Col span={12}>
            <div>
              {props.player && <Title style={{ color: selectedColor.color }}>{props.player.nickname && props.player.nickname !== '' ? props.player.nickname : 'New Player'}</Title>}
            </div>
          </Col>
        </Row>
        <Divider />
        <Tabs defaultActiveKey="1">
          <TabPane
            tab={
              <span>
                <IdcardOutlined />
                Bio
              </span>
            }
            key="1"
          >
            <Form scrollToFirstError={true} onFinish={save} form={form} layout="vertical">
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="firstName" label="First Name">
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="lastName" label="Last Name">
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="nickname" label="Nickname">
                    <Input placeholder="Nickname" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="jersey" label="Jersey #">
                    <InputNumber min={1} max={99} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="dateOfBirth" label="Date of Birth">
                    <DatePicker format="MM/DD/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="color" label="Player Text Color">
                    <ColorPicker animation="slide-down" color={selectedColor.color} onChange={onColorChange} placement="bottomRight" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="color" label="Player Background Color">
                    <ColorPicker animation="slide-down" color={selectedBackgroundColor.color} onChange={onBackgroundColorChange} placement="bottomRight" />
                  </Form.Item>
                </Col>
              </Row>
              <Row style={{ marginTop: '16px' }}>
                <div style={{ flex: 1 }}></div>
                <Space>
                  <Form.Item>
                    <Button className="login-form-button" icon={<CloseOutlined />} type="ghost" onClick={() => cancel()}>
                      Cancel
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" icon={<SaveOutlined />} loading={isLoading}>
                      Save
                    </Button>
                  </Form.Item>
                </Space>
              </Row>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BallIcon />
                Fielding Stats
              </span>
            }
            key="2"
          >
            {statsLoaded && fieldingStats && positions && props.player && (
              <div>
                <h3>Fielding Stats</h3>
                <div className="diagram" style={{ marginLeft: '25px', marginTop: '24px' }}>
                  {positions.map((position, pIndex) => {
                    if (position.number > 0) {
                      return (
                        <span
                          key={`label_${props.player.nickname}_${pIndex}`}
                          style={{ backgroundColor: props.player.backgroundColor, color: props.player.textColor }}
                          className={`playerlabel ${position.className}`}
                        >
                          {fieldingStats[position.abbr] && <span>{fieldingStats[position.abbr].count}</span>}
                          {!fieldingStats[position.abbr] && <span>0</span>}
                        </span>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                  <div className="sittingBox">
                    <strong>Bench:</strong>
                    <div className="sitting">
                      <div>
                        <div style={{ padding: '3px' }} className="sitting">
                          <span>{fieldingStats['BN'] ? fieldingStats['BN'].count : 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabPane>
          <TabPane
            tab={
              <span>
                <BatIcon />
                Batting Order Stats
              </span>
            }
            key="3"
          >
            {statsLoaded && battingOrderStats && props.player && (
              <div>
                <h3>Batting Order Stats</h3>
                <div style={{ marginLeft: '25px', marginTop: '24px' }}>
                  {Object.keys(battingOrderStats).map((key) => {
                    return (
                      <Card>
                        <Statistic title={battingOrderStats[key].label} value={battingOrderStats[key].count} valueStyle={{ color: '#3f8600' }} />
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>
    </Space>
  );
};

export default UpdatePlayer;
