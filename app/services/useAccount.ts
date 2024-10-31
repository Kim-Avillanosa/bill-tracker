import useAxiosClient from "./useAxiosClient";

const useAccount = () => {
  const { client } = useAxiosClient();
  const deposit = (amount: number) => {
    return client.post("/debit/deposit", {
      amount: amount,
    });
  };

  return { deposit };
};

export default useAccount;
