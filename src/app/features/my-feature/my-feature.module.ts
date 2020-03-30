import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyFeatureComponent } from './my-feature.component';

@NgModule({
  declarations: [
    MyFeatureComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MyFeatureComponent
  ]
})
export class MyFeatureModule { }
