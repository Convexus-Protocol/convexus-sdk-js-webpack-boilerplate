import IconService from 'icon-sdk-js';

const httpProvider = new IconService.HttpProvider(
    'https://lisbon.net.solidwallet.io/api/v3',
);
const debugProvider = new IconService.HttpProvider(
    'https://lisbon.net.solidwallet.io/api/v3d',
);

export const networkId = 2;
export const iconService = new IconService(httpProvider);
export const debugService = new IconService(debugProvider);
