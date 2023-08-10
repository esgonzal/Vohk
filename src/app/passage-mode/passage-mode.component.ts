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
  constructor(private passageModeService: PassageModeService, private cdr: ChangeDetectorRef, private router: Router) { }

  isPassageModeToggleOn: boolean = false;
  weekDays = [
    { name: 'Lunes', value: 1, checked: false },
    { name: 'Martes', value: 2, checked: false },
    { name: 'Miercoles', value: 3, checked: false },
    { name: 'Jueves', value: 4, checked: false },
    { name: 'Viernes', value: 5, checked: false },
    { name: 'Sabado', value: 6, checked: false },
    { name: 'Domingo', value: 7, checked: false }
  ];
  isAllHoursToggleOn: boolean = true;
  startHour: string = '';
  endHour: string = '';

  ngOnInit(): void {
    this.updateValues()
  }
  updateValues() {
    this.isPassageModeToggleOn = this.passageModeService.passageModeConfig?.passageMode === 1;
    this.isAllHoursToggleOn = this.passageModeService.passageModeConfig?.isAllDay === 1;
    this.weekDays.forEach(day => {
      day.checked = this.passageModeService.passageModeConfig?.weekDays.includes(day.value)
    })
    this.startHour = this.convertMinutesToTime(Number(this.passageModeService.passageModeConfig?.startDate))
    this.endHour = this.convertMinutesToTime(Number(this.passageModeService.passageModeConfig?.endDate))
  }
  onPassageModeToggleChange(event: any) {
    this.isPassageModeToggleOn = event.checked;
    this.cdr.detectChanges();
  }
  onAllHoursToggleChange(event: any) {
    this.isAllHoursToggleOn = event.checked;
    this.cdr.detectChanges();
  }
  onCheckboxChange(event: any, day: any) {
    day.checked = event.target.checked;
  }
  convertMinutesToTime(minutes: number): string {
    let hours = Math.floor(minutes / 60);
    let mins = minutes % 60;
    let formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    let formattedMins = mins < 10 ? `0${mins}` : `${mins}`;
    return `${formattedHours}:${formattedMins}`;
  }
  transformarAllHoursToggle(isAllDay: boolean) {
    if (isAllDay) { return 1; }
    else { return 2; }
  }
  transformarPassageToggle(PassageMode: boolean) {
    if (PassageMode) { return 1; }
    else { return 2; }
  }
  transformarHora(Tiempo: string) {
    let tiempoHora = Tiempo.split(":")[0]
    let tiempoMinuto = Tiempo.split(":")[1]
    return (Number(tiempoHora) * 60 + Number(tiempoMinuto)).toString()
  }
  async cambiarPassageMode() {
    const selectedDayNumbers: number[] = [];
    this.weekDays.forEach(day => {
      if (day.checked) {
        selectedDayNumbers.push(day.value);
      }
    });
    const Config: PassageMode = {
      "autoUnlock": 1,
      "endDate": this.transformarHora(this.endHour),
      "isAllDay": this.transformarAllHoursToggle(this.isAllHoursToggleOn),
      "passageMode": this.transformarPassageToggle(this.isPassageModeToggleOn),
      "startDate": this.transformarHora(this.startHour),
      "weekDays": selectedDayNumbers
    }
    try {
      await this.passageModeService.setPassageMode(this.passageModeService.token, this.passageModeService.lockID, Config)
      this.router.navigate(["lock", this.passageModeService.lockID]);
    } catch (error) {
      console.error("Error while setting passage mode:", error);
    }
  }
}