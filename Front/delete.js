var errorField;
async function initDelete(table,tableBody,permissionFd,errorFd,balanceFd){
    errorField=errorFd;

    await initCommon(balanceFd);
    
    const cd=await canDelete();
    if(cd){

        table.show();

        await showItems(tableBody);

        subscribeForEvents(()=>showItems(tableBody));
    }
    else{
        
        permissionFd.html(`you don't have the permission to delete products`);        
    }
}
async function canDelete() {

    const account = await getAccount();
    const r=await contract.methods.canDelete().call({ from: account });
    //console.log('r :>> ', r);
    return r;
}

async function showItems(tableBody) {
    const account=await getAccount();
    const products = await contract.methods.getAll().call({ from: account });

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
            <td><small>${x.owner}<small></td>
            <td>${x.id}</td>
            <td> 
                <button type="button" class="btn btn-success" onclick="deleteProduct(${x.id})">
                    Delete
                </button> 
            </td>
            </tr>
            `;

        
    }

    tableBody.html(html);
}

async function deleteProduct(id){
    
    try{
        const account=await getAccount();
        const receipt = await contract.methods.deleteProduct(id).send({
            from: account,
            gas: 1000000
        });
    
        console.log(`receipt:`);
        console.log(receipt);
        errorField.text('');
    }catch(e){
        console.log(e);
        errorField.html(`could not delete the product`);
    }

};
