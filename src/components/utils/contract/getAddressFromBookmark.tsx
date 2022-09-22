export const DEFAULT_BOOKMARK = {
    cxcd0f7cc050f371f814a69021e25f90795c37dfdb: 'Factory',
    cx47484f572945886ced9a93391cc17115318f33f9: 'BNUSD/ICX Pool',
    cxe450de3c27b134b06707fdebf60c05e09bcd8635: 'BNUSD/USDC Pool',
    cx37d904d8d88595ef404e931323845015a51c1ab2: 'USDC/ICX Pool',
    cx22169fa3c2ed8c96880eb5a5c980b092116ffe13: 'USDC/SICX Pool',
    cx607162cfe6db62401e457fb4466315e6217e4f5e: 'USDT/ICX Pool',
    cxc8511378dc65c08d11bd9c4cd9cdbce0fd8e4ae4: 'WETH/CRV Pool',
    cx8e6178573c7e7b777bc19627615cb06e067aecb4: 'Swap Router',
    cxe9b62320c92edc89df2b61da5f39ad96ea9c0473: 'Position Descriptor',
    cx342677ca08ddc2a6ecf0bd0325ee90296b514908: 'Position Manager',
    cx35897d3dda7b5187ef0173c6c6875b69f798c491: 'Pool ReadOnly',
    cxc4496612d11fc55ca2885d1d7347a73db7d348a7: 'Quoter',
    cxc97fdf80c3a4fbdbc98fb96f53f4ba7266cad8da: 'Pool Initializer',
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
