import React, { useEffect } from "react";
import Navbar from "./NavBar";
import { useState,useContext,createContext } from "react";
import { Contract , ethers} from "ethers";
import { solarzuAddress,abi} from "../constants/index"
import Web3Modal from "web3modal";
import { sequence } from '0xsequence'
import HDWalletProvider from "@truffle/hdwallet-provider";
import { OpenSeaPort, Network } from 'opensea-js'
export const solarzuContext = createContext();
export default function Layout({children}){
    const [modal, setModal] = useState(false)
    const [details, setDetails] = useState(null)
    const [home,setHome] = useState(true);
    const [connected, setConnected] = useState(false);
    const [provider,setProvider] = useState(null);
    const [contract,setContract] = useState(null);
    const [seaport,setSeaport] = useState(null);
    const [account,setAccount] = useState(null);
    const [url,setUrl] = useState("");
    let providerOptions = {

    };
    
    const connectWallet = async () => {
        try{
            if (!window?.ethereum?.isSequence) {
                providerOptions = {
                  ...providerOptions,
                  sequence: {
                    package: sequence,
                    options: {
                      appName: 'Solarzu Dapp',
                      defaultNetwork: 'mumbai'
                    }
                  }
                }
            }
              
            const web3Modal = new Web3Modal({
                network: "mumbai", // optional
                cacheProvider: false, // optional
                providerOptions // required
            });
            const instance = await web3Modal.connect();
    
            const provider = new ethers.providers.Web3Provider(instance);            
            // await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner(account);
            if(await signer.getChainId() != 80001){
                throw new Error("Please connect to the Mumbai testnet network");
            }
            setProvider(signer);
            setAccount(await signer.getAddress())
            setConnected(true);
        }
        catch(err){
            alert(err.message);
        }
    }
    const disconnect = async() => {
        if(provider.close) {
            await provider.close();
            await web3Modal.clearCachedProvider();
          }
        setConnected(false);
        setProvider(null);
        setContract(null);
        setAccount(null);
    }
    const changeHome = () =>{
        setHome(!home);
    }

    const getDetails = async(url)=>{
        const tokenDetails = url.split("/");
        const tokenId = tokenDetails[tokenDetails.length - 1];
        const tokenAddress = tokenDetails[tokenDetails.length - 2];
        setDetails(await seaport.api.getAsset({
            tokenAddress,
            tokenId
        }))
        setModal(true)
    }

    

    const accountAddress= process.env.NEXT_PUBLIC_OWNER_ADDRESS;
  const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY;
  const providerUrl= process.env.NEXT_PUBLIC_ALCHEMY_URL;
  useEffect(() => {
    
    let walletProvider = new HDWalletProvider({
            privateKeys: [
                PRIVATE_KEY
            ],
            providerOrUrl: providerUrl
    });

    setSeaport(new OpenSeaPort(walletProvider, {
        networkName: Network.Rinkeby,
        apiKey: ""
    },))
  },[])

    useEffect(() => {
        if(connected){
            setContract(new Contract(solarzuAddress,abi,provider));
        }
    },[connected]);
    
    return(
        <solarzuContext.Provider value={{
            changeHome,
            connectWallet,
            disconnect,
            connected,
            setHome,
            home,
            contract,
            provider,
            account,
            seaport,
            modal,
            getDetails,
            details,
            setModal,
            url,
            setUrl
            }}>
            <Navbar home = {home}/>
            {children}
        </solarzuContext.Provider>
    )
}