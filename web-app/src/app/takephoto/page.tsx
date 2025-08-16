"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { updateOrderStatus, DreamprintOrder } from "@/lib/supabase";

type FilterType = "Anime" | "Graffiti" | "Pop Art";

export default function TakePhotoPage() {
    const searchParams = useSearchParams();
    const claimId = searchParams.get('claimId');
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [orderDetails, setOrderDetails] = useState<DreamprintOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [photoTaken, setPhotoTaken] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string>("");
    const [selectedFilter, setSelectedFilter] = useState<FilterType>("Anime");
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        if (claimId) {
            setLoading(false);
            startCamera();
        } else {
            setError("No claim ID provided");
            setLoading(false);
        }

        return () => {
            // Cleanup camera stream when component unmounts
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [claimId]);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Unable to access camera");
        }
    };

    const switchCamera = async () => {
        // Stop current stream
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        // Switch facing mode
        const newFacingMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(newFacingMode);

        // Start new stream with switched camera
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: newFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error switching camera:", err);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

                         // Draw the video frame to canvas (mirrored to match preview)
             if (context) {
                 context.scale(-1, 1);
                 context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
             }

            // Convert to data URL for display and storage
            const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            setCapturedImage(imageDataUrl);
            setPhotoTaken(true);

            // Stop camera stream after capture
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }
    };

    const retakePhoto = () => {
        setPhotoTaken(false);
        setCapturedImage("");
        startCamera();
    };

    const saveToPhotos = () => {
        if (capturedImage) {
            // Create download link
            const link = document.createElement('a');
            link.download = `dreamprint-${claimId}.jpg`;
            link.href = capturedImage;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const generateQRCode = () => {
        // Placeholder for QR code generation
        const qrData = `https://dreamprint.app/claim/${claimId}`;
        console.log("Generate QR code for:", qrData);
        alert(`QR Code data: ${qrData}`);
    };

    const handleCompleteOrder = async () => {
        if (!claimId) return;

        try {
            // Update the order status to minted
            await updateOrderStatus(claimId, {
                minted_status: true,
                image_url: `https://example.com/images/${claimId}.jpg` // Placeholder URL
            });

            console.log(`Order ${claimId} marked as complete`);
            alert("Order completed successfully!");
        } catch (err) {
            console.error("Failed to complete order:", err);
            alert("Failed to complete order");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="px-4 py-8 max-w-md mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !claimId) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="px-4 py-8 max-w-md mx-auto">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
                            <p className="text-gray-600">{error || "Invalid claim ID"}</p>
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
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-black mb-2">Dreamprint Camera</h1>
                    <p className="text-gray-600 text-sm">Claim ID: <span className="font-mono text-pink-600">{claimId}</span></p>
                </div>

                <Card className="mb-4">
                    <CardContent className="p-4">
                        {!photoTaken ? (
                            // Camera View
                            <div className="space-y-4">
                                <div className="relative bg-black aspect-[4/3] overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className={`w-full h-full object-cover`}
                                    />
                                    <canvas
                                        ref={canvasRef}
                                        className="hidden"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={switchCamera}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        🔄 Flip
                                    </Button>
                                    <Button
                                        onClick={capturePhoto}
                                        className="flex-2 bg-pink-500 text-white hover:bg-pink-600"
                                    >
                                        📸 Take Photo
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            // Photo Review & Edit
                            <div className="space-y-4">
                                <div className="relative">
                                    <img
                                        src={capturedImage}
                                        alt="Captured photo"
                                        className="w-full aspect-[4/3] object-cover bg-black"
                                    />
                                </div>

                                {/* Filter Selection */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Select Art Style:</h3>
                                    <div className="flex gap-2">
                                        {(["Anime", "Graffiti", "Pop Art"] as FilterType[]).map((filter) => (
                                            <Button
                                                key={filter}
                                                onClick={() => setSelectedFilter(filter)}
                                                variant={selectedFilter === filter ? "default" : "outline"}
                                                className={`flex-1 text-xs ${selectedFilter === filter
                                                        ? "bg-pink-500 text-white"
                                                        : "border-gray-300"
                                                    }`}
                                            >
                                                {filter}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        onClick={retakePhoto}
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        🔄 New Photo
                                    </Button>
                                    <Button
                                        onClick={saveToPhotos}
                                        variant="outline"
                                        className="text-sm"
                                    >
                                        💾 Save
                                    </Button>
                                </div>

                                <Button
                                    onClick={generateQRCode}
                                    variant="outline"
                                    className="w-full text-sm"
                                >
                                    📱 Add QR Code
                                </Button>

                                <Button
                                    onClick={handleCompleteOrder}
                                    className="w-full bg-green-500 text-white hover:bg-green-600"
                                >
                                    ✨ Complete Order ({selectedFilter})
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center text-xs text-gray-500">
                    <p>Selected: {selectedFilter} Style</p>
                </div>
            </div>
        </div>
    );
}
