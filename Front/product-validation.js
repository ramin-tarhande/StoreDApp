function validate(description,price,error) {

    if(description==="")
    {
        error.html(`invalid description`);
        return false;
    }

    if(!Number(price))
    {
        //console.log('price :>> ', price);
        error.html(`invalid price`);
        return false;
    }
    return true;
}

function showFailureHelp(error) {
    error.html(`<small>adding product failed<br/>price should be between 1 & 10 ethers<br/>maximum number of products added from each account is 2</small>`);
}

