import { LightningElement, api, wire } from 'lwc';
import { getRelatedListRecords } from 'lightning/uiRelatedListApi';

const columns = [
    { label: 'Name', fieldName: 'Name' }
];
export default class DataTableLwc extends LightningElement {
    @api recordId;
    error;
    records = [];
    columns = columns;

    @wire(getRelatedListRecords, {
        parentRecordId: '$recordId',
        relatedListId: 'Contacts', // child relationship name
        fields: ['Contact.Id', 'Contact.Name']
    })
    wiredCallback({ error, data }){
        //alert(this.recordId);
        if(error){
            this.error = error;
            this.records = undefined;
        } else if(data){
            this.records.push(data.records[0].fields);
            alert(JSON.stringify(this.records[0]));
            this.error = undefined;
        }
    }
}