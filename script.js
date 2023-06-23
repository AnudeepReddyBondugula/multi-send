const ethers = require('ethers');


// contractAddress = 0x14CfD81166C4dAB75AF0434fD0E2F0E86AB9214E



const contractABI = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address payable",
                        "name": "addr",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct MultiSend.Payee[]",
                "name": "payees",
                "type": "tuple[]"
            }
        ],
        "name": "sendEther",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
]

const contractAddress = '0x14CfD81166C4dAB75AF0434fD0E2F0E86AB9214E';



const addressInput = document.getElementById("payeeAddr");
const etherInput = document.getElementById("ethValue");
const addButton = document.getElementById("addEntry");
const payees = document.getElementById("listOfPayees");
const sendButton = document.getElementById("send");

addButton.addEventListener('click', function (e){
    e.preventDefault();

    const addressValue = addressInput.value;
    const etherValue = etherInput.value;
    
    if (!(/^(0x)?[0-9a-fA-F]{40}$/).test(addressValue)){
        alert("InValid Address");
        return;
    }
    else if (etherInput.value == 0){
        alert("Enter value");
        return;
    }
    else{
        if (etherValue < 0.00001){
            alert("value should be minimum 0.00001")
            return;
        }
    }



    const entryDiv = document.createElement('div');
    entryDiv.classList.add('entry');

    const addressTag = document.createElement('p');
    addressTag.textContent = `${addressValue}`;

    const amountTag = document.createElement('p');
    amountTag.textContent = `${etherValue} ETH`;

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("delete-entry");

    deleteButton.addEventListener('click', function (e){
        e.preventDefault();

        entryDiv.remove();
    })

    const deleteIcon = document.createElement('i');
    deleteIcon.classList.add('material-icons');
    deleteIcon.textContent = 'delete';

    deleteButton.appendChild(deleteIcon);

    entryDiv.appendChild(addressTag);
    entryDiv.appendChild(amountTag);
    entryDiv.appendChild(deleteButton);

    payees.appendChild(entryDiv);

    addressInput.value = "";
    etherInput.value = "";

});


sendButton.addEventListener('click', async function (e){
    if (typeof window.ethereum === 'undefined') {
        console.error('Metamask is not installed');
        return;
      }
    await window.ethereum.enable();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    let records = []
    const entries = document.querySelectorAll(".entry");
    let totalAmount = 0;
    entries.forEach((entry)=> {
        const string = entry.childNodes[1].innerHTML;
        const value = parseFloat(string.match(/\d+(\.\d+)?/)[0]);
        console.log("value: ", value);
        totalAmount += value;
        const payee = {
            addr: entry.childNodes[0].innerHTML,
            amount: ethers.utils.parseEther(`${value}`).toString()
        }
        records.push(payee)
        
    })
    console.log(records);
    console.log(ethers.utils.parseEther(`${totalAmount}`).toString());
    const value = ethers.utils.parseEther(`${totalAmount}`).toString();
    const transaction = await contract.sendEther(records, {value : value});
    console.log(transaction);
    records = []



})