import useAxiosClient from "./useAxiosClient";

const useAuction = () => {
  const { client } = useAxiosClient();
  const makeOffer = (data: Models.MakeOffer) => {
    return client.post("/auction", {
      startAmount: data.startAmount,
      name: data.itemName,
      duration: data.duration,
    });
  };

  const offers = (status: "ONGOING" | "COMPLETED" | "ALL") => {
    return client.get(`/auction/${status}`);
  };

  const bidOffer = (bidId: number, data: Models.BidOffer) => {
    return client.patch(`/auction/${bidId}/bid`, {
      amount: data.amount,
    });
  };

  const bidList = (bidId: number) => {
    return client.get(`/auction/${bidId}/bidders`);
  };

  const startOffer = (bidId: number) => {
    return client.patch(`/auction/${bidId}/start`);
  };

  return { makeOffer, offers, bidOffer, startOffer, bidList };
};

export default useAuction;
