export const DEFAULT_BOOKMARK = {
    cxacfcb969604302970ae71f090cdd050ac7af2b13: 'Factory',
    cx638c9da8bf1114baa901c835faad26f001167558: 'BNUSD/ICX Pool',
    cxcd242a9e49e1e7efb3754302a924fdcf76322178: 'BNUSD/USDC Pool',
    cxf51dfb2c43827b1644f1be656a0603ce206d70ea: 'USDC/ICX Pool',
    cxab93a04990475153397560b9b82b35ae1eabb568: 'USDC/SICX Pool',
    cx4bdf6e698b0ecfb258574a843d234226322b140c: 'USDT/ICX Pool',
    cx137a83be86c65ff65f57b921b7ec225abb3ad0f8: 'WETH/CRV Pool',
    cx3ae85202c99aa4e7692545afc07f636082a46ac6: 'Swap Router',
    cx01f4822d91bdd5a410e8561bd25b4625a2dd6985: 'Position Descriptor',
    cx3a656c86f778726d0ba90470b11bfede1d2400ec: 'Position Manager',
    cxdbac175807385da0ed43ed82dc4f8064d472ed42: 'Pool ReadOnly',
    cx2b22e81bdd3a570be7f34327952627aea255e72a: 'Quoter',
    cx2dd3d58721127f87e91c10f27ed5442a5872498b: 'Pool Initializer',
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
