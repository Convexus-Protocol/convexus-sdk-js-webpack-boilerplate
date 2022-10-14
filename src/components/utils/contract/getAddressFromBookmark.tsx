export const DEFAULT_BOOKMARK = {
    cx5e0f1b97cfb7b2c83950200b2bc5cb723bb80694: 'Factory',
    cx4d1e7533796d56b336d4125c1c73229c770c51cf: 'BNUSD/ICX Pool',
    cx97cbd7e3e6937339054d53597e7551c8c61e141c: 'BNUSD/USDC Pool',
    cxfa2b4c6acab50b6f9ef38c23454e7db1a09b037a: 'USDC/ICX Pool',
    cxddee489ae0d33e98b73dc30144afdd892fe43816: 'USDC/SICX Pool',
    cx78d1d21d7f56960d3e00a3515b4fd05ff8c28211: 'USDT/ICX Pool',
    cx0e28b7c80c7b0ec3ab459d741cc8f34f64132de6: 'WETH/CRV Pool',
    cx60520a3eccd1246cbd9774c812b0cf94600c3123: 'Swap Router',
    cx60c4ac2a4ac2c413fe90d8bb4e67cfe256123601: 'Position Descriptor',
    cxb0077dd2c91f309f7fbbd3fc07cb7fcf0793dfea: 'Position Manager',
    cx75abd25bbd9966f310ac0b8ab20f2872686c2a6e: 'Pool ReadOnly',
    cx105b64239d9205f15a36a27c4c68288a3708f5d0: 'Quoter',
    cxba1c643f393314d32fe4e8a81ab338aa45605ce0: 'Pool Initializer',
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
