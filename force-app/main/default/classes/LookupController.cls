public with sharing class LookupController {

    @AuraEnabled
    public static List<LookupSearchResult> searchLookupRecords(String searchTerm, List<String> selectedIds, String sObjectName, String field, String subField, Integer maxResults) {
        List<LookupSearchResult> results = new List<LookupSearchResult>();

        String strQuery = 'SELECT Id, ' + field + (String.isNotBlank(subField) ? ', ' + subField : '') + ' FROM ' + sObjectName;
        strQuery += ' WHERE ' + field + ' LIKE :searchTerm AND Id NOT IN :selectedIds ORDER BY ' + field + ' LIMIT :maxResults';

        List<sObject> searchResults = Database.query(strQuery);
        for (sObject sObj : searchResults) {
            results.add(createLookupSearchResult(sObj, field, subField, sObjectName));
        }

        return results;
    }

    @AuraEnabled
    public static LookupSearchResult getRecentlyCreatedRecord(String sObjectName, String recordId, String field, String subField) {
        LookupSearchResult result = new LookupSearchResult();
        String strQuery = 'SELECT Id, ' + field + (String.isNotBlank(subField) ? ', ' + subField : '') + ' FROM ' + sObjectName + ' WHERE Id = :recordId LIMIT 1';

        List<sObject> searchResults = Database.query(strQuery);
        if (!searchResults.isEmpty()) {
            result = createLookupSearchResult(searchResults[0], field, subField, sObjectName);
        }

        return result;
    }

    private static LookupSearchResult createLookupSearchResult(sObject sObj, String field, String subField, String sObjectName) {
        LookupSearchResult res = new LookupSearchResult();
        res.Id = (Id) sObj.get('Id');
        res.title = String.valueOf(sObj.get(field));
        res.subtitle = (String.isNotBlank(subField) && sObj.get(subField) != null) ? String.valueOf(sObj.get(subField)) : sObjectName;
        return res;
    }

    public class LookupSearchResult {
        @AuraEnabled public Id Id { get; set; }
        @AuraEnabled public String title { get; set; }
        @AuraEnabled public String subtitle { get; set; }
    }
}