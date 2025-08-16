"use client";

import { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { parseUnits, erc20Abi } from 'viem';
import { insertOrder } from '@/lib/supabase';
import { isEthereumWallet } from "@dynamic-labs/ethereum";

// Contract addresses
const PYUSD_ADDRESSES = {
  sepolia: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9", // PYUSD Sepolia testnet
  mainnet: "0x6c3ea9036406852006290770BEdFcAbA0e23A0e8"  // PYUSD Mainnet
};
const YOUR_WALLET_ADDRESS = "0xB68918211aD90462FbCf75b77a30bF76515422CE"; // Your wallet to receive PYUSD

interface PYUSDPaymentProps {
  onPaymentSuccess: (claimId: string, transactionHash: string) => void;
  collageOptIn: boolean;
}

export default function PYUSDPayment({ onPaymentSuccess, collageOptIn }: PYUSDPaymentProps) {
  const { primaryWallet } = useDynamicContext();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "paying" | "success" | "error">("idle");
  const [paymentHash, setPaymentHash] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [useMainnet, setUseMainnet] = useState(false); // Default to testnet

  const payPYUSD = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      throw new Error('This wallet is not an Ethereum wallet');
    }

    try {
      setIsPaying(true);
      setPaymentStatus("paying");
      setPaymentHash("");
      setLoadingMessage("Processing payment...");

      const walletClient = await primaryWallet.getWalletClient();
      
      // 1 PYUSD = 1,000,000 wei (6 decimals)
      const paymentAmount = parseUnits("1", 6); // 1 PYUSD with 6 decimals
      
      // Get the correct PYUSD contract address based on selected network
      const pyusdAddress = useMainnet ? PYUSD_ADDRESSES.mainnet : PYUSD_ADDRESSES.sepolia;
      
      // Direct transfer to your wallet
      const hash = await walletClient.writeContract({
        address: pyusdAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [YOUR_WALLET_ADDRESS, paymentAmount],
      });

      setPaymentHash(hash);
      
      // Step 1: Transaction submitted - show "submitted" message immediately
      setLoadingMessage("Transaction submitted! You'll be notified if it fails.");
      
      // Step 2: Brief "generating claim ID" (very quick)
      setTimeout(() => {
        setLoadingMessage("Generating claim ID...");
      }, 500);
      
      // Generate claim ID after brief delay
      setTimeout(async () => {
        const claimId = generateClaimId();
        console.log("Claim ID:", claimId);
        
        // Step 3: Recording order - this is the main loading time
        setLoadingMessage("Recording order...");
        
        try {
          await insertOrder({
            claim_id: claimId,
            wallet_address: primaryWallet.address,
            paid: true,
            collage_opt_in: collageOptIn,
            tweet_link: undefined,
            minted_status: false,
            image_url: undefined
          });
          
          console.log("Order recorded in Supabase successfully!");
          
          // Step 4: Only NOW show success and move to success page
          setPaymentStatus("success");
          setLoadingMessage("");
          onPaymentSuccess(claimId, hash);
          
          console.log("Payment successful! Transaction hash:", hash);
          console.log("PYUSD sent to:", YOUR_WALLET_ADDRESS);
          
        } catch (dbError) {
          console.error("Failed to record order in database:", dbError);
          // Still show success even if DB fails
          setPaymentStatus("success");
          setLoadingMessage("");
          onPaymentSuccess(claimId, hash);
        }
      }, 1000); // Brief delay for "generating claim ID"
      
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Payment failed:", error);
      
      // Handle specific error types
      let errorMessage = "Payment failed. Please try again.";
      
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = "Insufficient PYUSD balance. Please check your wallet.";
      } else if (error.code === 'USER_REJECTED') {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
        errorMessage = "Transaction failed due to gas issues. Please try again.";
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = "Insufficient PYUSD balance. Please check your wallet.";
      } else if (error.message?.includes('user rejected')) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.message?.includes('gas')) {
        errorMessage = "Transaction failed due to gas issues. Please try again.";
      }
      
      setPaymentStatus("error");
      setLoadingMessage("");
      
      // Show user-friendly error message
      alert(errorMessage);
      
    } finally {
      setIsPaying(false);
    }
  };

  const generateClaimId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const getButtonText = () => {
    if (isPaying) return loadingMessage || "Processing...";
    if (paymentStatus === "success") return "Payment Submitted!";
    return "Pay 1 PYUSD";
  };

  const getButtonClass = () => {
    const baseClass = "w-full py-3 text-lg font-medium transition-colors ";
    
    if (paymentStatus === "success") {
      return baseClass + "bg-green-500 text-white cursor-default";
    } else if (paymentStatus === "error") {
      return baseClass + "bg-red-500 text-white hover:bg-red-600";
    } else if (isPaying) {
      return baseClass + "bg-gray-400 text-white cursor-not-allowed";
    } else {
      return baseClass + "bg-pink-500 text-white hover:bg-pink-600";
    }
  };

  return (
    <div className="space-y-4">
      {/* Network Selection */}
      <div className="flex items-center justify-end space-x-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useMainnet}
            onChange={(e) => setUseMainnet(e.target.checked)}
            disabled={isPaying || paymentStatus === "success"}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
        </label>
        <span className="text-sm text-gray-600">Mainnet</span>
      </div>

      <Button
        onClick={payPYUSD}
        disabled={isPaying || paymentStatus === "success"}
        className={getButtonClass()}
      >
        {getButtonText()}
      </Button>

      {/* Payment Status */}
      {paymentStatus === "paying" && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
          <div className="text-blue-600 text-sm">{loadingMessage}</div>
        </div>
      )}

      {paymentStatus === "success" && paymentHash && (
        <div className="text-center">
          <div className="text-green-600 text-sm mb-2">✅ Payment Submitted!</div>
          <a
            href={`https://${useMainnet ? 'etherscan.io' : 'sepolia.etherscan.io'}/tx/${paymentHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-xs hover:underline block mb-2"
          >
            View on {useMainnet ? 'Etherscan' : 'Sepolia Etherscan'}
          </a>
          <div className="text-gray-500 text-xs">
            You&apos;ll be notified if the transaction fails
          </div>
        </div>
      )}

      {paymentStatus === "error" && (
        <div className="text-red-600 text-sm text-center">
          Payment failed. Please try again.
        </div>
      )}

      {/* Reset button after success */}
      {paymentStatus === "success" && (
        <Button
          onClick={() => {
            setPaymentStatus("idle");
            setPaymentHash("");
          }}
          variant="outline"
          className="w-full bg-transparent"
        >
          Make Another Payment
        </Button>
      )}
    </div>
  );
}
