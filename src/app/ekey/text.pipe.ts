import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'texttransform'})
export class TextTransformPipe implements PipeTransform {
  transform(value: string): string {
    const splitBy = '_'
    const splittedText = value.split( splitBy );
    return `${ splittedText[1] }`;
  }
}