{
  class SnippetService {
    constructor(DownloadService, $localStorage, $rootScope, $q, $http){
      this.snippets = [];
      this.currentID = 0;
      this.currentSnippet = {};

      this.$localStorage = $localStorage;
      this.$rootScope = $rootScope;
      this.$q = $q;
      this.DownloadService = DownloadService;

      if(!$localStorage.snippets || $localStorage.snippets.length==0){
        $http.get('data.json').then((resp) => {
          this.snippets = $localStorage.snippets = resp.data;
          this.currentID = _.last(this.snippets).id + 1;
        });
      }
      else{
        this.snippets = this.$localStorage.snippets;
        this.currentID = _.last(this.snippets).id + 1;
      }
    }

    addSnippet(snippet){
      snippet.id = this.currentID++;
      this.snippets.push(angular.copy(snippet));
      this.saveSnippets();
      this.currentSnippet = {};
    }

    deleteSnippet(snippetId){
      this.$localStorage.snippets = this.snippets = _.filter(this.snippets, (obj) => obj.id!=snippetId);
    }

    getSnippetById(id){
      return this.$q.when(_.find(this.snippets, {id:id}))
    }

    saveSnippets(){
      this.$localStorage.snippets = this.snippets;
    }

    saveFile(){
      this.DownloadService(angular.toJson(this.snippets), "data.json", "json");
    }

    loadFile(file){
      var fr = new FileReader();
    
      fr.onload = (e) => {
        this.$localStorage.snippets = this.snippets = angular.fromJson(fr.result);
        this.currentID = _.last(this.snippets).id + 1;

        this.$rootScope.$apply();
      }
      fr.readAsText(file[0]);
    }

  }

  SnippetService.$inject['DownloadService', '$localStorage', '$rootScope', '$q', '$http']

  angular.module('snippetSaver')
  .service('SnippetService', SnippetService);
}