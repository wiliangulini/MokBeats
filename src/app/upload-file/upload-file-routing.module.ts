import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ProdutoresComponent} from "../produtores/produtores.component";

const routes: Routes = [
  { path: '', component: ProdutoresComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadFileRoutingModule { }
