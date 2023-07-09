import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ScrollService} from "../service/scroll.service";

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

    const previewFile = $('.uploaded-files');
    const divPreview = $('.uploaded');
    const previewSize = $('.size-file');
    const fileChooser = $('.input-file');

    fileChooser.onchange = (e: any) => {
      console.log(e)
      divPreview.style.display = 'flex';
      const fileToUpload = e.target.files[0];
      let s: number = fileToUpload.size/1000000;
      let size = s.toFixed(1);
      console.log(fileToUpload.name)
      previewFile.innerText = fileToUpload.name;
      previewSize.innerText = size + 'MB';
    };
  }

}
