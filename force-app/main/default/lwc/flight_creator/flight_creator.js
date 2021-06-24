import { api, LightningElement } from "lwc";
import getPlanes from "@salesforce/apex/FlightService.getPlanes";

export default class FlightCreator extends LightningElement {

  @api
  planeType;

  @api
  from;

  @api
  to;

  @api
  planeId;

  @api
  selectedDate;
  selectedPlane;

  planes;

  get days() {
    return [
      { label: "Sunday", value: 1 },
      { label: "Monday", value: 2 },
      { label: "Tuesday", value: 3 },
      { label: "Wednesday", value: 4 },
      { label: "Thursday", value: 5 },
      { label: "Friday", value: 6 },
      { label: "Saturday", value: 7 }
    ];
  }

  onSelectDay(event) {
    this.planeId = null;
    this.selectedPlane = null;
    this.selectedDate = event.detail.value;
    console.log(this.selectedDate);
    this.findPlanes();
  }


  findPlanes() {
    getPlanes({ typeId: this.planeType, day: this.selectedDate }).then((result) => {

      this.planes = result.map((item) => ({ label: item.Name, value: item.Id }));

      if (!this.planes) {
        this.planes = [{
          label: 'No airplanes are available on the selected date',
          value: ' '
        }]
      }

    });

  }

  onSelectPlane(event) {

    if (event.detail.value) {
      this.planeId = event.detail.value;
    }

  }

}
