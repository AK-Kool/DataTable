// yourComponent.js
import { LightningElement, track } from 'lwc';

export default class TestData1 extends LightningElement {
    @track alphabetArray = [];
    @track selectedRecords = [];
    @track pagedData = [];
    @track currentPage = 1;
    @track pageSize = 10;
    @track totalRecords = 50; // Total number of records in your dataset

    connectedCallback() {
        // Generate array of alphabets for A to Z
        for (let i = 65; i <= 90; i++) {
            this.alphabetArray.push(String.fromCharCode(i));
        }
        // Initialize selected records
        this.selectedRecords = [];
        // Fetch initial data
        this.fetchData();
    }

    handleRowSelection(event) {
        this.selectedRecords = event.detail.selectedRows;
    }

    handlePageChange(event) {
        this.currentPage = parseInt(event.target.value, 10);
        this.fetchData();
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.fetchData();
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.fetchData();
        }
    }

    goToNextPage() {
        if (this.currentPage < Math.ceil(this.totalRecords / this.pageSize)) {
            this.currentPage++;
            this.fetchData();
        }
    }

    goToLastPage() {
        this.currentPage = Math.ceil(this.totalRecords / this.pageSize);
        this.fetchData();
    }

    navigateToAlphabet(event) {
        const selectedAlphabet = event.target.dataset.alphabet;
        console.log("Selected alphabet:", selectedAlphabet); // Log selected alphabet
        // Filter data based on the selected alphabet
        this.currentPage = 1; // Reset pagination to first page
        this.fetchData(selectedAlphabet);
    }

    fetchData(selectedAlphabet) {
        // Dummy data (replace with your actual data fetching logic)
        const allData = [];
        for (let i = 0; i < this.totalRecords; i++) {
            allData.push({ id: i + 1, name: 'Record ' + (i + 1), alphabet: String.fromCharCode(65 + Math.floor(i / 10)) });
        }

        // Filter data based on selected alphabet if provided
        let filteredData = allData;
        if (selectedAlphabet) {
            filteredData = allData.filter(record => record.name.charAt(0) === selectedAlphabet);
        }
        console.log("Filtered data:", filteredData); // Log filtered data

        // Pagination logic
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.pagedData = filteredData.slice(startIndex, endIndex);
    }

    get columns() {
        return [
            { label: 'Name', fieldName: 'name', type: 'text' },
            // Add more columns as needed
        ];
    }
}