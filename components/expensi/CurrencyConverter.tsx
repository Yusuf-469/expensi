"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

// Exchange rates (in production, fetch from an API)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.19,
  INR: 83.12,
  SGD: 1.34,
  NZD: 1.64,
  MXN: 17.05,
  BRL: 4.95,
  ZAR: 18.90,
  KRW: 1330.50,
  THB: 35.80,
  IDR: 15650,
  MYR: 4.72,
  PHP: 56.15,
  VND: 24350,
};

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
];

export function CurrencyConverter() {
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    convert();
  }, [amount, fromCurrency, toCurrency]);

  const convert = () => {
    const numAmount = parseFloat(amount) || 0;
    const fromRate = EXCHANGE_RATES[fromCurrency];
    const toRate = EXCHANGE_RATES[toCurrency];
    const result = (numAmount / fromRate) * toRate;
    setConvertedAmount(result);
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleRefresh = () => {
    convert();
    setLastUpdated(new Date());
  };

  const getSymbol = (code: string) => {
    return CURRENCIES.find((c) => c.code === code)?.symbol || "$";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-[#1D9C5A]" />
          Currency Converter
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="text-lg"
          />
        </div>

        {/* Currency Selection */}
        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="icon" onClick={handleSwap} className="mb-0.5">
            <ArrowRightLeft className="w-4 h-4" />
          </Button>

          <div className="space-y-2">
            <label className="text-sm font-medium">To</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result */}
        <motion.div
          key={convertedAmount}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-muted rounded-lg p-4 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">
            {getSymbol(fromCurrency)}
            {amount} {fromCurrency} =
          </p>
          <p className="text-3xl font-bold text-[#1D9C5A]">
            {getSymbol(toCurrency)}
            {convertedAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            {toCurrency}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            1 {fromCurrency} = {((EXCHANGE_RATES[toCurrency] || 1) / (EXCHANGE_RATES[fromCurrency] || 1)).toFixed(4)}{" "}
            {toCurrency}
          </p>
        </motion.div>

        <p className="text-xs text-muted-foreground text-center">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </p>
      </CardContent>
    </Card>
  );
}
