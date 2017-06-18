(function() {
  window.globals = window.globals || {}
  
  // all is loaded; jquery is available
  $( document ).ready(function() {

    /**
    * Init: Check for presence of the address in the hash
    */
    if (window.location.hash) {
      $("#addressInput").focus();

      setTimeout(function(){

        var urlAddr=window.location.hash;
        urlAddr = urlAddr.replace('#','');
      
        $("#addressInput").val(urlAddr);
        $('#address-form').submit();
      }, 250);
    }

    /**
    * Build and execute request to look up voter info for provided address.
    * @param {string} address Address for which to fetch voter info.
    * @param {function(Object)} callback Function which takes the
    *     response object as a parameter.
    */
    function mkRequest(address, callback) {
      var req = gapi.client.request({
        'path' : '/civicinfo/v2/representatives',
        'params' : {'address' : address}
      });
      req.execute(callback);
    }

    /**
     * Render results in the DOM.
     * @param {Object} response Response object returned by the API.
     * @param {Object} rawResponse Raw response from the API.
     */
    function renderResults(response, rawResponse) {
      var results = [];

      var offices = response && response.offices ? response.offices : [];
      var officials = response && response.officials ? response.officials : [];

      offices.forEach(function(office) {
        // Exclude the President, VP, etc.
        if (office.divisionId.indexOf('state:ca') === -1) {
          return;
        }
        // Exclude State officials we don't focus on
        var stateRolesToShow = ['Governor', 'Lieutenant Governor', 'United States Senate']
        if (office.divisionId === "ocd-division/country:us/state:ca" && stateRolesToShow.indexOf(office.name) === -1) {
          return;
        }

        var officeName = office.name;
        var officialIndices = office.officialIndices;

        officialIndices.forEach(function(index) {
          var official = officials[index] ? officials[index] : {};
          var name = official.name;
          var urls = official.urls || [];
          var emails = official.emails;
          var phones = official.phones;

          var twitter = R.find(R.propEq('type', 'Twitter'), official.channels || []) || {};

          var politicianData = globals.politiciansLookup[name] || {};

          // This stuff will get sent into the mustache template from list.html
          results.push({
            officialTitle: officeName,
            officialName: name,
            url: urls[0],
            emails: emails,
            phones: phones,
            twitter: twitter.id,
            photoUrl: official.photoUrl,
            officialScore: politicianData.score,
            notes: politicianData.notes,
            actionNotes: politicianData.actionNotes,
            defaultExpand: politicianData.actionNotes && politicianData.actionNotes.trim() !== '',
          })
        })
      })

      // put blank entries at the end by pretending their score is Z
      results = results.sort(function (itemA, itemB) {
        var a = itemA.officialScore;
        var b = itemB.officialScore;
        if (!a) return 1;
        if (!b) return -1;
        if (a === b) return 0;
        return a < b ? -1 : 1;
      })

      var $rows = results.map(function(result, idx) {
        return globals.rowTemplate(Object.assign(result, { index: idx }));
      });
      $('#accordion').html($rows);
    }

    /**
     * Initialize the API client
     */
    function load() {
      gapi.client.setApiKey('AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0');

      $('#address-form').submit(function(evt) {
        evt.preventDefault();
        lookup();
      })

      var source = $("#row-template").html();
      globals.rowTemplate = Handlebars.compile(source);

      window.fetch("politicians.json")
        .then(function(response) { return response.json() })
        .then(function(json) { globals.politiciansLookup = json });
    }
    globals.load = load;

    function lookup() {
      mkRequest(
        document.getElementById("addressInput").value,
        renderResults
      );
    }


  });

})()
