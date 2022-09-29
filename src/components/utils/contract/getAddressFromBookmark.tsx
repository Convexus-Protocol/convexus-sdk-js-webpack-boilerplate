export const DEFAULT_BOOKMARK = {
    cx82a52879e11c032b819df4307da6fac21d097cb6: 'Factory',
    cxf6887e29c8a7842e960ed24e39873233749d9a5c: 'BNUSD/ICX Pool',
    cxf4c30d282bbe39a73ed2f8fe2eb5f68c776a0f86: 'BNUSD/USDC Pool',
    cx4157e0b7250eb6142a82a04235642be5a7d6a29b: 'USDC/ICX Pool',
    cxf8b1b8fb73a3726ebbbae62624915dc75abee22f: 'USDC/SICX Pool',
    cx4f78378b2129d0dc728470e0c8d60da22ec4a0b5: 'USDT/ICX Pool',
    cx9693f5ee25ca1b33297f84c875e79a245cf416d1: 'WETH/CRV Pool',
    cxe948d9ffcfea1c5593c868158d4f200239c5a2d9: 'Swap Router',
    cxb49d388a38fd8188670d3eae20be4867f4671951: 'Position Descriptor',
    cx4c5e17e7ae57b95e980c4a5717c0d11d3c9714ab: 'Position Manager',
    cx9c37ac88269ccd40f5388cceea6c34f27515b08a: 'Pool ReadOnly',
    cx59bec85f112e774c5b1c1a11f9f277ac18149ab1: 'Quoter',
    cx5bf410c0fa5918e9e73e918800148ea7ef53bbec: 'Pool Initializer',
    cx196276887ec398a1fb41b335f9260fbb300c684b: 'bnUSD',
    cxc8373f6f2654a9c8b689059aef58aefb9f878e12: 'CRV',
    cx26a0bf7574f0c7eff197beaed51736954a292f25: 'CTT',
    cx79ada8b605380c84507d42534080ada30c77602c: 'sICX',
    cxa818e190782c7bc64c1ec12512c7f8f3171fc8cf: 'USDC',
    cxa2895912e90f92e17c6df7e382c04745c7b6a9ce: 'USDT',
    cx1126c5dc7115daea7f55d6b6cf0eb63adeb3529f: 'WETH',
};

function getKeyByValue(object: any, value: any): string {
    const address = Object.keys(object).find((key) => object[key] === value);
    if (!address) {
        throw new Error(`Contract ${value} not found in bookmark`);
    }
    return address;
}

export function getAddressFromBookmark(name: string) {
    return getKeyByValue(DEFAULT_BOOKMARK, name);
}
