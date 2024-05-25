import React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    NumberField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    DateTimeInput,
    NumberInput,
    Create,
} from "react-admin";

const postFilters = [
    <TextInput label="Search" name="userId" source="userId" alwaysOn />,
];

export const BidList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" />
            <NumberField sortable={false} source="amount" />
            <TextField sortable={false} source="comment" />
            <TextField sortable={false} source="dateTime" />
            <TextField sortable={false} source="auctionId" />
            <TextField sortable={false} source="userId" />
            <EditButton />
        </Datagrid>
    </List>
);

export const BidEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <NumberInput required source="amount" name="amount"/>
            <TextInput source="comment" name="comment" />
            <DateTimeInput required source="dateTime" name="dateTime" />
            <NumberInput required source="auctionId" name="auctionId" />
            <TextInput required source="userId" name="userId" />
        </SimpleForm>
    </Edit>
);

export const BidCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <NumberInput required source="amount" name="amount"/>
            <TextInput source="comment" name="comment" />
            <DateTimeInput required source="dateTime" name="dateTime" />
            <NumberInput required source="auctionId" name="auctionId" />
            <TextInput required source="userId" name="userId" />
        </SimpleForm>
    </Create>
);
