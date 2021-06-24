import { LightningElement, track, wire } from "lwc";
import getAllAirports from "@salesforce/apex/FlightService.getAllAirports";
import getFlights from "@salesforce/apex/FlightService.getFlights";
import getPrices from "@salesforce/apex/FlightService.getPrices";
import createTicket from "@salesforce/apex/FlightService.createTicket";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import FIRST_NAME from "@salesforce/schema/Contact.FirstName";
import LAST_NAME from "@salesforce/schema/Contact.LastName";
import BIRTHDATE from "@salesforce/schema/Contact.Birthdate";
import PASSPORT from "@salesforce/schema/Contact.Passport__c";


export default class TicketCreator extends LightningElement {

  fields = [FIRST_NAME, LAST_NAME, BIRTHDATE, PASSPORT];
  airportsOptions;
  airportFrom;
  airportTo;
  departureDate;
  selectedClass;
  selectedFlight;
  flightOptions;
  availableSeats;
  disableButton = true;
  allFlights;
  message = "Please fill all fields";
  passengerId;
  showFlightForm = true;
  product2;
  price;

  get classOptions() {
    return [
      { label: "First", value: "First" },
      { label: "Economy", value: "Economy" },
      { label: "Business", value: "Business" }
    ];
  }

  @track isModalOpen = false;

  @wire(getAllAirports)
  getAllAirports(result) {

    if (result.data) {

      this.airportsOptions = result.data.map(item => ({ label: item.Name, value: item.Id }));

    } else {

      this.showNotification("Error", "Unable to retrieve data from server", "error");

    }
  }

  handleContactCreate(event) {
    this.passengerId = event.detail.id;
    this.showFlightForm = true;
  }

  getAvailableFlights() {

    this.disableButton = true;
    this.selectedFlight = null;

    if (this.allFieldIsFilled) {
      getFlights({ airportFrom: this.airportFrom, airportTo: this.airportTo, departureDate: this.departureDate })
        .then((result) => {
          console.log(result);

          if (result.length === 0) {
            this.message = "No available flights for selected date";
          } else {
            this.allFlights = result;
            this.flightOptions = result.map(item => ({ label: item.Name, value: item.Id }));
            this.message = "Please select a flight";
          }
          this.findActualPrice();

        }).catch((error) => this.showNotification("Error", JSON.stringify(error.message), "error"));

    } else {

      this.allFlights = null;
      this.flightOptions = null;
      this.message = "Please fill all fields";

    }

  }

  async getPricesForSelectedFlight() {

    console.log(this.selectedFlight);

    try {
      this.product2 = await getPrices({ flightId: this.selectedFlight });
      this.findActualPrice();
    } catch (error) {
      console.log(error);
    }


  }

  selectFrom(event) {
    this.airportFrom = event.detail.value;
    this.getAvailableFlights();
  }

  selectTo(event) {
    this.airportTo = event.detail.value;
    this.getAvailableFlights();
  }

  selectClass(event) {
    this.selectedClass = event.detail.value;
    this.generateMessage();
    this.findActualPrice();
  }

  selectDate(event) {
    this.departureDate = event.detail.value;
    this.getAvailableFlights();
  }

  selectFlight(event) {
    this.selectedFlight = event.detail.value;
    this.getPricesForSelectedFlight();
    this.generateMessage();
  }

  generateMessage() {
    if (this.selectedFlight) {

      const flight = this.allFlights.find(item => item.Id === this.selectedFlight);
      this.availableSeats = this.findSeatsByClass(flight);

      if (this.availableSeats) {

        if (this.availableSeats > 0) {
          this.message = `Available ${this.availableSeats} seats`;
          this.disableButton = false;
        } else {
          this.disableButton = true;
          this.message = "No available seats for selected flight";
        }

      }
    }

  }

  findActualPrice() {

    if (this.product2 && this.selectedFlight && this.selectedClass) {
      const entry = this.product2[0].PricebookEntries.find((item) => item.Pricebook2.Name.includes(this.selectedClass));
      this.price = entry.UnitPrice;
    } else  {
      this.price = null;
    }
  }

  findSeatsByClass(flight) {

    switch (this.selectedClass) {
      case "Economy": {
        return Number(flight.Plane__r.Plane_Type__r.Economy_seats__c - flight.Economy_tickets__c);
      }
      case "First": {
        return Number(flight.Plane__r.Plane_Type__r.First_seats__c - flight.First_tickets__c);
      }
      case "Business": {
        return Number(flight.Plane__r.Plane_Type__r.Business_seats__c - flight.Business_tickets__c);
      }

      default: {
        this.disableButton = true;
        this.message = "Please select a class";
        return null;
      }
    }
  }

  get allFieldIsFilled() {
    return this.departureDate && this.airportFrom && this.airportTo;
  }

  showNotification(title, message, variant) {
    const evt = new ShowToastEvent({
      title,
      message,
      variant
    });
    this.dispatchEvent(evt);
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  submitDetails() {

    if (this.allFieldIsFilled && this.passengerId) {
      createTicket({ type: this.selectedClass, flight: this.selectedFlight, contact: this.passengerId })
        .then(() => {

          this.showNotification("Success", "Ticket was created", "success");
          this.isModalOpen = false;

        }).catch((error) => {
        console.log("catchError");
        console.log("!!!", JSON.stringify(error));

        this.showNotification("Error", error.message, "error");

      });
    } else {
      this.showNotification("Oops", "Something is missing", "error");
    }

  }
}
