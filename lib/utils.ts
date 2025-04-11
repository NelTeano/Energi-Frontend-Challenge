import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Network info fetching function from Chainlist API
async function fetchNetworkInfo(chainId: number) {
  const response = await fetch(`https://chainid.network/chains.json`);
  const chains = await response.json();

  // Find network by chain ID
  const network = chains.find((chain: any) => chain.chainId === chainId);

  if (!network) {
    throw new Error("Network not found!");
  }

  return network;
}

export function useNetworkInfo(chainId: number) {
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const getNetworkInfo = async () => {
      try {
        const info = await fetchNetworkInfo(chainId);
        setNetworkInfo(info);
      } catch (err: any) {
        setError(err.message);
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

export const formatUSD = (balance: string) => { 
    const numBalance = parseFloat(balance);
    if (isNaN(numBalance)) return balance;
    return numBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
}

export const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

