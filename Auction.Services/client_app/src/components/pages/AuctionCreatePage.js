import React, {useContext, useEffect, useState} from "react";
import AuthContext from "../../contexts/AuthContext";
import {useNavigate} from "react-router-dom";
import ErrorContext from "../../contexts/ErrorContext";
import {Button, Checkbox, InputLabel, ListItemText, MenuItem, Select, TextField} from "@mui/material";
import useCategories from "../../hooks/useCategories";
import ErrorCode from "../../models/ErrorCode";

const AuctionCreatePage = () => {
    const navigate = useNavigate();

    const { addError } = useContext(ErrorContext);
    const { user, loading: userLoading } = useContext(AuthContext);
    
    const [categories, categoriesLoading, errorCode] = useCategories();

    const [tab, setTab] = useState(0);
    const [enabledTab, setEnabledTab] = useState(0);
    const [auctionFormData, setAuctionFormData] = useState({
        initialPrice: 1,
        minDecrease: 1,
    });
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);

    if (userLoading || categoriesLoading){
        return (
            <div className="default-container">
                <div className="loading-layout" style={{height: '130px'}}/>
            </div>
        );
    }

    if (!user || user.role !== 1 && user.role !== 3)
        navigate('/');
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const response = await fetch('/api/auctions/create', {
            method: 'POST',
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
            navigate('/profile?tab=1');
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

    const handleMoneyChange = (event) => {
        const newValue = parseFloat(event.target.value);
        if (!isNaN(newValue) && newValue >= 1)
            setAuctionFormData(prev => { return { ...prev, [event.target.name]: newValue }});
    };

    const handleCheckboxChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    return (
        <div className="default-container">
            <div className="tab-bar default-tabs">
                <div className={enabledTab >= 0 ? 'tab' : 'tab disabled'} onClick={changeTab(0)}>Заголовок</div>
                <div className={enabledTab >= 1 ? 'tab' : 'tab disabled'} onClick={changeTab(1)}>Описание</div>
                <div className={enabledTab >= 2 ? 'tab' : 'tab disabled'} onClick={changeTab(2)}>Подробности</div>
            </div>
            {tab === 0 && (
                <form onSubmit={changeTab(tab + 1, true)}>
                    <div className="default-input-container">
                        <TextField
                            label="Заголовок"
                            name="title"
                            value={auctionFormData.title}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Подтвердить
                    </Button>
                </form>
            )}
            {tab === 1 && (
                <form onSubmit={changeTab(tab + 1, true)}>
                    <div className="default-input-container">
                        <TextField
                            label="Описание"
                            name="description"
                            multiline
                            rows={4}
                            value={auctionFormData.description}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            required
                        />
                    </div>
                    <Button type="submit" variant="contained" fullWidth>
                        Подтвердить
                    </Button>
                </form>
            )}
            {tab === 2 && (
                <form onSubmit={handleSubmit}>
                    <div className="default-input-container">
                        <TextField
                            label="Начальная цена"
                            name="initialPrice"
                            value={(auctionFormData.initialPrice).toFixed(2)}
                            onChange={handleMoneyChange}
                            margin="normal"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Минимальное снижение"
                            name="minDecrease"
                            value={(auctionFormData.minDecrease).toFixed(2)}
                            onChange={handleMoneyChange}
                            margin="normal"
                            fullWidth
                            required
                        />
                        <InputLabel id="multiple-checkbox-label">Категории</InputLabel>
                        <Select
                            labelId="multiple-checkbox-label"
                            id="multiple-checkbox"
                            multiple
                            value={selectedCategories}
                            onChange={handleCheckboxChange}
                            renderValue={selected => selected.map(s => categories.find(c => c.id === s)?.name).join(', ') || 'Выберите категории'}
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
                        Подтвердить
                    </Button>
                </form>
            )}
        </div>
    );
}

export default AuctionCreatePage;