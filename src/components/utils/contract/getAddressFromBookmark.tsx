export const DEFAULT_BOOKMARK = {
    cxf38b3b64166238819f7af4b84a0aed71557f5fc0: 'Factory',
    cx2a930cbc63e0e494ae440086f8da46b683915c37: 'BNUSD/ICX Pool',
    cx60a6a8212e45456207fb185b069aacf40e2e4b2e: 'BNUSD/USDC Pool',
    cx5e39b0eb3495840a14f9e428597197752c6ead61: 'USDC/ICX Pool',
    cx5c5f1f0343379f8f10a96fc7b7825f24380830a6: 'USDC/SICX Pool',
    cx450bac11a426da8f64ad7317541038374476fc3b: 'USDT/ICX Pool',
    cxf86ba1830bdb03666fa6a0c47eb97c846fbdf7ea: 'WETH/CRV Pool',
    cx0b2be5f7c559bccfc5213130b5c6b9894a676ea7: 'Swap Router',
    cxcb1883a13d44a75f610582345d4ec818272fae6d: 'Position Descriptor',
    cx60f6fc487ccc1cd843fb74a984591c3fd3bee49e: 'Position Manager',
    cx8569b510b4a5b9fff84390c4f4e2e242e5ee10ff: 'Pool ReadOnly',
    cxe5ae204d767b51bb76d1bc2c7e75a24803c22161: 'Quoter',
    cx4ea744e12e7569fd58f0dde6b4bf6c83951a0c37: 'Pool Initializer',
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
