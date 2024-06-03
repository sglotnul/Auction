import React from "react";
import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    Edit,
    SimpleForm,
    TextInput,
    DateInput,
    Create,
    EmailField
} from "react-admin";

const postFilters = [
    <TextInput label="Search" name="name" source="name" alwaysOn />,
];

export const ProfileList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" label="Идентификатор" />
            <TextField sortable={false} source="userId" label="Идентификатор пользователя"/>
            <EmailField sortable={false} source="email" label="Эл.почта"/>
            <TextField sortable={false} source="firstName" label="Имя"/>
            <TextField sortable={false} source="lastName" label="Фамилия"/>
            <DateField sortable={false} source="birthDate" label="Дата рождения"/>
            <TextField sortable={false} source="biography" label="О себе"/>
            <TextField sortable={false} source="education" label="Образование"/>
            <EditButton />
        </Datagrid>
    </List>
);

export const ProfileEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="userId" name="userId" label="Идентификатор пользователя"/>
            <TextInput source="email" name="email" label="Эл.почта"/>
            <TextInput source="firstName" name="firstName" label="Имя"/>
            <TextInput source="lastName" name="lastName" label="Фамилия"/>
            <DateInput source="birthDate" name="birthDate" label="Дата рождения"/>
            <TextInput source="biography" name="biography" label="О себе"/>
            <TextInput source="education"  name="education" label="Образование"/>
        </SimpleForm>
    </Edit>
);

export const ProfileCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="userId" name="userId" label="Идентификатор пользователя"/>
            <TextInput source="email" name="email" label="Эл.почта"/>
            <TextInput source="firstName" name="firstName" label="Имя"/>
            <TextInput source="lastName" name="lastName" label="Фамилия"/>
            <DateInput source="birthDate" name="birthDate" label="Дата рождения"/>
            <TextInput source="biography" name="biography" label="О себе"/>
            <TextInput source="education"  name="education" label="Образование"/>
        </SimpleForm>
    </Create>
);
