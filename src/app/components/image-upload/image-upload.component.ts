import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { FileSystemFileEntry, FileSystemDirectoryEntry  } from 'ngx-file-drop';
import { FileSystemEntry } from 'ngx-file-drop/ngx-file-drop/dom.types';
const emptyErrorMessage = '-';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() filesNumberLimit: number;
  @Input() fileSizeLimitKb: number;
  @Input() allowedExtensions: string[];
  @Output() filesChange = new EventEmitter<File[]>();
  // @Output() error = new EventEmitter<FileSelectErrorEvent>();
  @Input() autoReset = false;
  @Input() inline = false;
  @Input() wrongExtensionErrorMessage = null;

  private errorMessageWrongExtension = emptyErrorMessage;
  private errorMessageMaxFileSize = '';
  private isFilesLimitExceeded = false;
  files: File[] = [];
  draggableDivClass = 'FileSelect-DragArea';
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  constructor(
  ) { }

  ngOnInit() {
    this.initErrorMessages();
  }

  @HostListener('dragover', ['$event']) onDragOver(event) {
    this.draggableDivClass = 'FileSelect-DropArea';
    event.preventDefault();
  }

  @HostListener('dragenter', ['$event']) onDragEnter(event) {
    this.draggableDivClass = 'FileSelect-DropArea';
    event.preventDefault();
  }

  @HostListener('dragend', ['$event']) onDragEnd(event) {
    this.draggableDivClass = 'FileSelect-DragArea';
    event.preventDefault();
  }

  @HostListener('dragleave', ['$event']) onDragLeave(event) {
    this.draggableDivClass = 'FileSelect-DragArea';
    event.preventDefault();
  }

  @HostListener('drop', ['$event']) onDrop(event) {
    this.draggableDivClass = 'FileSelect-DragArea';
    event.preventDefault();
    event.stopPropagation();
    this.processDragAndDropEvent(event);
  }

  private processDragAndDropEvent(event: DragEvent) {
    if (!this.checkFilesLimit()) {
      return;
    }

    // event.dataTransfer.items do not exist in IE and Safari
    // (there is no ability to drag and drop folders)
    if (!event.dataTransfer.items) {
      this.tryAddFiles(Array.from(event.dataTransfer.files));
      return;
    }

    const items = Array.from(event.dataTransfer.items);
    items.forEach(item => {
      if (item.kind === 'file') {
        this.processFileOrDirectory(item.webkitGetAsEntry());
      }
    });
  }

  private processFileOrDirectory(entry: FileSystemEntry) {
    if (entry.isFile) {
      (entry as FileSystemFileEntry).file(file => this.tryAddFile(file));
    }
    else if (entry.isDirectory) {
      const directoryReader = (entry as FileSystemDirectoryEntry).createReader();
      directoryReader.readEntries(entries => entries.forEach(item => this.processFileOrDirectory(item)));
    }
  }

  private validateFile(file: File): string {
    if (this.files.findIndex(f => f.name === file.name) > -1) {
      return emptyErrorMessage;
    } else {
      if (!this.validateExtension(file)) {
        return this.errorMessageWrongExtension;
      } else if (!this.validateSize(file)) {
        return 'File is too big: ' + file.size;
      }
      return null;
    }
  }

  private validateExtension(file: File): boolean {
    if (this.allowedExtensions && this.allowedExtensions.length > 0) {
      return this.allowedExtensions.some(ext => file.name.toLocaleLowerCase().endsWith(
        (ext.startsWith('.') ? '' : '.') + ext.toLowerCase())
      );
    } else {
      return true;
    }
  }

  private validateSize(file: File): boolean {
    return !this.fileSizeLimitKb ||
      this.fileSizeLimitKb && this.fileSizeLimitKb > 0 && file.size <= this.fileSizeLimitKb * 1024;
  }

  private tryAddFiles(files: Array<File>) {
    for (const file of files) {
      this.tryAddFile(file);
      if (this.isFilesLimitExceeded) {
        break;
      }
    }
  }

  private tryAddFile(file: File) {
    if (!this.checkFilesLimit()) {
      return;
    }
    const validationError = this.validateFile(file);
    if (validationError === null) {
      this.files.push(file);
    } else if (validationError !== emptyErrorMessage) {
      this.createError(validationError);
    }
      // Prevent emiting fileChange event if nothing's selected
      // (e.g. if Cancel pressed on file select. fixes IE double-submission bug too)
    if (this.files && this.files.length > 0) {
      this.filesChange.emit(this.files);
    }
    if (this.autoReset) {
      this.files = [];
    }
  }

  private initErrorMessages() {
    if (this.allowedExtensions && this.allowedExtensions.length > 0) {
      let allowedExtensionsListText = `.${this.allowedExtensions[0]}`;
      for (let i = 1; i < this.allowedExtensions.length; i++) {
        allowedExtensionsListText += `, .${this.allowedExtensions[i]}`;
      }
      if (!this.wrongExtensionErrorMessage) {
        this.errorMessageWrongExtension = `The file should have a ${allowedExtensionsListText} file extension`;
      }
      else {
        this.errorMessageWrongExtension = this.wrongExtensionErrorMessage;
      }
    }

    if (this.fileSizeLimitKb && this.fileSizeLimitKb > 0) {
      this.errorMessageMaxFileSize = 'Max filesize: ' + this.fileSizeLimitKb * 1024;
    }
  }

  onFileInputChanged(event) {
    if (!this.fileInput.nativeElement.value || !this.checkFilesLimit()) {
      return;
    }
    this.tryAddFiles(Array.from(event.target.files));

    this.fileInput.nativeElement.value = '';
  }

  onRemoveFileClicked(removedFile) {
    const index = this.files.indexOf(removedFile, 0);
    if (index > -1) {
      this.files.splice(index, 1);
    }
    this.filesChange.emit(this.files);
  }

  private createError(errorMessage: string) {
    const obj = {
      doPreventDefault: false,
      error: errorMessage,
      preventDefault() {
        this.doPreventDefault = true;
      }
    };
    alert(errorMessage);
    // this.error.emit(obj);
    if (!obj.doPreventDefault) {
      // this.store.dispatch(new AddAlertAction({
      //   message: errorMessage,
      //   type: 'danger',
      // }));
    }
  }

  private checkFilesLimit(): boolean {
    if (!this.filesNumberLimit || this.filesNumberLimit <= 0 ||
      this.files.length < this.filesNumberLimit) {
        this.isFilesLimitExceeded = false;
        return true;
    }
    this.createError('You cannot upload any more files.');
    this.isFilesLimitExceeded = true;
    return false;
  }
}

