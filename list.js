(function() {
  window.globals = window.globals || {}

  var emailText = "subject=Vote%20Yes%20on%20the%20housing%20bills%20package&body=As%20your%20constituent%20and%20a%20member%20of%20the%20pro-housing%20YIMBY%20movement%2C%20I%20ask%20you%20to%20please%20vote%20in%20favor%20of%20the%20Housing%20Package%20that%20will%20increase%20both%20overall%20housing%20production%20and%20funding%20for%20Affordable%20Housing.%20We%20hope%20this%20package%20will%20include%20bills%20like%20SB%2035%2C%20SB%202%2C%20SB%203%2C%20AB%20678%2FSB167%2C%20and%20any%20other%20bills%20that%20will%20create%20significantly%20more%20housing.%0A%0ACalifornia%20is%20experiencing%20a%20SEVERE%20housing%20shortage%20that%20is%20devastating%20to%20low-income%20people%2C%20stunting%20young%20people%2C%20and%20driving%20Californians%20to%20commute%20long%20distances%20for%20work.%20Every%20city%20needs%20to%20do%20its%20part%20to%20bring%20down%20prices%20by%20building%20more%20housing.%0A%0AWe%20need%20to%20streamline%20housing%20production%20to%20create%20more%20subsidized%20Affordable%20Housing%20and%20make%20market%20rate%20housing%20more%20affordable.%0A%0AThis%20housing%20package%20is%20major%20step%20towards%20addressing%20the%20needs%20of%20low-income%20Californians.%20About%201.7%20million%20low-income%20California%20renters%20spend%20more%20than%20half%20their%20income%20on%20housing.%20We%20need%20policies%20that%20increase%20funding%20for%20low-income%20housing%20projects%20and%20speed%20up%20the%20production%20of%20all%20housing%20NOW.%0A%0APlease%20support%20a%20housing%20package%20that%20takes%20major%20steps%20in%20the%20right%20direction.%0A%0AThank%20you.";

  // all is loaded; jquery is available
  $( document ).ready(function() {

    /**
    * Init: Check for presence of the address in the hash
    */
    if (window.location.hash) {
      $("#addressInput").focus();

      setTimeout(function(){

        var urlAddr = window.location.hash;
        urlAddr = decodeURIComponent(urlAddr.replace('#',''));

        $("#addressInput").val(urlAddr);

        mkRequest(urlAddr, renderResults);
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
        path: '/civicinfo/v2/representatives',
        params: {
          address: address,
          key: 'AIzaSyCu5mDa-j8751oDEp-pVnj8zjZKnA4A4T0'
        }
      });

      if (!globals.politiciansLookup) {
        fetchPoliticianMetadata().then(function() {
          req.execute(callback);
        });
      } else {
        req.execute(callback);
      }
    }

    var caAssemblyDistrictRe = /state:ca\/sldl:(\d+)/;

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

        var assemblyMatch = office.divisionId.match(caAssemblyDistrictRe);
        var yimbyMailerLink = (assemblyMatch && assemblyMatch.length === 2)
          ? 'https://sf-yimby-emailer.appspot.com/asm-district-' + assemblyMatch[1] + emailText
          : undefined;

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
            divisionId: office.divisionId,
            url: urls[0],
            emails: emails,
            phones: phones,
            twitter: twitter.id,
            photoUrl: official.photoUrl,
            officialScore: politicianData.score,
            notes: politicianData.notes,
            actionNotes: politicianData.actionNotes,
            defaultExpand: politicianData.actionNotes && politicianData.actionNotes.trim() !== '',
            yimbyMailerLink: yimbyMailerLink,
          })
        })
      })

      // Sort most local politicians up top (longer divisionId roughly means more local)
      // and then sort on politician name
      results = R.sortWith([
        R.descend(function(pol) { return pol.divisionId.length }),
        R.ascend(R.prop('officialName'))
      ])(results);

      var $rows = results.map(function(result, idx) {
        result.index = idx;
        return globals.rowTemplate(result);
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
    }
    globals.load = load;

    function lookup() {
      mkRequest(
        document.getElementById("addressInput").value,
        renderResults
      );
    }

    function fetchPoliticianMetadata() {
      return window.fetch("./data/politicians.json", { cache: "reload" })
        .then(function(response) { return response.json() })
        .then(function(json) { globals.politiciansLookup = json });
    }


  });

})()
