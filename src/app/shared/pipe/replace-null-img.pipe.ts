import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'replaceNullImg',
  standalone: true
})
export class ReplaceNullImgPipe implements PipeTransform {
  defaultUrl =
    'https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/Grogu_%28Star_Wars%29.jpg/220px-Grogu_%28Star_Wars%29.jpg';

  transform(value: string, replaceImgUrl: string = this.defaultUrl): string {
    return !value || !value.length ? replaceImgUrl : value;
  }

}
