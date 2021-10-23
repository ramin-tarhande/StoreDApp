async function initSell(tableBody){
    await initCommon();

    await showItems(tableBody);

    subscribeForEvents(()=>showItems(tableBody));
}

async function showItems(tableBody) {
    const account=await getAccount();
    const products = await contract.methods.getMyProducts().call({ from: account });

    //console.log(products);

    var html='';
    for(let i=0;i<products.length;i++){
        let x=products[i];
        
        //console.log(x);
        const ether = web3.utils.fromWei(x.price, 'ether');
        
        html+= `
            <tr> 
            <td>${x.description}</td>
            <td>${ether}</td>
            <td>${x.id}</td>
            <td> 
                <button type="button" class="btn btn-success" onclick="edit(${x.id})">
                    Edit
                </button> 
            </td>
            </tr>
            `;

        
    }

    tableBody.html(html);
}

function edit(id){
    
    window.location.href = `./edit.html?id=${id}`;
};


async function addProduct(description,price,error,afterFocus) {
    
    const v=validate(description,price,error);    
    if(!v){
        return;
    }

    error.text('');
    
    try{
        const weis = web3.utils.toWei(price, "ether"); 
        const account=await getAccount();
        const receipt = await contract.methods.add(description,weis).send({
            from: account,
            gas: 1000000
        });
    
        console.log(`receipt:`);
        console.log(receipt);
        
        afterFocus.focus();
    }catch(e){
        console.log(e);
        //error.html(`Operation failed<br/> <i>${e.message}</i>`);
        showFailureHelp(error);
    }
}
