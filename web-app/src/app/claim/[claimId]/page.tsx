"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getNetwork, useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { DreamprintOrder, getOrderByClaimId, updateOrderStatus } from "@/lib/supabase";
import { abi } from "@/app/utils/nft-abi.json";
import { isEthereumWallet } from "@dynamic-labs/ethereum";

// Contract addresses for different networks
const CONTRACT_ADDRESSES = {
  testnet: "0x49ed9edf4157E02E26207cC648Ef3286F09B2f8e", // Flow EVM testnet
  mainnet: "0xb861d6d79123ADa308E5F4030F458b402E2D131A"  // Flow EVM mainnet
} as const;

export default function ClaimPage() {
  const params = useParams();
  const claimId = params.claimId as string;
  const { primaryWallet } = useDynamicContext();
  const [order, setOrder] = useState<DreamprintOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [useMainnet, setUseMainnet] = useState(false); // Default to testnet

  useEffect(() => {
    const checkNetwork = async () => {
      if (primaryWallet?.connector) {
        try {
          const currentNetwork = await getNetwork(primaryWallet.connector);
          
          if (currentNetwork !== 545 && currentNetwork !== 74) {
            alert('Please switch to EVM Flow testnet or mainnet');
          }
        } catch (error) {
          console.error('Failed to get network:', error);
        }
      }
    };
  
    checkNetwork();
  }, [primaryWallet]);

  useEffect(() => {
    if (claimId) {
      fetchOrderDetails();
    }
  }, [claimId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const order = await getOrderByClaimId(claimId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      setOrder(order);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Failed to load claim details");
    } finally {
      setLoading(false);
    }
  };

  const handleMintNFT = async () => {
    if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
      throw new Error('This wallet is not an Ethereum wallet');
    }

    if (!order) {
      alert("Order not found");
      return;
    }

    const connectedAddress = primaryWallet.address.toLowerCase();
    const orderAddress = order.wallet_address.toLowerCase();
    
    if (connectedAddress !== orderAddress) {
      alert("Connected wallet doesn't match the wallet that made this purchase");
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(`Minting NFT for claim ${claimId} to address ${primaryWallet.address}`);

      // Get wallet client
      const walletClient = await primaryWallet.getWalletClient();
      
      // Get the correct contract address based on selected network
      const contractAddress = useMainnet ? CONTRACT_ADDRESSES.mainnet : CONTRACT_ADDRESSES.testnet;
      
      // Call the mint function on the smart contract
      const hash = await walletClient.writeContract({
        address: contractAddress as `0x${string}`,
        abi: abi,
        functionName: "mint",
        args: [claimId, primaryWallet.address as `0x${string}`],
      });

      console.log("Transaction submitted:", hash);
      
      // Store transaction hash
      setTransactionHash(hash);
      
      // Update mint status in database (you may need to add transaction_hash field to your database)
      await updateOrderStatus(claimId, { minted_status: true });
      
      // Refresh order data
      await fetchOrderDetails();

      alert(`Transaction submitted! 🎉\nTransaction hash: ${hash}`);
      
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      console.error("Error minting NFT:", err);
      
      // Handle specific error types
      if (err.name === 'UserRejectedRequestError') {
        setError("Transaction was rejected by user");
      } else if (err.message?.includes("Claim already minted")) {
        setError("This claim has already been minted");
      } else if (err.message?.includes("insufficient funds")) {
        setError("Insufficient funds for gas fees");
      } else {
        setError(`Failed to mint NFT: ${err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveToPhotos = (imageUrl: string) => {
    if (!imageUrl) return;
    
    // For iOS Safari, try to use Web Share API first
    if (navigator.share && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
      // Convert image URL to blob for sharing
      fetch(imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `dreamprint-${claimId}.jpg`, { type: 'image/jpeg' });
          
          navigator.share({
            title: 'Dreamprint Artwork',
            files: [file]
          }).catch(err => {
            console.log('Share failed, falling back to download:', err);
            fallbackDownload(imageUrl);
          });
        })
        .catch(err => {
          console.log('Blob conversion failed, falling back to download:', err);
          fallbackDownload(imageUrl);
        });
    } else {
      // For other browsers, use download
      fallbackDownload(imageUrl);
    }
  };

  const fallbackDownload = (imageUrl: string) => {
    if (!imageUrl) return;
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dreamprint-${claimId}.jpg`;
    link.target = '_blank';
    
    // For mobile devices, try to trigger download
    if (link.download !== undefined) {
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback for older browsers
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${imageUrl}" alt="Dreamprint artwork" />`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
            <div className="text-gray-500">Loading claim details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="px-4 py-8 max-w-md mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
              <p className="text-gray-600">{error || "Claim not found"}</p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="mt-4 bg-pink-500 text-white hover:bg-pink-600"
              >
                Go Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="px-4 py-8 max-w-md mx-auto">
        <div className="text-center mb-2 space-y-1">
          <p className="text-gray-600 text-sm">Claim ID: <span className="font-mono text-pink-600">{claimId}</span></p>
          {transactionHash && (
            <p className="text-gray-600 text-xs">
              Transaction: 
              <a 
                href={`https://evm-testnet.flowscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-blue-600 hover:text-blue-800 underline ml-1"
              >
                {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}
              </a>
            </p>
          )}
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="space-y-4">
              {/* Image Display */}
              {order.image_url && (
                <div className="relative bg-black overflow-hidden" style={{ width: '300px', height: '400px', margin: '30px auto 16px auto' }}>
                  <img
                    src={order.image_url}
                    alt="Dreamprint artwork"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Order Status */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.paid ? 'Paid' : 'Pending'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mint Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.minted_status ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.minted_status ? 'Minted' : 'Not Minted'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Collage Opt-in:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    order.collage_opt_in ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.collage_opt_in ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Wallet:</span>
                  <span className="text-xs font-mono text-gray-800">
                    {order.wallet_address.slice(0, 6)}...{order.wallet_address.slice(-4)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">

                {/* Show different buttons based on mint status */}
                {!order.minted_status ? (
                  <div>
                    {/* Network Selection Toggle */}
                    <div className="flex items-center justify-end space-x-3 mb-3">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useMainnet}
                          onChange={(e) => setUseMainnet(e.target.checked)}
                          disabled={loading}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
                      </label>
                      <span className="text-sm text-gray-600">Mainnet</span>
                    </div>
                    
                    <Button
                      onClick={handleMintNFT}
                      disabled={loading}
                      className="w-full bg-purple-500 text-white hover:bg-purple-600"
                    >
                      {loading ? "Minting..." : `🎨 Mint as NFT`}
                    </Button>
                    {order.image_url && (
                                              <div className="mt-2 w-full" style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => saveToPhotos(order.image_url!)}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Save to Photos
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-green-600 font-medium text-sm">
                        ✨ Already minted as NFT!
                      </div>
                      <div className="text-green-500 text-xs mt-1">
                        This artwork has been minted to the blockchain
                      </div>
                    </div>
                    {order.image_url && (
                                              <div className="mt-2 w-full" style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => saveToPhotos(order.image_url!)}
                          className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                          Save to Photos
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500">
          <p>Share this link to show your Dreamprint!</p>
        </div>
      </div>
    </div>
  );
}
