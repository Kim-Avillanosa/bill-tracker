import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form, Badge, Spinner, Alert } from "react-bootstrap";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import useAuthStore from "../../shared/store/useAuthStore";
import useAxiosClient from "../../services/useAxiosClient";
import { useChartData, ChartData } from "../../services/useChartData";

const COLORS = [
  "#2ed573",
  "#ff6348",
  "#3742fa",
  "#c56cf0",
  "#fffa65",
  "#b71540",
];

const status = {
  pending: "#fa983a",
  released: "#1e90ff",
  received: "#2ed573",
};

const InvoiceCharts: React.FC = () => {
  const { currentAccount: user } = useAuthStore();
  const { client: axiosClient } = useAxiosClient();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [currentClient, setCurrentClient] = useState<{
    id: number;
    name: string;
    banner_color: string;
    convert_currency_code: string;
    current_currency_code: string;
  }>();
  const [clients, setClients] = useState<
    Array<{
      id: number;
      name: string;
      banner_color: string;
      convert_currency_code: string;
      current_currency_code: string;
    }>
  >([]);
  const [selectedClientId, setSelectedClientId] = useState<number | undefined>(
    undefined
  );

  const { chartData, isLoading, error, mutate } =
    useChartData(selectedClientId);

  // Fetch clients for filter dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axiosClient.get(`/client/list`);
        setClients(response.data);
      } catch (err) {
        console.error("Failed to fetch clients:", err);
      }
    };

    if (user?.id) {
      fetchClients();
    }
  }, [user?.id]);

  const handleClientChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const clientId = event.target.value;
    setSelectedClient(clientId);
    if (clientId) {
      setSelectedClientId(parseInt(clientId));
      setCurrentClient(
        clients.find((client) => client.id === parseInt(clientId))
      );
    } else {
      setSelectedClientId(undefined);
    }
  };

  const formatCurrency = (amount: number, symbol: string) => {
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "released":
        return "info";
      case "received":
        return "success";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!chartData) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Data</Alert.Heading>
        <p>No chart data available.</p>
      </Alert>
    );
  }

  return (
    <div className="invoice-charts">
      {/* Header with Client Filter */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Row className="align-items-center">
                <Col md={6}>
                  <h4 className="mb-0">
                    Invoice Analytics
                    {chartData.filteredBy.clientId && (
                      <Badge bg="primary" className="ms-2">
                        Client Filtered
                      </Badge>
                    )}
                  </h4>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={selectedClient}
                    onChange={handleClientChange}
                    aria-label="Select client to filter"
                  >
                    <option value="">All Clients</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Invoices</Card.Title>
              <h2 className="text-primary">{chartData.totalInvoices}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Hours</Card.Title>
              <h2 className="text-success">
                {chartData.totalHours.toLocaleString()}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Currencies</Card.Title>
              <h2 className="text-info">
                {chartData.currencyBreakdown.length}
              </h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <div>
                {chartData.currencyBreakdown.map((curr, index) => (
                  <div key={curr.currency} className="mb-1">
                    <strong>
                      {formatCurrency(curr.totalAmount, curr.symbol)}
                    </strong>
                    <small className="text-muted d-block">
                      {curr.currency}
                    </small>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Currency Breakdown */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Currency Breakdown</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {chartData.currencyBreakdown.map((currency) => (
                  <Col md={3} key={currency.currency} className="mb-3">
                    <Card className="text-center">
                      <Card.Body>
                        <h6>{currency.currency}</h6>
                        <h4 className="text-primary">
                          {formatCurrency(
                            currency.totalAmount,
                            currency.symbol
                          )}
                        </h4>
                        <small className="text-muted">
                          {currency.invoiceCount} invoices
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Monthly Income Chart */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Monthly Income Trend</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart
                  data={chartData.monthlyIncome}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()}`,
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="pending"
                    stackId="a"
                    fill="#ffd32a"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={0}
                  />
                  <Bar
                    dataKey="released"
                    stackId="a"
                    fill="#3742fa"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={200}
                  />
                  <Bar
                    dataKey="received"
                    stackId="a"
                    fill="#1dd1a1"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={400}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Client Income and Status Summary */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Client Revenue Distribution</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.clientIncome}
                    dataKey="total"
                    nameKey="client"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ client, total, symbol }) =>
                      `${client}: ${formatCurrency(total, symbol)}`
                    }
                  >
                    {chartData.clientIncome.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(value, props.payload.symbol),
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5>Status Summary by Currency</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={chartData.statusSummary}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="currency" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(value, props.payload.symbol),
                      name.charAt(0).toUpperCase() + name.slice(1),
                    ]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="pending"
                    fill="#ffd32a"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={0}
                  />
                  <Bar
                    dataKey="released"
                    fill="#3742fa"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={200}
                  />
                  <Bar
                    dataKey="received"
                    fill="#1dd1a1"
                    radius={[4, 4, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={400}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Invoices Table */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5>Recent Invoices</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Client</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.recentInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td>{new Date(invoice.date).toLocaleDateString()}</td>
                        <td>{invoice.client}</td>
                        <td>
                          <Badge bg={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </td>
                        <td>
                          {formatCurrency(invoice.amount, invoice.symbol)}
                        </td>
                        <td>{invoice.hours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InvoiceCharts;
