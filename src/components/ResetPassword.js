import React, { useState } from 'react';
import { notification, Input, Button, Form, Row, Col, Space } from 'antd';
import AuthService from '../services/AuthService';
import logo from '../logo-dark.svg';

const LoginComponent = (props) => {

    // Initialize message state
    const [showReset, setShowReset] = useState(false);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const requestPasswordReset = async () => {
        setLoading(true);
        const email = form.getFieldValue('email');
        const res = await AuthService.requestPasswordReset(email)
        if (res.errorCode) {
            notification.error({
                message: res.errorMessage,
                duration: 4
            })
        } else {
            notification.success({
                message: "Password Reset Requested",
                description: "You will receive an email with you reset code. Please enter it below along with a new password.",
                duration: 4
            })
            setShowReset(true)
        }
        setLoading(false);
    };
    const resetPassword = async (credentials) => {
        setLoading(true);
        const res = await AuthService.resetPassword(credentials)
        if (res.errorCode) {
            notification.error({
                message: res.errorMessage,
                duration: 4
            })
            setShowReset(false)
            setLoading(false);
        } else {
            setLoading(false);
            notification.success({
                message: "Password Changed!",
                duration: 4
            })
            props.history.push('/login');
        }
    };

    return (
        <React.Fragment>
            <Row style={{ paddingTop: 100 }}>
                <Col flex="auto"></Col>
                <Col flex="300px">
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>
                        <img className='logo-header' src={logo} alt="logo" />
                        <Form form={form}
                            name="login"
                            className="login-form"
                            onFinish={resetPassword}
                            wrapperCol={{ span: 24 }}
                        >
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email!' }]}
                            >
                                <Input
                                    placeholder="Email"
                                    disabled={loading}
                                />
                            </Form.Item>
                            <Form.Item
                                hidden={!showReset}
                                name="resetToken"
                                rules={[{ required: true, message: 'Please input a reset code!' }]}
                            >
                                <Input.Password placeholder="Reset Code" disabled={loading} />
                            </Form.Item>
                            <Form.Item
                                hidden={!showReset}
                                name="newPassword"
                                hasFeedback
                                extra="Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&)"
                                rules={[
                                    { required: true, message: 'Please input a new Password!' },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            const pwordTest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&-]{8,}$/
                                            if (pwordTest.test(value)) return Promise.resolve();
                                            return Promise.reject('Password does not meet rules.');
                                        }
                                    })
                                ]}
                            >
                                <Input.Password placeholder="New Password" disabled={loading} />
                            </Form.Item>
                            <Form.Item
                                hidden={!showReset}
                                name="confirm"
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please confirm your password!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(rule, value) {
                                            if (!value || getFieldValue('newPassword') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('The passwords do not match!');
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="Confirm Password" disabled={loading} />
                            </Form.Item>
                            <Form.Item hidden={!showReset}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    loading={loading}
                                >
                                    Change Password
                                </Button>
                            </Form.Item>
                            <Form.Item hidden={showReset}>
                                <Button
                                    onClick={() => requestPasswordReset()}
                                    type="primary"
                                    loading={loading}
                                >
                                    Reset Password
                                </Button>
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