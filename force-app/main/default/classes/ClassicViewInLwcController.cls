public class ClassicViewInLwcController 
{
	@AuraEnabled(cacheable=true)
    public static List<EntityDefinition> getSobjects(){
        return [SELECT Id,Label, QualifiedApiName 
                FROM EntityDefinition order by QualifiedApiName asc];
    }
    @AuraEnabled
    public static List<FieldWrapper> getFields(String objName){
        Map <String,Schema.SObjectType> gd = Schema.getGlobalDescribe();
        Schema.SObjectType sobjType = gd.get(objName);
        Schema.DescribeSObjectResult r = sobjType.getDescribe();
        Map<String, Schema.SObjectField> MapofField = r.fields.getMap();
        
        List<FieldWrapper> lstWrapper = new List<FieldWrapper>();
        
        for(String fieldName : MapofField.keySet()) 
        {
            Schema.SObjectField field = MapofField.get(fieldName);
            Schema.DescribeFieldResult F = field.getDescribe();
            System.debug('Field Name: '+ fieldName + ' And ' + F.getLabel());
            FieldWrapper fw = new FieldWrapper();
            fw.fName = F.getLabel();
            fw.fApiName = fieldName;
            lstWrapper.add(fw);
        }
        return lstWrapper;
    }
    
    public class FieldWrapper{
        @auraEnabled public String fName;
        @auraenabled public String fApiName;
    }
    
    public class ColumnWrapper{
        @auraenabled public String label;
        @auraenabled public String fieldName;
    }

    @AuraEnabled
    public static List<Object> getRecords2(String objName, List<Object> columns){
        List<ColumnWrapper> lstCw = (List<ColumnWrapper>) JSON.deserialize(JSON.serialize(columns), List<ColumnWrapper>.class);
        
        String queryFields = '';

        for(Integer i = 0; i < lstCw.size(); i++){
            if(i == 0)
                queryFields += lstCw.get(i).fieldName;
            else
                queryFields += ', ' + lstCw.get(i).fieldName;
        }
        System.debug('------ : ' + queryFields);

        String query = 'SELECT Id, ' + queryFields + ' FROM ' + objName + ' LIMIT 50000';
        return Database.query(query);
    }
}