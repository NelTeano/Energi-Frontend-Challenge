'use client'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { toast } from "sonner"

// COMPONENTS
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import CryptoIcon from '@/components/CryptoIcon';
import Loader from '@/components/Loader';

// ICONS
import { 
  ChevronLeft,
  ChevronRight, 
} from "lucide-react";

// UTILS
import { formatUSD } from "@/lib/utils";


interface CryptoCurrencies {
  name: string,
  symbol: string,
  icon: string,
  price: number,
  last_price: number;
}

interface CryptoDetailsType { 
  name: string;
  symbol: string;
  last_price: number;
  maker_fee: number;
  taker_fee: number;
}

export default function Page() {

  const [data, setData] = useState<CryptoCurrencies[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNameAscending, setIsNameAscending] = useState<boolean>(false);
  const [isPriceAscending, setIsPriceAscending] = useState<boolean>(false);
  const [CryptoDetails, setCryptoDetails] = useState<CryptoDetailsType>({
      name: "",
      symbol: "",
      last_price: 0,
      maker_fee: 0,
      taker_fee: 0,
  });


  useEffect(() => {
    const fetchEnergiAPI = async () => {
      try {
          const response = await fetch("https://api.energiswap.exchange/v1/assets");
          const data = await response.json();
          setCryptoDetails(data);
      } catch (error) {
          console.error("Error fetching crypto details:", error);
      }
    };

    fetchEnergiAPI();

   }, [])


  useEffect(() => {
    const FilterCurrencies = async () => {  
      const filtered = Object.values(CryptoDetails).filter((crypto: any) =>
        coinSymbols.includes(crypto.symbol)
      );
  
      if (filtered) {
        const formattedData = filtered.map((prev) => ({
          ...prev,
          last_price: parseFloat(prev.last_price), // Ensure last_price is a number
        }));
        setData(formattedData);
      }
    };
  
    FilterCurrencies();
  }, [CryptoDetails]);

  const FilterByName = useCallback(() => {
    const sortedData = [...data].sort((a, b) => {
      if (isNameAscending) {
        return a.name.localeCompare(b.name); // Ascending order
      } else {
        return b.name.localeCompare(a.name); // Descending order
      }
    });

    if(isNameAscending){
      toast("Cryptocurrencies have been sorted in Ascending order.")
    }else{
      toast("Cryptocurrencies has been sorted by Descending order.")
    }
    setData(sortedData);
    setIsNameAscending(!isNameAscending); // Toggle the sort order
  }, [data, isNameAscending]);

  const FilterByPrice = useCallback(() => {
    const sortedData = [...data].sort((a, b) => {
      if (isPriceAscending) {
        return a.last_price - b.last_price; // Lowest to highest
      } else {
        return b.last_price - a.last_price; // Highest to lowest
      }
    });

    if(isPriceAscending){
      toast("Cryptocurrencies price value has been sorted by lowest to highest.")
    }else{
      toast("Cryptocurrencies price value have been sorted by highest to lowest.")
    }
    setData(sortedData);
    setIsPriceAscending(!isPriceAscending); // Toggle the sort order
  }, [data, isPriceAscending]);

  const coinSymbols = [
    "BTC",  // Bitcoin
    "ETH",  // Ethereum
    "USDC", // USD Coin
    "BNB",  // BNB
    "XRP",  // XRP
    "ADA",  // Cardano
    "SOL",  // Solana
    "DOGE", // Dogecoin
    "FTM",  // Fantom
    "LINK"  // Chainlink
  ];

  console.log("Currency Details: ", CryptoDetails);
  console.log("Filtered Currencies: ", data);


  
  if(
    !CryptoDetails || 
    Object.keys(CryptoDetails).every(key => 
      CryptoDetails[key as keyof CryptoDetailsType] === "" || 
      CryptoDetails[key as keyof CryptoDetailsType] === 0
    )
  ){
    return (
      <div className='flex justify-center w-full h-screen'>
        <Loader />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center h-screen">
      <div className='w-[800px] h-auto light:border-none dark:border-1 border-grey-500 bg-white dark:bg-black rounded-lg shadow-lg p-4 mt-[80px]'>
        <Table>
          <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead className='flex flex-row gap-2 hover:bg-gray-500/10 items-center hover:cursor-pointer duration-400 ease-in' onClick={FilterByName}>
                  <p >Coin</p>
                  {isNameAscending ? (
                    <span>
                      <ChevronLeft className='w-3 h-3' />
                    </span>
                  ) : (
                    <span>
                      <ChevronRight className='w-3 h-3' />
                    </span>
                  )}
                </TableHead>
                <TableHead></TableHead>
                <TableHead className='flex flex-row gap-2 hover:bg-gray-500/10 items-center hover:cursor-pointer duration-400 ease-in' onClick={FilterByPrice}>
                  <p>Price</p>
                  {isPriceAscending ? (
                    <span>
                      <ChevronLeft className='w-3 h-3' />
                    </span>
                  ) : (
                    <span>
                      <ChevronRight className='w-3 h-3' />
                    </span>
                  )}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='font-medium'>
              {data.map((currencies, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className='flex flex-row items-center gap-2 min-w-[250px] w-auto'>
                    <CryptoIcon symbol={currencies.symbol} size={40} />
                    <p className='text-md'>
                      {currencies.name}  
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className='text-md text-gray-500'>
                      {currencies.symbol}  
                    </p>
                  </TableCell>
                  <TableCell className='text-md text-gray-500'>
                    <span className='text-bold'>$</span>
                    {formatUSD(currencies.last_price.toString(), 2)} {/* Format for display */}
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
        </Table>
      </div>
  </div>
  )
}
