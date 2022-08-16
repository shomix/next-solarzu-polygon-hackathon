import NavBar from "./NavBar"
import styles from "../styles/Home.module.css"
import { useState , useContext, useEffect} from "react"
import Image from "next/image"
import { AiOutlineCloseCircle } from "react-icons/ai";
import { solarzuContext } from "../components/layout";
import HDWalletProvider from "@truffle/hdwallet-provider";
import { OpenSeaPort, Network } from 'opensea-js'
import { BigNumber } from 'ethers';
import { Web3Storage } from "web3.storage";
import { ToastContainer, toast } from "react-toastify";
import { data } from "autoprefixer";
import {ethers} from "ethers";
import "react-toastify/dist/ReactToastify.css";
import { solarzuAddress } from "../constants";
import {MdMessage} from "react-icons/md"

const CoinGecko = require('coingecko-api');
const CheckoutPage = () => {
  const [price,setPrice] = useState(null);
  const [files, setFiles] = useState([]);
  const [nftPrice,setNftPrice] = useState(0);
  const {connectWallet ,account, connected ,disconnect,contract,provider,seaport,getDetails,details,modal,setModal,setUrl,url} = useContext(solarzuContext);
  const ethPrice = async() => {
    const CoinGeckoClient = new CoinGecko();
    const priceOfEth = await CoinGeckoClient.simple.price({
      ids: ['ethereum'],
      vs_currencies: ['usd'],
    });
    setPrice(priceOfEth.data.ethereum.usd);
  };
  function makeFileObjects (data) {
    const obj = data;
    const blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
  
    const files = [
      new File([blob], account+'.json')
    ]
    return files
  }
  const storeContent = async (data) => {
    const web3storage_key = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
    const client = new Web3Storage({ token: web3storage_key });
    const files = makeFileObjects(data);
    const cid = await client.put([files[0]],{
      name: account,
    });
  };
  const toggleModal = () => {
    setModal(!modal)
  }
  useEffect(() => {
    ethPrice();
  },[price]);
  const accountAddress= process.env.NEXT_PUBLIC_OWNER_ADDRESS;
  const updateDetails = async()=>{
      const tokenURL = document.getElementById("tokenURL").value;
      // console.log(tokenURL)
      setUrl(tokenURL);
      await getDetails(tokenURL);
  }
  const createBuyOrder = async () => {
      const tokenURL = document.getElementById("tokenURL").value;
      const tokenDetails = tokenURL.split("/");
      const tokenId = tokenDetails[tokenDetails.length - 1];
      const tokenAddress = tokenDetails[tokenDetails.length - 2];
      await seaport.createBuyOrder({
      asset: {
          tokenId,
          tokenAddress
      },
      accountAddress,
      startAmount: nftPrice,
      paymentTokenAddress:"0xc778417E063141139Fce010982780140Aa0cD5Ab",
      })
      toast("Created Buy Order Successful");
  };
  const divideInstalments = async (amount, instalments) => {
      const instalment_amount = Math.round(amount*(10**18) / instalments);
      const tx = await contract.divide_installments(BigNumber.from(""+amount* 10**18), instalments, BigNumber.from(""+instalment_amount));
      await tx.wait();
  }
  const fee_calculator = (total_amount,interest) => {
      const interest_amount = total_amount * (interest/100);
      return interest_amount;
  }

  

  const buyNft = async() => {
      try{
        const CoinGeckoClient = new CoinGecko();
        const matic = await CoinGeckoClient.simple.price({
              ids: ['matic-network'],
              vs_currencies: ['eth'],
        });
        const maticVal = (1/matic.data["matic-network"].eth * nftPrice);
        const val = await contract.instalments_left();
        
        if(val._hex!="0x00"){
          throw new Error("You already have Instalments");
        }
        await (await provider.sendTransaction({to:solarzuAddress,value:ethers.utils.parseEther(""+fee_calculator(maticVal,10))})).wait();
        await divideInstalments(maticVal+fee_calculator(maticVal,2.5),3);
        
        await createBuyOrder();
        const tokenURL = document.getElementById("tokenURL").value;
        const tokenDetails = tokenURL.split("/");
        let data = {};
        data.user = account;
        data.tokenAddress = tokenDetails[tokenDetails.length - 2];
        data.tokenId = tokenDetails[tokenDetails.length - 1];
        data.nftPrice = nftPrice;
        data.amount = maticVal;
        data.instalments = 3;
        data.interest = 2.5;
        storeContent(data);
        setModal(false)
      }
      catch(err){
        if(err.code == -32603){
          alert("Insufficient Funds For completing Transaction")
        }
        else{
          alert(err.message);
        }
      }
  }

  useEffect(() => {
    if(url!=null){
      document.getElementById("tokenURL").value = url;
    }
  }
  ,[url]);
  return (
    <div className="flex justify-center" >
      <div className={styles.checkout}>
        <h1 className="mt-2 ml-2 p-2 tracking-wide font-semibold text-xl  underline text-white">
          Buy Now Pay Later
        </h1>

        <div className={styles.checkout_card}>
          <div className="flex flex-col m-2 space-y-4 w-3/4 rounded-md">
            <p className="text-white">URL :</p>
            <input
              className="h-12  rounded-md pl-[14px]"
              type="text"
              id="tokenURL"
              placeholder="Enter URL"
              required
            ></input>
            <p className="text-white">NFT Price : </p>
            <input
              className="h-12 rounded-md pl-[14px] "
              type="text"
              id="tokenPrice"
              placeholder="Enter NFT Price in ETH"
              onChange={(e) => setNftPrice(e.target.value)}
              required
            ></input>
          </div>
        </div>
        <button className={styles.checkbtn} onClick={updateDetails}>Get Details</button>
        
      </div>
      {modal && (
        <div className={styles.ovCard} >
          <div className={styles.overlay}>
            <div className={styles.mainOvCard}>
              {/*               <h1 className="text-white">CArd</h1> */}
              <div className="text-white text-2xl flex justify-end">
                <button onClick={toggleModal}>
                  <AiOutlineCloseCircle className="mt-2 mr-3" />
                </button>  
              </div>
              <div className="flex justify-center">
                <div className="mt-4">
                  <img
                    className="rounded-xl  pt-1"
                    src={details.imageUrl}
                    alt="NFT-Logo"
                    height={100}
                    width={100}
                  />
                </div>
              </div>
              <div className={styles.nft_details}>
                <div>
                  <h1 className="text-white font-bold underline tracking-wider font-">
                    NFT Details
                  </h1>
                  <div className="mt-4 space-y-2">
                    <p className="text-white ">Name : {details.name}</p>
                    <p className="text-white">Price : {(nftPrice*price).toFixed(2)} $</p>
                    <p className="text-white">Interest : {fee_calculator(nftPrice*price,10).toFixed(2)} $</p>
                  </div>
                </div>
              </div>
              <div className={styles.nft_tra_details}>
                <div>
                  <h1 className="text-white font-bold underline tracking-wider font-">
                    Transactions Details
                  </h1>
                  <div className="mt-4 space-y-2 flex flex-col">
                    <div className="flex justify-between">
                      <p className="text-white ">Original Price :</p>
                      <p className="text-white ">{(nftPrice*price).toFixed(2)} $</p>
                      </div>
                    <div className="flex justify-between">
                      <p className="text-white "> Interest Fees :</p>
                      <p className="text-white ">{fee_calculator(nftPrice*price,10).toFixed(2) } $</p>
                      </div>
                    <div className="flex justify-between">
                      <p className="text-white ">Purchase Provider Fees :</p>
                      <p className="text-white ">{fee_calculator(nftPrice*price,2.5).toFixed(2)} $</p>
                      </div>
                    <div className="flex justify-between">
                      <p className="text-white ">Total Purchase Fees :</p>
                      <p className="text-white ">{ (nftPrice*price+fee_calculator(nftPrice*price,10)+fee_calculator(nftPrice*price,2.5)).toFixed(2)}$</p>
                      </div>

                  </div>
                </div>
              </div>
              <div className={styles.nft_inCard}>
                <div className="text-left ">
                  <div className="flex justify-between">
                  <p className="text-white  ">Installments : </p>
                  <p className="text-white  ">3</p>
                  </div>
                  <div className="flex justify-between">
                  <p className="text-white  ">Installments Period: </p>
                  <p className="text-white  ">3 months</p>
                  </div>
                  <div className="flex justify-between">
                  <p className="text-white ">Amount : </p>
                  <p className="text-white ">{((nftPrice*price+fee_calculator(nftPrice*price,2.5))/3).toFixed(2)}$/month</p>
                  </div>
                </div>
              </div>
              <div className={styles.nft_inCard}>
                <div className="">
                  <div className="flex justify-around ">
                    <div className="items-center p-[10px]" >
                    <MdMessage className="text-caution text-2xl"/>
                    </div>
                  <p className="text-white text-center ">To avail  <b>BNPL</b> you have to pay <b>10 %</b> of the <b> total amount </b> . </p>
                  </div>
                </div>
              </div>
              {

          connected ?
            <button className={styles.buybtn} onClick={buyNft}>
             BNPL
            </button>
          :
            <button className={styles.buybtn} onClick={connectWallet}>
              Connect Wallet
            </button>
          
            }
              
            <ToastContainer />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CheckoutPage
