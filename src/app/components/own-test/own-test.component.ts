import { Component, OnInit } from '@angular/core';
import { BaseService, Tag } from 'src/app/services/base.service';
import { IImageModel } from 'src/app/models/server/image-model';
import { ServerHttpService } from 'src/app/services/server-http.sevice';

@Component({
  selector: 'app-own-test',
  templateUrl: './own-test.component.html',
  styleUrls: ['./own-test.component.scss']
})
export class OwnTestComponent implements OnInit {

  constructor(protected serverService: ServerHttpService) { }

  public tags: string[] = [];
  public response: any;
  imageSrc = '';
  imageFile: File;

  ngOnInit(): void {
    this.serverService.getTags().subscribe(t => {
      this.tags = t;
    });
    // this.baseService.getTags2().subscribe(t => {
    //   this.response = t;
    // });
  }

  onSave(){
    this.onUpload();
  }

  onFileChanged(event) {
    alert('File changed');
    this.imageFile = event?.target?.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };
    reader.readAsDataURL(this.imageFile);
  }

  onFilesChange(files: File[]){
    this.imageFile = files?.length === 1 ? files[0] : null;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };
    reader.readAsDataURL(this.imageFile);
    alert(this.imageFile.name);
  }

  onUpload() {
    const data = this.imageSrc.slice(this.imageSrc.indexOf(',') + 1);
    alert(`Upload image: ${data}`);
    this.serverService.postImage({
      id: 0,
      title: this.imageFile.name,
      data
    }).subscribe(x => alert(`Id = ${x}`));
  }

}
