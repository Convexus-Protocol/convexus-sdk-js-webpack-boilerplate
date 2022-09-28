export const DEFAULT_BOOKMARK = {
    cxc77992cecb4a281f7693ba9917213f8918154030: 'Factory',
    cx8ceba833cb5195841b84c0744f48780421f318ef: 'BNUSD/ICX Pool',
    cxed0516e7a32a95812826edb23cdec76cb1234682: 'BNUSD/USDC Pool',
    cxc7a08c7a7e3b7c4581dd7247e7b6bee0be30fb5d: 'USDC/ICX Pool',
    cx83dfba0fb1fc1573900a70ab242c134e402e7da6: 'USDC/SICX Pool',
    cxcfda3d7f583f413e71621ece1177df5b879c3db8: 'USDT/ICX Pool',
    cx349db97d8d8023f4338b3adf88b750b0cd51b673: 'WETH/CRV Pool',
    cx2eab3f725e60bdcd7bf757e163266879ccf2b2d0: 'Swap Router',
    cxc018c60799387219244feb7a654161418c58a18b: 'Position Descriptor',
    cx1a4079c13ed6d0b5288f55198c53836a25458fcc: 'Position Manager',
    cx5486a35ec9e90b5969c43740a5c7603e6e379354: 'Pool ReadOnly',
    cxa0055f15104518c9e8c5d7cbb4c3ef28d1f4bae3: 'Quoter',
    cxdf2f121a1a5b6f825327335bc35d85a0599accb7: 'Pool Initializer',
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
