import { connectWallet } from "./connectWallet";

export async function verifyAIResult(
  dataHash: string,
  aiResult: string,
  isConfirmed: boolean,
  doctorId: string,
) {
  try {
    // 1️⃣ Kết nối MetaMask → lấy signer + contract instance
    const { signer, contract } = await connectWallet();

    if (!contract) {
      throw new Error("Contract not found. Please check contract address.");
    }

    // 2️⃣ Gọi hàm addAudit của smart contract
    const tx = await contract.addAudit(dataHash, aiResult, isConfirmed, doctorId);

    // 3️⃣ Đợi blockchain xác nhận
    await tx.wait();

    return tx.hash;
  } catch (err: any) {
    console.error("Blockchain error:", err);
    throw err;
  }
}
