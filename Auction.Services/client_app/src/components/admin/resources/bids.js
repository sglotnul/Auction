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
            <TextField sortable={false} label="Идентификатор" source="id" />
            <NumberField sortable={false} label="Сумма" source="amount" />
            <TextField sortable={false} label="Коментарий" source="comment" />
            <TextField sortable={false} label="Время" source="dateTime" />
            <TextField sortable={false} label="Идентификатор лота" source="auctionId" />
            <TextField sortable={false} label="Идентификатор пользователя" source="userId" />
            <EditButton />
        </Datagrid>
    </List>
);

export const BidEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <NumberInput required source="amount" name="amount" label="Сумма"/>
            <TextInput source="comment" name="comment" label="Коментарий"/>
            <DateTimeInput required source="dateTime" name="dateTime" label="Время"/>
            <NumberInput required source="auctionId" name="auctionId" label="Идентификатор лота"/>
            <TextInput required source="userId" name="userId" label="Идентификатор пользователя"/>
        </SimpleForm>
    </Edit>
);

export const BidCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <NumberInput required source="amount" name="amount" label="Сумма"/>
            <TextInput source="comment" name="comment" label="Коментарий"/>
            <DateTimeInput required source="dateTime" name="dateTime" label="Время"/>
            <NumberInput required source="auctionId" name="auctionId" label="Идентификатор лота"/>
            <TextInput required source="userId" name="userId" label="Идентификатор пользователя"/>
        </SimpleForm>
    </Create>
);
