import useConsultations from "../hooks/useConsultations";
import React, {useContext, useEffect, useMemo, useState} from "react";
import ErrorContext from "../contexts/ErrorContext";
import {Checkbox, FormControlLabel} from "@mui/material";
import AuctionCard from "./AuctionCard";
import {Link} from "react-router-dom";
import {getUserFullName} from "../models/functions";

const UserConsultations = ({user, userName}) => {
    const {addError} = useContext(ErrorContext);
    
    const [consultations, loading, errorCode] = useConsultations();

    const [checkedItems, setCheckedItems] = useState({
        started: true,
        completed: true,
    });

    const splittedConsultations = useMemo(() => {
        return consultations.reduce((acc, item) => {
            if (item.status === 1) {
                acc.started.push(item);
            }
            else if (item.status === 2) {
                acc.completed.push(item);
            }
            return acc;
        }, { started: [], completed: [] });
    }, [consultations]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (loading) {
        return (
            <div className="profile-page-content">
                <div className="profile-auctions-container">
                    <div className="loading-layout" style={{height: '130px'}}/>
                    <div className="loading-layout" style={{height: '130px'}}/>
                    <div className="loading-layout" style={{height: '130px'}}/>
                </div>
            </div>
        );
    }
    
    if (errorCode) {
        return (
            <div className="profile-page-content">
                <div className="profile-auctions-container">
                    Error.
                </div>
            </div>
        );
    }

    const handleChange = (event) => {
        setCheckedItems({
            ...checkedItems,
            [event.target.name]: event.target.checked,
        });
    };

    return (
        <div className="profile-page-content">
            <div className="profile-auctions-container">
                <ConsultationStatusFilter started={checkedItems.started} completed={checkedItems.completed} onChange={handleChange}/>
                {!consultations.length && 'Nothing found'}
                {checkedItems.started && !!splittedConsultations.started.length && <div className="auction-separator active">Active consultations</div>}
                {checkedItems.started && splittedConsultations.started.map(
                    (c) => (
                        <ConsultationCard consultation={c} user={user} />
                    )
                )}
                {checkedItems.completed && !!splittedConsultations.completed.length && <div className="auction-separator">Completed consultations</div>}
                {checkedItems.completed && splittedConsultations.completed.map(
                    (c) => (
                        <ConsultationCard consultation={c} user={user} />
                    )
                )}
            </div>
        </div>
    );
}

const ConsultationCard = ({consultation, user}) => {
    
    const getFullName = (u) => {
        return `${getUserFullName(u.userName, u.profile)}${u.userId === user.userId ? ' (You)' : ''}`
    }
    
    return (
        <div className="consultation-card">
            <Link to={`/auctions/${consultation.auction.id}`}><h2>{consultation.auction.title}</h2></Link>
            <Link to={`/profile/${consultation.consultant.userName}`}>{getFullName(consultation.consultant)} --- </Link>
            <Link to={`/profile/${consultation.student.userName}`}>{getFullName(consultation.student)}</Link>
            <h1>{consultation.bid.amount}</h1>
        </div>
    )
}

const ConsultationStatusFilter = ({started, completed, onChange}) => {
    return (
        <div className="auction-type-filter-bar">
            <div className="auction-type-filter-item">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={started}
                            onChange={onChange}
                            name="started"
                        />
                    }
                    label="Active"
                />
            </div>
            <div className="auction-type-filter-item">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={completed}
                            onChange={onChange}
                            name="completed"
                        />
                    }
                    label="Completed"
                />
            </div>
        </div>
    )
}

export default UserConsultations;