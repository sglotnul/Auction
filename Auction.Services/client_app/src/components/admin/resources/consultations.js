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
    DateInput,
    NumberInput,
    Create,
    ReferenceInput, DateTimeInput
} from "react-admin";

const postFilters = [
    <NumberInput label="Search" name="adminId" source="adminId" alwaysOn />,
];

export const ConsultationList = (props) => (
    <List filters={postFilters} {...props}>
        <Datagrid rowClick="edit">
            <TextField sortable={false} source="id" label="Идентификатор"/>
            <TextField sortable={false} source="startAt" label="Время начала"/>
            <TextField sortable={false} source="status" label="Статус"/>
            <TextField sortable={false} source="consultantId" label="Идентификатор консультанта"/>
            <TextField sortable={false} source="studentId" label="Идентификатор студента" />
            <TextField sortable={false} source="auctionId" label="Идентификатор лота"/>
            <TextField sortable={false} source="bidId" label="Идентификатор ставки" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ConsultationEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <DateTimeInput name="startAt" source="startAt" label="Время начала"/>
            <NumberInput required source="status" name="status" label="Статус"/>
            <TextInput required source="consultantId" name="consultantId" label="Идентификатор консультанта"/>
            <TextInput required source="studentId" name="studentId" label="Идентификатор студента"/>
            <NumberInput required source="auctionId" name="auctionId" label="Идентификатор лота"/>
            <NumberInput required source="bidId" name="bidId" label="Идентификатор ставки"/>
        </SimpleForm>
    </Edit>
);

export const ConsultationCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <DateTimeInput name="startAt" source="startAt" label="Время начала"/>
            <NumberInput required source="status" name="status" label="Статус"/>
            <TextInput required source="consultantId" name="consultantId" label="Идентификатор консультанта"/>
            <TextInput required source="studentId" name="studentId" label="Идентификатор студента"/>
            <NumberInput required source="auctionId" name="auctionId" label="Идентификатор лота"/>
            <NumberInput required source="bidId" name="bidId" label="Идентификатор ставки"/>
        </SimpleForm>
    </Create>
);
