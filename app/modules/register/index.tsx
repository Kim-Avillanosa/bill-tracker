import "bootstrap/dist/css/bootstrap.min.css";
import { Layout, Page } from "@/shared/components";
import RegistrationForm from "@/shared/auth/RegistrationForm";
import { NextPage } from "next";

const RegisterPage: NextPage = () => {
  return (
    <Page title="BidBox">
      <Layout>
        <RegistrationForm />
      </Layout>
    </Page>
  );
};

export default RegisterPage;
