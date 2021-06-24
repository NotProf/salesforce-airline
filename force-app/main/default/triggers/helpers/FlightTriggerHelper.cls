/**
 * Created by igorkarpiuk on 07.06.2021.
 */

public with sharing class FlightTriggerHelper {

    private static final Integer firstIndex = 0;
    private static final Integer businessIndex = 1;
    private static final Integer economyIndex = 2;

    public static void createTickets(List<Flight__c> flights) {

        List<Ticket__c> tickets = new List<Ticket__c>();
        List<Schema.PicklistEntry> ticketTypes = Ticket__c.Class__c.getDescribe().getPicklistValues();

        for (Flight__c flight : flights) {


            Plane_Type__c type = [
                    SELECT Id, Name, Business_seats__c, First_seats__c, Economy_seats__c
                    FROM Plane_Type__c
                    WHERE Id IN (SELECT Plane_Type__c FROM Plane__c WHERE Id = :flight.Plane__c)
            ];


            for (Integer i = 0; i < type.First_seats__c; i++) {
                tickets.add(
                        new Ticket__c(Name = flight.Name, Flight__c = flight.Id,
                                Class__c = ticketTypes[firstIndex].getLabel())
                );
            }

            for (Integer i = 0; i < type.Business_seats__c; i++) {
                tickets.add(new Ticket__c(Name = flight.Name, Flight__c = flight.Id,
                        Class__c = ticketTypes[businessIndex].getLabel()));
            }

            for (Integer i = 0; i < type.Economy_seats__c; i++) {
                tickets.add(new Ticket__c(Name = flight.Name, Flight__c = flight.Id,
                        Class__c = ticketTypes[economyIndex].getLabel()));
            }

        }

        try {
            insert tickets;
        } catch (Exception e) {
            System.debug('ERROR OCCURRED WHILE CREATING TICKETS' + e.getMessage());
        }
    }

}
