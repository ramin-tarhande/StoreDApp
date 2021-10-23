async function initBuy(tableBody){
    await initCommon();

    await showItems(tableBody);

    subscribeForEvents(()=>showItems(tableBody));
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
            <td>${x.owner}</td>
            <td>${x.id}</td>
            <td> 
                <button type="button" class="btn btn-success" onclick="buy(${x.id})">
                    Buy
                </button> 
            </td>
            </tr>
            `;

        
    }

    tableBody.html(html);
}

function buy(id){
    
    window.location.href = `./buy-product.html?id=${id}`;
};
