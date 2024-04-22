// ShortestPathLWC.js
import { LightningElement, wire } from 'lwc';
import getTasksForCurrentUser from '@salesforce/apex/JefGeoAcctCreatorController.getTasksForCurrentUser';

export default class ShortestPathLWC extends LightningElement {

    shortestPathAccounts;

    connectedCallback()
    {
        this.loadShortestPath();
    }

    loadShortestPath() {
        
            getTasksForCurrentUser()
                .then(result => {
                    this.shortestPathAccounts = result;
                })
                .catch(error => {
                    console.error('Error loading shortest path accounts', error);
            });
        
    }
}