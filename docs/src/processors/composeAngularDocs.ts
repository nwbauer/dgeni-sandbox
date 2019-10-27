import { Processor, DocCollection, Document } from 'dgeni';
import { ClassExportDoc } from 'dgeni-packages/typescript/api-doc-types/ClassExportDoc';
import { AngularComponentDoc } from '../api-doc-types/angularComponentDoc';

export function composeAngularDocs() {
  return new ComposeAngularDocs();
}

export class ComposeAngularDocs implements Processor {
  $runAfter = ['mergeParameterInfo'];
  $process(docs: DocCollection) {
    console.log('running ComposeAngularDocs');
    docs.forEach((doc: Document) => {
      if (doc instanceof ClassExportDoc) {
        console.log('found class!');
      }
    });
  }
}
