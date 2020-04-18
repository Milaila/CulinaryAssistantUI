import { Component, OnInit } from '@angular/core';
import { BaseService, Tag } from 'src/app/services/base.service';

@Component({
  selector: 'app-own-test',
  templateUrl: './own-test.component.html',
  styleUrls: ['./own-test.component.scss']
})
export class OwnTestComponent implements OnInit {

  constructor(protected baseService: BaseService) { }

  public tags: Tag[] = [];
  public response: any;
  public newTag: string = "abc";

  ngOnInit(): void {
    this.baseService.getTags().subscribe(t => {
      this.tags = t;
    });
    this.baseService.getTags2().subscribe(t => {
      this.response = t;
    });
  }

  onSave(){
    this.baseService.sendTag(this.newTag).subscribe(t => {
      alert(t);
    });
  }

  onFileChanged(event) {
    alert('File changed');
    const file = event.target.files[0];
  }

  onFilesChange(files: File[]){
    var file = files?.length === 1 ? files[0] : null;
    alert(file.name);
  }

}
