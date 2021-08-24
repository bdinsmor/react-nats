import React, { useState, useEffect } from "react";

import DataService from "../../services/DataService";
import {
  notification,
  Input,
  Button,
  Row,
  Col,
  Form,
  Space,
  Divider,
  Typography,
  Skeleton,
} from "antd";

import { SaveOutlined, CloseOutlined } from "@ant-design/icons";

const UpdateValue = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(props.isNew);
      form.setFieldsValue(props.value);

      setIsLoading(false);
    };
    init();
  }, [form, props.value, props.isNew]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        configurationId: props.value.configurationId,
        revisionDate: props.value.revisionDate,
        msrp: values.msrp,
        finance: values.finance,
        retail: values.retail,
        askingPrice: values.askingPrice,
        auctionPrice: values.auctionPrice,
        tradeIn: values.tradeIn,
        low: values.low,
        high: values.high,
        wholesale: values.wholesale,
      };

      await DataService.updateValue(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Value Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Value",
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
    <Space direction="vertical" style={{ width: "100%" }}>
      <Skeleton active loading={isLoading}></Skeleton>
      <Form
        scrollToFirstError={true}
        hidden={isLoading}
        onFinish={save}
        form={form}
        layout="vertical"
        hideRequiredMark
      >
        <Row align="left">
          <Col span={12}>
            <div>
              <Typography style={{ fontSize: "30px" }}>
              {props.value.configurationId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Row align="left">
          <Col span={12}>
            <div>
              <Typography style={{ fontSize: "14px", color: 'rgba(0,0,0,0.47)' }}>
              {props.value.revisionDate}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="msrp"
              label="MSRP">
              <Input placeholder="MSRP" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="askingPrice"
              label="Asking Price" >
              <Input placeholder="Asking Price" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="Finance"
              label="finance">
              <Input placeholder="Finance" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="askingPrice"
              label="Asking Price" >
              <Input placeholder="Asking Price" />
            </Form.Item>
          </Col>          
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="retail"
              label="Retail">
              <Input placeholder="Retail" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="low"
              label="Low" >
              <Input placeholder="Low" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="wholesale"
              label="Wholesale">
              <Input placeholder="Wholesale" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="high"
              label="High" >
              <Input placeholder="High" />
            </Form.Item>
          </Col>
          
        </Row>
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="tradeIn"
              label="Trade In" >
              <Input placeholder="Trade In" />
            </Form.Item>
          </Col>
        </Row>
        <Space>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              icon={<SaveOutlined />}
              loading={isLoading}
            >
              Save
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              className="login-form-button"
              icon={<CloseOutlined />}
              type="ghost"
              onClick={() => cancel()}
            >
              Cancel
            </Button>
          </Form.Item>
        </Space>
      </Form>
    </Space>
  );
};

export default UpdateValue;
