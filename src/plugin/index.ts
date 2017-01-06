import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export * from './index.service';
export * from './index.directive';
export * from './index.component';

import { ScrollSpyIndexDirective } from './index.directive';
import { ScrollSpyIndexRenderComponent } from './index.component';

@NgModule({
  imports: [ CommonModule, RouterModule ],
  declarations: [ ScrollSpyIndexDirective, ScrollSpyIndexRenderComponent ],
  exports: [ ScrollSpyIndexDirective, ScrollSpyIndexRenderComponent ]
})
export class ScrollSpyIndexModule {}
