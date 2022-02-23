var formatter_eth = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'ETH',
});

var formatter_usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

var formatter_eur = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'EUR',
});

async function getData() {
    let url = 'data.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function getConversion() {
    let url = 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD,EUR';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function renderData() {
    let memes = await getData();
    let conversions = await getConversion();
    let html = '';
    memes.forEach(meme => {
        let eth = formatter_eth.format(meme.ETHprice);
        let usd = formatter_usd.format(meme.ETHprice * conversions.USD);
        let eur = formatter_eur.format(meme.ETHprice * conversions.EUR);
        let htmlSegment = `
            <!-- Gallery item -->
            <div class="col-xl-3 col-lg-4 col-md-6 mb-4">
                <div class="bg-white rounded shadow-sm"><a href="${meme.imageURL}" target="_blank"><img src="${meme.imageURL}" target="_blank" alt="${meme.name}" class="img-fluid card-img-top zoom"></a>
                    <div class="p-4">
                        <h5><a href="${meme.KYMURL}" target="_blank" class="text-dark">${meme.name}</a></h5>
                        <p class="small text-muted mb-0">${meme.description}</p>
                        <div class="d-flex align-items-center justify-content-between rounded-pill bg-light px-3 py-2 mt-4">
            `
        if (meme.ETHprice > 0) {
            htmlSegment += `
                                <p class="small mb-0">Sold for <span class="font-weight-bold">${eth}</span><br/><small class="float-right">${usd}<br/>${eur}</small></p>
                `
        } else {
            htmlSegment += `
                                <p class="small mb-0"><span class="font-weight-bold">–</span><br/><small class="float-right">No price information.<br/>Either the info was not found, or it is a collection.</small></p>
                `
        }
        htmlSegment += `
                            <a href="${meme.transactionURL}" target="_blank" class="text-dark" data-toggle="tooltip" data-placement="right" title="Link to the transaction page"><div class="badge badge-primary px-3 rounded-pill font-weight-normal">Source</div></a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- End -->
            `;

        html += htmlSegment;
    });

    let container = document.querySelector('.memes');
    container.innerHTML = html;
}

renderData();