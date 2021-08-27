import React, { useState, useEffect } from "react";

import DataService from "../../../services/DataService";
import {
  notification,
  Input,
  Button,
  Row,
  Col,
  Form,
  Select,
  Space,
  Divider,
  Typography,
  Skeleton,
} from "antd";


import { SaveOutlined, CloseOutlined } from "@ant-design/icons";
const { Option } = Select;

const UpdateAdjustment = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(props.isNew);
      form.setFieldsValue(props.adjustment);

      setIsLoading(false);
    };
    init();
  }, [form, props.adjustment, props.isNew]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        sizeClassId: props.adjustment.sizeClassId,
        fuelType: values.fuelType,
        modelYear: values.modelYear,
        uom: values.uom,

      };

      await DataService.updateUtilizationAdjustment(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Adjustment Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Adjusment",
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
                Utilization Adjustment for Size Class Id: {props.adjustment.sizeClassId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={24}>
          <Form.Item name="fuelType" label="Condition" rules={[{ required: true }]}>
          <Select
            placeholder="Select a fuel type"
            allowClear
          >
            <Option value="D">D</Option>
            <Option value="G">G</Option>
          </Select>
        </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="modelYear"
              label="Model Year"
              rules={[
                {
                  required: true,
                  message: "Model Year cannot be empty",
                },
              ]}
            >
              <Input placeholder="Model Year" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="lowValue"
              label="Low Value">
              <Input placeholder="Low Value" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="highValue"
              label="High Value">
              <Input placeholder="High Value" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="uom"
              label="UoM">
              <Input placeholder="UoM" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
          <Form.Item
              name="retailAdjustmentValue"
              label="Retail Adjustment Value">
              <Input placeholder="Retail Adjustment Value" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
          <Form.Item
              name="financeAdjustmentValue"
              label="Finance Adjustment Value">
              <Input placeholder="Finance Adjustment Value" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="wholesaleAdjustmentValue"
              label="Wholesale Adjustment Value">
              <Input placeholder="Wholesale Adjustment Value" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="tradeInAdjustment"
              label="Trade In Adjustment">
              <Input placeholder="Trade In Adjustment" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="lowAdjustment"
              label="Low Adjustment">
              <Input placeholder="Low Adjustment" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="highAdjustment"
              label="High Adjustment">
              <Input placeholder="High Adjustment" />
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

export default UpdateAdjustment;
