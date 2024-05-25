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
            <TextField sortable={false} source="id" />
            <TextField sortable={false} source="startAt" />
            <TextField sortable={false} source="status" />
            <TextField sortable={false} source="consultantId" />
            <TextField sortable={false} source="studentId" />
            <TextField sortable={false} source="auctionId" />
            <TextField sortable={false} source="bidId" />
            <EditButton />
        </Datagrid>
    </List>
);

export const ConsultationEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <DateTimeInput name="startAt" source="startAt"/>
            <NumberInput required source="status" name="status"/>
            <TextInput required source="consultantId" name="consultantId"/>
            <TextInput required source="studentId" name="studentId"/>
            <NumberInput required source="auctionId" name="auctionId"/>
            <NumberInput required source="bidId" name="bidId"/>
        </SimpleForm>
    </Edit>
);

export const ConsultationCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <DateTimeInput name="startAt" source="startAt"/>
            <NumberInput required source="status" name="status"/>
            <TextInput required source="consultantId" name="consultantId"/>
            <TextInput required source="studentId" name="studentId"/>
            <NumberInput required source="auctionId" name="auctionId"/>
            <NumberInput required source="bidId" name="bidId"/>
        </SimpleForm>
    </Create>
);
