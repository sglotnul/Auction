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
            <TextField sortable={false} label="Идентификатор" source="id" />
            <TextField sortable={false} label="Заголовок" source="title" />
            <TextField sortable={false} label="Описание" source="description" />
            <TextField sortable={false} label="Статус" source="status" />
            <TextField sortable={false} label="Время начала" source="startAt" />
            <TextField sortable={false} label="Время окончания" source="endAt" />
            <NumberField sortable={false} label="Начальная цена" source="initialPrice" />
            <NumberField sortable={false} label="Минимальное снижение" source="minDecrease" />
            <TextField sortable={false} label="Идентификатор пользователя" source="userId" />
            <EditButton />
        </Datagrid>
    </List>
);

export const AuctionEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput required source="title" label="Заголовок" name="title"/>
            <TextInput required source="description" label="Описание" name="description"/>
            <NumberInput required source="status" label="Статус" name="status"/>
            <DateTimeInput  source="startAt" label="Время начала" name="startAt"/>
            <DateTimeInput source="endAt" label="Время окончания" name="endAt" />
            <NumberInput required source="initialPrice" label="Начальная цена" name="initialPrice" />
            <NumberInput required source="minDecrease" label="Минимальное снижение" name="minDecrease" />
            <TextInput required source="userId" label="Идентификатор пользователя" name="userId" />
        </SimpleForm>
    </Edit>
);

export const AuctionCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput required source="title" label="Заголовок" name="title"/>
            <TextInput required source="description" label="Описание" name="description"/>
            <NumberInput required source="status" label="Статус" name="status"/>
            <DateTimeInput  source="startAt" label="Время начала" name="startAt"/>
            <DateTimeInput source="endAt" label="Время окончания" name="endAt" />
            <NumberInput required source="initialPrice" label="Начальная цена" name="initialPrice" />
            <NumberInput required source="minDecrease" label="Минимальное снижение" name="minDecrease" />
            <TextInput required source="userId" label="Идентификатор пользователя" name="userId" />
        </SimpleForm>
    </Create>
);
