import Image from 'next/image';
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { useState, useEffect } from 'react'
import { Web3Button } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const tokenId = 0;
  const quantity = 1;

  const [totalSupply, setTotalSupply] = useState(0);

  const sdk = new ThirdwebSDK("mumbai", {
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID
  });

  let contract;

  async function getTotalSupply() {
    contract = await sdk.getContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
    const amount = await contract.erc1155.totalSupply(tokenId);
    return parseInt(amount);
  }
  
  useEffect(() => {
    getTotalSupply()
      .then((res) => {
        setTotalSupply(res);
      });
    
  }, []);

  return (
    <div className={styles.container}>
      <div>
        <h1>Machinegun Girl&apos;s</h1>
      </div>

      <div className={styles.sub_title_container}>
        <div className={styles.right_margin}>
          <Image
            src='/polygon.png'
            width='45'
            height='45'
            alt='icon_matic'
          />
        </div>
        <div className={styles.right_margin}>
          <h2>Gasless free mint!</h2>
        </div>
      </div>
      
      <div className={styles.nft_view_container}>
        <div className={styles.image_frame} />
        <div className={styles.image_container}>
          <Image
            className={styles.image_property}
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
        <div className={styles.supply_counter_container}>
          [ {totalSupply} / ∞ ] minted
        </div>
      }

      </div>
      <div>
        <Web3Button
          className={styles.button_style}
          contractAddress={process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}
          action={async (contract) => {
            await contract.erc1155.claim(tokenId, quantity);
            setTotalSupply(parseInt(await contract.erc1155.totalSupply(tokenId)));
          }}
          onSuccess={() => alert("Claimed!")}
          onError={() => alert("Something went wrong")}
        >
          Claim
        </Web3Button>
      </div>
    </div>
  );
}
