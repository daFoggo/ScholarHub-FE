import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, Coins, Copy, Plus, Wallet } from "lucide-react";
import { useState } from "react";
import { useCreateWallet } from "../hooks/use-personal";

interface WalletCardProps {
  walletAddress?: string | null;
  sptBalance?: number;
  className?: string;
}

export const WalletCard = ({
  walletAddress,
  sptBalance = 0,
  className,
}: WalletCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const { mutate: createWallet, isPending: isCreating } = useCreateWallet();

  // if (!walletAddress) return null; // Removed check to show card even if empty

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="size-5 text-primary" />
          Blockchain Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!walletAddress ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
            <div className="p-3 rounded-full bg-muted">
              <Wallet className="size-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">No Wallet Connected</p>
              <p className="text-sm text-muted-foreground">
                Create a wallet to receive rewards and use premium features.
              </p>
            </div>
            <Button onClick={() => createWallet()} disabled={isCreating}>
              {isCreating ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Create Wallet
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            {/* SPT Balance */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                  <Coins className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    SPT Balance
                  </p>
                  <p className="text-xl font-bold">
                    {sptBalance.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Address */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 text-sm font-mono rounded bg-muted truncate">
                  {formatAddress(walletAddress)}
                </code>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={handleCopy}
                      >
                        {copied ? (
                          <Check className="size-4 text-green-500" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy address"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
