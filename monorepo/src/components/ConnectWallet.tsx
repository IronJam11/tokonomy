import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet } from "lucide-react";

export default function ConnectWallet() {
 
    return (
    <div className="text-center py-12">
         <div className="mb-4">
            <Wallet className="mx-auto h-16 w-16 text-blue-500" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Connect your wallet</h3>
        <p className="text-muted-foreground mb-6">
            Connect your wallet to start creating your coin
        </p>
        <ConnectButton />
    </div>);
}