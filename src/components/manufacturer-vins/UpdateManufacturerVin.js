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


const UpdateModelAlias = (props) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.modelAlias);

      setIsLoading(false);
    };
    init();
  }, [form, props.modelAlias]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
      manufacturerId: props.manufacturerVin.manufacturerId,
      manufacturerName: props.manufacturerVin.manufacturerName,
      shortVin: values.manufacturerVin.shortVin,
      vinManufacturerCode: values.manufacturerVin.vinManufacturerCode,
      vinYearCode: values.manufacturerVin.vinYearCode,
      cicCode: values.manufacturerVin.cicCode,
      modelYear: values.manufacturerVin.modelYear
      };

      await DataService.updateManufacturerVin(updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Manufacturer VIN Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Manufacturer VIN",
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
          <Col>
            <div>
              <Typography style={{ fontSize: "20px" }}>
                Edit Manufacturer VIN
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row align="middle">
          <Col>
            <div>
              <Typography style={{ fontSize: "20px" }}>
                {props.model.modelId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24}>
            <Form.Item name="manufacturerId">
              <Input placeholder="Manufacturer Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="manufacturerName">
              <Input placeholder="Manufacturer Name" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="modelYear">
              <Input placeholder="Model Year" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="vinManufacturerCode">
              <Input placeholder="VIN Manufacturer Code" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="vinYearCode">
              <Input placeholder="Manufacturer Id" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="shortVin">
              <Input placeholder="Short VIN" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="cicCode">
              <Input placeholder="CIC Code" />
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

export default UpdateModelAlias;
