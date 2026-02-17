import { Button } from "react-bootstrap";
import useModalStore from "@/shared/store/useModal";
import { useState } from "react";
import InvoiceSelectionForm from "../invoice/InvoiceSelectionForm";

type OfferStatuses = "TIMESHEETS" | "CLIENTS" | "CHARTS" | "INVOICES";

interface DashboardOptionsProps {
  setStatus: (status: OfferStatuses) => void;
}

const DashboardOptions: React.FC<DashboardOptionsProps> = ({ setStatus }) => {
  const [currentStatus, setlocalStatus] = useState<OfferStatuses>("CHARTS");

  const { openModal } = useModalStore();

  return (
    <div className="mt-2 mb-4 d-flex flex-wrap gap-3 justify-content-between align-items-center toolbar-surface">
      <div className="dashboard-actions">
        <Button
          size="sm"
          variant={currentStatus == "CHARTS" ? "outline-success" : "light"}
          onClick={() => {
            setlocalStatus("CHARTS");
            setStatus("CHARTS");
          }}
          className="m-0"
        >
          📊 CHARTS
        </Button>
        <Button
          size="sm"
          variant={currentStatus == "TIMESHEETS" ? "outline-success" : "light"}
          onClick={() => {
            setStatus("TIMESHEETS");
            setlocalStatus("TIMESHEETS");
          }}
          className="m-0"
        >
          🕒 TIMESHEETS
        </Button>
        <Button
          size="sm"
          variant={currentStatus == "CLIENTS" ? "outline-success" : "light"}
          onClick={() => {
            setlocalStatus("CLIENTS");
            setStatus("CLIENTS");
          }}
          className="m-0"
        >
          👨‍💼 CLIENTS
        </Button>
        <Button
          size="sm"
          variant={currentStatus == "INVOICES" ? "outline-success" : "light"}
          onClick={() => {
            setlocalStatus("INVOICES");
            setStatus("INVOICES");
          }}
          className="m-0"
        >
          📄 INVOICES
        </Button>
      </div>
      <div>
        <Button
          onClick={() =>
            openModal({
              size: "xl",
              title: "Generate Invoice & Timesheet",
              content: <InvoiceSelectionForm />,
            })
          }
          variant="warning"
          size="sm"
          className="m-0"
        >
          ⚡Invoice and Timesheet
        </Button>
      </div>
    </div>
  );
};

export default DashboardOptions;
