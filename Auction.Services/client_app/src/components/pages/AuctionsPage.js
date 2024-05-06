import React, {useEffect, useState, useContext, Fragment} from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from "react-router-dom";

const AuctionsPage = () => {
	const navigate = useNavigate();
	const { user } = useContext(AuthContext);
	const [auctions, setAuctions] = useState([]);

	useEffect(() => {
		const fetchAuctions = async () => {
			if (!user) {
				navigate('/login');
				
				console.log("fuck");
				
				return;
			}
			
			const response = await fetch('api/auctions');
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			setAuctions(data);
		};

		fetchAuctions();
	}, [user, navigate]);

	return (
		<Fragment>
			<h1>{user.Name} - {user.Id} - {user.Role}</h1>
			{auctions.map((auction) => (
				<div key={auction.Id}>
					<h2>{auction.Id} - {auction.StudentUserId}</h2>
					{/* здесь должна быть логика отображения и отправки ставок */}
				</div>
			))}
		</Fragment>
	);
};

export default AuctionsPage;