import React from "react";
import {
    List,
    Datagrid,
    TextField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    Create,
    SelectInput, PasswordInput
} from "react-admin";

const postFilters = [
    <TextInput label="Search" name="userName" source="userName" alwaysOn />,
];

export const UserList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" />
            <TextField sortable={false} source="userName" />
            <TextField sortable={false} source="role" />
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput required source="userName" name="userName" />
            <PasswordInput required source="password" name="password" />
            <SelectInput 
                source="role" 
                choices={[
                    { id: 1, name: 'Student' },
                    { id: 2, name: 'Consultant' },
                    { id: 3, name: 'Admin' },
                ]} 
            />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput required source="userName" name="userName" />
            <PasswordInput required source="password" name="password" />
            <SelectInput
                source="role"
                choices={[
                    { id: 1, name: 'Student' },
                    { id: 2, name: 'Consultant' },
                    { id: 2, name: 'Admin' },
                ]}
            />
        </SimpleForm>
    </Create>
);
