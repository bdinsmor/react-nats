/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Row, Col, Space } from 'antd';
import AuthService from '../services/AuthService';
import logo from '../revs-logo.png';

const LoginComponent = (props) => {
  const login = async () => {
    const user = await AuthService.login();
    if (user) {
      props.history.push('/');
    }
  };

  useEffect(() => {
    const user = AuthService.getUser();
    if (!user) {
      //AuthService.login();
    }

    AuthService.checkForRedirect().then((user) => {
      console.log('user is... ' + JSON.stringify(user));
      props.history.push('/');
    });
  }, []);

  return (
    <React.Fragment>
      <Row style={{ paddingTop: 100 }}>
        <Col flex="auto"></Col>
        <Col flex="300px">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <img className="rotate-y" style={{ width: '800px' }} src={logo} alt="logo" />

            <Row gutter={16}>
              <div className="google-btn" onClick={() => login()}>
                <div className="google-icon-wrapper">
                  <img alt="los gatos revolution logo" className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
                </div>
                <p className="btn-text">Sign in with google</p>
              </div>
            </Row>
          </Space>
        </Col>
        <Col flex="auto"></Col>
      </Row>
    </React.Fragment>
  );
};

export default LoginComponent;
