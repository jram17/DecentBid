import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AuctionCard from '../ListAuction/AuctionCard';
import { Card } from '../ui/card';
import axios from "axios";

export function UserOwningAuctions() {
    const [isLoading, setIsLoading] = useState(false);
    const [auctions, setAuctions] = useState([]);
    const [error, setError] = useState('');
    const address = useSelector((state) => state.address.address);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`/auctions/own-auctions/${address}`);
                setAuctions(response.data);
            } catch (error) {
                setError(error.message);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetails();
    }, [address])
    if (!auctions || auctions.length === 0) {
        return (
            <div className="w-full flex justify-center">
                <Card>
                    <h1>No Auctions Found</h1>
                </Card>
            </div>

        );
    }
    if (isLoading) return <div className="w-full flex justify-center">Loading ......</div>;
    if (error) return <div className="w-full flex justify-center">Error: {error}</div>;
    return (
        <div className="w-full flex justify-center">
            <div className="grid grid-cols-3 gap-10 ">
                {auctions.map((auction, index) => (
                    <AuctionCard auction={auction} key={index} />
                ))}
            </div>
        </div>
    );
}