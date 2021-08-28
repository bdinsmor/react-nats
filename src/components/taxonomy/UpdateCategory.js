import React, { useState, useEffect } from "react";

import DataService from "../../services/DataService";
import {
  notification,
  Button,
  Input,
  Row,
  Col,
  Form,
  Space,
  Divider,
  Typography,
  Skeleton,
} from "antd";


import { SaveOutlined, CloseOutlined } from "@ant-design/icons";


const UpdateCategory = (props) => {
  const [form] = Form.useForm();
  const [isNew, setIsNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async function () {
      setIsLoading(true);
      setIsNew(false);
      form.setFieldsValue(props.category);

      setIsLoading(false);
    };
    init();
  }, [form, props.category]);



  const save = async (values) => {
    setIsLoading(true);
    try {
      const updates = {
        classificationId: props.category.classificationId,
        categoryId: props.category.categoryId,
        categoryName: values.categoryName
      };

      await DataService.updateCategory(isNew, updates);
      form.resetFields();
      setIsLoading(false);
      notification.success({
        message: "Category Updated",
        duration: 2,
      });
      if (props.onSaveSuccess) props.onSaveSuccess();
    } catch (e) {
      notification.error({
        message: "Error Updating Category",
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
          <Col>
            <div>
              <Typography style={{ fontSize: "24px" }}>
              Update Category
              </Typography>
            </div>
          </Col>
        </Row>
        <Divider />

        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="classificationId"
              label="Classification Id"
            >
              <Input placeholder="Classification Id" disabled />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Col span={24}>
            <Form.Item
              name="categoryName"
              label="Category Name"
              rules={[
                {
                  required: true,
                  message: "Category Name cannot be empty",
                },
              ]}
            >
              <Input placeholder="Classification Name" />
            </Form.Item>
          </Col>
        </Row>

        <Space>
          <Form.Item>
            <Button
              className="login-form-button"
              icon={<CloseOutlined />}
              onClick={() => cancel()}
            >
              Cancel
            </Button>
          </Form.Item>
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

        </Space>
      </Form>
    </Space>
  );
};

export default UpdateCategory;
