import { Injectable } from '@angular/core';
import { PassageMode } from '../Interfaces/PassageMode';

@Injectable({
  providedIn: 'root'
})
export class PassageModeService {

  passageModeConfig:PassageMode;

  constructor() { }
}
