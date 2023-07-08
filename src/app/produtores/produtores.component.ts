import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-produtores',
  templateUrl: './produtores.component.html',
  styleUrls: ['./produtores.component.scss']
})
export class ProdutoresComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({

    });
  }

  ngOnInit(): void {
  }

}
