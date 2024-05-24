import React from "react";
import { List, Datagrid, TextField, DateField, EditButton, Edit, SimpleForm, TextInput, DateInput, Create } from "react-admin";

const postFilters = [
    <TextInput label="Search" name="name" source="name" alwaysOn />,
];

export const ProfileList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" />
            <TextField sortable={false} source="userId" />
            <TextField sortable={false} source="firstName" />
            <TextField sortable={false} source="lastName" />
            <DateField sortable={false} source="birthDate" />
            <TextField sortable={false} source="biography" />
            <TextField sortable={false} source="education" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ProfileEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="userId" name="userId" />
            <TextInput source="firstName" name="firstName" />
            <TextInput source="lastName" name="lastName" />
            <DateInput source="birthDate" name="birthDate" />
            <TextInput source="biography" name="biography" />
            <TextInput source="education"  name="education" />
        </SimpleForm>
    </Edit>
);

export const ProfileCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="userId" name="userId" />
            <TextInput source="firstName" name="firstName" />
            <TextInput source="lastName" name="lastName" />
            <DateInput source="birthDate" name="birthDate" />
            <TextInput source="biography" name="biography" />
            <TextInput source="education" name="education" />
        </SimpleForm>
    </Create>
);
