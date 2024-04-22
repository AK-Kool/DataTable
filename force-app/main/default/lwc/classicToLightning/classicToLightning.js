import { LightningElement, track, wire, api } from 'lwc';
import getFields from '@salesforce/apex/ClassicViewInLwcController.getFields';
export default class ClassicToLightning extends LightningElement {
    @api listData;
    @track searchResultClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';

    // private variables
    _cancelBlur = false;
    _clonnedData;
    _objectsFields;
    objectFieldsArray;

    get getObjectFields(){
        return this.objectFieldsArray;
    }

    loading = false;
    flag1 = false;
    currentlySelected = '';

    get divClass1(){
        if(this.flag1)
            return 'slds-combobox__form-element slds-input-has-icon slds-input-has-icon_left-right';
        return 'slds-combobox__form-element slds-input-has-icon slds-input-has-icon_right';    
    }

    get openMultiselectCmp(){
        if(this.flag1)
            return true;
        return false;    
    }

    handleInput(e){
        if(e.target.value.length > 2){
            let abc = this.listData.filter(r => {
                
                if(r.Label.includes(e.target.value)){
                    return true;
                }
            });
            if(abc.length === undefined || abc.length === 0){
                abc = [];
                abc.push({ Label: 'No Object Found.'});
            }
            this.listData = [...abc];
            this.searchResultClass += ' slds-is-open';
        } 
        else if(e.target.value.length < 2){
            this.listData = [...this._clonnedData];
            this.searchResultClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
        }
    }

    handleBlur(e){
        if(this._cancelBlur){
            return;
        }
        this.searchResultClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    }

    handleInputClick(e){
        if(e.target.value.length > 2){
            this.searchResultClass += ' slds-is-open'; 
        }
        else if(e.target.value.length < 2)
            this.searchResultClass = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    }

    handleComboboxMouseDown(e){
        const mainButton = 0;
        if(e.button === mainButton){
            this._cancelBlur = true;
        }
    }

    handleComboboxMouseUp(){
        this._cancelBlur = false;
        this.template.querySelector('input').focus();
    }

    handleResultClick(e){
        const selectedId = e.currentTarget.dataset.recordid;
        this.currentlySelected = this.listData.find(r => r.QualifiedApiName === selectedId);

        this.dispatchEvent(new CustomEvent('objselection', {
            detail: this.currentlySelected.QualifiedApiName
        }));

        // make a callout
        getFields({
            objName: this.currentlySelected.Label
        }).then(result => {
            this._objectsFields = result;
            this.objectFieldsArray = [];
            this._objectsFields.forEach(currentItem => {
                this.objectFieldsArray.push(currentItem.fName);
            });
        }).catch(e => {
            alert(JSON.stringify(e));
        });
        // ---------------
        this.flag1 = true;
        this.listData = [...this._clonnedData];
    }

    handleClear(){
        this.flag1 = false;
        this.dispatchEvent(new CustomEvent('btnclick', {
            detail: []
        }));
    }

    connectedCallback() {
        this._clonnedData = [...this.listData];
    }
}