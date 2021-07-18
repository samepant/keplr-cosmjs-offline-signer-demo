A little repo that compares how the offline signer using a keplr wallet and a cosmjs wallet. 

Keplr also requires your wallet to have a little bit of whichever currency in it to sign, so this repo assumes you have added a chain with the chain id `purp-chain`. I handled this by running a local simapp, and pointing the keplr `experimentalSuggestChain` at it.

Once you've added the local chain, you will need to send some currency to your keplr wallet (it requires a wallet to have some currency to sign offline transactions).