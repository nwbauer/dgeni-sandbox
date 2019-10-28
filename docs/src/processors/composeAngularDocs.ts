import { Processor, DocCollection, Document } from 'dgeni';
import { ClassExportDoc } from 'dgeni-packages/typescript/api-doc-types/ClassExportDoc';
import { AngularComponentDoc } from '../api-doc-types/angularComponentDoc';
import { AngularServiceDoc } from '../api-doc-types/angularServiceDoc';
import { AngularModuleDoc } from '../api-doc-types/angularModuleDoc';
import { MemberDoc } from 'dgeni-packages/typescript/api-doc-types/MemberDoc';
import { MethodMemberDoc } from 'dgeni-packages/typescript/api-doc-types/MethodMemberDoc';
import { ParsedDecorator } from 'dgeni-packages/typescript/services/TsParser/getDecorators';
import { PropertyMemberDoc } from 'dgeni-packages/typescript/api-doc-types/PropertyMemberDoc';

export function composeAngularDocs() {
  return new ComposeAngularDocs();
}

export type AngularDoc =
  AngularComponentDoc |
  AngularServiceDoc |
  AngularModuleDoc;

export interface DocParseStrategy {
  canParse: (doc: ClassExportDoc) => boolean;
  parse: (doc: ClassExportDoc) => AngularDoc;
}

export function hasDecorator(doc: ClassExportDoc, name: string): boolean {
  if (!doc.decorators) { return false; }
  return doc.decorators.some((decorator: ParsedDecorator) => {
    return decorator.name === name;
  });
}

export class ComposeAngularDocs implements Processor {
  $runAfter = ['adding-extra-docs'];
  $runBefore = ['extra-docs-added'];

  private parsers: DocParseStrategy[] = [
    {
      canParse: (doc: ClassExportDoc) => hasDecorator(doc, 'Component'),
      parse: (doc: ClassExportDoc) => this.parseAngularComponent(doc)
    },
    {
      canParse: (doc: ClassExportDoc) => hasDecorator(doc, 'Injectable'),
      parse: (doc: ClassExportDoc) => this.parseAngularService(doc)
    },
    {
      canParse: (doc: ClassExportDoc) => hasDecorator(doc, 'NgModule'),
      parse: (doc: ClassExportDoc) => this.parseAngularModule(doc)
    }
  ];

  $process(docs: DocCollection) {
    console.log('running ComposeAngularDocs');
    return docs.map((doc: Document) => {
      if (doc instanceof ClassExportDoc) {
        const docStrategy = this.parsers.find(({canParse}) => canParse(doc));
        return docStrategy ?  docStrategy.parse(doc) : doc;
      }
      return doc;
    });
  }

  private parseAngularComponent(doc: ClassExportDoc): AngularComponentDoc {
    const result = new AngularComponentDoc(
      doc.host,
      doc.moduleDoc,
      doc.symbol,
      doc.aliasSymbol
    );

    if (doc.members) {
      doc.members.forEach((member: MemberDoc) => {

        if (member.decorators) {
          member.decorators.forEach((decorator: ParsedDecorator) => {
            if (decorator.name === 'Input') {
              result.inputs.push(member);
            }
            if (decorator.name === 'Output') {
              result.outputs.push(member);
            }
          });
        }

      });
    }

    return result;
  }


  private parseAngularService(doc: ClassExportDoc): AngularServiceDoc {
    const result = new AngularServiceDoc(
      doc.host,
      doc.moduleDoc,
      doc.symbol,
      doc.aliasSymbol
    );

    if (doc.members) {
      doc.members.forEach((member: MemberDoc) => {

        if (member.decorators) {
          member.decorators.forEach((decorator: ParsedDecorator) => {
            if (member instanceof MethodMemberDoc) {
              result.methods.push(member);
            }
            if (member instanceof PropertyMemberDoc) {
              result.properties.push(member);
            }
          });
        }

      });
    }

    return result;
  }

  private parseAngularModule(doc: ClassExportDoc): AngularModuleDoc {
    const result = new AngularModuleDoc(
      doc.host,
      doc.moduleDoc,
      doc.symbol,
      doc.aliasSymbol
    );
    return result;
  }
}
