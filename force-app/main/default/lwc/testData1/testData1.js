import { LightningElement, track, api } from 'lwc';
import getRecords2 from '@salesforce/apex/ClassicViewInLwcController.getRecords2';

export default class TestData1 extends LightningElement {
    @track alphabetArray = [];
    @track selectedRecords = [];
    @track pagedData = [];
    @track currentPage = 1;
    @track pageSize = 10;
    @track totalRecords = 0;
    @track sortBy;
    @track sortDirection;
    @track selectedAlphabet;

    @api columns;
    @api selectedObj;

    preselectedContactRow = [];
    otherSelectedRows = [];
    deselectedRecordIds = [];
    selectedRecCount = 0;

    @api
    columnsChanged(columns){
        //alert(JSON.stringify(columns));
        this.columns = columns;
        this.fetchData();
    }    

    connectedCallback() {
        //alert(JSON.stringify(this.columns));
        for (let i = 65; i <= 90; i++) {
            this.alphabetArray.push(String.fromCharCode(i));
        }
        
        this.selectedRecords = [];
        
        this.fetchData();
    }

    handleRowSelection(event) {
        this.selectedRecords = event.detail.selectedRows;
        this.setSelectedRecordCount(this.selectedRecords.length);
        this.selectedRecords.forEach(row => {
            this.preselectedContactRow.push(row.id);
        });
        switch (event.detail.config.action){
            case 'rowDeselect':
                if(this.otherSelectedRows){
                    this.deselectedRecordIds.push(event.detail.config.value);
                }
                break;
            default:
                break;
        }
    }

    handlePageChange(event) {
        this.currentPage = parseInt(event.target.value, 10);
        this.updatePagedData();
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.syncSelectDeselectRecords();
        this.updatePagedData();
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.syncSelectDeselectRecords();
            this.updatePagedData();
        }
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.syncSelectDeselectRecords();
            this.updatePagedData();
        }
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.syncSelectDeselectRecords();
        this.updatePagedData();
    }

    syncSelectDeselectRecords(){
        if(JSON.stringify(this.otherSelectedRows) !== JSON.stringify(this.preselectedContactRow)){
                if(this.preselectedContactRow.length > 0){
                    this.setSelectedRecordCount(this.preselectedContactRow.length);
                    this.preselectedContactRow.forEach(row => {
                        const existindVal = this.otherSelectedRows.find(r => r === row);
                        const deselectedRec = this.deselectedRecordIds.find(r1 => r1 === row);
                        if(!existindVal && !deselectedRec)
                            this.otherSelectedRows.push(row);
                        else if(deselectedRec)
                            this.otherSelectedRows = this.otherSelectedRows.filter(r => r !== deselectedRec);    
                    });
                }
            }
            this.deselectedRecordIds = [];
    }

    navigateToAlphabet(event) {
        const selectedAlphabet = event.target.dataset.alphabet;
        if (selectedAlphabet) {   
            this.selectedAlphabet = selectedAlphabet;
            this.filterData();
        } else {
            this.selectedAlphabet = null;
            this.resetData();
        }
    }

    handleSort(event) {
        this.sortBy = event.detail.fieldName;
        this.sortDirection = event.detail.sortDirection;
        this.updatePagedData();
    }

    filterData() {
        let filteredData = [...this.lowerCased];
         
        if (this.selectedAlphabet) {
            filteredData = this.filterDataByAlphabet(filteredData, this.selectedAlphabet);
        }
        this.totalRecords = filteredData.length;
        this.currentPage = 1;
        this.updatePagedData();
    }

    filterDataByAlphabet(data, selectedAlphabet) {
        if(selectedAlphabet === 'ALL'){
            return data;
        } else {
            const firstColumnName = this.columns[0].fieldName;
            let filledData = data.map(item => {
                const value = item[firstColumnName.toLowerCase()];
                if (!value) {
                    item[firstColumnName.toLowerCase()] = 'Not Available';
                }
                return item;
            });
            let filteredData = filledData.filter(item => item[firstColumnName.toLowerCase()].startsWith(selectedAlphabet));
            return filteredData;
        }
    }

    resetData() {
        this.totalRecords = this.lowerCased.length;
        this.currentPage = 1;
        this.updatePagedData();
    }

    fetchData() {
        
        getRecords2({
            objName: this.selectedObj,
            columns: this.columns
        }).then(data => {
            //alert(JSON.stringify(data));
            this.lowerCased = data.map(item => {
                let mapped = {};
                for (let key in item) {
                    mapped[key.toLowerCase()] = item[key];
                }
                return mapped;
            });
            this.totalRecords = this.lowerCased.length;
            this.updatePagedData();
        }).catch(e => {
            console.log(JSON.stringify(e));
        });
    }

    updatePagedData() {
        let filteredData = [...this.lowerCased];
        if (this.selectedAlphabet) {
            filteredData = this.filterDataByAlphabet(filteredData, this.selectedAlphabet);
        }

        let sortedData = [...filteredData];
        if (this.sortBy) {
            sortedData = this.sortData(sortedData, this.sortBy, this.sortDirection);
        }

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pagedData = sortedData.slice(startIndex, endIndex);

        this.preselectedContactRow = [];
        this.pagedData.forEach(row => {
            const checkExisting = this.otherSelectedRows.find(r => r === row.id);
            if(checkExisting)
                this.preselectedContactRow.push(checkExisting);
        });

        //alert(JSON.stringify(this.preselectedContactRow));
    }

    sortData(data, sortBy, sortDirection) {
        let sortedData = [...data];
        // Sort data based on the sort direction and column
        sortedData.sort((a, b) => {
            let aValue = a[sortBy] || '';
            let bValue = b[sortBy] || '';
            aValue = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
            bValue = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;
            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            } else if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            } else {
                return 0;
            }
        });
        return sortedData;
    }

    get totalPages() {
        return Math.ceil(this.totalRecords / this.pageSize);
    }

    setSelectedRecordCount(val){
        this.selectedRecCount = val;
    }
    get getSelectedRecordCount(){
        return this.selectedRecCount;
    }
}