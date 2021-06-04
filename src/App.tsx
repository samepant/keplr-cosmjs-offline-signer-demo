import { Secp256k1HdWallet } from "@cosmjs/launchpad";
import { SigningStargateClient } from "@cosmjs/stargate";
// import { ChainInfo, AppCurrency, Currency, Bech32Config } from "@keplr-wallet/types";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import "./App.css";

declare global {
  interface Window extends KeplrWindow {}
}

const address = "cosmos1vqpjljwsynsn58dugz0w8ut7kun7t8ls2qkmsq";
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
  chainId: "cosmoshub-4",
};

function App() {
  const mnemonic =
    "gap way stumble absent siren butter vehicle fancy wait lawn legend wave stomach hospital number";

  const cosmjsSign = async () => {
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
  };

  const keplrSign = async () => {
    try {
      if (window && window.getOfflineSigner) {
        const offlineSigner = window.getOfflineSigner("cosmoshub-4");
        const accounts = await offlineSigner.getAccounts();
        const signingClient = await SigningStargateClient.offline(
          offlineSigner
        );
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

  // const addDummyChain = async () => {
  //   const res = await window.experimentalSuggestChain({
  //     rpc: '',
  //     rest: '',
  //     chainId: '',
  //     chainName: '',
  //     currencies: {

  //     },
  //     stakeCurrency: {
  //       coinDenom: 'stake',
  //       coinMinimalDenom: '',
  //       coinDecimals: 0,
  //     },
  //     bip44: {
  //       coinType: 0,
  //     },
  //     bech32Config: {
  //       bech32PrefixAccAddr: '',
  //       bech32PrefixAccPub: '',
  //       bech32PrefixValAddr: '',
  //       bech32PrefixValPub: '',
  //       bech32PrefixConsAddr: '',
  //       bech32PrefixConsPub: '',
  //     },
  //   });
  // }
  return (
    <div className="App">
      <header className="App-header">
        <p>Import this secret to your keplr wallet:</p>
        <code>{mnemonic}</code>
        <button onClick={cosmjsSign}>Sign with cosmjs</button>
      </header>
    </div>
  );
}

export default App;
