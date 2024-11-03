declare global {
  namespace Models {
    interface ApiBadRequest {
      message: string;
    }

    interface User {
      id: number;
      userName: string;
    }

    interface JwtResponse {
      access_token;
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
      entry_date: string; // ISO format date string
      client: Client;
      created_at: string;
      updated_at: string;
    }

    type WorkItem = {
      entry_date: string;
      title: string;
      description: string;
      tags: string[];
      hours: number;
    };

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
      hourly_rate: number;
      hours_per_day: number;
      address: string;
      created_at: string; // Alternatively, you could use Date if you prefer
      updated_at: string; // Alternatively, you could use Date if you prefer
      userId: number;
      current_currency_code: string;
      convert_currency_code: string;
    }

    interface WorkItem {
      title: string;
      rate: string;
      description: string;
      hours: number;
      tags: string; // If you want to parse it into an array, consider changing this to string[]
      invoiceId: number;
      id: number;
    }

    interface Invoice {
      id: number;
      note: string;
      clientId: number;
      client: Client;
      invoiceNumber: string;
      date: string; // Alternatively, you could use Date if you prefer
      workItems: WorkItem[];
      status: string;
      updatedAt: string; // Alternatively, you could use Date if you prefer
    }
    interface Invoice {
      id: number;
      note: string;
      clientId: number;
      client: Client;
      invoiceNumber: string;
      date: string; // Alternatively, you could use Date if you prefer
      workItems: WorkItem[];
      status: string;
      updatedAt: string; // Alternatively, you could use Date if you prefer
    }

    interface Client {
      id: number;
      email: string;
      name: string;
      symbol: string;
      code: string;
      hourly_rate: string; // Keeping it as string to match your data structure
      hours_per_day: number;
      address: string;
      banner_color: string;
      headline_color: string;
      text_color: string;
      created_at: string; // ISO date string
      updated_at: string; // ISO date string
      userId: number;
      category: string;
    }
  }
}

export {};
