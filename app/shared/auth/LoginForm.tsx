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
import Link from "next/link";
import useAuth from "@/services/useAuth";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import { jwtDecode } from "jwt-decode";

const LoginForm = () => {
    const { login } = useAuth();

    const { setAccount } = useAuthStore();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            password: Yup.string()
                .min(3, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: (values) => {
            toast
                .promise(login(values.email, values.password), {
                    success: `Welcome! ${values.email}`,
                    loading: "Please wait",
                    error: (err) => err.response.data.message,
                })
                .then((resp) => {
                    if (resp.status === 200) {
                        const result: Models.JwtResponse = resp.data;
                        const data: Models.TokenData = jwtDecode(result.access_token);
                        setAccount(
                            {
                                userName: data.username,
                                id: data.sub,
                            },
                            result.access_token
                        );
                    }
                });
        },
    });

    return (
        <div className="auth-wrapper">
        <Container className="auth-card">
            <div className="auth-logo">
                <img src="/logo.png" alt="Bill Tracker" />
            </div>
            <h1 className="mt-2 mb-4">
                <strong>Login</strong>
            </h1>
            <Form onSubmit={formik.handleSubmit}>
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
                <div className="text-center mt-3">
                    <Button className="w-100" type="submit">
                        Login
                    </Button>
                </div>

                <div className="text-center mt-2">
                    <Link href={"/register"}>
                        <Button className="w-100" variant="outline-dark">
                            Register
                        </Button>
                    </Link>
                </div>
            </Form>
        </Container>
        </div>
    );
};

export default LoginForm;
