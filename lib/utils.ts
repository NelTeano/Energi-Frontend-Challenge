import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface Chain {
  chainId: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}


// Network info fetching function from Chainlist API
async function fetchNetworkInfo(chainId: number) {
  const response = await fetch(`https://chainid.network/chains.json`);
  const chains: Chain[] = await response.json();

  // Find network by chain ID
  const network = chains.find((chain) => chain.chainId === chainId);

  if (!network) {
    throw new Error("Network not found!");
  }

  return network;
}

export function useNetworkInfo(chainId: number) {
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getNetworkInfo = async () => {
      try {
        const info = await fetchNetworkInfo(chainId);
        setNetworkInfo(info);
      } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
      } finally {
        setLoading(false);
      }
    };

    getNetworkInfo();
  }, [chainId]);

  return { networkInfo, loading, error };
}

export const formatCurrency = (balance: string) => { 
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) return balance;
    return numBalance.toFixed(4); 
}

export const formatUSD = (balance: string, decimalDigits: number) => { 
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) return balance;
    return numBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: decimalDigits });
}

export const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

