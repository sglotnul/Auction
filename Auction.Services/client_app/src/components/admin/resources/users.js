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
            <TextField sortable={false} source="id" label="Идентификатор"/>
            <TextField sortable={false} source="userName" label="Имя пользователя"/>
            <TextField sortable={false} source="role" label="Роль"/>
            <EditButton />
        </Datagrid>
    </List>
);

export const UserEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="userName" name="userName" label="Имя пользователя"/>
            <SelectInput
                source="role"
                label="Роль"
                choices={[
                    { id: 1, name: 'Студент' },
                    { id: 2, name: 'Консультант' },
                    { id: 3, name: 'Администратор' },
                ]} 
            />
        </SimpleForm>
    </Edit>
);

export const UserCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput required source="userName" name="userName" label="Имя пользователя"/>
            <PasswordInput required source="password" name="password" label="Пароль"/>
            <SelectInput
                required
                source="role"
                label="Роль"
                choices={[
                    { id: 1, name: 'Студент' },
                    { id: 2, name: 'Консультант' },
                    { id: 3, name: 'Администратор' },
                ]}
            />
        </SimpleForm>
    </Create>
);
