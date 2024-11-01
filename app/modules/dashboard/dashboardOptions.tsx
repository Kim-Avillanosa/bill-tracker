import { Button } from "react-bootstrap";
import useModalStore from "@/shared/store/useModal";
import { useState } from "react";

type OfferStatuses = "TIMESHEETS" | "CLIENTS" | "INVOICE";

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
        <Button
          variant={currentStatus == "INVOICE" ? "outline-success" : "light"}
          onClick={() => {
            setlocalStatus("INVOICE");
            setStatus("INVOICE");
          }}
          className="m-1"
        >
          💲 INVOICE
        </Button>
      </div>
      <div>
        <Button
          onClick={() =>
            openModal({
              title: "Generate invoice",
              content: <div>Test</div>,
            })
          }
          variant="success"
          className="m-1"
        >
          Generate invoice 🧾
        </Button>
      </div>
    </div>
  );
};

export default DashboardOptions;
