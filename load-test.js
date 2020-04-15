function restaurant() {
  var dbName = 'guidebook';
  var cuisines = ['American', 'Chinese', 'Irish', 'Turkish', 'Italian', 'Mexican', 'Greek', 'Seafood', 'Indian', 'Japanese', 'Indian', 'Vegetarian', 'Hawaiian'];
  var zipcodes = ["10030", "10471", "10112", "11426", "10039", "10035", "11005", "10307", "11692", "10044", "10026", "10280", "11233", "10103", "10121", "10282", "10473", "10281", "11436", "10153", "11433", "10057", "11242", "10111", "10122", "10168", "10107", "10000"];

  function queryByZip(zipcode) {
    var query = {"address.zipcode" : zipcode};
    var coll = db.getSiblingDB(dbName).getCollection('restaurants');
    var items = coll.find(query).toArray();
    return items;
  }

  function queryByZipCuisine(zipcode, cuisine) {
    var query = {"address.zipcode" : zipcode, "cuisine" : cuisine};
    var coll = db.getSiblingDB(dbName).getCollection('restaurants');
    var items = coll.find(query).toArray();
    return items;
  }

  function queryByCuisineGrade(cuisine, score) {
    var query = {"cuisine" : cuisine, "grades.score" : {"$gte": score}};
    var coll = db.getSiblingDB(dbName).getCollection('restaurants');
    var items = coll.find(query).sort({"grades.score": -1}).toArray();
    return items;
  }

  function queryByCuisineAverageGrade(cuisine, score) {
    var query = {"cuisine" : cuisine, "grades.score" : {"$gte": score}};
    var coll = db.getSiblingDB(dbName).getCollection('restaurants');
    var items = coll.find(query).sort({"grades.score": -1}).toArray();
    return items;
  }

  function updateVisitCountByZipcode(zipcode) {
    var query = {"address.zipcode" : {"$in" : zipcodes}};
    query = {}
    var coll = db.getSiblingDB(dbName).getCollection('restaurants');
    var setValues = {"$inc" : {"visitor_count": 1}};
    var value = coll.updateMany(query, setValues, {multi: true});
    return value;
  }

  this.performReads = function() {
    for(var i = 0; i < 10000; i++) {
      var ci = parseInt(Math.random() * cuisines.length);
      var zi = parseInt(Math.random() * zipcodes.length);
      var score = parseInt(Math.random() * 100);
      var sleepForMs = parseInt(Math.random() * 2);

      var updated = updateVisitCountByZipcode(zipcodes[zi]);
      var citems = queryByZip(cuisines[ci]);
      var zitems = queryByZipCuisine(zipcodes[zi], cuisines[ci]);
      var sitems = queryByCuisineGrade(cuisines[ci], score);
      sleep(sleepForMs);
    }
  }

  this.performWrites = function() {
    for(var i = 0; i < 8000; i++) {
      var zi = parseInt(Math.random() * zipcodes.length);
      var sleepForMs = parseInt(Math.random() * 2);
      var updated = updateVisitCountByZipcode(zipcodes[zi]);
      sleep(sleepForMs);
    }
  }
}

var r = new restaurant();
