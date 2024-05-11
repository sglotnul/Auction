import React, {useCallback, useEffect, useState} from 'react';
import useAuctions from "../../hooks/useAuctions";
import DefaultPageLayout from "../DefaultPageLayout";
import AuctionsCategoryFilter from "../AuctionsCategoryFilter";
import AuctionsFilter from "../../models/AuctionsFilter";
import AuctionCard from "../AuctionCard";
import {Link} from "react-router-dom";

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
		<DefaultPageLayout>
			<AuctionsCountView count={count} loading={auctionsLoading}/>
			<div className="auctions-page">
				<div className='filter-list'>
					<AuctionsCategoryFilter initialCategories={filter.categories} onSubmit={onCategoryFilterChanged}/>
				</div>
				<AuctionsList auctions={auctions} loading={auctionsLoading}/>
			</div>
		</DefaultPageLayout>
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

const AuctionsList = ({auctions, loading}) => {
	if (loading) {
		return (
			<div className='auction-list'>
				Loading...
			</div>
		);
	}

	return (
		<div className='auction-list'>
			{auctions.length > 0
				? auctions.map(
					(auction) => (
						<Link className="auction-card-outer-link" to={`/auctions/${auction.id}`}>
							<AuctionCard key={auction.id} auction={auction}/>
						</Link>
					)
				)
				: "Nothing found"
			}
		</div>
	);
};

function createFilter() {
	return AuctionsFilter.fromQueryString(window.location.search);
}

export default AuctionsPage;