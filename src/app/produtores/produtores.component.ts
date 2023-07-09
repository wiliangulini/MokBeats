import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ScrollService} from "../service/scroll.service";
import {empty} from "rxjs";

@Component({
  selector: 'app-produtores',
  templateUrl: './produtores.component.html',
  styleUrls: ['./produtores.component.scss']
})
export class ProdutoresComponent implements OnInit, AfterViewInit, AfterViewChecked {

  form: FormGroup;

  constructor(
    private scrollService: ScrollService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
  ) {
    this.form = this.fb.group({

    });
  }

  ngOnInit(): void {
    this.scrollService.scrollUp();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngAfterViewInit() {
    this.uploadFile();
  }

  uploadFile() {
    const $: any = document.querySelector.bind(document);

    let previewFile = $('.uploaded-files');
    let divPreview = $('.uploaded');
    let showFile = $('.showFile');
    let previewSize = $('.size-file');
    let fileChooser = $('.input-file');

    fileChooser.onchange = (e: any) => {

      divPreview.style.display = 'flex';
      let arrayUpload: FileList = e.target.files;

      for(let i: number = 0; i < arrayUpload.length; i++) {

        let fileItem: any = divPreview.cloneNode(true);
        i > 0 ? showFile.append(fileItem) : console.log(fileItem);
        let s: number = arrayUpload[i].size/1000000;
        let size = s.toFixed(1);
        previewFile.innerText = arrayUpload[i].name;
        previewSize.innerText = size + 'MB';
      }
    };
  }

}
