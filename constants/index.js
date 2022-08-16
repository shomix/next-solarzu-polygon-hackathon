export const solarzuAddress = "0x45F10504f655a38aEa0dC178a353b7038EdCe4b3";

export const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "total_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "instalment_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "instalments",
          "type": "uint8"
        }
      ],
      "name": "BNPL",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "instalment_amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "instalments_left",
          "type": "uint8"
        }
      ],
      "name": "INSTALMENT_PAID",
      "type": "event"
    },
    {
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "total_amount",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "instalments",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "_instalment_amount",
          "type": "uint256"
        }
      ],
      "name": "divide_installments",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "instalments_amount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "instalments_left",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "repayment",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "used_amount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ] 

export const nftDetails = [
  {
    tokenAddress : "0xfb7e002151343efa2a3a5f2ea98db0d21efb75ce",
    tokenId :"1176"
  },
  {
    tokenAddress : "0x6f0fd221AD5f923baFA5c982b91D9f80a77409DB",
    tokenId :"27"
  },
  {
    tokenAddress : "0x287e11af803af5667ab45cfea7f574c5f9037843",
    tokenId :"5"
  },
  {
    tokenAddress : "0x724038c2f3188a9960a1c2c1f6111dd79577717f",
    tokenId :"14"
  },
  {
    tokenAddress : "0xda4c7a51590b23cfc67dfe1cbf0d28446dcd08ae",
    tokenId :"0"
  },
  {
    tokenAddress : "0xca1dcd4c0c909009ac2191baaf4b1c9694a5aeb9",
    tokenId :"40"
  },
]