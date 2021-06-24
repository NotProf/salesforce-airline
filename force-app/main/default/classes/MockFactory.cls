
public with sharing class MockFactory {

 public static void createData() {

  Airport__c[] airports = new Airport__c[] {
            new Airport__c(Name = 'Borispil', Country__c = 'Ukraine', City__c = 'Kyiv'),
            new Airport__c(Name = 'Lviv', Country__c = 'Ukraine', City__c = 'Lviv'),
            new Airport__c(Name = 'Istanbul', Country__c = 'Turkey', City__c = 'Istanbul'),
            new Airport__c(Name = 'Orly', Country__c = 'France', City__c = 'Paris')
    };
     insert airports;

     Account account = new Account(Name = 'MAU');

     insert account;

     Plane_Type__c planeType = new Plane_Type__c(Name = 'Boeing 767', Economy_seats__c = 1,
             Business_seats__c = 1, First_seats__c = 1);

     insert planeType;


     Plane__c plane = new Plane__c(Name = 'Boeing 767 - 1', Plane_Type__c = planeType.Id,
                                   Owner__c = account.Id);
     insert plane;

     Flight__c flight = new Flight__c(Name = 'Lviv - Paris', Plane__c = plane.Id,
             From__c = airports[1].Id, To__c = airports[3].Id, Date_and_Time__c = Datetime.now(), Departure_date__c = Date.today());

  insert flight;


 }
}
