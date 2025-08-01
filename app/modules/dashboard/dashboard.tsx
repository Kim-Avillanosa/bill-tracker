import { Page, SecuredLayout } from "@/shared/components";
import DashboardOptions from "./dashboardOptions";
import { useState } from "react";
import ClientTable from "../clients/ClientTable";
import TimesheetContainer from "../timesheet/TimesheetContainer";
import InvoiceCharts from "./InvoiceCharts";

type OfferStatuses = "TIMESHEETS" | "CLIENTS" | "EARNINGS" | "CHARTS";

const Dashboard: React.FC = () => {
  const [currentStatus, setStatus] = useState<OfferStatuses>("TIMESHEETS");

  const renderCurrentView = () => {
    switch (currentStatus) {
      case "TIMESHEETS":
        return <TimesheetContainer />;

      case "CLIENTS":
        return <ClientTable />;

      case "CHARTS":
        return <InvoiceCharts />;

      default:
        return <>Timesheets</>;
    }
  };

  return (
    <Page title="Bill Tracker">
      <SecuredLayout>
        <DashboardOptions setStatus={(status) => setStatus(status)} />{" "}
        {renderCurrentView()}
      </SecuredLayout>
    </Page>
  );
};

export default Dashboard;
