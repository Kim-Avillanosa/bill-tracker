import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  FormGroup,
  FormLabel,
  Container,
  FormControl,
  Button,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import useClient from "@/services/useClient";
import useModalStore from "@/shared/store/useModal";

type ClientFormProps = {
  initialData?: {
    id?: number;
    name: string;
    code: string;
    symbol: string;
    address: string;
    hourly_rate: number;
    hours_per_day: number;
    category: string;
    banner_color: string;
    headline_color: string;
    text_color: string;
  };
  isUpdate?: boolean;
};

const ClientForm: React.FC<ClientFormProps> = ({
  initialData,
  isUpdate = false,
}) => {
  const { addClient, updateClient } = useClient();

  const { dismiss } = useModalStore();

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      code: initialData?.code || "",
      symbol: initialData?.symbol || "",
      address: initialData?.address || "",
      hourly_rate: initialData?.hourly_rate || 0,
      hours_per_day: initialData?.hours_per_day || 0,
      category: initialData?.category || "",
      banner_color: initialData?.banner_color || "",
      headline_color: initialData?.headline_color || "",
      text_color: initialData?.text_color || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      code: Yup.string().required("Code is required"),
      symbol: Yup.string().required("Symbol is required"),
      address: Yup.string().required("Address is required"),
      hourly_rate: Yup.number().required("Hourly rate is required"),
      hours_per_day: Yup.number().required("Hours per day is required"),
      category: Yup.string().required("Category is required"),
      banner_color: Yup.string().required("Banner color is required"),
      headline_color: Yup.string().required("Headline color is required"),
      text_color: Yup.string().required("Text color is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (isUpdate && initialData) {
          await updateClient(initialData.id ?? 0, values);
          toast.success("Client updated successfully");
          dismiss();
        } else {
          await addClient(values);
          toast.success("Client added successfully");
          dismiss();
        }
      } catch (error) {
        toast.error("Failed to submit client data");
      }
    },
  });

  return (
    <Container className="">
      <Form onSubmit={formik.handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="name">Name</FormLabel>
          <FormControl
            type="text"
            name="name"
            id="name"
            placeholder="Enter client name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            isInvalid={formik.touched.name && Boolean(formik.errors.name)}
          />
          {formik.touched.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="code">Code</FormLabel>
          <FormControl
            type="text"
            name="code"
            id="code"
            placeholder="Enter client code"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.code}
            isInvalid={formik.touched.code && Boolean(formik.errors.code)}
          />
          {formik.touched.code && (
            <div className="text-danger">{formik.errors.code}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="symbol">Symbol</FormLabel>
          <FormControl
            type="text"
            name="symbol"
            id="symbol"
            placeholder="Enter client symbol"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.symbol}
            isInvalid={formik.touched.symbol && Boolean(formik.errors.symbol)}
          />
          {formik.touched.symbol && (
            <div className="text-danger">{formik.errors.symbol}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="address">Address</FormLabel>
          <FormControl
            type="text"
            name="address"
            id="address"
            placeholder="Enter client address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            isInvalid={formik.touched.address && Boolean(formik.errors.address)}
          />
          {formik.touched.address && (
            <div className="text-danger">{formik.errors.address}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="hourly_rate">Hourly Rate</FormLabel>
          <FormControl
            type="number"
            name="hourly_rate"
            id="hourly_rate"
            placeholder="Enter hourly rate"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.hourly_rate}
            isInvalid={
              formik.touched.hourly_rate && Boolean(formik.errors.hourly_rate)
            }
          />
          {formik.touched.hourly_rate && (
            <div className="text-danger">{formik.errors.hourly_rate}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="hours_per_day">Hours per Day</FormLabel>
          <FormControl
            type="number"
            name="hours_per_day"
            id="hours_per_day"
            placeholder="Enter hours per day"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.hours_per_day}
            isInvalid={
              formik.touched.hours_per_day &&
              Boolean(formik.errors.hours_per_day)
            }
          />
          {formik.touched.hours_per_day && (
            <div className="text-danger">{formik.errors.hours_per_day}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="category">Category</FormLabel>
          <FormControl
            type="text"
            name="category"
            id="category"
            placeholder="Enter category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            isInvalid={
              formik.touched.category && Boolean(formik.errors.category)
            }
          />
          {formik.touched.category && (
            <div className="text-danger">{formik.errors.category}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="banner_color">Banner Color</FormLabel>
          <FormControl
            type="text"
            name="banner_color"
            id="banner_color"
            placeholder="Enter banner color"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.banner_color}
            isInvalid={
              formik.touched.banner_color && Boolean(formik.errors.banner_color)
            }
          />
          {formik.touched.banner_color && (
            <div className="text-danger">{formik.errors.banner_color}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="headline_color">Headline Color</FormLabel>
          <FormControl
            type="text"
            name="headline_color"
            id="headline_color"
            placeholder="Enter headline color"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.headline_color}
            isInvalid={
              formik.touched.headline_color &&
              Boolean(formik.errors.headline_color)
            }
          />
          {formik.touched.headline_color && (
            <div className="text-danger">{formik.errors.headline_color}</div>
          )}
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="text_color">Text Color</FormLabel>
          <FormControl
            type="text"
            name="text_color"
            id="text_color"
            placeholder="Enter text color"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.text_color}
            isInvalid={
              formik.touched.text_color && Boolean(formik.errors.text_color)
            }
          />
          {formik.touched.text_color && (
            <div className="text-danger">{formik.errors.text_color}</div>
          )}
        </FormGroup>
        <div className="text-center m-3">
          <Button variant="success" className="w-100" type="submit">
            {isUpdate ? "Update Client" : "Add Client"}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default ClientForm;
