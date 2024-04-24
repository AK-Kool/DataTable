// data-table.js
import { LightningElement, track } from "lwc";

const columns = [
  { label: "Contact name", fieldName: "Name", type: "text" },
  { label: "Contact email", fieldName: "Email", type: "text" }
];

const contacts = [
  {
    id: "0065w00002BRfvJAAT",
    Name: "Roy Goodman",
    Email: "roy@roy.com"
  },
  {
    id: "0065w00002BRupJAAT",
    Name: "Tracy Smith",
    Email: "tracy@tracy.com"
  },
  {
    id: "0065w00002BRrpJAAT",
    Name: "New Smith",
    Email: "tracy@tracy.com"
  }
];

export default class DataTable extends LightningElement {
  @track columns = columns;
  @track contacts = contacts;
  @track selectedIds = new Set(["0065w00002BRfvJAAT"]); // Using set to store selected record IDs
  @track pageSize = 2;
  @track pageIndex = 0;

  // Handler for selecting/deselecting a record
  handleRecordSelect(event) {
    const selectedRows = event.detail.selectedRows.map(row => row.id);
    const newSelectedIds = new Set(selectedRows);
    this.selectedIds = new Set([...this.selectedIds, ...newSelectedIds]);
  }

  // Getter for paginated contacts
  get paginatedContacts() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.contacts.slice(startIndex, endIndex);
  }

  // Getter for checking if previous button should be disabled
  get isPreviousDisabled() {
    return this.pageIndex === 0;
  }

  // Getter for checking if next button should be disabled
  get isNextDisabled() {
    return this.paginatedContacts.length < this.pageSize;
  }

  // Handler for navigating to the next page
  handleNextPage() {
    this.pageIndex++;
  }

  // Handler for navigating to the previous page
  handlePreviousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
    }
  }
}