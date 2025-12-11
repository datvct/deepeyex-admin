// src/blockchain/connectWallet.ts
import { ethers } from "ethers";
import contractABI from "./ABI.json";
import { CONTRACT_ADDRESS } from "./contractAddress";

export async function connectWallet() {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    alert("Vui lòng cài MetaMask!");
    return null;
  }

  // Yêu cầu MetaMask cung cấp account
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });

  // Cấp provider & signer từ MetaMask
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();

  // Tạo instance contract
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractABI,
    signer
  );

  return { provider, signer, contract };
}
