import Safe, { SafeFactory } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'
import { EthersAdapter } from '@safe-global/protocol-kit'
import SafeApiKit from '@safe-global/api-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'




const run = async () => {

    // https://chainlist.org/?search=goerli&testnets=true
    // const RPC_URL = 'https://rpc-mumbai.maticvigil.com'
    const RPC_URL='https://eth-goerli.public.blastapi.io'
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

    const Acc1Pk = "488b4c368013bbb3feb381d2795a316bd1d2d153d49d150596bded29de46d202"; 
    const Acc2Pk = "9c4088cab3dabfaefea309edb62543cf4da9c7a47ed0f58f34db9c746da742ce"; 
    const Acc3Pk = "82c6a8fd7a12f1e4a380c5c6f50638d09af5970df841498a2274d7f88619516a"; 

    // // Initialize signers
    const owner1Signer = new ethers.Wallet(Acc3Pk, provider)
    const owner2Signer = new ethers.Wallet(Acc2Pk, provider)
    const owner3Signer = new ethers.Wallet(Acc1Pk, provider)

    const ethAdapterOwner1 = new EthersAdapter({
        ethers,
        signerOrProvider: owner1Signer
    })


    const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })

    const safeAccountConfig: SafeAccountConfig = {
        owners: [
            await owner1Signer.getAddress(),
            await owner2Signer.getAddress(),
            await owner3Signer.getAddress()
        ],
        threshold: 2,
        // ... (Optional params)
    }

    /* This Safe is tied to owner 1 because the factory was initialized with
    an adapter that had owner 1 as the signer. */
    const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })

    const safeAddress = await safeSdkOwner1.getAddress()

    console.log('Your Safe has been deployed:')
    console.log(`https://goerli.etherscan.io/address/${safeAddress}`)
    console.log(`https://app.safe.global/gor:${safeAddress}`)



    // FundRaising
    const _safeAddress = safeSdkOwner1.getAddress()
    const safeAmount = ethers.utils.parseUnits('0.01', 'ether').toHexString()

    const transactionParameters = {
        to: _safeAddress,
        value: safeAmount
    }

    const tx = await owner1Signer.sendTransaction(transactionParameters)

    console.log('Fundraising.')
    console.log(`Deposit Transaction: https://goerli.etherscan.io/tx/${tx.hash}`)


    // Send transaction from Safe
    // // Any address can be used. In this example you will use vitalik.eth
    // const destination = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
    // const amount = ethers.utils.parseUnits('0.000005', 'ether').toString()

    // const safeTransactionData: SafeTransactionDataPartial = {
    //     to: destination,
    //     data: '0x',
    //     value: amount
    // }

    // // Create a Safe transaction with the provided parameters
    // // https://chainlist.org/?search=goerli&testnets=true
    // const RPC_URL = 'https://eth-goerli.public.blastapi.io'
    // const provider = new ethers.providers.JsonRpcProvider(RPC_URL)

    // // Initialize signers
    // const owner1Signer = new ethers.Wallet("488b4c368013bbb3feb381d2795a316bd1d2d153d49d150596bded29de46d202", provider)
    // const owner2Signer = new ethers.Wallet("9c4088cab3dabfaefea309edb62543cf4da9c7a47ed0f58f34db9c746da742ce", provider)
    // const owner3Signer = new ethers.Wallet("82c6a8fd7a12f1e4a380c5c6f50638d09af5970df841498a2274d7f88619516a", provider)

    // const ethAdapterOwner1 = new EthersAdapter({
    //     ethers,
    //     signerOrProvider: owner1Signer
    // })
    // const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapterOwner1 })
    // const safeAccountConfig: SafeAccountConfig = {
    //     owners: [
    //         await owner1Signer.getAddress(),
    //         await owner2Signer.getAddress(),
    //         await owner3Signer.getAddress()
    //     ],
    //     threshold: 2,
    //     // ... (Optional params)
    // }
    // const safeSdkOwner1 = await safeFactory.deploySafe({ safeAccountConfig })   
    // const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData })



    // // Deterministic hash based on transaction parameters
    // const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction)

    // // Sign transaction to verify that the transaction is coming from owner 1
    // const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash)

    // const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })


    // const safeAddress = await safeSdkOwner1.getAddress()

    // await safeService.proposeTransaction({
    //     safeAddress,
    //     safeTransactionData: safeTransaction.data,
    //     safeTxHash,
    //     senderAddress: await owner1Signer.getAddress(),
    //     senderSignature: senderSignature.data,
    // })

    // const pendingTransactions = await (await safeService.getPendingTransactions(safeAddress))?.results;



    // // Assumes that the first pending transaction is the transaction you want to confirm
    // const transaction = pendingTransactions[0]
    // const _safeTxHash = transaction.safeTxHash

    // const ethAdapterOwner2 = new EthersAdapter({
    //     ethers,
    //     signerOrProvider: owner2Signer
    // })

    // const safeSdkOwner2 = await Safe.create({
    //     ethAdapter: ethAdapterOwner2,
    //     safeAddress
    // })

    // const signature = await safeSdkOwner2.signTransactionHash(_safeTxHash)
    // const response = await safeService.confirmTransaction(_safeTxHash, signature.data)


    // const _safeTransaction = await safeService.getTransaction(safeTxHash)
    // const executeTxResponse = await safeSdkOwner1.executeTransaction(_safeTransaction)
    // const receipt: any = await executeTxResponse.transactionResponse?.wait()

    // console.log('Transaction executed:')
    // console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`)

    // const afterBalance1 = await safeSdkOwner1.getBalance()
    // const afterBalance2 = await safeSdkOwner2.getBalance()
    // const afterBalance3 = await safeSdkOwner1.getBalance()

    // console.log(`The final balance of the Safe: ${ethers.utils.formatUnits(afterBalance1, 'ether')} ETH`)
    // console.log(`The final balance of the Safe: ${ethers.utils.formatUnits(afterBalance2, 'ether')} ETH`)
    // console.log(`The final balance of the Safe: ${ethers.utils.formatUnits(afterBalance3, 'ether')} ETH`)




















    // Create a transaction

    // Any address can be used. In this example you will use vivek.eth
    const destination = '0x8e180c296DEaA8Cc1A9aCca6F3079e5105DACDa3'
    const amount = ethers.utils.parseUnits('0.0005', 'ether').toString()

    const safeTransactionData: SafeTransactionDataPartial = {
        to: destination,
        data: '0x',
        value: amount
    }
    console.log("Creating a transaction to a Safe transaction...")
    // Create a Safe transaction with the provided parameters
    const safeTransaction = await safeSdkOwner1.createTransaction({ safeTransactionData })






    // Propose the transaction
    // Deterministic hash based on transaction parameters
    const safeTxHash = await safeSdkOwner1.getTransactionHash(safeTransaction)

    // Sign transaction to verify that the transaction is coming from owner 1
    const senderSignature = await safeSdkOwner1.signTransactionHash(safeTxHash)

    // const txServiceUrl = 'https://safe-transaction-goerli.safe.global'
    // const safeService = new SafeApiKit({ txServiceUrl, ethAdapter: ethAdapterOwner1 })

    console.log("Proposing a transaction to a Safe...")
    await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: safeTransaction.data,
        safeTxHash,
        senderAddress: await owner1Signer.getAddress(),
        senderSignature: senderSignature.data,
    })


    // Get pending transactions
    const pendingTransactions = (await safeService.getPendingTransactions(safeAddress)).results
    console.log("Pending transactions:")
    console.log(pendingTransactions)


    // Confirm the transaction: second confirmation

    // Assumes that the first pending transaction is the transaction you want to confirm
    const transaction = pendingTransactions[0]
    const _safeTxHash = transaction.safeTxHash

    const ethAdapterOwner2 = new EthersAdapter({
        ethers,
        signerOrProvider: owner2Signer
    })

    const safeSdkOwner2 = await Safe.create({
        ethAdapter: ethAdapterOwner2,
        safeAddress
    })


    const signature = await safeSdkOwner2.signTransactionHash(_safeTxHash)
    console.log("Confirming transaction...", signature)
    const response = await safeService.confirmTransaction(_safeTxHash, signature.data)
    console.log("Transaction confirmed:", response)



    // Execute the transaction

    const _safeSdkOwner1 = await Safe.create({
        ethAdapter: ethAdapterOwner1,
        safeAddress
    })

    console.log("Executing transaction...")
    const _safeTransaction = await safeService.getTransaction(safeTxHash)
    const executeTxResponse = await _safeSdkOwner1.executeTransaction(_safeTransaction)
    const receipt: any = await executeTxResponse.transactionResponse?.wait()

    console.log('Transaction executed:')
    console.log(`https://goerli.etherscan.io/tx/${receipt.transactionHash}`);



    // Confirm that the transaction was executed
    const afterBalance = await safeSdkOwner1.getBalance()

    console.log(`The final balance of the Safe: ${ethers.utils.formatUnits(afterBalance, 'ether')} ETH`)
}

run()