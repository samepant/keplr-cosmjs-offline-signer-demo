import { Secp256k1HdWallet } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import "./App.css";

declare global {
  interface Window extends KeplrWindow {}
}

const address = "cosmos1q4w6w5lrsqut6mxj49vlvz7hqclsy0tnhrz825";
const txMsgs = [
  {
    typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    value: {
      fromAddress: "cosmos10nmdf6nt2qzvgn9q2nuwmmfc359yfesmu3gw22",
      toAddress: "cosmos1vqpjljwsynsn58dugz0w8ut7kun7t8ls2qkmsq",
      amount: [
        {
          amount: "50000",
          denom: "uatom",
        },
      ],
    },
  },
];
const txFee = {
  amount: [
    {
      amount: "2000",
      denom: "uatom",
    },
  ],
  gas: "200000",
};
const txMemo = "Tokens from us to you";
const signerData = {
  accountNumber: 244765,
  sequence: 0,
  chainId: "purp-chain",
};

function App() {
  const mnemonic =
    "gap way stumble absent siren butter vehicle fancy wait lawn legend wave stomach hospital number";

  const cosmjsSign = async () => {
    try {
      const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic);
      const signingClient = await SigningStargateClient.offline(wallet);
      const { bodyBytes, signatures } = await signingClient.sign(
        address,
        txMsgs,
        txFee,
        txMemo,
        signerData
      );
    console.log(bodyBytes, signatures);
    } catch (error) {
      console.log('cosmjs sign error: ', error.message)
    }
  };

  const keplrSign = async () => {
    try {
      if (window && window.getOfflineSigner) {
        const offlineSigner = window.getOfflineSigner("purp-chain");
        const accounts = await offlineSigner.getAccounts();
        const signingClient = await SigningStargateClient.offline(offlineSigner);
        const { bodyBytes, signatures } = await signingClient.sign(
          address,
          txMsgs,
          txFee,
          txMemo,
          signerData
        );
        console.log(bodyBytes, signatures);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addDummyChain = async () => {
    try {
      
    if (!window.keplr) {
      alert("Please install keplr extension");
    } else {
      const res = await window.keplr.experimentalSuggestChain({
        chainId: "purp-chain",
        chainName: "purple test chain",
        rpc: "http://127.0.0.1:26657",
        rest: "http://127.0.0.1:1317",
        bip44: {
          coinType: 118,
        },
        bech32Config: {
          bech32PrefixAccAddr: "cosmos",
          bech32PrefixAccPub: "cosmos" + "pub",
          bech32PrefixValAddr: "cosmos" + "valoper",
          bech32PrefixValPub: "cosmos" + "valoperpub",
          bech32PrefixConsAddr: "cosmos" + "valcons",
          bech32PrefixConsPub: "cosmos" + "valconspub",
        },
        currencies: [
          {
            coinDenom: "stake",
            coinMinimalDenom: "stake",
            coinDecimals: 6,
          },
        ],
        feeCurrencies: [
          {
            coinDenom: "stake",
            coinMinimalDenom: "stake",
            coinDecimals: 6,
          },
        ],
        stakeCurrency: {
          coinDenom: "stake",
          coinMinimalDenom: "stake",
          coinDecimals: 6,
        },
        coinType: 118,
        gasPriceStep: {
          low: 1,
          average: 1,
          high: 1,
        },
      });

      console.log(res);
    }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <p>Import this secret to your keplr wallet:</p>
        <code>{mnemonic}</code>
        <button onClick={cosmjsSign}>Sign with cosmjs (logs to console)</button>
        <button onClick={keplrSign}>Sign with keplr offlinse signer (logs to console)</button>
        <button onClick={addDummyChain}>Add local simd chain</button>
      </header>
    </div>
  );
}

export default App;
