import useAxiosClient from "./useAxiosClient";

type UserAccount = {
  email: string;
  password: string;
  name: string;
  address: string;
  bank_name: string;
  bank_swift_code: string;
  bank_account_number: string;
  bank_account_name: string;
};



const useAuth = () => {
  const { client } = useAxiosClient();
  const login = (username: string, password: string) => {
    return client.post("/auth/login", {
      email: username,
      password: password,
    });
  };

  const register = (account : UserAccount) => {
    return client.post("/users/register", account);
  };

  return { login, register };
};

export default useAuth;
