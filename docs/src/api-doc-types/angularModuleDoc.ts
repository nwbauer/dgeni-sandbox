import { ClassExportDoc } from 'dgeni-packages/typescript/api-doc-types/ClassExportDoc';
import { MemberDoc } from 'dgeni-packages/typescript/api-doc-types/MemberDoc';
import { AngularServiceDoc } from './angularServiceDoc';
import { AngularComponentDoc } from './angularComponentDoc';

export class AngularModuleDoc extends ClassExportDoc {
  docType = 'angular-module';
  public components: AngularComponentDoc[] = [];
  public services: AngularServiceDoc[] = [];
}
