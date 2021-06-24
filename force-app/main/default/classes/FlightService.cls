
public with sharing class FlightService {

    @AuraEnabled(Cacheable=true)
    public static List<Plane__c> getPlanes(Id typeId, Date day) {
        List<Plane__c> planes = [
                SELECT Id, Name
                FROM Plane__c
                WHERE Id NOT IN (
                        SELECT Plane__c
                        FROM Flight__c
                        WHERE Departure_date__c = :day
                        AND Plane__r.Plane_Type__c = :typeId
                )
        ];

        return planes;

    }

    @AuraEnabled(Cacheable=true)
    public static List<Airport__c> getAllAirports() {
        return [SELECT Id, Name FROM Airport__c];
    }

    @AuraEnabled(Cacheable=true)
    public static List<Flight__c> getFlights(Id airportFrom, Id airportTo, Date departureDate) {
        List<Flight__c> flights = [
                SELECT Id, Name, Business_tickets__c, Economy_tickets__c, First_tickets__c,
                        Plane__r.Plane_Type__r.Economy_seats__c, Plane__r.Plane_Type__r.Business_seats__c,
                        Plane__r.Plane_Type__r.First_seats__c
                FROM Flight__c
                WHERE From__c = :airportFrom AND To__c = :airportTo AND Departure_date__c = :departureDate
        ];

        return flights;
    }

    @AuraEnabled(Cacheable=false)
    public static void createTicket(String type, Id flight, Id contact) {
        Ticket__c ticket = new Ticket__c(Flight__c = flight, Class__c = type, Passenger__c = contact);
        insert ticket;
    }

    @AuraEnabled(Cacheable=true)
    public static List<Product2> getPrices(Id flightId) {
        List<Product2> products = [
                SELECT Id, (SELECT UnitPrice, Pricebook2.Name FROM PricebookEntries LIMIT 4)
                FROM Product2
                WHERE Id IN (SELECT Product__c FROM Flight__c WHERE Id = :flightId)
        ];

        System.debug(products);
        return products;
    }

}

