import React, { useCallback, useEffect, useState } from 'react'
import { Separator } from "@/components/ui/separator";
import MetaMaskLogo from '@/public/metamask-icon.png'
import EnergiIcon from '@/public/energiIcon.png'
import Image from 'next/image'
import { ExternalLink, Copy} from "lucide-react"
import { useNetworkInfo, formatAddress, formatCurrency, formatUSD } from "@/lib/utils"; // use the hook above

import CryptoIcon from './CryptoIcon';


interface AccountDataType { 
    address?: string;
    balance?: string;
    chainId?: string;
    network?: string;
}

export default function Details({ AccountData, setAccountData }: { AccountData: AccountDataType; setAccountData: React.Dispatch<React.SetStateAction<AccountDataType>> }) {

    const [Symbol, setSymbol] = React.useState<string>("ETH");
    const [UsdValue, setUsdValue] = React.useState<number | null>(null);
    const { address, balance, chainId, network } = AccountData
    const { networkInfo } = useNetworkInfo(chainId ? parseInt(chainId) : 0);
    

    useEffect(() => { 
        const fetchCryptoPrice = async () => {
            try {
                const response = await fetch(
                    `https://api.coinbase.com/v2/prices/${Symbol.toLowerCase()}-USD/spot`
                );
                const priceData = await response.json(); // Parse the JSON response
                const usdValue = priceData.data.amount; 

                if (balance) {
                    const usdBalance = parseFloat(balance) * parseFloat(usdValue);
                    setUsdValue(parseInt(usdBalance.toString()));
                }
            } catch (error) {
                console.error('Error fetching crypto price:', error);
                setUsdValue(null);
            }
        };
    
        fetchCryptoPrice();
    
        if (networkInfo) {
            setSymbol(networkInfo?.nativeCurrency.symbol);
        }
    }, [networkInfo, chainId, Symbol, balance]);

    const formattedAddress = formatAddress(address ?? "");
    const formattedBalance = formatCurrency(balance ?? "0");

    
    // console.log("Network Info:", networkInfo);
    // console.log("Chain Symbol:", networkInfo?.nativeCurrency.symbol);
    // console.log("USD Balance:", UsdValue);
    // console.log("Crypto Balance:", balance);



    if (AccountData && networkInfo) {
        return (
            <div className="flex flex-col p-4  rounded-lg shadow-md w-[700px] h-[400px] border-none dark:bg-slate-600">
                <div className='flex w-full justify-between items-center'>
                    <div className='flex gap-2'>
                        <Image
                            src={EnergiIcon}
                            width={15}
                            height={10}
                            alt="Metamask Logo"
                        />
                        <p className='font-bold text-md'>Energi Network</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      <p>Connected</p>
                    </div>
                </div>
                <Separator className="my-2" />
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2'>
                        <Image
                            src={MetaMaskLogo}
                            width={20}
                            height={15}
                            alt="Metamask Logo"
                        />
                        <p className='font-medium text-md text-gray-500'>{formattedAddress}</p>
                    </div>
                    <div className='flex flex-row gap-2'>
                        <Copy className='w-6 h-6 dark:text-white ligth:text-gray-500 cursor-pointer' onClick={() => navigator.clipboard.writeText(address ?? "")} />
                        <ExternalLink className='w-6 h-6 dark:text-white ligth:text-gray-500 cursor-pointer' />
                    </div>
                </div>
                <div className='flex flex-col items-center justify-center w-full gap-4 font-bold'>
                    <p className='text-md text-gray-400'>Total Balance</p>
                    <div className='flex flex-row gap-2 items-center'>
                        <CryptoIcon symbol={Symbol} size={40} />
                        <p className=' text-xl'>{formattedBalance}</p>
                    </div>
                    <p className='text-xl'>$ {UsdValue}</p>
                </div>
            </div>
        )
    }
}
