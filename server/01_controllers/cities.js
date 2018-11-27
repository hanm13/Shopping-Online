const path=require('path');
const reqPath = path.join(__dirname, '../00_models/cities.json');
const fs = require('fs');

let init = (app) => {

    // Get products - ALL - EVERY CLIENT CAN ACCESS: 
    app.get("/api/cities", async (req, res) => {

        await fs.readFile(reqPath , 'utf8', (err,data) =>{
            //Handle Error
            if(!err) {
                //Handle Success
                // Parse Data to JSON
                var jsonObj = JSON.parse(data);
                //console.log(jsonObj);
                //Send back as Response
                res.json(jsonObj);
            }else {
                //Handle Error
                res.json("Error: " + err )
            }
        });
       
    });

}

module.exports = { init }


/*

Get Cities - Get Request

CURL : curl -v -X GET localhost:6200/api/cities

Response:

< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Access-Control-Allow-Methods: GET,PUT,POST,DELETE
< Access-Control-Allow-Headers: Content-Type, xx-auth
< Content-Type: application/json; charset=utf-8
< Content-Length: 1513
< ETag: W/"5e9-9+R4EUkBVutN3e8jN27hDaYxV4M"
< Date: Sun, 18 Nov 2018 17:53:05 GMT
< Connection: keep-alive
<
[{"name":"Afula"},{"name":"Arad"},{"name":"Ariel"},{"name":"Ashdod"},{"name":"Ashkelon"},{"name":"Baqa al-Gharbiyye"},{"name":"Bat Yam"},{"name":"Beersheba"},{"name":"Beit She'an"},{"name":"Beit Shemesh"},{"name":"Beitar Illit"},{"name":"Bnei Brak"},{"name":"Dimona"},{"name":"Eilat"},{"name":"El'ad"},{"name":"Giv'at Shmuel"},{"name":"Givatayim"},{"name":"Hadera"},{"name":"Haifa"},{"name":"Herzliya"},{"name":"Hod HaSharon"},{"name":"Holon"},{"name":"Jerusalem"},{"name":"Kafr Qasim"},{"name":"Karmiel"},{"name":"Kfar Saba"},{"name":"Kfar Yona"},{"name":"Kiryat Ata"},{"name":"Kiryat Bialik"},{"name":"Kiryat Gat"},{"name":"Kiryat Malakhi"},{"name":"Kiryat Motzkin"},{"name":"Kiryat Ono"},{"name":"Kiryat Shmona"},{"name":"Kiryat Yam"},{"name":"Lod"},{"name":"Ma'ale Adumim"},{"name":"Ma'alot-Tarshiha"},{"name":"Migdal HaEmek"},{"name":"Modi'in Illit"},{"name":"Modi'in-Maccabim-Re'ut"},{"name":"Nahariya"},{"name":"Nazareth"},{"name":"Nesher"},{"name":"Ness Ziona"},{"name":"Netanya"},{"name":"Netivot"},{"name":"Ofakim"},{"name":"Or Akiva"},{"name":"Or Yehuda"},{"name":"Petah Tikva"},{"name":"Ra'anana"},{"name":"Rahat"},{"name":"Ramat Gan"},{"name":"Ramat HaSharon"},{"name":"Ramla"},{"name":"Rehovot"},{"name":"Rishon LeZion"},{"name":"Rosh HaAyin"},{"name":"Safed"},{"name":"Sakhnin"},{"name":"Sderot"},{"name":"Tamra"},{"name":"Tayibe"},{"name":"Tel Aviv"},{"name":"Tiberias"},{"name":"Tira"},{"name":"Tirat Carmel"},{"name":"Umm al-Fahm"},{"name":"Yavne"},{"name":"Yehud-Monosson"},{"name":"Yokneam "}]* Connection #0 to host localhost left intact


*/