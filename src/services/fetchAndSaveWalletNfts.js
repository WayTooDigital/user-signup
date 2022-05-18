import { getParsedNftAccountsByOwner } from "@nfteyez/sol-rayz";
import { PublicKey, Connection } from "@solana/web3.js";
import axios from "axios";
import UserModel from "../models/users.js";

const fetchAndSaveWalletNfts = (user) => {
  // Not using "await" on purpose to avoid keep the user waiting for response
  return new Promise((resolve, reject) => {
    try {
      getParsedNftAccountsByOwner({
        publicAddress: new PublicKey(user.walletAddress),
        connection: new Connection(global.config.solana_network, "confirmed"),
      }).then((allNfts) => {
        Promise.all(
          allNfts
            .filter((nft) =>
              nft.data.creators.find(
                (creator) =>
                  creator.address === global.config.nft_creator_address
              )
            )
            .map(async (nft) => {
              try {
                // The lastChar check is to avoid an unnecessary redirect from Arweave which requires the trailing "/"
                const lastChar = nft.data.uri.charAt(nft.data.uri.length - 1);
                const resp = await axios.get(
                  `${nft.data.uri}${lastChar !== "/" ? "/" : null}`
                );
                nft.image = resp.data.image;
              } catch (err) {
                reject();
                console.log(err);
              }
              return nft;
            })
        ).then(async (response) => {
          await UserModel.findOneAndUpdate(
            { _id: user._id },
            {
              nfts: response,
            }
          );
          resolve();
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default fetchAndSaveWalletNfts;
