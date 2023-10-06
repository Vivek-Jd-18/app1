import SafeApiKit, { OwnerResponse } from '@safe-global/api-kit';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';

const run = async () => {
    const safeCoreSDK = new Safe();

    const safeAddress = '0xB23E9602C5ff21451a7220b47066AB75F054F578';

    // const safe = await safeCoreSDK.getSafe(safeAddress);

    const RPC_URL = 'https://eth-goerli.public.blastapi.io'
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)
    const owner1Signer = new ethers.Wallet("488b4c368013bbb3feb381d2795a316bd1d2d153d49d150596bded29de46d202", provider)

    const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: owner1Signer
    })


    const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })

    const safes: OwnerResponse = await safeService.getSafesByOwner("0x1cb0a69aA6201230aAc01528044537d0F9D718F3")
    console.log(safes, "safessafessafes")
}
run()