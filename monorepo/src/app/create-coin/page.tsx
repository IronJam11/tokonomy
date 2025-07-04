"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from "wagmi";
import { setApiKey } from "@zoralabs/coins-sdk";
import { parseEther } from "viem";
import { base, baseSepolia } from "viem/chains";
import { 
  DeployCurrency, 
  InitialPurchaseCurrency, 
  createMetadataBuilder, 
  createZoraUploaderForCreator,
  createCoinCall,
  getCoinCreateFromLogs,
  validateMetadataURIContent
} from "@zoralabs/coins-sdk";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Upload, Wallet, CheckCircle, XCircle, Info, AlertCircle, ExternalLink } from "lucide-react";
import InfoCards from "@/components/InfoCards";
import ConnectWallet from "@/components/ConnectWallet";

// Set your Zora API key
const ZORA_API_KEY = process.env.NEXT_PUBLIC_ZORA_API_KEY || "zora_api_d66c8d3743429a5ea3f9bdc60d905a6b130a670b34d4f33519d33baf8a76c5b8";

export default function CreateCoinPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currency, setCurrency] = useState<DeployCurrency>(DeployCurrency.ZORA);
  const [initialPurchaseAmount, setInitialPurchaseAmount] = useState("");
  const [isPreparingCoin, setIsPreparingCoin] = useState(false);
  const [contractCallParams, setContractCallParams] = useState<any>(null);
  const [metadataUri, setMetadataUri] = useState<string>("");
  const [deployedCoinAddress, setDeployedCoinAddress] = useState<string>("");

  // Set API key
  setApiKey(ZORA_API_KEY);

  // Contract simulation and writing
  const { data: simulation, error: simulationError } = useSimulateContract(
    contractCallParams ? {
      ...contractCallParams,
      account: address,
    } : undefined
  );

  const { 
    writeContract, 
    isPending: isWritePending, 
    isSuccess: isWriteSuccess, 
    isError: isWriteError, 
    error: writeError, 
    data: txHash 
  } = useWriteContract();

  // Wait for transaction receipt
  const { 
    data: receipt, 
    isLoading: isReceiptLoading, 
    isSuccess: isReceiptSuccess 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Handle transaction success
  useEffect(() => {
    if (isReceiptSuccess && receipt) {
      try {
        const coinDeployment = getCoinCreateFromLogs(receipt);
        if (coinDeployment?.coin) {
          setDeployedCoinAddress(coinDeployment.coin);
          alert("🎉 Coin created successfully!");
          console.log(`Your coin has been deployed at ${coinDeployment.coin}`);
          toast.success("🎉 Coin created successfully!", {
            description: `Your coin has been deployed at ${coinDeployment.coin}`,
            action: {
              label: "View on Explorer",
              onClick: () => window.open(`https://basescan.org/address/${coinDeployment.coin}`, '_blank'),
            },
            duration: 10000,
          });
          
          // Reset form
          resetForm();
        }
      } catch (error) {
        console.error("Error extracting coin address:", error);
        toast.success("Coin created successfully!", {
          description: `Transaction: ${txHash}`,
          action: {
            label: "View Transaction",
            onClick: () => window.open(`https://basescan.org/tx/${txHash}`, '_blank'),
          },
        });
        resetForm();
      }
    }
  }, [isReceiptSuccess, receipt, txHash]);

  // Handle write errors
  useEffect(() => {
    if (isWriteError && writeError) {
      toast.error("❌ Transaction failed", {
        description: writeError.message,
        duration: 8000,
      });
    }
  }, [isWriteError, writeError]);

  // Handle simulation errors
  useEffect(() => {
    if (simulationError && contractCallParams) {
      toast.error("⚠️ Transaction simulation failed", {
        description: "Please check your parameters and try again",
        duration: 5000,
      });
    }
  }, [simulationError, contractCallParams]);

  // Handle pending states
  useEffect(() => {
    if (isWritePending) {
      toast.loading("📝 Confirm transaction in wallet", {
        description: "Please approve the transaction to create your coin",
        duration: 30000,
      });
    }
  }, [isWritePending]);

  useEffect(() => {
    if (isReceiptLoading) {
      toast.loading("⏳ Creating your coin...", {
        description: "Transaction confirmed, waiting for deployment",
        duration: 60000,
      });
    }
  }, [isReceiptLoading]);

  const resetForm = () => {
    setName("");
    setSymbol("");
    setDescription("");
    setImage(null);
    setInitialPurchaseAmount("");
    setContractCallParams(null);
    setMetadataUri("");
    setDeployedCoinAddress("");
  };

  const handlePrepareCoin = async () => {
    
    if (!isConnected || !address) {
      toast.error("🔒 Wallet not connected", {
        description: "Please connect your wallet to continue",
      });
      return;
    }

    if (!name || !symbol || !description || !image) {
      toast.error("📝 Missing required fields", {
        description: "Please fill in all required fields",
      });
      return;
    }

    if (!ZORA_API_KEY) {
      toast.error("🔑 API key missing", {
        description: "Zora API key is required for metadata upload",
      });
      return;
    }

    try {
      setIsPreparingCoin(true);
      
      toast.loading("📤 Uploading metadata to IPFS...", {
        description: "This may take a moment",
        duration: 30000,
      });

      // Create metadata uploader
      const uploader = createZoraUploaderForCreator(address as `0x${string}`);

      // Create and upload metadata
      const { createMetadataParameters } = await createMetadataBuilder()
        .withName(name)
        .withSymbol(symbol)
        .withDescription(description)
        .withImage(image)
        .upload(uploader);

      // Validate metadata URI
      if (createMetadataParameters.uri) {
        await validateMetadataURIContent(createMetadataParameters.uri);
        setMetadataUri(createMetadataParameters.uri);
      }

      const coinParams = {
        ...createMetadataParameters,
        name,
        symbol,
        payoutRecipient: address as `0x${string}`,
        chainId: chainId || base.id,
        currency,
        ...(initialPurchaseAmount && {
          initialPurchase: {
            currency: InitialPurchaseCurrency.ETH,
            amount: parseEther(initialPurchaseAmount),
          },
        }),
      };

      const callParams = await createCoinCall(coinParams);
      setContractCallParams(callParams);
      alert("✅ Coin prepared successfully!");

      toast.success("✅ Coin prepared successfully!", {
        description: "Ready to deploy on Base blockchain",
        action: {
          label: "View Metadata",
          onClick: () => metadataUri && window.open(metadataUri, '_blank'),
        },
      });

    } catch (err) {
      console.error("Error preparing coin creation:", err);
      toast.error("❌ Preparation failed", {
        description: err instanceof Error ? err.message : "An unknown error occurred",
        duration: 8000,
      });
    } finally {
      setIsPreparingCoin(false);
    }
  };

  const handleCreateCoin = () => {
    if (simulation?.request) {
      writeContract(simulation.request);
    } else {
      toast.error("⚠️ Transaction not ready", {
        description: "Please prepare the coin creation first",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("📁 File too large", {
          description: "Please select an image smaller than 5MB",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error("🖼️ Invalid file type", {
          description: "Please select a valid image file",
        });
        return;
      }

      setImage(file);
      toast.success("🖼️ Image selected", {
        description: `${file.name} ready for upload`,
      });
    }
  };

  const isWrongNetwork = chainId && chainId !== baseSepolia.id;

  return (
    <div className="">
      <div className="max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl ">
              Create Your Coin
            </CardTitle>
            <CardDescription className="text-lg">
              Deploy your own ERC20 token on Base via Zora Protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isConnected ? (
                <ConnectWallet />
            ) : (
              <>
                {isWrongNetwork && (
                  <Alert className="mb-6 border-orange-200 bg-orange-50">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      Please switch to Base network to create your coin. Current network may not be supported.
                    </AlertDescription>
                  </Alert>
                )}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        Coin Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Awesome Coin"
                        required
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symbol">
                        Symbol <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="symbol"
                        type="text"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                        placeholder="MAC"
                        required
                        maxLength={10}
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your coin's purpose and utility..."
                      required
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Coin Image <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="image"
                      type="file"
                      onChange={handleImageChange}
                      accept="image/*"
                      required
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                    {image && (
                      <div className="mt-3 flex items-center space-x-3">
                        <img 
                          src={URL.createObjectURL(image)} 
                          alt="Preview" 
                          className="h-20 w-20 object-cover rounded-lg border-2 border-blue-200"
                        />
                        <div className="text-sm text-muted-foreground">
                          <p className="font-medium">{image.name}</p>
                          <p>{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Trading Currency</Label>
                      <Select value={currency.toString()} onValueChange={(value) => setCurrency(Number(value) as DeployCurrency)}>
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={DeployCurrency.ZORA.toString()}>
                            <div className="flex items-center space-x-2">
                              <span>ZORA</span>
                              <span className="text-xs text-muted-foreground">(Recommended)</span>
                            </div>
                          </SelectItem>
                          <SelectItem value={DeployCurrency.ETH.toString()}>ETH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="initialPurchase">Initial Purchase (ETH)</Label>
                      <Input
                        id="initialPurchase"
                        type="number"
                        value={initialPurchaseAmount}
                        onChange={(e) => setInitialPurchaseAmount(e.target.value)}
                        placeholder="0.01"
                        min="0"
                        step="0.001"
                        className="focus:ring-2 focus:ring-blue-500"
                      />
                      <p className="text-xs text-muted-foreground">
                        Optional: Seeds initial liquidity
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={handlePrepareCoin}
                      disabled={isPreparingCoin || !isConnected || !!isWrongNetwork}
                      className="flex-1 "
                    >
                      {isPreparingCoin ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Preparing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Prepare Coin
                        </>
                      )}
                    </Button>

                    {contractCallParams && simulation && (
                      <Button
                        type="button"
                        onClick={handleCreateCoin}
                        disabled={isWritePending || isReceiptLoading || !simulation.request}
                        className="flex-1"
                      >
                        {isWritePending || isReceiptLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isWritePending ? "Confirming..." : "Creating..."}
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Create Coin
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  {simulationError && contractCallParams && (
                    <Alert className="border-red-200 bg-red-50">
                      <XCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        Transaction simulation failed. Please check your parameters.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <InfoCards />

      </div>
    </div>
  );
}