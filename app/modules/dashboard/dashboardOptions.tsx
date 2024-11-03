import { Button } from "react-bootstrap";
import useModalStore from "@/shared/store/useModal";
import { useState } from "react";
import InvoiceSelectionForm from "../invoice/InvoiceSelectionForm";

type OfferStatuses = "TIMESHEETS" | "CLIENTS";

interface DashboardOptionsProps {
  setStatus: (status: OfferStatuses) => void;
}

const DashboardOptions: React.FC<DashboardOptionsProps> = ({ setStatus }) => {
  const [currentStatus, setlocalStatus] = useState<OfferStatuses>("TIMESHEETS");

  const { openModal } = useModalStore();

  return (
    <div className="mt-5 d-flex justify-content-between">
      <div>
        <Button
          variant={currentStatus == "TIMESHEETS" ? "outline-success" : "light"}
          onClick={() => {
            setStatus("TIMESHEETS");
            setlocalStatus("TIMESHEETS");
          }}
          className="m-1"
        >
          🕒 TIMESHEETS
        </Button>
        <Button
          variant={currentStatus == "CLIENTS" ? "outline-success" : "light"}
          onClick={() => {
            setlocalStatus("CLIENTS");
            setStatus("CLIENTS");
          }}
          className="m-1"
        >
          👨‍💼 CLIENTS
        </Button>
      </div>
      <div>
        <Button
          onClick={() =>
            openModal({
              size: "lg",
              title: "Generate Invoice & Timesheet",
              content: <InvoiceSelectionForm />,
            })
          }
          variant="warning"
          size="lg"
          className="m-1"
        >
          ⚡Invoice and Timesheet
        </Button>
      </div>
    </div>
  );
};

export default DashboardOptions;
