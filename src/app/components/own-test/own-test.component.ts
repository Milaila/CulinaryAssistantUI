import { Component, OnInit } from '@angular/core';
import { BaseService, Tag } from 'src/app/services/base.service';
import { IImageModel } from 'src/app/models/IImageModel';

@Component({
  selector: 'app-own-test',
  templateUrl: './own-test.component.html',
  styleUrls: ['./own-test.component.scss']
})
export class OwnTestComponent implements OnInit {

  constructor(protected baseService: BaseService) { }

  public tags: Tag[] = [];
  public response: any;
  public newTag = '';
  imageSrc = '';
  imageFile: File;
  images: IImageModel[] = [];

  ngOnInit(): void {
    this.baseService.getTags().subscribe(t => {
      this.tags = t;
    });
    // this.baseService.getTags2().subscribe(t => {
    //   this.response = t;
    // });
    this.baseService.getImages().subscribe(t => {
      this.images = t;
    });
  }

  onSave(){
    this.baseService.sendTag(this.newTag).subscribe(t => {
      alert(t);
    });
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
    this.baseService.sendImage({
      title: this.imageFile.name,
      data
    }).subscribe(x => alert(`Id = ${x}`));
  }

}
