import React, { useState, useEffect, useCallback } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FaSync } from "react-icons/fa"; // Import the refresh icon from FontAwesome

interface ExchangeRateResponse {
  data: Record<string, number>;
}

interface CurrencyConverterLabelProps {
  initialAmount?: number;
  initialCurrency?: string;
  targetCurrency: string;
}

const CurrencyConverterLabel: React.FC<CurrencyConverterLabelProps> = ({
  initialAmount = 0,
  initialCurrency = "AUD",
  targetCurrency,
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAmount(initialAmount);
  }, [initialAmount, setAmount]);

  const fetchExchangeRate = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_9DFEpL45l767vootoaIZvLpffgzWXrzmJKVDPhxX&currencies=${targetCurrency}&base_currency=${initialCurrency}`
      );
      const data: ExchangeRateResponse = await response.json();
      const rate = data.data[targetCurrency];
      setExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    } finally {
      setLoading(false);
    }
  }, [initialCurrency, targetCurrency]);

  useEffect(() => {
    fetchExchangeRate();
  }, [fetchExchangeRate]);

  const convertCurrency = () => {
    return exchangeRate ? (amount * exchangeRate).toFixed(2) : "Loading...";
  };

  return (
    <>
      <div className="d-flex align-content-between align-items-center">
        <strong>{`${targetCurrency} ${convertCurrency()}`}</strong>
        <Button
          variant="light"
          size="sm"
          onClick={fetchExchangeRate}
          disabled={loading}
          className="d-flex align-items-center"
        >
          {loading ? <Spinner animation="border" size="sm" /> : <FaSync />}
        </Button>
      </div>
    </>
  );
};

export default CurrencyConverterLabel;
