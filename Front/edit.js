
async function initEdit(descriptionFd,priceFd,errorFd,btn,balanceFd){
    var urlParams = new URLSearchParams(window.location.search);
    var id=urlParams.get('id');
      
    await initCommon(balanceFd);

    await fillFields(id,descriptionFd,priceFd);

    btn.click(function () {

        //console.log('btn clicked');
        updateProduct(id,descriptionFd.val(),priceFd.val(),errorFd);
    });


    //subscribeForEvents(()=>showItems(tableBody));
}

async function fillFields(id,descriptionFd,priceFd){

    const account=await getAccount();
    const p = await contract.methods.get(id).call({ from: account });
    descriptionFd.val(p.description);
    const ether = web3.utils.fromWei(p.price, 'ether');
    priceFd.val(ether);
}

async function updateProduct(id,description,price,errorFd) {
    
    const v=validate(description,price,errorFd);    
    if(!v){
        return;
    }

    errorFd.text('');
    
    try{
        const weis = web3.utils.toWei(price, "ether"); 
        const account=await getAccount();
        const receipt = await contract.methods.update(id,description,weis).send({
            from: account,
            gas: 1000000
        });
    
        console.log(`receipt:`);
        console.log(receipt);

        window.location.href = `./sell.html`;        
        
    }catch(e){
        console.log(e);
        //error.html(`Operation failed<br/> <i>${e.message}</i>`);
        showFailureHelp(errorFd);
    }
}
