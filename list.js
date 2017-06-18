(function() {
  window.globals = window.globals || {}

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
        if (office.divisionId.indexOf('state:ca') === -1) {
          return;
        }

        var officeName = office.name;
        var officialIndices = office.officialIndices;
        officialIndices.forEach(function(index) {
          var official = officials[index] ? officials[index] : {};
          var name = official.name
          var urls = official['urls']

          var politicianData = globals.politiciansLookup[name] || {};

          results.push({
            officialTitle: officeName,
            officialName: name,
            url: urls && urls.length > 0 ? urls[0] : undefined,
            photoUrl: official['photoUrl'],
            officialScore: politicianData.score,
            notes: politicianData.notes,
            actionNotes: politicianData.actionNotes
          })
        })

      })

      var $el = $('#accordion');
      var $rows = results.map(function(result, idx) {
        return globals.rowTemplate(Object.assign(result, { index: idx }));
      });
      $el.html($rows);
    }

    /**
     * Initialize the API client
     */
    function load() {
      gapi.client.setApiKey('AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0');

      var source = $("#row-template").html();
      globals.rowTemplate = Handlebars.compile(source);

      window.fetch("politicians.json")
        .then(function(response) { return response.json() })
        .then(function(json) { globals.politiciansLookup = json });
    }
    globals.load = load;

    function lookup(evt) {
      mkRequest(
        document.getElementById("addressInput").value,
        renderResults
      );
    }
    globals.lookup = lookup;

})()
