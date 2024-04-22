import { LightningElement, wire, track, api } from 'lwc';
export default class DataTablePagination extends LightningElement 
{
    @api 
    set allRecords(records){
        this.totalRecords = records;
        this.totalPages = Math.ceil(records.length/this.recordSize);
        this.updateRecords();
    }

    get allRecords(){
        return this.totalRecords;
    }

    @track totalRecords;
    @track visibleRecords;
    @track recordSize = 5;
    @track totalPages;
    @track currentPage = 1;

    previousHandler(){
        if(this.currentPage > 1){
            this.currentPage -= 1;
            this.updateRecords();
        }
    }

    get disablePrevious(){
        return this.currentPage <= 1;
    }

    nextHandler(){
        if(this.currentPage < this.totalPages){
            this.currentPage += 1;
            this.updateRecords();
        }
    }

    get disableNext(){
        return this.currentPage >= this.totalPages;
    }

    updateRecords(){
        const start = (this.currentPage - 1) * this.recordSize;
        const end = this.currentPage * this.recordSize;
        this.visibleRecords = this.totalRecords.slice(start, end);

        this.dispatchEvent(new CustomEvent(
            'dataload', 
            {
                detail: {
                    visibleRec: this.visibleRecords,
                    currentPage: this.currentPage
                }
            }
        ));
    }
}