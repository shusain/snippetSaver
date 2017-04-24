angular.module("snippetSaver")
  .controller('BrowseCtrl', function(SnippetService, EditorManager, $timeout, copyTextToClipboard) {
    var ctrl = this;
    ctrl.SnippetService = SnippetService;
    ctrl.showDescription = {}
    
    ctrl.toggleDescription = value => SnippetService.snippets.forEach( item => ctrl.showDescription[item.id] = value);
    

    ctrl.copy = (snippetId) => {
      var editor = EditorManager.snippetIdToEditor(snippetId);
      editor.selectAll();
      copyTextToClipboard(editor.getCopyText());

      ctrl.lastCopied = snippetId;
      $timeout(() => {
        ctrl.lastCopied = null;
      }, 1000)

      editor.getSelection().clearSelection();
    }
    
  });