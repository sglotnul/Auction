import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import ErrorContext from "../../contexts/ErrorContext";
import AuthContext from "../../contexts/AuthContext";
import useCategories from "../../hooks/useCategories";
import ErrorCode from "../../models/ErrorCode";
import {Button, Checkbox, InputLabel, ListItemText, MenuItem, Select, TextField} from "@mui/material";
import useProfile from "../../hooks/useProfile";
import useAuction from "../../hooks/useAuction";

const EditAuctionPage = () => {
    const navigate = useNavigate();
    
    const { auctionId } = useParams();

    const { addError } = useContext(ErrorContext);
    const { user, loading: userLoading } = useContext(AuthContext);

    const [categories, categoriesLoading] = useCategories();
    const [initialAuction, loading, status, updateAuction] = useAuction(auctionId, !!user);

    const [tab, setTab] = useState(0);
    const [enabledTab, setEnabledTab] = useState(0);
    const [auctionFormData, setAuctionFormData] = useState(initialAuction);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        setSelectedCategories(initialAuction?.categories?.map(c => c.id) ?? []);
        setAuctionFormData(initialAuction);
    }, [initialAuction]);

    if (!!auctionFormData != !!initialAuction || loading || userLoading || categoriesLoading){
        return (
            <div className="default-container">
                ...Loading
            </div>
        );
    }

    if (!initialAuction) {
        switch (status) {
            case 403:
                navigate('/');
                break;
            case 404:
                return 'Nothing found';
            case 500:
                return 'Internal server error';
            default:
                return 'Unexpected error';
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch(`/api/auctions/${auctionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                ...auctionFormData,
                categories: selectedCategories
            })
        });

        const responseBody = await response.text();
        if (!response.ok) {
            addError(new ErrorCode(responseBody));
        }
        else {
            navigate(`/auctions/${responseBody}`)
        }
    };

    const changeTab = (newTab, enableNext = false) => (e) => {
        e.preventDefault();

        if (!enableNext && enabledTab < newTab) {
            return;
        }

        setEnabledTab(newTab);
        setTab(newTab);
    };

    const handleInputChange = (event) => {
        setAuctionFormData({ ...auctionFormData, [event.target.name]: event.target.value });
    };

    const handleCheckboxChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    return (
        <div className="default-container">
            <div className="tab-bar register-tabs">
                <div className={enabledTab >= 0 ? 'tab' : 'tab disabled'} onClick={changeTab(0)}>Title</div>
                <div className={enabledTab >= 1 ? 'tab' : 'tab disabled'} onClick={changeTab(1)}>Description</div>
                <div className={enabledTab >= 2 ? 'tab' : 'tab disabled'} onClick={changeTab(2)}>Details</div>
            </div>
            {tab === 0 && (
                <form onSubmit={changeTab(tab + 1, true)}>
                    <div className="default-input-container">
                        <TextField
                            label="Title"
                            name="title"
                            value={auctionFormData?.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Confirm
                    </Button>
                </form>
            )}
            {tab === 1 && (
                <form onSubmit={changeTab(tab + 1, true)}>
                    <div className="default-input-container">
                        <TextField
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={auctionFormData?.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Confirm
                    </Button>
                </form>
            )}
            {tab === 2 && (
                <form onSubmit={handleSubmit}>
                    <div className="default-input-container">
                        <InputLabel id="multiple-checkbox-label">Categories</InputLabel>
                        <Select
                            labelId="multiple-checkbox-label"
                            id="multiple-checkbox"
                            multiple
                            value={selectedCategories}
                            onChange={handleCheckboxChange}
                            renderValue={selected => selected.map(s => categories.find(c => c.id === s).name).join(', ') || 'Choose categories'}
                            fullWidth
                            displayEmpty
                            margin="normal"
                        >
                            {categories.map(category => (
                                <MenuItem key={category.id} value={category.id}>
                                    <Checkbox checked={selectedCategories.indexOf(category.id) > -1} />
                                    <ListItemText primary={category.name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Confirm
                    </Button>
                </form>
            )}
        </div>
    );
}

export default EditAuctionPage;