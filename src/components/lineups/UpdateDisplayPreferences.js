/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

import DataService from '../../services/DataService';
import { notification, Radio, Button, Row, Col, Form, Space, Divider, Typography, Skeleton } from 'antd';

import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import 'rc-color-picker/assets/index.css';

const { Title } = Typography;

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

const UpdateDisplayPreferences = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.lineup.settings.playerNameDisplay);
      setIsLoading(false);
    };
    init();
  }, [props.player]);

  useEffect(() => {
    return function cleanup() {};
  }, []);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updatedLineup = { ...props.lineup };
      updatedLineup.settings.playerNameDisplay = values.playerNameDisplay;

      await DataService.updateLineup(updatedLineup);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: 'Lineup Updated',
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess(updatedLineup);
    } catch (e) {
      console.log('err: ', e);
      notification.error({
        message: 'Error Updating Lineup',
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
        <Row align="left" style={{ paddingLeft: '8px', paddingTop: '16px' }}>
          <Col span={12}>
            <div>{props.lineup && <Title>Edit Lineup Settings</Title>}</div>
          </Col>
        </Row>
        <Divider />

        <Form scrollToFirstError={true} onFinish={save} form={form} layout="vertical">
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
      </div>
    </Space>
  );
};

export default UpdateDisplayPreferences;
