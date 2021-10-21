var contract;
var account;
var web3;
var isAdmin;

async function initMetamask() { 
    if (window.ethereum) {
      
      console.log('Metamask is installed');

      setWeb3();
      await setAccount();
    } 
    else{
      console.log('Metamask is NOT installed');
      window.location.replace("add-metamask.html");
    }
}
function setWeb3() {
  console.log('create web3');
  web3 = new Web3(window.ethereum); 
  console.log('web3 created');
}

async function setAccount() {
  console.log('request accounts');
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  var accounts = await web3.eth.getAccounts();
  account = accounts[0];
  console.log(accounts);
  console.log('account :>> ', account);
}

async function init() {
  
  await initMetamask();

  await initContract();

  const contractBalance = await contract.methods.getContractBalance().call({from : account});
  console.log('contractBalance :>> ', contractBalance);

  const isAdmin_ct = await contract.methods.isAdmin().call({from : account});
  console.log('isAdmin_ct :>> ', isAdmin_ct);

  const isAdmin_ct2 = await contract.methods.isAdmin().call({from : account});
  console.log('isAdmin_ct2 :>> ', isAdmin_ct2);

  const canDelete = await contract.methods.canDelete().call({from : account});
  console.log('canDelete :>> ', canDelete);
  //console.log('typeof canDelete :>> ', typeof canDelete);

  const admin = await contract.methods.getAdmin().call({from : account});
  console.log('admin :>> ', admin);

  const isAdmin_fr = (admin==account);
  console.log('isAdmin_fr :>> ', isAdmin_fr);

  isAdmin=isAdmin_fr;
}

function initContract() {
  const abi = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tollPercent",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_startId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "soldTo",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "deleted",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "struct DStore.Product",
          "name": "product",
          "type": "tuple"
        }
      ],
      "name": "Added",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "soldTo",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "deleted",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "struct DStore.Product",
          "name": "product",
          "type": "tuple"
        }
      ],
      "name": "Deleted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "soldTo",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "deleted",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "struct DStore.Product",
          "name": "product",
          "type": "tuple"
        }
      ],
      "name": "Edited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "soldTo",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "deleted",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "struct DStore.Product",
          "name": "product",
          "type": "tuple"
        }
      ],
      "name": "Sold",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "isAdmin",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAdmin",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAll",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "soldTo",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "deleted",
              "type": "bool"
            }
          ],
          "internalType": "struct DStore.Product[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getMyProducts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "address payable",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "sold",
              "type": "bool"
            },
            {
              "internalType": "address",
              "name": "soldTo",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "deleted",
              "type": "bool"
            }
          ],
          "internalType": "struct DStore.Product[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "desc",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "add",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "desc",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "price",
          "type": "uint256"
        }
      ],
      "name": "edit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "deleteProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "canDelete",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "buy",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "getContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

  const address = "0x18Ca79bE3C4FF552A9c72f893F724C52BEfDeB13";

  console.log('connect to contract');
  contract = new web3.eth.Contract(abi, address);
  console.log(contract);
}