
@IsTest
public with sharing class FlightTriggerTest {

//    @TestSetup
//    public static void createData() {
//        MockFactory.createData();
//    }
//
//    @IsTest
//    public static void createTicketsSuccess() {
//        List<Airport__c> airports = [SELECT Id, Name FROM Airport__c LIMIT 2];
//        Plane__c plane = [SELECT Id, Name FROM Plane__c LIMIT 1];
//
//        Flight__c flight = new Flight__c(Name = airports[0].Name + ' - ' + airports[1].Name, Plane__c = plane.Id,
//                From__c = airports[0].Id, To__c = airports[1].Id, Date_and_Time__c = Datetime.now());
//
//        insert flight;
//
//        List<Ticket__c> tickets = [SELECT Id, Name FROM Ticket__c];
//
//        System.assertEquals(3, tickets.size());
//    }
}
