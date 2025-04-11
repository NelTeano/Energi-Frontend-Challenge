'use client'
import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner"




// COMPONENTS
import { Button } from "@/components/ui/button";
import Image from 'next/image'
import { AccountBoard } from "@/components/AccountBoard";

// IMAGE
import MetaMaskLogo from '@/public/metamask-icon.png'
import Loader from "@/components/Loader";


declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}


interface AccountType {
    address?: string;
    balance?: string;
    chainId?: string;
    network?: string;
}

interface CryptoDetailsType { 
    name: string;
    symbol: string;
    last_price: number;
    maker_fee: number;
    taker_fee: number;
}

interface NetworkType {
    name: string;
    chainId: number;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
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
    const [NetworkInfo, setNetworkInfo] = useState<NetworkType[] | null>(null);
    const [filteredNetwork, setFilteredNetwork] = useState<NetworkType[] | null>(null);
    const [filteredCrypto, setFilteredCrypto] = useState<CryptoDetailsType>({
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

        const fetchNetworkInfo = async () => {
            const response = await fetch(`https://chainid.network/chains.json`);
            const chains = await response.json();
            
            setNetworkInfo(chains);
        }
        
        fetchNetworkInfo();
        fetchEnergiAPI();
    }, [])


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
                toast.success(`MetaMask Currency Changed to ${ network.name.charAt(0).toUpperCase() + network.name.slice(1)} successfully!`)
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
            
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
const networkInfo = NetworkInfo.find((info: any) => info.chainId === chainId);

            if (networkInfo) {
                setSymbol(networkInfo.nativeCurrency.symbol);
            }
            const filtered = NetworkInfo.filter((info) => info.chainId === chainId); 
            setFilteredNetwork(filtered); 
        }
        
        
        if(Symbol !== "Default") {
            const filteredEntry = Object.entries(CryptoDetails).find(
                ([, value]) => value.symbol === Symbol // Replace `_` with `,`
              );
        
            if(filteredEntry) {
                setFilteredCrypto(filteredEntry[1]);
            }
        }

    }, [accountData, Symbol, CryptoDetails, NetworkInfo]);


    const _connectToMetaMask = useCallback(async () => {
        toast("Connecting to MetaMask...")
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

            toast.success("Connected to MetaMask successfully!")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: Error | any) {
            alert(`Error connecting to MetaMask: ${error?.message ?? error}`);
          }
        } else {
          alert("MetaMask not installed");
        }
    }, []);
  
    const _disconnectWallet = useCallback(() => {
        setAccountData({});
        setSymbol("Default");
        setFilteredNetwork(null);
        setFilteredCrypto({
            name: "",
            symbol: "",
            last_price: 0,
            maker_fee: 0,
            taker_fee: 0,
        });

        toast.success("MetaMask Wallet disconnected successfully!")
    }, []);
  
    console.log("Account Data:", accountData);
    console.log("Crypto Details:", CryptoDetails);
    console.log("Symbol:", Symbol);
    console.log("Network Info:", NetworkInfo);
    console.log("Filtered Network:", filteredNetwork);
    console.log("Filtered Crypto:", filteredCrypto);


    if (
        !NetworkInfo || 
        Object.keys(NetworkInfo).length === 0 || 
        !CryptoDetails || 
        Object.keys(CryptoDetails).every(key => 
            CryptoDetails[key as keyof CryptoDetailsType] === "" || 
            CryptoDetails[key as keyof CryptoDetailsType] === 0
        )
    ) {
        return (
              <div className='flex justify-center w-full h-screen'>
                <Loader />
              </div>
        )
    }

    

        return (
            <>
                { accountData == null || accountData == undefined || Object.keys(accountData).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-screen dark:bg-black light:bg-white">
                        <div className="flex flex-col w-full h-screen">
                                <div
                                    className="flex flex-col gap-4 items-center justify-center h-[600px] w-full"
                                >
                                    <div className="flex flex-col items-center justify-center ">
                                        <Image
                                            src={MetaMaskLogo}
                                            width={200}
                                            height={200}
                                            alt="Metamask Logo"
                                        />
                                        <div className="flex flex-row gap-2 mt-4">
                                            {["M", "E", "T", "A", "M", "A", "S", "K"].map((letter, index) => (
                                                <span key={index} className="text-5xl font-bold dark:text-white light:text-gray-500">{letter}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <Button onClick={_connectToMetaMask} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-800 hover:cursor-pointer transition duration-200 ease-in-out">
                                        Connect to MetaMask
                                    </Button>
                                </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-screen">
                        <AccountBoard Symbol={Symbol} AccountDetails={accountData} UsdValue={filteredCrypto.last_price} LogoutBTN={_disconnectWallet} />
                    </div>
                )}
            </>
        )
}




