export interface PassageMode{
    autoUnlock:number;
    endDate:string;
    isAllDay:number;
    passageMode:number;
    startDate:string;
    weekDays:number[]
}

export interface PassageModeFormulario{
    weekDays:boolean[]
    isAllDay:number;
    startDate:string;
    endDate:string;
}