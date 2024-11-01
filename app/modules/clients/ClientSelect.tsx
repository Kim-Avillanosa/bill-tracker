import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import useClient from "@/services/useClient";
import { toast } from "react-hot-toast";

interface ClientSelectProps {
  onChange: (id: number) => void;
}

const ClientSelect: React.FC<ClientSelectProps> = ({ onChange }) => {
  const { getClientList } = useClient();
  const [clients, setClients] = useState<Models.Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getClientList();
        // Assuming response.data is an array of clients
        setClients(response.data); // Assuming response.data is already typed as Client[]

        // If there are clients, call onChange with the first client's id
        if (response.data.length > 0) {
          onChange(response.data[0].id);
        }
      } catch {
        toast.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []); // Add getClientList and onChange to the dependency array

  return (
    <Container>
      <Row>
        <Col className="align-content-center" xs="auto">
          <Form.Label>
            <strong>Client: </strong>
          </Form.Label>
        </Col>
        <Col xs="auto">
          <Form.Group controlId="clientSelect">
            {loading ? (
              <p>Loading clients...</p>
            ) : (
              <Form.Control
                as="select"
                onChange={(e) => onChange(Number(e.target.value))}
                defaultValue={clients.length > 0 ? clients[0].id : ""} // Set default value if clients exist
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.code})
                  </option>
                ))}
              </Form.Control>
            )}
          </Form.Group>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientSelect;
