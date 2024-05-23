﻿import React from "react";
import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create } from "react-admin";

const postFilters = [
    <TextInput label="Search" name="name" source="name" alwaysOn />,
];

export const CategoryList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" />
            <TextField sortable={false} source="name" />
            <EditButton />
        </Datagrid>
    </List>
);

export const CategoryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput required source="name" name="name"/>
        </SimpleForm>
    </Edit>
);

export const CategoryCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput required source="name" name="name"/>
        </SimpleForm>
    </Create>
);
