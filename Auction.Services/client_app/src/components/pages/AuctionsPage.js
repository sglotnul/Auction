import React, {Fragment, useCallback, useContext, useEffect, useMemo} from 'react';
import useAuctions from "../../hooks/useAuctions";
import AuctionsCategoryFilter from "../AuctionsCategoryFilter";
import AuctionsFilter from "../../models/AuctionsFilter";
import {Link, useLocation, useNavigate} from "react-router-dom";
import AuctionCard from "../AuctionCard";
import ErrorContext from "../../contexts/ErrorContext";

const AuctionsPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const { addError } = useContext(ErrorContext);
	
	const filter = useMemo(() => AuctionsFilter.fromQueryString(location.search), [location, navigate]);
	
	const [auctions, count, auctionsLoading, errorCode] = useAuctions(filter);
	
	useEffect(() => {
		if (errorCode) {
			addError(errorCode);
		}
	}, [errorCode]);
	
	const onCategoryFilterChanged = useCallback(selectedCategories => {
		navigate(`?${filter.cloneWithUpdatedCategories(selectedCategories).getQueryString()}`, { replace: true });
	}, [filter]);

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
	if (loading) {
		return (
			<div className='auction-list'>
				<div className="loading-layout" style={{height: '130px'}}/>
				<div className="loading-layout" style={{height: '130px'}}/>
				<div className="loading-layout" style={{height: '130px'}}/>
			</div>
		);
	}

	return (
		<div className='auction-list'>
			{auctions.length > 0
				? auctions.map(
					(auction) => (
						<AuctionCard key={auction.id} auction={auction} />
					)
				)
				: 'Ничего не найдено.'
			}
		</div>
	);
};

const AuctionsCountView = ({count, loading}) => {
	if (loading) {
		return (
			<div className="auctions-count-bar">
				<div className="loading-layout" style={{ height: '30px' }} />
			</div>
		)
	}

	return (
		<div className="auctions-count-bar">
			Найдено {count} лотов
		</div>
	);
}

export default AuctionsPage;