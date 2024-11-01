import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Form,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
} from "react-bootstrap";
import Link from "next/link";
import useAuth from "@/services/useAuth";
import toast from "react-hot-toast/headless";
import { useRouter } from "next/router";

const RegistrationForm = () => {
  const { register } = useAuth();

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      name: "",
      address: "",
      bank_name: "",
      bank_swift_code: "",
      bank_account_number: "",
      bank_account_name: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      name: Yup.string().required("Name is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), ""], "Passwords must match")
        .required("Confirm Password is required"),
      address: Yup.string().required("Address is required"),
      bank_name: Yup.string().required("Bank name is required"),
      bank_swift_code: Yup.string().required("Bank SWIFT code is required"),
      bank_account_number: Yup.string().required(
        "Bank account number is required"
      ),
      bank_account_name: Yup.string().required("Bank account name is required"),
    }),
    onSubmit: (values) => {
      toast
        .promise(register({ ...values }), {
          success: `Account successfully registered`,
          loading: "Please wait",
          error: (err) => err.response.data.message,
        })
        .then((resp) => {
          if (resp.status === 201) {
            router.push("/");
          }
        });
    },
  });

  return (
    <div className="container mt-5 w-50 pb-5">
      <h1 className="text-center">
        <strong style={{ fontSize: 60 }}>Bill tracker 💸</strong>
      </h1>
      <h1 className="mt-5">
        <strong>Register</strong>
      </h1>

      <Form className="mt-5" onSubmit={formik.handleSubmit}>
        {/* Credentials Section */}
        <div className="mt-5">
          <h4>
            <strong>Credentials</strong>
          </h4>
          <hr />

          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              isInvalid={formik.touched.email && Boolean(formik.errors.email)}
            />
            {formik.touched.email && (
              <div className="text-danger">{formik.errors.email}</div>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              isInvalid={
                formik.touched.password && Boolean(formik.errors.password)
              }
            />
            {formik.touched.password && (
              <div className="text-danger">{formik.errors.password}</div>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
            <FormControl
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              isInvalid={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
            />
            {formik.touched.confirmPassword && (
              <div className="text-danger">{formik.errors.confirmPassword}</div>
            )}
          </FormGroup>
        </div>

        <div className="mt-5">
          <h4>
            <strong>Name</strong>
          </h4>
          <hr />
          <FormGroup>
            <FormLabel htmlFor="name">Full Name</FormLabel>
            <FormControl
              type="text"
              name="name"
              id="name"
              placeholder="Enter your full name"
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
            <FormLabel htmlFor="address">Address</FormLabel>
            <FormControl
              type="text"
              name="address"
              id="address"
              placeholder="Enter your address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              isInvalid={
                formik.touched.address && Boolean(formik.errors.address)
              }
            />
            {formik.touched.address && (
              <div className="text-danger">{formik.errors.address}</div>
            )}
          </FormGroup>
        </div>

        <div className="mt-5">
          <h4>
            <strong>Bank Details (For Invoice generation)</strong>
          </h4>
          <hr />

          <FormGroup>
            <FormLabel htmlFor="bank_name">Bank Name</FormLabel>
            <FormControl
              type="text"
              name="bank_name"
              id="bank_name"
              placeholder="Enter your bank name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bank_name}
              isInvalid={
                formik.touched.bank_name && Boolean(formik.errors.bank_name)
              }
            />
            {formik.touched.bank_name && (
              <div className="text-danger">{formik.errors.bank_name}</div>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="bank_swift_code">Bank SWIFT Code</FormLabel>
            <FormControl
              type="text"
              name="bank_swift_code"
              id="bank_swift_code"
              placeholder="Enter your bank SWIFT code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bank_swift_code}
              isInvalid={
                formik.touched.bank_swift_code &&
                Boolean(formik.errors.bank_swift_code)
              }
            />
            {formik.touched.bank_swift_code && (
              <div className="text-danger">{formik.errors.bank_swift_code}</div>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="bank_account_number">
              Bank Account Number
            </FormLabel>
            <FormControl
              type="text"
              name="bank_account_number"
              id="bank_account_number"
              placeholder="Enter your bank account number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bank_account_number}
              isInvalid={
                formik.touched.bank_account_number &&
                Boolean(formik.errors.bank_account_number)
              }
            />
            {formik.touched.bank_account_number && (
              <div className="text-danger">
                {formik.errors.bank_account_number}
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="bank_account_name">Bank Account Name</FormLabel>
            <FormControl
              type="text"
              name="bank_account_name"
              id="bank_account_name"
              placeholder="Enter your bank account name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bank_account_name}
              isInvalid={
                formik.touched.bank_account_name &&
                Boolean(formik.errors.bank_account_name)
              }
            />
            {formik.touched.bank_account_name && (
              <div className="text-danger">
                {formik.errors.bank_account_name}
              </div>
            )}
          </FormGroup>
        </div>

        <div className="text-center mt-3">
          <Button className="w-100" color="primary" type="submit">
            Register
          </Button>
        </div>

        <div className="text-center mt-3">
          <Link href={"/"}>
            <Button className="w-100" variant="outline-dark">
              Login
            </Button>
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default RegistrationForm;
