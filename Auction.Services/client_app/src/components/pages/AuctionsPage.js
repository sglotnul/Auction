import React, {useCallback, useEffect, useState} from 'react';
import useAuctions from "../../hooks/useAuctions";
import DefaultPageLayout from "../DefaultPageLayout";
import AuctionsCategoryFilter from "../AuctionsCategoryFilter";
import AuctionsFilter from "../../models/AuctionsFilter";
import AuctionCard from "../AuctionCard";

const AuctionsPage = () => {
	const [filter, setFilter] = useState(createFilter());

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
			<AuctionsCountView filter={filter}/>
			<div className="auctions-page">
				<div className='filter-list'>
					<AuctionsCategoryFilter initialCategories={filter.categories} onSubmit={onCategoryFilterChanged}/>
				</div>
				<AuctionsList filter={filter}/>
			</div>
		</DefaultPageLayout>
	);
};

const AuctionsCountView = ({filter}) => {
	const [_ , count, loading] = useAuctions(filter);

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

const AuctionsList = ({filter}) => {
	const [auctions, _, loading] = useAuctions(filter);

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
					(auction) => <AuctionCard key={auction.id} auction={auction}/>
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