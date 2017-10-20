var viewModel;

// array of locations in Saudi Arabia
var locationsSA = [{
        title: 'King Salman Walk',
        location: {
            lat: 26.3133011,
            lng: 50.1935845
        }
    },
    {
        title: 'Scitech',
        location: {
            lat: 26.3193119,
            lng: 50.2301239
        }
    },
    {
        title: 'Signature',
        location: {
            lat: 26.3593123,
            lng: 50.188556
        }
        }, {
        title: 'GODIVA',
        location: {
            lat: 26.3031498,
            lng: 50.2225463
        }
        },{
        title: 'Al Ennabi Grill',
        location: {
            lat: 26.2951501,
            lng: 50.2148455
        }
        },
    {
        title: 'Sunset Beach',
        location: {
            lat: 26.3265157,
            lng: 50.1917043
        }
    }
];

// create a map variable that will be used in initMap()
var map;

// create array for listing markers in map
var markers = [];

// initialize map
function initMap() {
    // intial map view when loaded
    var myLatLng = {
        lat: 26.3248475,
        lng: 50.2052415
    };
    // create a map object and get map from DOM for display
    map = new google.maps.Map(document.getElementById("map"), {
        center: myLatLng,
        zoom: 12
    });
    // creates infowindow for each place pin
    var infoWindow = new google.maps.InfoWindow();

    function updateMap(x) {

        // store title and location iteration in variables
        var title = x.title;
        var location = x.location;

        // drop marker after looping
        var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP,
            address: address
        });
        // pushes all locations into markers array
        markers.push(marker);

        viewModel.myLocations()[j].marker = marker;

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function () {
            // show info inside infowindow when clicked
            populateInfoWindow(this, infoWindow);
            // displays all data retrieved from foursquare api down below
            infoWindow.setContent(contentString);
        });

        // This function populates the infowindow when the marker is clicked. 
        function populateInfoWindow(marker, infoWindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infoWindow.marker != marker) {
                infoWindow.marker = marker;
                infoWindow.setContent('<div class="title">' + marker.title + '</div>' + marker.contentString);
                // sets animation to bounce 2 times when marker is clicked
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function () {
                    marker.setAnimation(null);
                }, 2130);
                infoWindow.open(map, marker);
                // Make sure the marker property is cleared if the infowindow is closed.
                infoWindow.addListener('closeclick', function () {
                    infoWindow.setMarker = null;
                });
            }
        } // end of populateInfoWindow

        // foursquare client-id and client-secret
        var client_id = "04ONOAN4OKDZZV13SODIU04K3T2MQ4MYQED1JHF0UE3FL12A";
        var client_secret = "ABDZ2GVVFOGRY5RCGCFXG0SUSYBAE3XKZWMGFY1H1SKBIZF1";

        // foursquare api url
        var foursquareUrl = "https://api.foursquare.com/v2/venues/search"; // + marker.position.lat() + "," + marker.position.lng();
        // creating variables outside of the for ajax request for faster loading
        var venue, address, category, foursquareId, contentString;

        // ajax request - foursquare api data (https://developer.foursquare.com/docs/)
        $.ajax({
            //	type: 'GET',
            url: foursquareUrl,
            dataType: "json",
            data: {
                client_id: client_id,
                client_secret: client_secret,
                query: marker.title, // gets data from marker.title (array of object)
                near: "Khobar",
                v: 20170523 // version equals date
            },
            success: function (data) {
                // console.log(data);
                // get venue info
                venue = data.response.venues[0];
                // get venue address info
                address = venue.location.formattedAddress[0];
                // get venue category info
                category = venue.categories[0].name;
                // gets link of place
                foursquareId = "https://foursquare.com/v/" + venue.id;
                // populates infowindow with api info
                contentString = "<div class='name'>" + "Name: " + "<span class='info'>" + title + "</span></div>" +
                    "<div class='category'>" + "Catergory: " + "<span class='info'>" + category + "</span></div>" +
                    "<div class='address'>" + "Location: " + "<span class='info'>" + address + "</span></div>" +
                    "<div class='information'>" + "More info: " + "<a href='" + foursquareId + "'>" + "Click here" + "</a></div>";

                marker.contentString;
            },
            error: function () {
                contentString = "<div class='name'>Data is currently not available. Please try again.</div>";
            }
        });


    }

    // iterates through all locations and drop pins on every single location
    for (j = 0; j < locationsSA.length; j++) {
        updateMap(locationsSA[j]);

    } // end of for loop through markers [j]
}

function mapError() {
    alert("Map could not be loaded at this moment. Please try again");
}

// Location Constructor
var Location = function (data) {
    var self = this;
    this.title = data.title;
    this.location = data.location;
    this.show = ko.observable(true);
};

// VIEW MODEL //
var viewModel = function () {
    var view = this;
    // define Location observable array 
    this.myLocations = ko.observableArray();
    this.filteredInput = ko.observable('');
    // this.locationsList = ko.observableArray();

    for (i = 0; i < locationsSA.length; i++) {
        var place = new Location(locationsSA[i]);
        view.myLocations.push(place);
    }

    // from http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    this.searchFilter = ko.computed(function () {
        var filter = view.filteredInput().toLowerCase(); // listens to what user types in to the input search bar
        // iterates through myLocations observable array
        for (j = 0; j < view.myLocations().length; j++) {
            // it filters myLocations as user starts typing
            if (view.myLocations()[j].title.toLowerCase().indexOf(filter) > -1) {
                view.myLocations()[j].show(true); // shows locations according to match with user key words
                if (view.myLocations()[j].marker) {
                    view.myLocations()[j].marker.setVisible(true); // shows/filters map markers according to match with user key words
                }
            } else {
                view.myLocations()[j].show(false); // hides locations according to match with user key words
                if (view.myLocations()[j].marker) {
                    view.myLocations()[j].marker.setVisible(false); // hides map markers according to match with user key words
                }
            }
        }
    });

    // https://developers.google.com/maps/documentation/javascript/events
    this.showLocation = function (locations) {
        google.maps.event.trigger(locations.marker, 'click');
    };
};

// instantiate the ViewModel
viewModel = new viewModel();

// activate knockout apply binding
ko.applyBindings(viewModel);
