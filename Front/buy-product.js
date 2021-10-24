async function initBuyProduct(descriptionFd,priceFd,errorFd,btn,balanceFd){
    var urlParams = new URLSearchParams(window.location.search);
    var id=urlParams.get('id');
      
    await initCommon(balanceFd);

    const p=await load(id);

    fillFields(p,descriptionFd,priceFd);

    btn.click(function () {

        //console.log('btn clicked');
        buyProduct(p,errorFd);
    });


    //subscribeForEvents(()=>showItems(tableBody));
}

async function load(id){

    const account=await getAccount();
    const p = await contract.methods.get(id).call({ from: account });
    return p;
}

function fillFields(p,descriptionFd,priceFd){

    descriptionFd.val(p.description);
    const ether = web3.utils.fromWei(p.price, 'ether');
    priceFd.val(ether);
}

async function buyProduct(p,errorFd) {
    
    errorFd.text('');
    
    try{
        const account=await getAccount();
        const receipt = await contract.methods.buy(p.id).send({
            from: account,
            gas: 1000000, 
            value:p.price
        });
    
        console.log('receipt :>> ', receipt);
        
        window.location.href = `./buy.html`;        
        
    }catch(e){
        console.log(e);
        errorFd.html(`operation failed. check that:
        <ul>
        <li>maximum buying per address is not exceeded</li>
        </ul>`);
    }
}
