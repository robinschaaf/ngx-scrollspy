import { ScrollSpyIndexService } from './index.service';
import { ScrollSpyIndexDirective } from './index.directive';
import { ScrollSpyIndexRenderDirective } from './index.render.directive';

export * from './index.service';
export * from './index.directive';
export * from './index.render.directive';

export default {
  directives: [ ScrollSpyIndexDirective, ScrollSpyIndexRenderDirective ],
  providers: [ ScrollSpyIndexService ]
};
