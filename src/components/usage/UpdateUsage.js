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

const UpdateUsage = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(props.isNew);
      form.setFieldsValue(props.usage);

      setIsLoading(false);
    };
    init();
  }, [form, props.isNew, props.usage]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        modelId: props.usage.modelId,
        modelYear: values.modelYear,
        age: values.age,
        benchmarkLevel: values.benchmarkLevel,
        meanAnnualUsage: values.meanAnnualUsage,
        recordCount: values.recordCount,
        percentile25: values.percentile25,
        percentile45: values.percentile45,
        percentile55: values.percentile55,
        percentile75: values.percentile75,
        percentile99: values.percentile99,
        distribution25: values.distribution25,
        distribution45: values.distribution45,
        distribution55: values.distribution55,
        distribution75: values.distribution75,
        distribution99: values.distribution99
      };

      await DataService.updateUsage(isNew,updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Usage Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Usage",
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
                Usage for Model Id: {props.usage.modelId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="modelYear"
              label="Model Year">
              <Input placeholder="Model Year" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="percentile25"
              label="Percentile 25" >
              <Input placeholder="Percentile 25" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="distrubution25"
              label="Distribution 25" >
              <Input placeholder="Distribution 25" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="age"
              label="Age">
              <Input placeholder="Age" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="percentile45"
              label="Percentile 45" >
              <Input placeholder="Percentile 45" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="distrubution45"
              label="Distribution 45" >
              <Input placeholder="Distribution 45" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="benchmarkLevel"
              label="Benchmark Level">
              <Input placeholder="Benchmark Level" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="percentile55"
              label="Percentile 55" >
              <Input placeholder="Percentile 55" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="distrubution55"
              label="Distribution 55" >
              <Input placeholder="Distribution 55" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="meanAnnualUsage"
              label="Mean Annual Usage">
              <Input placeholder="Mean Annual Usage" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="percentile75"
              label="Percentile 75" >
              <Input placeholder="Percentile 75" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="distrubution75"
              label="Distribution 75" >
              <Input placeholder="Distribution 75" />
            </Form.Item>
          </Col>
        </Row>
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
              name="percentile99"
              label="Percentile 99" >
              <Input placeholder="Percentile 99" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="distrubution99"
              label="Distribution 99" >
              <Input placeholder="Distribution 99" />
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

export default UpdateUsage;
