(function() {
  window.scorecard = window.scorecard || {}

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
          var urls = official['urls']

          results.push({
            officialTitle: officeName,
            officialName: official.name,
            url: urls && urls.length > 0 ? urls[0] : undefined,
            photoUrl: official['photoUrl'],
            officialScore: 'B',
            notes: 'Hi',
          })
        })

      })

      var $el = $('#accordion');
      var $rows = results.map(function(result) {
        return scorecard.rowTemplate(result);
      });
      $el.html($rows);
    }

    /**
     * Initialize the API client
     */
    function load() {
      gapi.client.setApiKey('AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0');

      var source = $("#row-template").html();
      scorecard.rowTemplate = Handlebars.compile(source);
    }
    scorecard.load = load;

    function lookup() {
      mkRequest(
        document.getElementById("addressInput").value,
        renderResults
      );
    }
    scorecard.lookup = lookup;

})()
