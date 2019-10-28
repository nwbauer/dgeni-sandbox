// Canonical path provides a consistent path (i.e. always forward slashes) across different OSes
import * as path from 'canonical-path';
import { composeAngularDocs } from './processors/composeAngularDocs';
import { Package } from 'dgeni';

// Create and export a new Dgeni package called dgeni-example. This package depends upon
// the jsdoc and nunjucks packages defined in the dgeni-packages npm module.
module.exports = new Package('dgeni-example', [
  require('dgeni-packages/typescript'),
  require('dgeni-packages/nunjucks')
])

.processor(composeAngularDocs)

// Configure our dgeni-example package. We can ask the Dgeni dependency injector
// to provide us with access to services and processors that we wish to configure
.config((
  log,
  readFilesProcessor,
  templateFinder,
  writeFilesProcessor,
  readTypeScriptModules,
  computePathsProcessor,
  EXPORT_DOC_TYPES
) => {

  const MODULES_DOCS_PATH = 'partials/modules';
  const basePath = path.resolve(__dirname, '../..');
  const customDocTypes = [
    'angular-component',
    'angular-service',
    'angular-module'
  ];

  customDocTypes.forEach((docType) => EXPORT_DOC_TYPES.push(docType));

  computePathsProcessor.pathTemplates.push({
    docTypes: ['module'],
    outputPathTemplate: MODULES_DOCS_PATH + '/${path}/index.html',
    pathTemplate: '/${id}.file',
  });

  computePathsProcessor.pathTemplates.push({
    docTypes: EXPORT_DOC_TYPES,
    outputPathTemplate: MODULES_DOCS_PATH + '/${path}/index.html',
    pathTemplate: '${moduleDoc.path}/${name}.${docType}',
  });

  // Set logging level
  log.level = 'info';

  // Specify the base path used when resolving relative paths to source and output files
  readFilesProcessor.basePath = basePath;

  // Specify collections of source files that should contain the documentation to extract
  readFilesProcessor.sourceFiles = [
    {
      include: 'src/**/*.js',
      basePath: 'src'
    }
  ];

  // Specify the base path used when resolving relative paths to source and output files
  readTypeScriptModules.basePath = basePath;

  readTypeScriptModules.sourceFiles = [
    {
      include: 'src/**/*.ts',
      exclude: 'src/**/*.spec.js',
    }
  ];

  readTypeScriptModules.hidePrivateMembers = false;

  // Add a folder to search for our own templates to use when rendering docs
  templateFinder.templateFolders.unshift(path.resolve(__dirname, 'templates'));

  // Specify how to match docs to templates.
  // In this case we just use the same static template for all docs
  templateFinder.templatePatterns.unshift('<%= doc.docType %>.template.html');

  // Specify where the writeFilesProcessor will write our generated doc files
  writeFilesProcessor.outputFolder  = 'docs/build';
});
