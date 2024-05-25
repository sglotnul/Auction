import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext} from "react";
import AuthContext from "../../contexts/AuthContext";
import UserAuctions from "../UserAuctions";
import UserProfile from "../UserProfile";
import UserConsultations from "../UserConsultations";

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const {userName} = useParams();
    
    const {user, loading} = useContext(AuthContext);

    const tabParam = searchParams.get('tab');
    const tab = isNaN(tabParam) ? 0 : Number(tabParam);

    if (loading) {
        return (
            <div className="default-container">
                <div className="loading-layout" style={{height: '60px'}}/>
            </div>
        );
    }

    const changeTab = (newTab) => (e) => {
        e.preventDefault();

        searchParams.set('tab', newTab);
        navigate(`?${searchParams.toString()}`, { replace: true })
    };

    return (
        <div className="default-container">
            <div className="tab-bar default-tabs">
                <div className={tab === 0 ? 'tab disabled' : 'tab'} onClick={changeTab(0)}>Profile</div>
                <div className={tab === 1 ? 'tab disabled' : 'tab'} onClick={changeTab(1)}>Auctions</div>
                <div className={tab === 2 ? 'tab disabled' : 'tab'} onClick={changeTab(2)}>Consultations</div>
            </div>
            {tab === 0 && <UserProfile user={user} userName={userName}/>}
            {tab === 1 && <UserAuctions user={user} userName={userName} />}
            {tab === 2 && <UserConsultations user={user} userName={userName} />}
        </div>
    )
}

export default ProfilePage;