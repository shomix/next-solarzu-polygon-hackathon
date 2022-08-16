import Image from "next/image"
import NftCard from "./NftCard"
import { solarzuContext } from "../components/layout";
import { useContext, useEffect , useState} from "react";
import { nftDetails } from "../constants";
import styles from "../styles/Home.module.css"

const HomePage = () => {
  const {seaport} = useContext(solarzuContext);
  const [loaded,setLoaded] = useState(false);
  const [data,setData] = useState(null);
  const getNfts = async () => {
    let nftData = []
    for(let i=0;i<nftDetails.length;i++){
      const details=await seaport.api.getAsset({
        tokenAddress : nftDetails[i].tokenAddress,
        tokenId : nftDetails[i].tokenId
      })
      nftData.push(details)
    }
    setData(nftData);
  }
  useEffect(() => {
    if(seaport !=null) {
      getNfts()
    }
},[seaport]);
  useEffect(() => {
    if(data != null) {
      setLoaded(true);
    }
  },[data]);
  return (
    <div className="flex flex-row justify-evenly relative">
      <div className="ml-20 mt-32">
        <Image
          src="https://res.cloudinary.com/krotcloud/image/upload/v1658604332/Text_w1yrjr.png"
          alt="logo"
          height={450}
          width={600}
          priority={true}
        />
              <p className="text-white text-3xl mt-3 ">Buy your favorite NFTs with zero-collateral</p> 
              <p className="text-white text-3xl ">& repay over 3 months.</p> 
      </div>
      <div className="mr-6 space-x-5 space-y-5">
        <p className="text-center text-white font-semibold text-5xl underline mt-1 mb-3 tracking-wider">
          NFT Marketplace
        </p>
        {
           loaded ? (
        <div className="space-y-4">
          <div className="flex flex-row  w-full mt-1 space-x-5  ">
            <NftCard data={data[0]}/>
            <NftCard data={data[1]}/>
            <NftCard data={data[2]}/>
          </div>
          <div className="flex flex-row  w-full mt-1 space-x-5 ">
            <NftCard data={data[3]}/>
            <NftCard data={data[4]}/>
            <NftCard data={data[5]}/>
          </div>
        </div>
        )
        :
        <div>
        <div className="mt-44">
          <img src="./final.gif" width={400} height={400}></img>
        </div>

        </div>
        }
      </div>
    </div>
  )
}

export default HomePage
