
  angular.module('snippetSaver')
  .service('SnippetService', function($localStorage, $rootScope, $q){
    
    
    
    // Function to download data to a file
    function download(data, filename, type) {
        var a = document.createElement("a"),
            file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
    
    let service = {
      snippets: [],
      currentID:0,
      currentSnippet: {},
      addSnippet: function(snippet){
        snippet.id = service.currentID++;
        service.snippets.push(angular.copy(snippet));
        service.saveSnippets();
        service.currentSnippet = {};
      },
      deleteSnippet: function(snippetId){
        $localStorage.snippets = service.snippets = _.filter(service.snippets, (obj) => obj.id!=snippetId);
      },
      getSnippetById: function(id){
        return $q.when(_.find(service.snippets, {id:id}))
      },
      saveSnippets: function(){
        $localStorage.snippets = service.snippets;
      },
      saveFile: function(){
        download(angular.toJson(service.snippets), "data.json", "json")
      },
      loadSnippets: function(file){
        var fr = new FileReader();
      
        fr.onload = function(e){
          $localStorage.snippets = service.snippets = angular.fromJson(fr.result);
          service.currentID = _.last(service.snippets).id + 1;

          $rootScope.$apply();
        }
        fr.readAsText(file[0]);
      }
    };

    if($localStorage.snippets && $localStorage.snippets.length){
      service.snippets = $localStorage.snippets;
      service.currentID = _.last(service.snippets).id + 1;
    }

    return service;
  });