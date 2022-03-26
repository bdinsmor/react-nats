/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { notification, Layout, Input, Card, Space, Form, Radio, Row, Col, Button, InputNumber } from 'antd';
import DataService, { positionsSubject, settingsSubject } from '../../services/DataService';
import { SaveOutlined } from '@ant-design/icons';

import dayjs from 'dayjs';
let localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(localizedFormat);
const { Content } = Layout;

class PlayerNameOptions {
  // Create new instances of the same class as static attributes
  static FirstName = new PlayerNameOptions('FirstName');
  static LastName = new PlayerNameOptions('LastName');
  static Nickname = new PlayerNameOptions('Nickname');
  static FirstInitialLastName = new PlayerNameOptions('FirstInitialLastName');

  constructor(name) {
    this.name = name;
  }
}

const Settings = (props) => {
  const [form] = Form.useForm();
  const [settings, setSettings] = useState({});
  const formRef = useRef(form);

  // Update the form ref
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const saveSettings = async (formValues) => {
    const l = { ...settings };
    l.continuousBatting = formValues.continuousBatting;
    l.numInnings = formValues.numInnings;
    l.outfieldRule = formValues.outfieldRule;
    l.outfieldInning = formValues.outfieldInning;
    l.numFielders = formValues.numFielders;
    l.fieldName = formValues.fieldName;
    l.playerNameDisplay = formValues.playerNameDisplay;
    console.log('updates: ' + JSON.stringify(l, null, 2));
    try {
      DataService.updateSettings(l);
      setSettings(l);
      notification.success({
        message: 'Settings Updated',
        duration: 2,
      });
    } catch (error) {
      notification.error({
        message: 'Error Updating Settings',
        duration: 2,
      });
    }
  };

  const createPositions = (numPositions) => {
    let positions = [];
    positions.push({
      number: 1,
      abbr: 'P',
      label: 'P',
      className: 'pitcher',
    });
    positions.push({
      number: 2,
      abbr: 'C',
      label: 'C',
      className: 'catcher',
    });
    positions.push({
      number: 3,
      abbr: '1B',
      label: '1B',
      className: 'first',
    });
    positions.push({
      number: 4,
      abbr: '2B',
      label: '2B',
      className: 'second',
    });
    positions.push({
      number: 5,
      abbr: '3B',
      label: '3B',
      className: 'third',
    });
    positions.push({
      number: 6,
      abbr: 'SS',
      label: 'SS',
      className: 'shortstop',
    });
    positions.push({
      number: 7,
      abbr: 'LF',
      label: 'LF',
      className: 'leftfield',
    });

    if (numPositions === 10) {
      positions.push({
        number: 8,
        abbr: 'LCF',
        label: 'LCF',
        className: 'leftcenter',
      });
      positions.push({
        number: 9,
        abbr: 'RCF',
        label: 'RCF',
        className: 'rightcenter',
      });
      positions.push({
        number: 10,
        abbr: 'RF',
        label: 'RF',
        className: 'rightfield',
      });
    } else {
      positions.push({
        number: 8,
        abbr: 'CF',
        label: 'CF',
        className: 'centerfield',
      });
      positions.push({
        number: 9,
        abbr: 'RF',
        label: 'RF',
        className: 'rightfield',
      });
    }

    DataService.updatePositions(positions);
  };

  useEffect(() => {
    const positionsSubscription = positionsSubject.getPositions().subscribe((positions) => {
      if (!positions || positions.length === 0) {
        createPositions();
      }
    });
    DataService.subscribeToPositions();
    form.setFieldsValue({
      fieldName: 'Balzer Field',
      numInnings: 6,
      outfieldRule: 'yes',
      continuousBatting: 'yes',
      outfieldInning: 4,
      numFielders: 9,
      playerNameDisplay: PlayerNameOptions.Nickname,
    });
    const settingsSubscription = settingsSubject.getSettings().subscribe((s) => {
      form.setFieldsValue(s);
      if (s !== settings) {
        setSettings(s);
      }
    });
    DataService.subscribeToSettings();

    return function cleanup() {
      positionsSubscription.unsubscribe();
      settingsSubscription.unsubscribe();
    };
  }, []);

  return (
    <React.Fragment>
      <Layout>
        <Content style={{ paddingTop: 24 }}>
          <Card title="System Settings" style={{ width: '50%' }}>
            <Col>
              <Form layout="inline" form={form} onFinish={saveSettings}>
                <Col>
                  <Col style={{ paddingBottom: 24 }}>
                    <h5>Home Field</h5>
                    <Form.Item name="fieldName">
                      <Input placeholder="Home Field Name" />
                    </Form.Item>
                  </Col>
                  <Col style={{ paddingBottom: 24 }}>
                    <h5># Innings in Game</h5>
                    <Form.Item name="numInnings">
                      <InputNumber min={6} max={7} placeholder="# Innings" />
                    </Form.Item>
                  </Col>
                  <Col style={{ paddingBottom: 24 }}>
                    <h5>Continous Batting Order</h5>
                    <Form.Item name="continuousBatting" rules={[{ required: true }]}>
                      <Radio.Group>
                        <Radio value="yes">Yes</Radio>
                        <Radio value="no">No</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col style={{ paddingBottom: 24 }}>
                    <h5># of Players in Field</h5>
                    <Form.Item name="numFielders">
                      <InputNumber min={9} max={10} placeholder="# Players" />
                    </Form.Item>
                  </Col>

                  <Row style={{ paddingBottom: 36, gutter: 24 }}>
                    <Col style={{ paddingRight: 16 }}>
                      <h5>Must Play Outfield</h5>
                      <Form.Item name="outfieldRule" rules={[{ required: true }]}>
                        <Radio.Group>
                          <Radio value="yes">Yes</Radio>
                          <Radio value="no">No</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                    <Col>
                      <h5>By Inning</h5>
                      <Form.Item name="outfieldInning">
                        <InputNumber min={1} max={7} placeholder="Play Outfield By Inning" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Col style={{ paddingBottom: 48 }}>
                    <h5>Player Name to Display in Lineup</h5>
                    <Form.Item name="playerNameDisplay">
                      <Radio.Group>
                        <Space direction="vertical">
                          <Radio value={PlayerNameOptions.FirstName.name}>First Name (John)</Radio>
                          <Radio value={PlayerNameOptions.LastName.name}>Last Name (Smith)</Radio>
                          <Radio value={PlayerNameOptions.Nickname.name}>Nickname (Johnny)</Radio>
                          <Radio value={PlayerNameOptions.FirstInitialLastName.name}>First Initial Last Name (J. Smith)</Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col style={{ paddingBottom: 24 }}>
                    <h5>&nbsp;</h5>
                    <Form.Item>
                      <Button htmlType="submit" icon={<SaveOutlined />}>
                        Save
                      </Button>
                    </Form.Item>
                  </Col>
                </Col>
              </Form>
            </Col>
          </Card>
        </Content>
      </Layout>
    </React.Fragment>
  );
};
export default Settings;
