import { LightningElement, track, wire } from 'lwc';
import getSobjects from '@salesforce/apex/ClassicViewInLwcController.getSobjects';

export default class LightningRoot extends LightningElement {
    @track listViewRecords;
    @track columns = [];
    @track objectSelected;

    @wire(getSobjects)
    wiredCallback({error,data}){
        if(data){
            this.listViewRecords = data;
        } else if(error){
            alert('Error Occured.');
        }
    }

    connectedCallback(){
        
        this.template.addEventListener('btnclick', this.handleClick.bind(this));
        
    }

    handleClick(e){
        this.columns = [];
        e.detail.forEach(currentItem => {
            this.columns.push({
                label: currentItem.fName,
                fieldName: currentItem.fApiName
            });
        });
        this.template.querySelector('c-data-table-lwc1').columnsChanged(this.columns);
    }

    get columnStatus(){
        if(this.columns.length > 0){
            return true;
        }    
        return false;
    }

    handleSelectedObject(e){
        this.objectSelected = e.detail;
    }
}