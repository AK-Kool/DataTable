import { LightningElement, api, track, wire } from 'lwc';
import getRecords2 from '@salesforce/apex/ClassicViewInLwcController.getRecords2';

export default class DataTableLwc1 extends LightningElement {
    @api columns;
    @track records = [];
    @api selectedObj;
    @track visibleData;
    @track allRecords;

    @track selectedRows = [];
    @track selectedRecordDetails = [];
    @track currentPage;
    @track selectedRecords;

    handleData(e){
         

        this.visibleData = e.detail.visibleRec;
        this.currentPage = e.detail.currentPage;
    }


    connectedCallback(){
        getRecords2({
            objName: this.selectedObj,
            columns: this.columns
        }).then(data => {
            let lowerCased = data.map(item => {
                let mapped = {};
                for (let key in item) {
                    mapped[key.toLowerCase()] = item[key];
                }
                return mapped;
            });
            
            this.allRecords = lowerCased;
        }).catch(e => {
            console.log(JSON.stringify(e));
        });
    }

    @api
    columnsChanged(columns){
        getRecords2({
            objName: this.selectedObj,
            columns: columns
        }).then(data => {
            let lowerCased = data.map(item => {
                let mapped = {};
                for (let key in item) {
                    mapped[key.toLowerCase()] = item[key];
                }
                return mapped;
            });
            
            this.allRecords = lowerCased;
        }).catch(e => {
            console.log(JSON.stringify(e));
        });
    }

    handleRowSelection(event){
        //alert(JSON.stringify(event.detail.selectedRows));
        // check for current page
        this.selectedRecords = event.detail.selectedRows;
    }
}