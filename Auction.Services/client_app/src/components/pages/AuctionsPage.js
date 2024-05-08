import React from 'react';
import DefaultPageLayout from "../DefaultPageLayout";
import useAuctions from "../../hooks/useAuctions";
import AuctionCard from "../AuctionCard";

const AuctionsPage = () => {
	const auctions = useAuctions(null);

	return (
		<DefaultPageLayout>
			<div className='auction-list'>
				{auctions.map(
					(auction) => <AuctionCard key={auction.id} auction={auction}/>
				)}
			</div>
		</DefaultPageLayout>
	);
};

export default AuctionsPage;