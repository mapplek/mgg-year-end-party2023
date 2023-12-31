import Image from 'next/image';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState, useEffect } from 'react'
import { Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const tokenId = 0;
  const quantity = 1;

  const [totalSupply, setTotalSupply] = useState(0);
  const [minted, setMinted] = useState(false);

  const sdk = new ThirdwebSDK("mumbai", {
    clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID
  });

  let contract;

  async function getTotalSupply() {
    contract = await sdk.getContract(process.env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS);

    const supplied = await contract.erc1155.totalSupply(tokenId);
    return parseInt(supplied);
  }
  
  useEffect(() => {
    getTotalSupply()
      .then((res) => {
        setTotalSupply(res);
      });
    
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.title_area}>
        <h1>マシンガンズ大忘年会2023</h1>
      </div>

      <div className={styles.description_container}>
        <div className={styles.flex_horizontal_margin}>
          <Image
            src='/polygon.png'
            width='45'
            height='45'
            alt='icon_matic'
          />
        </div>
        <div className={styles.flex_horizontal_margin}>
          <h2>Gasless free mint!</h2>
        </div>
      </div>
      
      <div className={styles.img_view_container}>
        <div className={styles.img_frame} />

        <div className={styles.img_area}>
          <Image
            className={styles.img_property}
            src='/miko01.jpeg'
            width='200'
            height='200'
            alt='nft_image'
            priority
          />
        </div>
      </div>
      <div>

      {totalSupply != 0 &&
        <div className={styles.supply_counter_area}>
          [ {totalSupply} / ∞ ] minted
        </div>
      }
      {minted &&
        <div className={styles.opensea_link_area}>
          OpenSea link is <a href="https://testnets.opensea.io/ja/collection/gasless-drop-demo-1">here</a>!
        </div>
      }

      </div>
      <div>
        <Web3Button
          className={styles.button_style}
          contractAddress={process.env.NEXT_PUBLIC_DEV_CONTRACT_ADDRESS}
          action={async (contract) => {
            await contract.erc1155.claim(tokenId, quantity);
            setTotalSupply(parseInt(await contract.erc1155.totalSupply(tokenId)));
          }}
          onSuccess={() => {
            alert("Claimed!");
            setMinted(true);
          }}
          onError={() => alert("Something went wrong")}
        >
          Claim
        </Web3Button>
      </div>
    </div>
  );
}
