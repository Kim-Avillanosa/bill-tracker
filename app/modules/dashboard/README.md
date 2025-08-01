# Invoice Charts Component

A comprehensive chart dashboard for invoice analytics using Recharts and React Bootstrap.

## Features

- **Multi-Currency Support**: Handles different currencies per client
- **Client Filtering**: Filter data by specific client or view all clients
- **Real-time Data**: Auto-refreshes every 30 seconds using SWR
- **Responsive Design**: Works on all screen sizes
- **Interactive Charts**: Hover tooltips and legends

## Charts Included

### 1. Summary Cards
- Total Invoices count
- Total Hours worked
- Number of currencies used
- Total Revenue by currency

### 2. Monthly Income Trend
- Stacked bar chart showing pending, released, and received amounts
- Line chart overlay showing total income
- Grouped by month and currency

### 3. Client Revenue Distribution
- Pie chart showing revenue breakdown by client
- Color-coded segments with tooltips

### 4. Status Summary by Currency
- Bar chart showing invoice status breakdown
- Grouped by currency with status indicators

### 5. Recent Invoices Table
- Last 10 invoices with status badges
- Amount and hours information

### 6. Currency Breakdown
- Card view showing total amount per currency
- Invoice count per currency

## Usage

### Basic Usage
```tsx
import InvoiceCharts from './modules/dashboard/InvoiceCharts';

function Dashboard() {
  return (
    <div>
      <InvoiceCharts />
    </div>
  );
}
```

### With Client Filtering
The component automatically handles client filtering through the dropdown. Users can:
- Select "All Clients" to see overall analytics
- Select a specific client to see client-specific data

## API Endpoints Used

- `GET /invoice/chart-summary/:userId` - All clients data
- `GET /invoice/chart-summary/:userId?clientId=123` - Specific client data
- `GET /client/list/:userId` - Client list for dropdown

## Dependencies

- **Recharts**: Chart library
- **React Bootstrap**: UI components
- **SWR**: Data fetching and caching
- **Axios**: HTTP client

## Data Structure

The component expects data in this format:

```typescript
interface ChartData {
  monthlyIncome: Array<{
    month: string;
    currency: string;
    symbol: string;
    pending: number;
    released: number;
    received: number;
    total: number;
    hours: number;
  }>;
  clientIncome: Array<{
    client: string;
    currency: string;
    symbol: string;
    pending: number;
    released: number;
    received: number;
    total: number;
    hours: number;
  }>;
  statusSummary: Array<{
    currency: string;
    symbol: string;
    pending: number;
    released: number;
    received: number;
    total: number;
  }>;
  currencyBreakdown: Array<{
    currency: string;
    symbol: string;
    totalAmount: number;
    invoiceCount: number;
  }>;
  totalHours: number;
  recentInvoices: Array<{
    id: number;
    date: string;
    client: string;
    status: string;
    amount: number;
    currency: string;
    symbol: string;
    hours: number;
  }>;
  totalInvoices: number;
  filteredBy: { userId?: number; clientId?: number };
}
```

## Customization

### Colors
Chart colors can be customized by modifying the `COLORS` array:

```tsx
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
```

### Chart Heights
Responsive container heights can be adjusted:

```tsx
<ResponsiveContainer width="100%" height={400}> // Change 400 to desired height
```

### Refresh Interval
Data refresh interval can be modified in `useChartData.ts`:

```tsx
refreshInterval: 30000, // 30 seconds - change as needed
```

## Error Handling

The component includes comprehensive error handling:
- Loading states with spinners
- Error messages for failed API calls
- Empty state handling
- Network error recovery

## Performance

- Uses SWR for intelligent caching
- Parallel data fetching
- Optimized re-renders
- Responsive chart containers 