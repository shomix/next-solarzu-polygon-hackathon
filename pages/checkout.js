import { useContext ,useEffect } from 'react';
import {solarzuContext} from '../components/layout';

import CheckoutPage from "../components/CheckoutPage"

// import NavBar from "../components/NavBar";

export default function Checkout() {
  const {changeHome,home,contract,setUrl} = useContext(solarzuContext);
  useEffect(()=>{
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const url = params.get('tokenUrl')
    setUrl(url);
  })

  useEffect(() => {
      if(home){
          changeHome();
      }
  },[home]);

  
  return (
    <CheckoutPage />
  )
}
