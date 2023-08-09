import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PassageModeService } from '../services/passage-mode.service';
import { PassageMode } from '../Interfaces/PassageMode';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passage-mode',
  templateUrl: './passage-mode.component.html',
  styleUrls: ['./passage-mode.component.css']
})
export class PassageModeComponent implements OnInit {
  constructor(private passageModeService: PassageModeService, private cdr: ChangeDetectorRef, private router: Router) {}

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

  selectedDays: boolean[] = [false, false, false, false, false, false, false];
  isAllHoursToggleOn: boolean = true; 
  startHour: string = ''; 
  endHour: string = ''; 

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
    if (!isAllDay){return 1;}
    else {return 2;}}
  transformarPassageToggle(PassageMode: boolean){
    if (PassageMode){return 1;}
    else {return 2;}}
  
  transformarHora(Tiempo: string){
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return (Number(tiempoHora)*60 + Number(tiempoMinuto)).toString()
  }
  
  cambiarPassageMode() {
    const selectedDayNumbers: number[] = [];
    this.weekDays.forEach((day, index) => {
      if (this.selectedDays[index]) {
        selectedDayNumbers.push(day.value);
      }
    });
    const Config: PassageMode = { "autoUnlock": 1, 
                                  "endDate":this.transformarHora(this.endHour),
                                  "isAllDay":this.transformarAllHoursToggle(this.isAllHoursToggleOn),
                                  "passageMode":this.transformarPassageToggle(this.isPassageModeToggleOn),
                                  "startDate":this.transformarHora(this.startHour),
                                  "weekDays":selectedDayNumbers
                                }
    this.passageModeService.setPassageMode(this.passageModeService.token, this.passageModeService.lockID, Config)
    this.router.navigate(["lock",this.passageModeService.lockID]);
  }
}