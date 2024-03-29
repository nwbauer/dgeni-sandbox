import { ClassExportDoc } from 'dgeni-packages/typescript/api-doc-types/ClassExportDoc';
import { MemberDoc } from 'dgeni-packages/typescript/api-doc-types/MemberDoc';

export class AngularComponentDoc extends ClassExportDoc {
  docType = 'angular-component';
  public inputs: MemberDoc[] = [];
  public outputs: MemberDoc[] = [];
}
