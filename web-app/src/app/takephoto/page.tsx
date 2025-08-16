"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { updateOrderStatus, DreamprintOrder } from "@/lib/supabase";

type FilterType = "Anime" | "Graffiti" | "Pop Art";

function TakePhotoContent() {
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
  const [currentStep, setCurrentStep] = useState<"photo" | "processing" | "qr" | "save">("photo");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);

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
                     width: { ideal: 1080 },
                     height: { ideal: 1440 }
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
                     width: { ideal: 1080 },
                     height: { ideal: 1440 }
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

             if (context) {
                 // Use higher resolution canvas for better quality
                 const targetWidth = 2400;  // Double the display resolution
                 const targetHeight = 3200; // Double the display resolution
                 canvas.width = targetWidth;
                 canvas.height = targetHeight;

                 // Enable high-quality rendering
                 context.imageSmoothingEnabled = true;
                 context.imageSmoothingQuality = 'high';
                 
                 // Clear canvas with black background
                 context.fillStyle = '#000000';
                 context.fillRect(0, 0, canvas.width, canvas.height);
                 
                 // Calculate scaling to fit video into polaroid dimensions while maintaining quality
                 const videoAspect = video.videoWidth / video.videoHeight;
                 const targetAspect = targetWidth / targetHeight;
                 
                 let drawWidth, drawHeight, offsetX, offsetY;
                 
                 if (videoAspect > targetAspect) {
                     // Video is wider, fit to height and crop sides
                     drawHeight = targetHeight;
                     drawWidth = drawHeight * videoAspect;
                     offsetX = (targetWidth - drawWidth) / 2;
                     offsetY = 0;
                 } else {
                     // Video is taller, fit to width and crop top/bottom
                     drawWidth = targetWidth;
                     drawHeight = drawWidth / videoAspect;
                     offsetX = 0;
                     offsetY = (targetHeight - drawHeight) / 2;
                 }

                 // Draw the video frame at full resolution
                 context.drawImage(video, offsetX, offsetY, drawWidth, drawHeight);
             }

             // Convert to PNG for lossless quality, or high-quality JPEG
             const imageDataUrl = canvas.toDataURL('image/png');
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
        setCurrentStep("photo");
        setImageUrl("");
        startCamera();
    };

    const handleAIEdit = async () => {
        try {
            setIsProcessingAI(true);
            setCurrentStep("processing");
            console.log(`AI editing with ${selectedFilter} style`);
            
            // Create prompt based on selected filter
            const promptMap = {
                "Anime": "Transform this image into the style of Studio Ghibli.",
                "Graffiti": "Turn this into a vibrant street art mural with a bold graffiti style. Use thick black ink outlines, flat spray-paint color fills, and high-contrast shadows. Simplify facial features and clothing folds into clear shapes with sharp edges. Apply saturated, vibrant colors with crisp separation—no gradients or soft blending. Add subtle spray textures and urban wall background for authenticity. The overall look should feel like a large-scale graffiti mural painted with aerosol cans, comic-book energy, and vivid, punchy tones.", 
                "Pop Art": "Transform this image into the style of Andy Warhol's pop art."
            };
            
            const response = await fetch('/api/ai-edit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageData: capturedImage,
                    prompt: promptMap[selectedFilter]
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to process AI edit');
            }

            const result = await response.json();
            console.log('AI edit result:', result);
            
            if (result.editedImageUrl) {
                // Update the captured image with the AI-edited version
                setCapturedImage(result.editedImageUrl);
                // Move to QR code step
                setCurrentStep("qr");
            } else {
                throw new Error('No edited image URL received');
            }
        } catch (error) {
            console.error('Error during AI edit:', error);
            setError('Failed to process AI edit. Please try again.');
            setCurrentStep("photo"); // Go back to photo step on error
        } finally {
            setIsProcessingAI(false);
        }
    };

    const uploadAndSaveImage = async () => {
        try {
            console.log("Uploading AI-edited image to Cloudinary...");
            
            // Step 1: Upload AI-edited image to Cloudinary
            const uploadResponse = await fetch('/api/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    imageUrl: capturedImage, // This is the Replicate result URL
                    claimId: claimId
                })
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image to Cloudinary');
            }

            const uploadResult = await uploadResponse.json();
            const permanentUrl = uploadResult.imageUrl;
            
            console.log("Image uploaded to Cloudinary:", permanentUrl);
            setImageUrl(permanentUrl);
            
            // Step 2: Save permanent URL to Supabase
            console.log("Saving image URL to Supabase...");
            await updateOrderStatus(claimId!, {
                image_url: permanentUrl,
                minted_status: false // Will be set to true after QR code is added
            });
            
            return permanentUrl;
        } catch (error) {
            console.error("Error uploading and saving image:", error);
            throw new Error('Failed to upload and save image');
        }
    };

    const handleUploadAndAddQR = async () => {
        try {
            // First upload and save the AI-edited image
            await uploadAndSaveImage();
            
            // Then add QR code
            await handleAddQRCode();
        } catch (error) {
            console.error("Error in upload and QR process:", error);
            setError('Failed to process image. Please try again.');
        }
    };

    const handleAddQRCode = async () => {
        try {
            // Step 1: Generate QR code URL
            const claimUrl = `${window.location.origin}/claim/${claimId}`;
            console.log("Generating QR code for:", claimUrl);
            
            // Step 2: Create canvas to overlay QR code on image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }
            
            // Create image element from captured image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
                img.onload = async () => {
                    try {
                        // Set canvas dimensions to match image
                        canvas.width = img.width;
                        canvas.height = img.height;
                        
                        // Draw the original image
                        ctx.drawImage(img, 0, 0);
                        
                        // Generate QR code using a simple QR API service
                        const qrSize = Math.min(img.width, img.height) * 0.18; // 18% of image size
                        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${Math.floor(qrSize)}x${Math.floor(qrSize)}&data=${encodeURIComponent(claimUrl)}&bgcolor=255-255-255&color=0-0-0&format=png`;
                        
                        // Load QR code image
                        const qrImg = new Image();
                        qrImg.crossOrigin = 'anonymous';
                        
                        qrImg.onload = () => {
                            // Position QR code at bottom right corner with padding
                            const padding = 30;
                            const qrX = img.width - qrSize - padding;
                            const qrY = img.height - qrSize - 45;
                            
                            // Add white background for QR code
                            ctx.fillStyle = 'white';
                            ctx.fillRect(qrX - padding/2, qrY - padding/2, qrSize + padding, qrSize + padding);
                            
                            // Draw QR code
                            ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
                            
                            // Convert canvas to data URL
                            const finalImageUrl = canvas.toDataURL('image/png', 0.9);
                            setCapturedImage(finalImageUrl);
                            
                            resolve(true);
                        };
                        
                        qrImg.onerror = () => reject(new Error('Failed to load QR code'));
                        qrImg.src = qrUrl;
                        
                    } catch (err) {
                        reject(err);
                    }
                };
                
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = capturedImage;
            });
            
            // Step 3: Upload final image to hosting API
            console.log("Uploading final image to hosting service...");
            // TODO: Implement image hosting API call with final image
            const hostedImageUrl = `https://example.com/hosted/${claimId}-final.png`;
            setImageUrl(hostedImageUrl);
            
            // Step 4: Save image URL to database
            console.log("Saving image URL to database...");
            // TODO: Implement database update with hosted URL
            
            setCurrentStep("save");
        } catch (error) {
            console.error("Error in QR code process:", error);
            setError('Failed to add QR code. Please try again.');
        }
    };

    const handleFinalSave = () => {
        saveToPhotos();
        handleCompleteOrder();
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
                    <p className="text-gray-600 text-sm">Claim ID: <span className="font-mono text-pink-600">{claimId}</span></p>
                </div>

                <Card className="mb-4">
                    <CardContent className="p-4">
                        {!photoTaken ? (
                            // Camera View
                                                         <div className="space-y-4">
                                 <div className="relative bg-black overflow-hidden" style={{ width: '300px', height: '400px', margin: '50px auto 16px auto' }}>
                                     <video
                                         ref={videoRef}
                                         autoPlay
                                         playsInline
                                         muted
                                         className="w-full h-full object-cover"
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
                                 <div className="relative bg-black overflow-hidden" style={{ width: '300px', height: '400px', margin: '50px auto 16px auto' }}>
                                     <img
                                         src={capturedImage}
                                         alt="Captured photo"
                                         className="w-full h-full object-cover"
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

                                {/* Step-by-step flow */}
                                {currentStep === "photo" && (
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            onClick={handleAIEdit}
                                            disabled={isProcessingAI}
                                            className="flex-[3] bg-pink-500 text-white hover:bg-pink-600 text-sm"
                                        >
                                            {isProcessingAI ? "Processing..." : "✨ AI Edit"}
                                        </Button>
                                        <Button
                                            onClick={retakePhoto}
                                            variant="outline"
                                            className="flex-1 text-sm"
                                            disabled={isProcessingAI}
                                        >
                                            🔄
                                        </Button>
                                    </div>
                                )}

                                {currentStep === "processing" && (
                                    <div className="space-y-4 mt-6">
                                        <div className="text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                                            <h3 className="text-sm font-medium text-gray-700">AI Processing</h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Transforming your photo with {selectedFilter} style...
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {currentStep === "qr" && (
                                    <div className="space-y-3 mt-6">
                                        <Button
                                            onClick={handleUploadAndAddQR}
                                            variant="outline"
                                            className="w-full text-sm"
                                        >
                                            📱 Add QR Code
                                        </Button>
                                    </div>
                                )}

                                {currentStep === "save" && (
                                    <div className="space-y-3 mt-6">
                                        <Button
                                            onClick={handleFinalSave}
                                            className="w-full bg-green-500 text-white hover:bg-green-600"
                                        >
                                            💾 Save Photo
                                        </Button>
                                    </div>
                                )}
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

export default function TakePhotoPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="px-4 py-8 max-w-md mx-auto">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
                        <div className="text-gray-500">Loading...</div>
                    </div>
                </div>
            </div>
        }>
            <TakePhotoContent />
        </Suspense>
    );
}
