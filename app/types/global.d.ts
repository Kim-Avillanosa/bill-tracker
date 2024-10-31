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
        tags: string; // Store as string (JSON format) to be parsed later
        summary: string;
        entry_date: string; // ISO format date string
        client: Client;
        created_at: string;
        updated_at: string;
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
  