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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);

      form.setFieldsValue(props.adjustment);

      setIsLoading(false);
    };
    init();
  }, [form, props.adjustment]);

  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        sizeClassId: props.adjustment.sizeClassId,
        condition: values.adjustment.condition,
        adjustmentFactor: values.adjustment.adjustmentFactor,
      };

      await DataService.updateUser(updates);
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
                Condition Adjustment for Size Class Id: {props.adjustment.sizeClassId}
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />
        <Row gutter={12}>
          <Col span={24}>
          <Form.Item name="condition" label="Condition" rules={[{ required: true }]}>
          <Select
            placeholder="Select a condition"
            allowClear
          >
            <Option value="Excellent">Excellent</Option>
            <Option value="Very Good">Very Good</Option>
            <Option value="Good">Good</Option>
            <Option value="Fair">Fair</Option>
            <Option value="Poor">Poor</Option>
          </Select>
        </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="adjustmentFactor"
              label="Adjustment Factor"
              rules={[
                {
                  required: true,
                  message: "Adjustment Factor cannot be empty",
                },
              ]}
            >
              <Input placeholder="Adjustment Factor" />
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
