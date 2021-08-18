import React, { useState, useEffect } from "react";
import { Avatar, Popover, Row, Col, Space, Button, Typography } from 'antd';
import { useHistory } from 'react-router-dom';

import { UserOutlined} from '@ant-design/icons';
import AuthService from "../services/AuthService";
import * as _dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

const dayjs = _dayjs.extend(relativeTime);
const { Text } = Typography;

const HeaderBar = (props) => {
    const history = useHistory();
    const [user, setUser] = useState({});
    const [title, setTitle] = useState([]);

    useEffect(() => {
        setUser(AuthService.getUser());
    }, [])

    useEffect(() => {
        if(props.title && props.title !== '' && props.title !== '/') {
            setTitle(props.title.replace(/^\/|\/$/g, ''));
        } else {
            setTitle("Taxonomy");
        }
       
    }, [props.title])

    const logout = () => {
        AuthService.logout();
        history.push('/login');
    }

    const userContent = (
        <div style={{ maring: "10px", width: "300px" }}>
            <Space direction="vertical">
                <Text strong style={{ fontSize: "16px" }}>{user.email}</Text>
                <Text type="secondary">{'Last logged in ' + dayjs(user.lastLogin).fromNow()}</Text>
                <Button size="small" onClick={() => logout()}>Logout</Button>
            </Space>
        </div>
    );

    return (
        <Row>
            <Col span={12} offset={2}>
            <Typography style={{ color: 'fff', fontSize: "20px", textTransform: "capitalize" }}>
                <div style={{color:"#fff"}}>{title}</div>
              </Typography>
            </Col>
            <Col flex="auto">
            
            </Col>
            <Col>
          </Col>
            <Col>
                <Popover content={userContent} placement="leftBottom" trigger="click">
                    <Avatar style={{ background: "transparent", border: "solid white 1px", cursor: "pointer" }} size="medium" icon={<UserOutlined />} />
                </Popover>
            </Col>
        </Row>
    )
}
export default HeaderBar;