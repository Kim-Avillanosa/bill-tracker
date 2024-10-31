import { Page, SecuredLayout } from "@/shared/components";
import DashboardOptions from "./dashboardOptions";
import { useState } from "react";
import ClientTable from "../clients/ClientTable";
import TimesheetContainer from "../timesheet/TimesheetContainer";

type OfferStatuses = "TIMESHEETS" | "CLIENTS" | "INVOICE";

const Dashboard: React.FC = () => {
  const [currentStatus, setStatus] = useState<OfferStatuses>("TIMESHEETS");

  const renderCurrentView = () => {
    switch (currentStatus) {
      case "TIMESHEETS":
        return <TimesheetContainer />;

      case "INVOICE":
        return <>Invoice</>;

      case "CLIENTS":
        return <ClientTable />;

      default:
        return <>Timesheets</>;
    }
  };

  return (
    <Page title="Bill Tracker">
      <SecuredLayout>
        <h1>
          <strong>Dashboard</strong>
        </h1>
        <DashboardOptions setStatus={(status) => setStatus(status)} />{" "}
        {renderCurrentView()}
      </SecuredLayout>
    </Page>
  );
};

export default Dashboard;
