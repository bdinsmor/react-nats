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

const UpdatePopularity = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(props.isNew);
      form.setFieldsValue(props.popularity);

      setIsLoading(false);
    };
    init();
  }, [form, props.popularity]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        modelId: props.popularity.modelId,
        benchmarkGroup: values.benchmarkGroup,
        marketPopularityIndex: values.marketPopularityIndex,
        marketPopularityLabel: values.marketPopularityLabel,
        recordCount: values.recordCount,
        twenty: values.twenty,
        forty: values.forty,
        sixty: values.sixty,
        eighty: values.eighty,
        hundred: values.hundred,
        twentyPercent: values.twentyPercent,
        fortyPercent: values.fortyPercent,
        sixtyPercent: values.sixtyPercent,
        eightyPercent: values.eightyPercent,
        hundredPercent: values.hundredPercent
      };

      await DataService.updatePopularity(isNew,updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Popularity Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Popularity",
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
        <Row align="middle">
          <Col span={12}>
            <div>
              <Typography style={{ fontSize: "20px" }}>
              Popularity for Model Id: {props.popularity.modelId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="recordCount"
              label="Record Count">
              <Input placeholder="Record Count" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="twenty"
              label="Twenty" >
              <Input placeholder="Twenty" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="twentyPercent"
              label="Twenty %" >
              <Input placeholder="Twenty %" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="Market Popularity Index"
              label="marketPopularityIndex">
              <Input placeholder="Market Popularity Index" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="forty"
              label="Forty" >
              <Input placeholder="Forty" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="fortyPercent"
              label="Forty %" >
              <Input placeholder="Forty %" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="benchmarkGroup"
              label="Benchmark Group">
              <Input placeholder="Benchmark Group" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sixty"
              label="Sixty" >
              <Input placeholder="Sixty" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sixtyPercent"
              label="Sixty %" >
              <Input placeholder="Sixty %" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="marketPopularityLabel"
              label="Market Popularity Label">
              <Input placeholder="Market Popularity Label" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="eighty"
              label="Eighty" >
              <Input placeholder="Eighty" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="eightyPercent"
              label="Eighty %" >
              <Input placeholder="Eighty %" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8} offset={8}>
            <Form.Item
              name="hundred"
              label="Hundred" >
              <Input placeholder="Hundred" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="hundredPercent"
              label="Hundred %" >
              <Input placeholder="Hundred %" />
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

export default UpdatePopularity;
