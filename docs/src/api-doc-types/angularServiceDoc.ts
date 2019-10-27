import { ClassExportDoc } from 'dgeni-packages/typescript/api-doc-types/ClassExportDoc';
import { MemberDoc } from 'dgeni-packages/typescript/api-doc-types/MemberDoc';

export class AngularServiceDoc extends ClassExportDoc {
  docType = 'angular-service';
  public properties: MemberDoc[] = [];
  public methods: MemberDoc[] = [];
}
