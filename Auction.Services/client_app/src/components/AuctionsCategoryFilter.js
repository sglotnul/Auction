import React, {useCallback, useState, Fragment, useEffect} from 'react';
import useCategories from "../hooks/useCategories";
import {Button, Checkbox, FormControlLabel, FormGroup} from "@mui/material";

const AuctionsCategoryFilter = ({initialCategories, onSubmit}) => {
    const [categories, loading] = useCategories();
    const [selectedCategories, setSelectedCategories] = useState([...initialCategories]);

    const onButtonClick = useCallback(e => onSubmit(selectedCategories), [selectedCategories]);
    
    if (loading) {
        return 'Loading...';
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
        <>
            <FormGroup>
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
            </FormGroup>
            <Button
                disabled={arraysHaveSameElements(initialCategories, selectedCategories)}
                variant="contained"
                fullWidth
                onClick={onButtonClick}
            >
                Submit
            </Button>
        </>
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