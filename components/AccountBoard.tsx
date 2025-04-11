import Image from 'next/image';
import { useState, useEffect, useMemo } from "react";
import { ethers } from "ethers";
import CryptoIcon from '@/components/CryptoIcon';
import { Separator } from "@/components/ui/separator";
import { ExternalLink, Copy } from "lucide-react";

// IMG
import EnergiIcon from '@/public/energiIcon.png';
import MetaMaskLogo from '@/public/metamask-icon.png'

// UTILS
import { formatAddress, formatCurrency, formatUSD } from "@/lib/utils";
import { Button } from './ui/button';

interface AccountBoardProps {
    AccountDetails: AccountType;
    Symbol: string;
    UsdValue: number;
    LogoutBTN: () => void;
}

interface AccountType {
    address?: string;
    balance?: string;
    chainId?: string;
    network?: string;
}


export const AccountBoard = ({ AccountDetails, Symbol, UsdValue, LogoutBTN }: AccountBoardProps) => { 

    const { address, balance, chainId, network } = AccountDetails;

    const getUsdBalance = useMemo(() => {
        const totalBalance = parseFloat(balance || "0") * UsdValue;

        return formatCurrency(totalBalance.toString());
    }, [balance, UsdValue]);


    const formattedAddress = formatAddress(address ?? "");
    const formatUsdValue = formatUSD(getUsdBalance ?? "0", 0);
    const formattedCurrencyBal = formatCurrency(balance ?? "0");


    return (
        <>
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
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        <div className='flex flex-row justify-between items-center'>
                            <div className='flex flex-row gap-2'>
                                <Image
                                    src={MetaMaskLogo}
                                    width={20}
                                    height={15}
                                    alt="Metamask Logo"
                                />
                                <p className='font-medium text-md dark:text-white ligth:text-gray-500'>{formattedAddress}</p> {/* Apply formatted address */}
                            </div>
                            <div className='flex flex-row gap-2'>
                                <Copy className='w-6 h-6 dark:text-white ligth:text-gray-500 cursor-pointer' onClick={() => navigator.clipboard.writeText(address ?? "")} />
                                <ExternalLink className='w-6 h-6 dark:text-white ligth:text-gray-500 cursor-pointer' onClick={() => window.open(`https://etherscan.io/address/${address}`, '_blank')} />
                            </div>
                        </div>
                        <div className='flex flex-col items-center justify-center w-full gap-4 font-bold'>
                            <p className='text-md text-gray-400'>Total Balance</p>
                            <div className='flex flex-row gap-2 items-center'>
                                <CryptoIcon symbol={Symbol} size={40} />
                                <p className=' text-xl'>{formattedCurrencyBal}</p>
                            </div>
                            <p className='text-xl'>$ {formatUsdValue}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-center mb-4">
                        <Button onClick={LogoutBTN} className="bg-red-500 w-[200px] text-white px-4 py-2 rounded-md hover:bg-red-800 hover:cursor-pointer transition duration-200 ease-in-out">
                            Disconnect Wallet
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AccountBoard;
