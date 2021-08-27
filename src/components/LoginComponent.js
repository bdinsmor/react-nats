import React, { useState } from 'react';
import { notification, Input, Button, Form, Row, Col, Space } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import AuthService from '../services/AuthService';
import logo from '../logo-dark.svg';

import { useHistory } from "react-router-dom";

const LoginComponent = (props) => {
     const [loading, setLoading] = useState(false);

     const history = useHistory();

  const resetPassword = () =>{ 
    let path = `reset-password`; 
    history.push(path);
  }

    const login = (values) => {
        setLoading(true);
        const credentials = { username: values.username, password: values.password };
        AuthService.login(credentials).then(res => {
            setLoading(false);
            if (!res.errorCode) {
                props.history.push('/');
            } else {
                if (res.errorCode === 'PASSWORD_RESET_REQUIRED') {
                    notification.error({
                        message: 'Password Reset Required',
                        duration: 4
                    })
                    props.history.push('/reset-password');
                } else {
                    notification.error({
                        message: res.errorMessage,
                        duration: 4
                    })
                }
            }
        });
    };

    return (
        
        <React.Fragment>
            <Row style={{ paddingTop: 100 }}>
                <Col flex="auto"></Col>
                <Col flex="300px">
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <img style={{ width: "300px" }} src={logo} alt="logo" />
                        <Form
                            name="login"
                            className="login-form"
                            onFinish={login}
                            wrapperCol={{ span: 24 }}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                      type: 'email',
                                      message: 'The input is not a valid email address',
                                    },
                                    {
                                      required: true,
                                      message: 'Please input an email address',
                                    },
                                  ]}
                            >
                                <Input
                                size="large"
                                    prefix={<MailOutlined className="site-form-item-icon" />}
                                    placeholder="Email"
                                    disabled={loading}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input
                                 size="large"
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                    disabled={loading}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    loading={loading}
                                    icon={<LoginOutlined />}
                                >
                                    Log in
                                </Button>
                                <Button type="link" onClick={() => resetPassword()} style={{ float: "right" }}>Reset Password</Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </Col>
                <Col flex="auto"></Col>
            </Row>
        </React.Fragment >
    )
}

export default LoginComponent;