declare global {
  namespace Models {
    type Currency = {
      name: string;
      symbol: string;
      iso: string;
      currencySymbol: string;
    };

    interface ApiBadRequest {
      message: string;
    }

    interface User {
      id: number;
      userName: string;
    }

    interface JwtResponse {
      access_token: string;
    }

    interface TokenData {
      sub: number;
      username: string;
      iat: number;
      exp: number;
    }

    interface Timesheet {
      id: number;
      tags: string;
      summary: string;
      entry_date: string;
      client: Client;
      created_at: string;
      updated_at: string;
    }

    interface WorkItem {
      id?: number;
      entry_date: string | Date;
      title: string;
      description: string;
      tags: string[] | string;
      hours: number;
      rate?: number | string;
      invoiceId?: number;
    }

    type InvoiceData = {
      clientId: number;
      date: string;
      note: string;
      workItems: WorkItem[];
    };

    interface Client {
      id: number;
      email: string;
      name: string;
      code: string;
      symbol: string;
      hourly_rate: number;
      hours_per_day: number;
      days_per_week: number;
      address: string;
      banner_color: string;
      headline_color: string;
      text_color: string;
      created_at: string;
      updated_at: string;
      userId: number;
      category: string;
      current_currency_code: string;
      convert_currency_code: string;
    }

    interface Invoice {
      id: number;
      note: string;
      clientId: number;
      client: Client;
      invoiceNumber: string;
      date: string;
      workItems: WorkItem[];
      status: string;
      updatedAt: string;
      referrenceNumber: string;
    }
  }
}

export {};
