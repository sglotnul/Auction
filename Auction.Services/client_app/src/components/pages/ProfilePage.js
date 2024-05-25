import {useLocation, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useMemo} from "react";
import AuthContext from "../../contexts/AuthContext";
import UserAuctions from "../UserAuctions";
import UserProfile from "../UserProfile";
import UserConsultations from "../UserConsultations";
import useUser from "../../hooks/useUser";
import ErrorContext from "../../contexts/ErrorContext";

const ProfilePage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const {userName} = useParams();
    
    const {user: currentUser, loading: currentUserLoading} = useContext(AuthContext);
    const {addError} = useContext(ErrorContext);
    
    const [user, loading, errorCode] = useUser(userName, !!userName);
    
    useEffect(() => {
        addError(errorCode);
    }, [errorCode]);
    
    const searchParams = new URLSearchParams(location.search);

    const tabParam = searchParams.get('tab');
    const tab = isNaN(tabParam) ? 0 : Number(tabParam);

    if (userName && loading || currentUserLoading) {
        return (
            <div className="default-container">
                <div className="loading-layout" style={{height: '60px'}}/>
            </div>
        );
    }
    
    if (!currentUser && !userName) {
        navigate('/');
        return;
    }

    const changeTab = (newTab) => (e) => {
        e.preventDefault();

        searchParams.set('tab', newTab);
        navigate(`?${searchParams.toString()}`, { replace: true })
    };

    const actualUser = user || currentUser;

    const isCurrentUser = !userName || currentUser?.userName.toLowerCase() === userName?.toLowerCase();
    const isStudent = actualUser?.role === 1 || actualUser?.role === 3

    return (
        <div className="default-container">
            <div className="tab-bar default-tabs">
                <div className={tab === 0 ? 'tab disabled' : 'tab'} onClick={changeTab(0)}>Profile</div>
                {isStudent && <div className={tab === 1 ? 'tab disabled' : 'tab'} onClick={changeTab(1)}>Auctions</div>}
                {isCurrentUser && <div className={tab === 2 ? 'tab disabled' : 'tab'} onClick={changeTab(2)}>Consultations</div>}
            </div>
            {tab === 0 && <UserProfile user={currentUser} userName={userName}/>}
            {isStudent && tab === 1 && <UserAuctions user={currentUser} userName={userName} />}
            {isCurrentUser && tab === 2 && <UserConsultations user={currentUser} userName={userName} />}
        </div>
    )
}

export default ProfilePage;