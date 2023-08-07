import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PassageModeService } from '../services/passage-mode.service';
import { PassageMode, PassageModeFormulario } from '../Interfaces/PassageMode';

@Component({
  selector: 'app-passage-mode',
  templateUrl: './passage-mode.component.html',
  styleUrls: ['./passage-mode.component.css']
})
export class PassageModeComponent implements OnInit {
  isPassageModeToggleOn: boolean=false;
  weekDays = [
    { name: 'Lunes', value: 1 },
    { name: 'Martes', value: 2 },
    { name: 'Miercoles', value: 3 },
    { name: 'Jueves', value: 4 },
    { name: 'Viernes', value: 5 },
    { name: 'Sabado', value: 6 },
    { name: 'Domingo', value: 7 }
  ];

  selectedDays: boolean[] = [false, false, false, false, false, false, false]; // Array to store selected days of the week
  isAllHoursToggleOn: boolean = false; // Slide toggle for startHour and endHour
  startHour: string = ''; // Stores the selected startHour
  endHour: string = ''; // Stores the selected endHour

  
  constructor(private passageModeService: PassageModeService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateSlideToggle()
  }
  updateSlideToggle() {
    // Assuming that the passageModeConfig is already populated with data
    const passageMode = this.passageModeService.passageModeConfig?.passageMode;
    // Update the isSlideToggleOn based on the passageMode value
    this.isPassageModeToggleOn = passageMode === 1;
  }
  onPassageModeToggleChange(event: any) {
    this.isPassageModeToggleOn = event.checked;
    this.cdr.detectChanges();
  }
  onAllHoursToggleChange(event: any){
    this.isAllHoursToggleOn = event.checked;
    this.cdr.detectChanges();
  }

  transformarAllHoursToggle(isAllDay: boolean){
    if (isAllDay){
      return '1';
    }
    else {
      return '2';
    }
  }
  
  cambiarPassageMode() {
    // Convert selectedDays array to the desired format [1, 2, 3, 4, 5, 6, 7]
    const selectedDayNumbers: number[] = [];
    this.weekDays.forEach((day, index) => {
      if (this.selectedDays[index]) {
        selectedDayNumbers.push(day.value);
      }
    });

    console.log("Selected Days:", selectedDayNumbers);
    console.log("Is All Hours Toggle On:", this.transformarAllHoursToggle(this.isAllHoursToggleOn));
    console.log("Start Hour:", this.startHour);
    console.log("End Hour:", this.endHour);
  }



}