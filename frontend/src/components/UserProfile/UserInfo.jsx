
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { Copy, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { toast } from "sonner"
import { add } from "date-fns"

export function UserInfo() {
    const address = useSelector((state) => state.address.address);
    // const Bidnumber = 12;
    // const WinNumber = 3
    const [isHovered, setIsHovered] = useState(false)

    const [user, setUser] = useState({ status: false, points: null, auctionbid: null, auctionwin: null });


    const formatAddress = (addr) => {
        if (!addr) return ""
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address)
        toast.success("Your wallet address has been copied to clipboard")
    }


    const generateColor = (addr) => {
        if (!addr) return "#6366f1"
        const hash = addr.split("").reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc)
        }, 0)
        return `hsl(${hash % 360}, 70%, 60%)`
    }


    const getInitials = (addr) => {
        if (!addr) return "WA"
        return addr.substring(2, 4).toUpperCase()
    }


    useEffect(() => {
        async function getuserlogs() {
            if (window.ethereum) {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();

                    const contractAddress = ContractJson.contractAddress;
                    const contractABI = ContractJson.abi;
                    const contract = new ethers.Contract(
                        contractAddress,
                        contractABI,
                        provider
                    );
                    const points = await contract.returnUserCredibilty(address);
                    const auctionbids = await contract.returnUserAuctionBids(address);
                    const auctionwins = await contract.returnUserAuctionWins(address);
                    setUser({ status: true, points: points.toString(), auctionbid: auctionbids.toString(), auctionwin: auctionwins.toString() });

                } catch (error) {
                    console.error('User denied account access', error);
                    return null;
                }
            } else {
                alert('Please install Metamask');
                toast.error("metamask not connected");
                return null;
            }
        }

        setUser({ status: false, points: 0, auctionbid: 0, auctionwin: 0 });
        getuserlogs();
    }, [address]);



    return (
        <div className="flex w-full justify-center">
            <div className="space-y-4  ">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
                    <Avatar className="h-20 w-20 border-2 border-muted">
                        <AvatarImage src={`https://robohash.org/${address}?set=set4`} alt="User avatar" />
                        <AvatarFallback style={{ backgroundColor: generateColor(address) }}>{getInitials(address)}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center sm:items-start">
                        <h2 className="text-xl font-semibold">Wallet Account</h2>
                        <div
                            className="flex items-center gap-2 mt-1 group cursor-pointer"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={copyToClipboard}
                        >
                            <Badge variant="outline" className="px-2 py-1 font-mono">
                                {formatAddress(address)}
                            </Badge>
                            <Copy className={`h-4 w-4 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`} />
                        </div>
                        <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={copyToClipboard}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Address
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                                <a href={`https://sepolia.etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    View on Explorer
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <StatCard title="Total Bids" value={user.auctionbid} description="Across all auctions" />
                    <StatCard title="Auctions Won" value={user.auctionwin} description="Successfully won" />
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, description }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            </CardHeader>
            <CardContent >
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}


export function UserInfoShort() {
    const address = useSelector((state) => state.address.address);
    const [isHovered, setIsHovered] = useState(false)

    const formatAddress = (addr) => {
        if (!addr) return ""
        return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address)
        toast.success("Your wallet address has been copied to clipboard")
    }


    const generateColor = (addr) => {
        if (!addr) return "#6366f1"
        const hash = addr.split("").reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc)
        }, 0)
        return `hsl(${hash % 360}, 70%, 60%)`
    }


    const getInitials = (addr) => {
        if (!addr) return "WA"
        return addr.substring(2, 4).toUpperCase()
    }

    return (
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
            <Avatar className="h-10 w-10 border-2 border-muted">
                <AvatarImage src={`https://robohash.org/${address}?set=set4`} alt="User avatar" />
                <AvatarFallback style={{ backgroundColor: generateColor(address) }}>{getInitials(address)}</AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center sm:items-start">
                <h2 className="text-xl font-semibold">Wallet Account</h2>
                <div
                    className="flex items-center gap-2 mt-1 group cursor-pointer"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={copyToClipboard}
                >
                    <Badge variant="outline" className="px-2 py-1 font-mono">
                        {formatAddress(address)}
                    </Badge>
                    <Copy className={`h-4 w-4 ${isHovered ? "opacity-100" : "opacity-0"} transition-opacity`} />
                </div>
                <div className="flex gap-2 mt-3">

                    <Button size="sm" variant="outline" asChild>
                        <a href={`https://sepolia.etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View on Explorer
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}