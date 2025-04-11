'use client'
import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";

// COMPONENTS
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import CryptoIcon from '@/components/CryptoIcon';
import { Separator } from "@/components/ui/separator";


// IMAGE
import MetaMaskLogo from '@/public/metamask-icon.png'
import { ExternalLink, Copy} from "lucide-react"
import EnergiIcon from '@/public/energiIcon.png'
import { useNetworkInfo } from "@/lib/utils";


declare global {
  interface Window {
    ethereum?: any;
  }
}


export interface AccountType {
    address?: string;
    balance?: string;
    chainId?: string;
    network?: string;
}

export interface CryptoDetailsType { 
    name: string;
    symbol: string;
    last_price: number;
    maker_fee: number;
    taker_fee: number;
}


export default function Page() {
  
    const [accountData, setAccountData] = useState<AccountType>({});
    const [Symbol, setSymbol] = useState<string>("Default");
    const [CryptoDetails, setCryptoDetails] = useState<CryptoDetailsType>({
        name: "",
        symbol: "",
        last_price: 0,
        maker_fee: 0,
        taker_fee: 0,
    });
    const [NetworkInfo, setNetworkInfo] = useState<any>(null);
    const [filteredData, setFilteredData] = useState<any>(null);
    

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

        const fetchNetworkInfo = async () => {
            const response = await fetch(`https://chainid.network/chains.json`);
            const chains = await response.json();
            
            setNetworkInfo(chains);
        }
        
        fetchNetworkInfo();
        fetchEnergiAPI();
    },[])


    useEffect(() => {
        if (typeof window.ethereum !== 'undefined') {
            const { ethereum } = window;
      
            const handleChainChanged = async () => {
                const accounts = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                // Get the connected Ethereum address
                const address = accounts[0];
                // Create an ethers.js provider using the injected provider from MetaMask
                const provider = new ethers.BrowserProvider(ethereum);
                // Get the account balance
                const balance = await provider.getBalance(address);
                // Get the network ID from MetaMask
                const network = await provider.getNetwork();

                setAccountData({
                    address,
                    balance: ethers.formatEther(balance),
                    // The chainId property is a bigint, change to a string
                    chainId: network.chainId.toString(),
                    network: network.name,
                });
            };
            
            ethereum.on('chainChanged', handleChainChanged);
      
          return () => {
            ethereum.removeListener('chainChanged', handleChainChanged);
          };
        }
      }, [accountData]);
    
    
    useEffect(() => {
        if (NetworkInfo) {
            const chainId = parseInt(accountData.chainId ?? "0");
            const networkInfo = NetworkInfo.find((info: any) => info.chainId === chainId);
            if (networkInfo) {
                setSymbol(networkInfo.nativeCurrency.symbol);
            }
            const filtered = NetworkInfo.filter((info) => info.chainId === chainId); 
            setFilteredData(filtered); 
        }
    }, [accountData]);


    const _connectToMetaMask = useCallback(async () => {
        const ethereum = window.ethereum;
        // Check if MetaMask is installed
        if (typeof ethereum !== "undefined") {
          try {
            // Request access to the user's MetaMask accounts
            const accounts = await ethereum.request({
              method: "eth_requestAccounts",
            });
            // Get the connected Ethereum address
            const address = accounts[0];
            // Create an ethers.js provider using the injected provider from MetaMask
            const provider = new ethers.BrowserProvider(ethereum);
            // Get the account balance
            const balance = await provider.getBalance(address);
            // Get the network ID from MetaMask
            const network = await provider.getNetwork();

            // Update state with the results
            setAccountData({
              address,
              balance: ethers.formatEther(balance),
              // The chainId property is a bigint, change to a string
              chainId: network.chainId.toString(),
              network: network.name,
            });
          
          } catch (error: Error | any) {
            alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
          }
        } else {
          alert("MetaMask not installed");
        }
    }, []);
  
    console.log("Account Data:", accountData);
    console.log("Crypto Details:", CryptoDetails);
    console.log("Symbol:", Symbol);
    console.log("Network Info:", NetworkInfo);
    console.log("Filtered Data:", filteredData);


    if(NetworkInfo == null || NetworkInfo == undefined || Object.keys(NetworkInfo).length === 0){
        return (
            <div className="flex items-center justify-center w-full h-screen"> Loading ......</div>
        )
    }


        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="flex flex-col w-full h-screen">
                        <div
                            className="flex flex-col gap-4 items-center justify-center h-[600px] bg-amber-100 w-full"
                        >
                            <Image
                                src={MetaMaskLogo}
                                width={200}
                                height={200}
                                alt="Metamask Logo"
                            />
                            <Button onClick={_connectToMetaMask} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 ease-in-out">
                                Connect to MetaMask
                            </Button>
                        </div>
                    <>
                        <div className="flex flex-col items-center justify-center w-full h-screen">

                        </div>
                    </>
                </div>
            </div>
        )
    
}




const AccountBoard = ({AccountDetails} : AccountType, {}) => { 

    const { address, balance, chainId, network } = AccountDetails;

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
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row gap-2'>
                        <Image
                            src={MetaMaskLogo}
                            width={20}
                            height={15}
                            alt="Metamask Logo"
                        />
                        <p className='font-medium text-md text-gray-500'>0hhiajsbbdijjib123</p>
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
                        <p className=' text-xl'>78</p>
                    </div>
                    <p className='text-xl'>$ 100</p>
                </div>
            </div>
        </>
    )
}
