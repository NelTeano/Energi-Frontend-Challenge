'use client'

import { useState, useCallback } from "react";
import { ethers } from "ethers";

// COMPONENTS
import { Button } from "@/components/ui/button";
import AccountDetails from "@/components/AccountDetails";
import Image from 'next/image'

// IMAGE
import MetaMaskLogo from '@/public/metamask-icon.png'

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

export default function page() {

    const [accountData, setAccountData] = useState<AccountType>({});
    
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


    if(accountData == null || accountData == undefined || Object.keys(accountData).length === 0){
        console.log("No Account Data Found")
    }else{
        console.log("Account Data:", accountData);
    }
      
  return (
    <div className="flex flex-col w-full h-screen">
        { accountData == null || accountData == undefined || Object.keys(accountData).length === 0? 
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
        : 
        <>
            <div className="flex flex-col items-center justify-center w-full h-screen">
                <AccountDetails AccountData={accountData} setAccountData={setAccountData} />
            </div>
        </>
        }
    </div>
  )
}
