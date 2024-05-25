import useConsultations from "../hooks/useConsultations";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import ErrorContext from "../contexts/ErrorContext";
import {Button, Checkbox, FormControlLabel} from "@mui/material";
import {Link} from "react-router-dom";
import {getUserFullName} from "../models/functions";
import ErrorCode from "../models/ErrorCode";

const UserConsultations = ({user, userName}) => {
    const {addError} = useContext(ErrorContext);
    
    const [consultations, loading, errorCode, reload] = useConsultations();

    const [checkedItems, setCheckedItems] = useState({
        started: true,
        completed: true,
    });

    const splittedConsultations = useMemo(() => {
        return consultations.reduce((acc, item, index) => {
            if (item.status === 1) {
                acc.started.push(item);
            }
            else {
                acc.completed.push(item);
            }

            if (index === consultations.length - 1) {
                const sortFunction = (a, b) => b.id - a.id ;

                acc.started = acc.started.sort(sortFunction);
                acc.completed = acc.completed.sort(sortFunction);
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
                        <ConsultationCard key={c.id} consultation={c} user={user}>
                            <div className="auction-card-button-row">
                                <CompleteButton consultationId={c.id} onAction={reload}/>
                                <CancelButton consultationId={c.id} onAction={reload}/>
                            </div>
                        </ConsultationCard>
                    )
                )}
                {checkedItems.completed && !!splittedConsultations.completed.length &&
                    <div className="auction-separator">Completed consultations</div>}
                {checkedItems.completed && splittedConsultations.completed.map(
                    (c) => (
                        <ConsultationCard key={c.id} consultation={c} user={user} />
                    )
                )}
            </div>
        </div>
    );
}

const ConsultationCard = ({consultation, user, children}) => {
    
    const getFullName = (u) => {
        return `${getUserFullName(u.userName, u.profile)}${u.userId === user.userId ? ' (You)' : ''}`
    }
    
    return (
        <div className="consultation-card">
            <Link to={`/auctions/${consultation.auction.id}`}><h2>{consultation.auction.title}</h2></Link>
            <Link to={`/profile/${consultation.consultant.userName}`}>{getFullName(consultation.consultant)} --- </Link>
            <Link to={`/profile/${consultation.student.userName}`}>{getFullName(consultation.student)}</Link>
            <h1>{consultation.bid.amount}</h1>
            {children}
        </div>
    )
}

const CancelButton = ({consultationId, onAction}) => {
    const {addError} = useContext(ErrorContext);

    const handleClick = useCallback(async (e) => {
        const response = await fetch(`/api/consultations/${consultationId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        if (!response.ok) {
            addError(new ErrorCode( await response.text()));
        }
        else {
            onAction();
        }
    }, []);

    return (<Button variant="contained" color="error" onClick={handleClick}>Cancel</Button>);
};

const CompleteButton = ({consultationId, onAction}) => {
    const {addError} = useContext(ErrorContext);

    const handleClick = useCallback(async (e) => {
        const response = await fetch(`/api/consultations/${consultationId}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            }
        });

        if (!response.ok) {
            addError(new ErrorCode( await response.text()));
        }
        else {
            onAction();
        }
    }, []);

    return (<Button variant="contained" color="success" onClick={handleClick}>Complete</Button>);
};

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