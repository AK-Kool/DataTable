// LwcState.js
import { LightningElement, track } from 'lwc';

const data = [
    { id: '1', name: 'Account A', amount: 1000, closeDate: '2024-04-22', selected: false },
    { id: '2', name: 'Account B', amount: 2000, closeDate: '2024-04-23', selected: false },
    { id: '3', name: 'Account C', amount: 3000, closeDate: '2024-04-24', selected: false },
    // Add more data as needed
];

const ITEMS_PER_PAGE = 2; // Change as needed

export default class LwcState extends LightningElement {
    @track data = data;
    @track masterSelected = false;
    @track currentPage = 1;
    @track pageSize = ITEMS_PER_PAGE;
    @track totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
    @track sortColumn;
    @track sortDirection;
    @track sortIndicator = '';
    @track selectedRows = [];

    columns = [
        { label: 'Name', fieldName: 'name', sortable: true },
        { label: 'Amount', fieldName: 'amount', type: 'currency', sortable: true },
        { label: 'Close Date', fieldName: 'closeDate', type: 'date', sortable: true }
        // Add more columns as needed
    ];

    connectedCallback() {
        this.updateSelectedRows();
    }

    renderedCallback() {
        console.log("Synthetic?", this.template.synthetic);
    }

    get paginatedData() {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.data.slice(start, end).sort((a, b) => this.sortData(a, b));
    }

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage === this.totalPages;
    }

    handleMasterChange(event) {
        const checked = event.target.checked;
        this.masterSelected = checked;
        this.data = this.data.map(row => {
            row.selected = checked;
            return row;
        });
        this.updateSelectedRows();
    }

    handleRowChange(event) {
        const rowId = event.target.dataset.rowId;
        const checked = event.target.checked;
        this.data = this.data.map(row => {
            if (row.id === rowId) {
                row.selected = checked;
            }
            return row;
        });
        this.masterSelected = this.data.every(row => row.selected);
        this.updateSelectedRows();
    }

    handleSave(event) {
        // Handle save logic here
    }

    handleSort(event) {
        const { fieldName: columnField, sortDirection } = event.detail;
        this.sortColumn = columnField;
        this.sortDirection = sortDirection;
        this.sortIndicator = sortDirection === 'asc' ? '↑' : '↓';
    }

    sortData(a, b) {
        const fieldA = a[this.sortColumn] || '';
        const fieldB = b[this.sortColumn] || '';
        let comparison = 0;
        if (fieldA > fieldB) {
            comparison = 1;
        } else if (fieldA < fieldB) {
            comparison = -1;
        }
        return this.sortDirection === 'asc' ? comparison : -comparison;
    }

    handlePrevious() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateSelectedRows();
        }
    }

    handleNext() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateSelectedRows();
        }
    }

    handlePageSizeChange(event) {
        this.pageSize = parseInt(event.target.value, 10);
        this.totalPages = Math.ceil(this.data.length / this.pageSize);
        if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
        }
        this.updateSelectedRows();
    }

    updateSelectedRows() {
        this.selectedRows = this.data.filter(row => row.selected);
    }
}