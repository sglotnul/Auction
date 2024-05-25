import * as React from "react";
import {Admin, Resource} from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";

import { AuctionList, AuctionEdit, AuctionCreate } from "./resources/auctions";
import { BidList, BidEdit, BidCreate } from "./resources/bids";
import { CategoryList, CategoryEdit, CategoryCreate } from "./resources/categories";
import { ProfileList, ProfileEdit, ProfileCreate } from "./resources/profiles";
import { UserList, UserEdit, UserCreate } from "./resources/users";
import {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import AuthContext from "../../contexts/AuthContext";

const dataProvider = simpleRestProvider("/api/admin");

const AdminPage = () => {
    const navigate = useNavigate();

    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return (
            <div className="default-container">
                <div className="loading-layout" style={{height: '130px'}}></div>
            </div>
        )
    }
    
    if (user?.role !== 3) {
        navigate('/');
        return;
    }
    
    return (
        <Admin basename="/admin" dataProvider={dataProvider} loginPage="/login">
            <Resource name="auctions" list={AuctionList} edit={AuctionEdit} create={AuctionCreate}/>
            <Resource name="bids" list={BidList} edit={BidEdit} create={BidCreate}/>
            <Resource name="categories" list={CategoryList} edit={CategoryEdit} create={CategoryCreate}/>
            <Resource name="profiles" list={ProfileList} edit={ProfileEdit} create={ProfileCreate}/>
            <Resource name="users" list={UserList} edit={UserEdit} create={UserCreate}/>
        </Admin>
    );
}

export default AdminPage;