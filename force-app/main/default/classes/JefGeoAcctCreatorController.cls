// @AuraEnabled(cacheable=true)
    // public static List<sObject> getRecords(String searchKey, String sortBy, String sortByType, String sortOrder, Integer pageSize, 
    //                                           String after, String lastId, String before, String firstId, boolean first, boolean last, Integer lastPageSize,
    //                                       	List<Object> columns, String objectLabel) {
                                                
        
    //     List<ColumnWrapper> lstCw = (List<ColumnWrapper>) JSON.deserialize(JSON.serialize(columns), List<ColumnWrapper>.class);
    //     System.debug('----- :' + objectLabel);
    //     String queryFields = '';

    //     for(Integer i = 0; i < lstCw.size(); i++){
    //         if(i == 0)
    //             queryFields += lstCw.get(i).fieldName;
    //         else
    //             queryFields += ', ' + lstCw.get(i).fieldName;
    //     }
    //     System.debug('------ : ' + queryFields);
        
    //     List<sObject> records = null;
    //     String query = 'SELECT Id, ' + queryFields + ' FROM ' + objectLabel;
    //     if(searchKey != '') {
    //         String textFilter = '%'+searchKey+'%';
    //         query = buildSearchTerm(query, searchKey);
    //     }
        
    //     String orderQuery = 'ORDER BY ' + sortBy + ' ' + sortOrder + ', Id '+ sortOrder;
    //     if((after != '' && !last) || (before != '' && !first)) {
    //         String param = 'textParam';
    //         String operator = sortOrder == 'asc' ? (after != '' ? '>' : '<'): (after != '' ? '<' : '>');
    //         String textParam = after != '' ? after : before;
    //         if(sortByType == 'Number') {
    //             Integer numberParam = Integer.valueOf(textParam);
    //             param = 'numberParam';
    //         } else if(sortByType == 'Date') {
    //             Date dateParam = Date.valueOf(textParam);
    //             param = 'dateParam';
    //         } 
    //         query += 'and (' + sortBy + operator + ':'+param+' OR ('+sortBy+'=:'+param+' AND Id'+ operator +':lastId)) ';
    //     }
                                                  
    //     if(last || (before != '' && !first)) {
    //         orderQuery = 'Order BY ' + sortBy + ' ' + (sortOrder == 'asc' ? 'desc': 'asc') + ', Id '+ (sortOrder == 'asc' ? 'desc': 'asc'); 
    //     }
    //     records = Database.query(query + orderQuery + ' LIMIT ' + (last && lastPageSize > 0 ? lastPageSize : pageSize));
                                                  
    //     if((before != '' && !first) || last) {
    //         List<Invoice__c> tmp = new List<Invoice__c>();
    //         for(Integer i=records.size()-1; i>=0; i--) {
    //             tmp.add(records.get(i));
    //         }
    //         records = tmp;
    //     } 
    //     return records;
		
    //     return null;
    // }
    
    // @AuraEnabled(cacheable=true)
    // public static Integer getCount(Id accountId, String searchKey) { 
    //     String query = 'SELECT Count() FROM Invoice__c Where Account__c=:accountId ';
    //     if(searchKey != '') {
    //         String textFilter = '%'+searchKey+'%';
    //         query = buildSearchTerm(query, searchKey);
    //     }  
    //     return Database.countQuery(query);
    // }
    
    // private static String buildSearchTerm(String query, String searchKey) {
    //     query += 'and ( Name Like :textFilter or Status__c Like :textFilter ';
    //     if(searchKey.isNumeric()) {
    //         query += ' or CALENDAR_YEAR(Invoice_Date__c)='+searchKey+' or CALENDAR_MONTH(Invoice_Date__c)='+searchKey+' or DAY_IN_MONTH(Invoice_Date__c)='+searchKey;  
    //         query += ' or CALENDAR_YEAR(Due_Date__c)='+searchKey+' or CALENDAR_MONTH(Due_Date__c)='+searchKey+' or DAY_IN_MONTH(Due_Date__c)='+searchKey; 
    //         query += ' or Total__c='+searchKey+' ) '; 
    //     } else {
    //         Pattern p = Pattern.compile('(\\d{4})-(\\d{1,2})(-(\\d{1,2}))?');
    //         Matcher pm = p.matcher(searchKey);
    //         if(pm.matches()) {                
    //             query += ' or (CALENDAR_YEAR(Invoice_Date__c)='+pm.group(1)+' and CALENDAR_MONTH(Invoice_Date__c)='+pm.group(2)+' '+
    //                   (pm.group(3) != null ? ' and DAY_IN_MONTH(Invoice_Date__c)='+pm.group(3).replace('-', '')+' ' : '')+') ';  
    //             query += ' or (CALENDAR_YEAR(Due_Date__c)='+pm.group(1)+' and CALENDAR_MONTH(Due_Date__c)='+pm.group(2)+' '+
    //                   (pm.group(3) != null ? ' and DAY_IN_MONTH(Due_Date__c)='+pm.group(3).replace('-', '')+' ' : '')+') '; 
    //         }
    //         query += ') ';
    //     }
    //     return query;
    // }

public class JefGeoAcctCreatorController {
    public class AccountDistance implements Comparable {
        public String accountId;
        public Double distance;

        public AccountDistance(String accountId, Double distance) {
            this.accountId = accountId;
            this.distance = distance;
        }

        public Integer compareTo(Object other) {
            AccountDistance otherDistance = (AccountDistance)other;
            if (this.distance < otherDistance.distance) {
                return -1;
            } else if (this.distance > otherDistance.distance) {
                return 1;
            } else {
                return 0;
            }
        }
    }

    // Convert Decimal to Radians
    public static Double toRadians(Decimal degrees) {
        return degrees.doubleValue() * 0.017453292519943295; // Approximately equal to Math.PI / 180.0
    }

    public static List<String> getNeighborIds(String accountId, Map<String, Account> accountMap) {
        
        List<String> neighborIds = new List<String>();
        for (String id : accountMap.keySet()) {
            if (!id.equals(accountId)) {
                neighborIds.add(id);
            }
        }
        return neighborIds;
    }

    public static Double getDistance(String accountId, String neighborId, Map<String, Account> accountMap) {
        
        Double earthRadius = 6371.0; 
        Double lat1 = toRadians(accountMap.get(accountId).JefGeoLocation__Latitude__s);
        Double lon1 = toRadians(accountMap.get(accountId).JefGeoLocation__Longitude__s);
        Double lat2 = toRadians(accountMap.get(neighborId).JefGeoLocation__Latitude__s);
        Double lon2 = toRadians(accountMap.get(neighborId).JefGeoLocation__Longitude__s);

        Double dLat = lat2 - lat1;
        Double dLon = lon2 - lon1;

        Double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(lat1) * Math.cos(lat2) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);

        Double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    }
	
    public static List<Account> findShortestPath(List<Account> accountList) {
        Map<String, Account> accountMap = new Map<String, Account>();

        
        for (Account acc : accountList) {
            accountMap.put(acc.Id, acc);
        }

        
        Map<String, Double> distanceMap = new Map<String, Double>();
        
        
        List<AccountDistance> priorityQueue = new List<AccountDistance>();

        
        for (String accountId : accountMap.keySet()) {
            if (accountId == accountList[0].Id) {
                distanceMap.put(accountId, Math.pow(10, 300) / Math.pow(10, -300)); // Use a large positive number to represent infinity
            } else {
                distanceMap.put(accountId, Math.pow(10, 300) / Math.pow(10, -300));
            }
            priorityQueue.add(new AccountDistance(accountId, distanceMap.get(accountId)));
        }

        
        while (!priorityQueue.isEmpty()) {
            priorityQueue.sort(); 

            AccountDistance currentAccountDistance = priorityQueue.remove(0);

            for (String neighborId : getNeighborIds(currentAccountDistance.accountId, accountMap)) {
                Double newDistance = distanceMap.get(currentAccountDistance.accountId) + getDistance(currentAccountDistance.accountId, neighborId, accountMap);
                
                if (newDistance < distanceMap.get(neighborId)) {
                    distanceMap.put(neighborId, newDistance);

                   
                    for (AccountDistance ad : priorityQueue) {
                        if (ad.accountId == neighborId) {
                            ad.distance = newDistance;
                            break;
                        }
                    }
                }
            }
        }

        
        List<Account> orderedAccounts = new List<Account>();
        for (String accountId : distanceMap.keySet()) {
            orderedAccounts.add(accountMap.get(accountId));
        }

        return orderedAccounts;
    }
    
    // ------------------------------------------------
    @AuraEnabled
    public static List<Account> createAccountsFromRequest(String searchTerm, Integer limiter) {
        
        String apiUrl = 'https://api-adresse.data.gouv.fr/search/?q=' + EncodingUtil.urlEncode(searchTerm, 'UTF-8') + '&limit=' + String.valueOf(limiter);

        HttpRequest request = new HttpRequest();
        request.setEndpoint(apiUrl);
        request.setMethod('GET');

        HttpResponse response = new Http().send(request);

       
        List<Account> createdAccounts = new List<Account>();

        if (response.getStatusCode() == 200) { // Assuming a successful response code
            Map<String, Object> jsonResponse = (Map<String, Object>)JSON.deserializeUntyped(response.getBody());

            
            List<Object> features = (List<Object>)jsonResponse.get('features');
            for (Object feature : features) {
                Map<String, Object> featureMap = (Map<String, Object>)feature;
                Map<String, Object> properties = (Map<String, Object>)featureMap.get('properties');
                Map<String, Object> geometry = (Map<String, Object>)featureMap.get('geometry');

                String accountId = (String)properties.get('id');
                System.debug('Acc Number:' + accountId);
                List<Object> coordinates = (List<Object>)geometry.get('coordinates');
                Double latitude = coordinates != null && coordinates.size() > 1 ? ((Decimal)coordinates.get(1)).doubleValue() : null;
                Double longitude = coordinates != null && coordinates.size() > 0 ? ((Decimal)coordinates.get(0)).doubleValue() : null;

                if (accountId != null && latitude != null && longitude != null) {
                    
                    Account existingAccount;

                    if (existingAccount == null) {
                        
                        Account newAccount = new Account(
                            Name = (String)properties.get('label'),
                            AccountNumber = accountId,
                            JefGeoLocation__Latitude__s = latitude,
                            JefGeoLocation__Longitude__s = longitude
                        );
                        createdAccounts.add(newAccount);
                    }
                }
            }
        }

        
        if (!createdAccounts.isEmpty()) {
            Map<String, Id> accountIdMap = new Map<String, Id>();
            for (Account acc : createdAccounts) {
                accountIdMap.put(acc.AccountNumber, null);
            }
        
            List<Account> existingAccounts = [SELECT Id, AccountNumber FROM Account WHERE AccountNumber IN :accountIdMap.keySet()];
        
            for (Account acc : existingAccounts) {
                accountIdMap.put(acc.AccountNumber, acc.Id);
            }
        
            for (Account acc : createdAccounts) {
                acc.Id = accountIdMap.get(acc.AccountNumber);
            }
        
            upsert createdAccounts;
        }
		
        return findShortestPath(createdAccounts);
    }
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getTasksForCurrentUser() {
        
        Id currentUserId = UserInfo.getUserId();

        
        List<Task> tasks = [SELECT Id, Subject, ActivityDate, Status, AccountId, Account.Name, Account.JefGeoLocation__Latitude__s, Account.JefGeoLocation__Longitude__s
                            FROM Task
                            WHERE OwnerId = :currentUserId
                                AND ActivityDate = TODAY
                                AND Status = 'Not Started'
                                AND AccountId != null
                                AND Account.JefGeoLocation__Latitude__s != null
                                AND Account.JefGeoLocation__Longitude__s != null];
        
        List<Account> lstAcc = new List<Account>();
		for(Task t: tasks)
        {
            Account acc = new Account();
            acc.Id = t.AccountId;
            acc.Name = t.Account.Name;
            acc.JefGeoLocation__Latitude__s = t.Account.JefGeoLocation__Latitude__s;
            acc.JefGeoLocation__Longitude__s = t.Account.JefGeoLocation__Longitude__s;
            lstAcc.add(acc);
        }
        return findShortestPath(lstAcc);
        //return tasks;
    }
}