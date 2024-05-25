import React from "react";
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    DateTimeInput,
    NumberInput,
    Create
} from "react-admin";

const postFilters = [
    <TextInput label="Search" name="title" source="title" alwaysOn />,
];

export const AuctionList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" />
            <TextField sortable={false} source="title" />
            <TextField sortable={false} source="description" />
            <TextField sortable={false} source="status" />
            <TextField sortable={false} source="startAt" />
            <TextField sortable={false} source="endAt" />
            <NumberField sortable={false} source="initialPrice" />
            <NumberField sortable={false} source="minDecrease" />
            <TextField sortable={false} source="userId" />
            <EditButton />
        </Datagrid>
    </List>
);

export const AuctionEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput required source="title" name="title"/>
            <TextInput required source="description" name="description"/>
            <NumberInput required source="status" name="status"/>
            <DateTimeInput  source="startAt" name="startAt"/>
            <DateTimeInput source="endAt" name="endAt" />
            <NumberInput required source="initialPrice" name="initialPrice" />
            <NumberInput required source="minDecrease" name="minDecrease" />
            <TextInput required source="userId" name="userId" />
        </SimpleForm>
    </Edit>
);

export const AuctionCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput required source="title" name="title" />
            <TextInput required source="description" name="description" />
            <NumberInput required source="status" name="status"/>
            <DateTimeInput source="startAt" name="startAt" />
            <DateTimeInput source="endAt" name="endAt" />
            <NumberInput required source="initialPrice" name="initialPrice" />
            <NumberInput required source="minDecrease" name="minDecrease" />
            <TextInput required source="userId" name="userId" />
        </SimpleForm>
    </Create>
);
