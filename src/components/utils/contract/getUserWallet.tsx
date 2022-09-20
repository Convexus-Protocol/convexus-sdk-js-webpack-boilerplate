import IconService from 'icon-sdk-js';

export function getUserWallet() {
    return IconService.IconWallet.loadPrivateKey(
        'd1e5692683ce567281367b0ab6871a306607c40230648a82c1c6aa6a5c297891',
    );
}
