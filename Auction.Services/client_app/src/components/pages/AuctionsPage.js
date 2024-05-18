import React, {Fragment, useCallback, useContext, useEffect, useState} from 'react';
import useAuctions from "../../hooks/useAuctions";
import AuctionsCategoryFilter from "../AuctionsCategoryFilter";
import AuctionsFilter from "../../models/AuctionsFilter";
import {Link} from "react-router-dom";
import AuctionCard from "../AuctionCard";
import AuthContext from "../../contexts/AuthContext";
import {Button} from "@mui/material";

const AuctionsPage = () => {
	const [filter, setFilter] = useState(createFilter());
	const [auctions, count, auctionsLoading] = useAuctions(filter);

	useEffect(() => {
		const newUrl = new URL(window.location);
		newUrl.search = filter.getQueryString();

		window.history.replaceState({}, '', newUrl);
	}, [filter]);
	
	const onCategoryFilterChanged = useCallback(selectedCategories => {
		setFilter(prev => prev.cloneWithUpdatedCategories(selectedCategories));
	}, []);

	return (
		<Fragment>
			<AuctionsCountView count={count} loading={auctionsLoading}/>
			<div className="auctions-page">
				<div className='filter-list'>
					<AuctionsCategoryFilter initialCategories={filter.categories} onSubmit={onCategoryFilterChanged}/>
				</div>
				<AuctionsList auctions={auctions} loading={auctionsLoading}/>
			</div>
		</Fragment>
	);
};

const AuctionsList = ({auctions, loading}) => {
	const { user, loading: userLoading } = useContext(AuthContext);
	
	if (loading || userLoading) {
		return (
			<div className='auction-list'>
				Loading...
			</div>
		);
	}
	
	const canBid = user?.role === 2 || user?.role === 3;

	return (
		<div className='auction-list'>
			{auctions.length > 0
				? auctions.map(
					(auction) => (
						<Link className="auction-card-outer-link" to={`/auctions/${auction.id}`}>
							<AuctionCard key={auction.id} auction={auction} showBidButton={canBid}>
								{canBid
									? <Button variant="contained">Bid</Button>
									: null
								}
							</AuctionCard>
						</Link>
					)
				)
				: 'Nothing found'
			}
		</div>
	);
};

const AuctionsCountView = ({count, loading}) => {
	if (loading) {
		return (
			<div className="auctions-count-bar">
				Loading...
			</div>
		)
	}

	return (
		<div className="auctions-count-bar">
			Found {count} auctions
		</div>
	);
}

function createFilter() {
	return AuctionsFilter.fromQueryString(window.location.search);
}

export default AuctionsPage;