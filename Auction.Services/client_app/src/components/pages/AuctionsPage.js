import React, {Fragment, useCallback, useContext, useEffect, useMemo, useState} from 'react';
import useAuctions from "../../hooks/useAuctions";
import AuctionsCategoryFilter from "../AuctionsCategoryFilter";
import AuctionsFilter from "../../models/AuctionsFilter";
import {Link} from "react-router-dom";
import AuctionCard from "../AuctionCard";
import AuthContext from "../../contexts/AuthContext";
import {Button} from "@mui/material";
import ErrorContext from "../../contexts/ErrorContext";

const AuctionsPage = () => {
	const { user } = useContext(AuthContext);
	const { addError } = useContext(ErrorContext);
	
	const [filter, setFilter] = useState(AuctionsFilter.fromQueryString(window.location.search));
	
	const [auctions, count, auctionsLoading, errorCode] = useAuctions(filter);
	
	useEffect(() => {
		setFilter(filter.clone());
	}, [user]);

	useEffect(() => {
		const newUrl = new URL(window.location);
		newUrl.search = filter.getQueryString();

		window.history.replaceState({}, '', newUrl);
	}, [filter]);
	
	useEffect(() => {
		if (errorCode) {
			addError(errorCode);
		}
	}, [errorCode]);
	
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

	return (
		<div className='auction-list'>
			{auctions.length > 0
				? auctions.map(
					(auction) => (
						<Link className="auction-card-outer-link" to={`/auctions/${auction.id}`}>
							<AuctionCard key={auction.id} auction={auction} />
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

export default AuctionsPage;