import React, {useCallback, useState, useEffect, useContext} from 'react';
import useCategories from "../hooks/useCategories";
import {Button, Checkbox, FormControlLabel, FormGroup} from "@mui/material";
import ErrorContext from "../contexts/ErrorContext";

const AuctionsCategoryFilter = ({initialCategories, onSubmit}) => {
    const { addError } = useContext(ErrorContext);
    
    const [categories, loading, errorCode] = useCategories();
    
    const [selectedCategories, setSelectedCategories] = useState([...initialCategories]);

    const onButtonClick = useCallback(e => onSubmit(selectedCategories), [selectedCategories]);

    useEffect(() => {
        setSelectedCategories(initialCategories);
    }, [initialCategories]);

    useEffect(() => {
        if (errorCode) {
            addError(errorCode);
        }
    }, [errorCode]);
    
    if (loading) {
        return (
            <div className="category-filter-container">
                <div className="loading-layout" style={{height: '40px'}}/>
                <div className="loading-layout" style={{height: '40px'}}/>
                <div className="loading-layout" style={{height: '40px'}}/>
            </div>
        );
    }

    if (!categories) {
        return 'Error.'
    }

    const updateSelectedCategories = (categoryId) => (e) => {
        setSelectedCategories(prevSelected => {
            if (e.target.checked) {
                return [...prevSelected, categoryId];
            } 
            
            return prevSelected.filter(id => id !== categoryId);
        });
    };
    
    return (
        <div className="category-filter-container">
            {categories.map(
                (category) =>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedCategories.indexOf(category.id.toString()) > -1}
                                onChange={updateSelectedCategories(category.id.toString())}
                            />}
                        label={category.name}
                        key={category.id}
                    />
            )}
            <Button
                disabled={arraysHaveSameElements(initialCategories, selectedCategories)}
                variant="contained"
                fullWidth
                onClick={onButtonClick}
            >
                Submit
            </Button>
        </div>
    );
}

function arraysHaveSameElements(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    if (set1.size !== set2.size) return false;
    for (let item of set1) {
        if (!set2.has(item)) return false;
    }
    return true;
}

export default AuctionsCategoryFilter;