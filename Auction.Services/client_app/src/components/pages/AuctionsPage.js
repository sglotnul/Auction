import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const AuctionsPage = () => {
	const { user } = useContext(AuthContext);
	const [auctions, setAuctions] = useState([]);

	useEffect(() => {
		let response = fetch("api/profile/");
		response
			.then(r => r.json())
			.then(a => setAuctions(a));
	}, []);

	return (
		<div>
			{auctions.map((auction) => (
				<div key={auction.Id}>
					<h2>{auction.Id} - {auction.StudentUserId}</h2>
					{/* здесь должна быть логика отображения и отправки ставок */}
				</div>
			))}
		</div>
	);
};

export default AuctionsPage;