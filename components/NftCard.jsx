import Image from "next/image"
import React from "react"
import styles from "../styles/Home.module.css"
import { solarzuContext } from "../components/layout";
import { useContext, useEffect , useState} from "react";
const NftCard = (props) => {
  const openModal = () => {
    window.location.href = 'checkout?tokenUrl='+props.data.openseaLink;
  }

  return (
    
      <div className={styles.card}>
        <div className="mx-20 ">
          <Image
            className="rounded-3xl"
            src={props.data.imageUrl}
            alt="nft-image"
            height={180}
            width={180}
            priority={true}
          />
        </div>
        <p className="mt-8/12 text-2xl font-normal text-white">
          Name: {props.data.name}
        </p>
        {/* <p className="mt-8/12 text-2xl font-normal text-white">
          Price: 0.01 eth{" "}
        </p> */}
        <button className={styles.checkoutbtn} onClick={()=>{openModal()}}>Checkout</button>
      </div>

  )
}

export default NftCard
