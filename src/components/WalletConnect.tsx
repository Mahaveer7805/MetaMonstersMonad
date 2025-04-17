
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { connectWallet, disconnectWallet, getConnectionState } from '@/lib/web3';
import { truncateAddress } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function WalletConnect() {
  const [address, setAddress] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [networkName, setNetworkName] = useState("Unknown");
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  // Initialize from current connection state
  useEffect(() => {
    const state = getConnectionState();
    setAddress(state.address);
    setIsConnected(state.isConnected);

    // Set network name based on chainId
    if (state.chainId === 10143) {
      setNetworkName("Monad");
      setIsCorrectNetwork(true);
    } else if (state.isConnected) {
      setNetworkName(`Chain: ${state.chainId}`);
      setIsCorrectNetwork(false);
    }
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await connectWallet();
      if (success) {
        const state = getConnectionState();
        setAddress(state.address);
        setIsConnected(true);

        if (state.chainId === 10143) {
          setNetworkName("Monad");
          setIsCorrectNetwork(true);
        } else {
          setNetworkName(`Chain: ${state.chainId}`);
          setIsCorrectNetwork(false);

          // Display manual instructions if unable to switch automatically
          toast.warning("Please switch to Monad network in your wallet");
          toast.info("Network Name: Monad Testnet, RPC URL: https://rpc.testnet.monad.xyz/, Chain ID: 10143, Symbol: MONAD", {
            duration: 10000,
          });
        }
      } else {
        // Connection was successful but possibly on wrong network
        const state = getConnectionState();
        if (state.isConnected) {
          setAddress(state.address);
          setIsConnected(true);
          setNetworkName(`Chain: ${state.chainId}`);
          setIsCorrectNetwork(state.chainId === 10143);
        }
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setAddress("");
    setIsConnected(false);
    setNetworkName("Unknown");
  };

  const handleSwitchNetwork = () => {
    toast.info("Manual Monad Network Setup", {
      description: "Network Name: Monad Testnet, RPC URL: https://rpc.testnet.monad.xyz/, Chain ID: 10143, Symbol: MONAD",
      duration: 10000,
    });
  };

  return (
    <div className="flex items-center gap-2">
      {!isConnected ? (
        <Button
          className="bg-game-primary hover:bg-game-secondary text-white"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect Monad Wallet"}
        </Button>
      ) : (
        <>
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md border ${isCorrectNetwork ? 'bg-game-background border-game-secondary' : 'bg-amber-900/30 border-amber-500'}`}>
            <span className="text-sm font-medium">{truncateAddress(address)}</span>
            <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${isCorrectNetwork ? 'bg-purple-700 text-white' : 'bg-amber-500 text-black'}`}>
              {networkName}
            </span>

            {!isCorrectNetwork && (
              <Button
                variant="ghost"
                size="sm"
                className="px-1 h-6 text-amber-200 hover:text-amber-100"
                onClick={handleSwitchNetwork}
              >
                <AlertCircle className="h-4 w-4 mr-1" />
                <span className="text-xs">Switch</span>
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDisconnect}
            className="border-game-secondary text-game-secondary hover:bg-game-secondary/10"
          >
            Disconnect
          </Button>
        </>
      )}
    </div>
  );
}
