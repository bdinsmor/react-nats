import React, { useState, useEffect } from 'react';
import { Avatar, Popover, Row, Col, Space, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';
import AuthService from '../services/AuthService';
import * as _dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const dayjs = _dayjs.extend(relativeTime);
const { Text } = Typography;

const HeaderBar = (props) => {
  const history = useNavigate();
  const [user] = useState({});
  const [title, setTitle] = useState([]);

  useEffect(() => {
    // setUser(AuthService.getUser());
  }, []);

  useEffect(() => {
    if (props.title && props.title !== '' && props.title !== '/') {
      setTitle(props.title.replace(/^\/|\/$/g, ''));
    } else {
      setTitle('Lineups');
    }
  }, [props.title]);

  const logout = () => {
    AuthService.logout();
    history.push('/login');
  };

  const titleContent = (
    <Row>
      <Space>
        {user && (
          <>
            <Avatar src={user.photoURL} style={{ background: 'transparent', border: 'solid white 1px', cursor: 'pointer' }} size="large" icon={<UserOutlined />} />
            <Col>
              <Space direction="vertical">
                <Text transform="capitalize">{user.displayName}</Text>
              </Space>
            </Col>
          </>
        )}
      </Space>
    </Row>
  );

  const userContent = (
    <div style={{ marginRight: '10px' }}>
      <Space direction="vertical">
        <Text type="secondary">{'Last logged in ' + dayjs(user.lastLogin).fromNow()}</Text>
        <Button type="ghost" size="small" onClick={() => logout()}>
          Logout
        </Button>
      </Space>
    </div>
  );

  return (
    <Row>
      <Col span={6} offset={3}>
        <Typography style={{ color: 'fff', fontSize: '22px', textTransform: 'capitalize' }}>
          <div style={{ color: '#fff', maxHeight: '46px' }}>{title}</div>
        </Typography>
      </Col>
      <Col flex="auto"></Col>
      <Col style={{ marginRight: '50px' }}>
        <Popover content={userContent} title={titleContent} placement="bottom" trigger="click">
          {user && (
            <Row>
              <Space>
                <Avatar src={user.photoURL} style={{ background: 'transparent', border: 'solid white 1px', cursor: 'pointer' }} size="medium" icon={<UserOutlined />} />
                <Text style={{ color: 'fff', fontSize: '14px', textTransform: 'capitalize' }}>
                  <div style={{ color: '#fff' }}>{user.displayName}</div>
                </Text>
              </Space>
            </Row>
          )}
        </Popover>
      </Col>
    </Row>
  );
};
export default HeaderBar;
