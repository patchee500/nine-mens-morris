"use strict";

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Programm initialisieren
 */

//Variablen für Events
var mouse = new THREE.Vector2()
var weissname = "White";
var schwarzname = "Black";
var mousedown = null;
var radious = 70;
var theta = 0;
var phi = 75;
var onMouseDownTheta = 0;
var onMouseDownPhi = 75;
var onMouseDownPosition = new THREE.Vector2();
var mouseovertarget;
var mousedown = false;
var Mausx = null;
var Mausy = null;
var gefundenundok = false;
var ausgangsstein = null;
//var plane;  //unsichtbare Führungsfläche, kommt nicht zum Einsatz
var projector = new THREE.Projector();
var setzphaseweissvorbei = false;
var setzphaseschwarzvorbei = false;
var weissdarfspringen = false;
var schwarzdarfspringen = false;
var weissgesetzt = 0;
var schwarzgesetzt = 0;
var weissesteine = 0;
var schwarzesteine = 0;
var AktSpielzugtyp = "weisssetzen"; //bei "weisssetzen","schwarzsetzen","weissherausnehmen",
//    "schwarzherausnehmen","weissziehen" oder "schwarzziehen" passiert Verschiedenes
var SpeicherSpielzugtyp;
var letzterSpielzugOK = false;
var bewegterStein = null;
var OnMouseObject = null;
var ClickedObject = null;

// Szene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
camera.position.y = radious * Math.sin(phi * Math.PI / 360);
camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
camera.lookAt(scene.position);
//camera.position.z = 55;
//camera.position.y = 40;
var renderer = new THREE.WebGLRenderer({antialiasing: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColorHex(0xE6E3E1, 1);
document.body.appendChild(renderer.domElement);

window.addEventListener('mousemove', onDocumentMouseMove, false);
window.addEventListener('resize', onWindowResize, false);
window.addEventListener('mouseup', onDocumentMouseUp, false);
renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);

var reuseraycaster = new THREE.Raycaster();

//Licht
var helligkeit = 2.3;
var ylicht = 35;
var intensitaet = 65;
var lichtfarbe = 0xFFFFFF;

var pointLight = new THREE.PointLight(lichtfarbe, helligkeit, intensitaet);
pointLight.position.y = ylicht;
pointLight.position.z = 40;
scene.add(pointLight);
var pointLight2 = new THREE.PointLight(lichtfarbe, helligkeit, intensitaet);
pointLight2.position.y = ylicht;
pointLight2.position.x = -40;
scene.add(pointLight2);
var pointLight3 = new THREE.PointLight(lichtfarbe, helligkeit, intensitaet);
pointLight3.position.y = ylicht;
pointLight3.position.x = 40;
scene.add(pointLight3);
var pointLight4 = new THREE.PointLight(lichtfarbe, helligkeit, intensitaet);
pointLight4.position.y = ylicht;
pointLight4.position.z = -40;
scene.add(pointLight4);

// Meshs

//Spielbrett
var texture_spielbrett = THREE.ImageUtils.loadTexture("./mats/mzl.hownmsoa.png");
var texture_spielbrett_bump = THREE.ImageUtils.loadTexture("./mats/mzl.hownmsoa_bump.png");
var geometry_spielbrett = new THREE.CubeGeometry(40, 0.5, 40);
var material_spielbrett = new THREE.MeshPhongMaterial();
material_spielbrett.map = texture_spielbrett;
material_spielbrett.bumpMap = texture_spielbrett_bump;
material_spielbrett.bumpScale = -1.5;
var mesh_spielbrett = new THREE.Mesh(geometry_spielbrett, material_spielbrett);
mesh_spielbrett.position = new THREE.Vector3(0, -0.5, 0);
scene.add(mesh_spielbrett);

//Es folgt Code für eine unsichtbare Führungsfläche für angehobene Steine(nicht verwendet)

/*
 plane = new THREE.Mesh( new THREE.PlaneGeometry( 40, 40, 8, 8), new THREE.MeshBasicMaterial( { color: 0x000000, opacity: 0.25, transparent: true, wireframe: true } ) );
 plane.visible = true;
 plane.position = new THREE.Vector3(0,2,0);
 plane.rotation.x = 90*(Math.PI/180);
 
 scene.add( plane );	  */

//Es folgt Code für schöne, texturierte Spielsteine(nicht verwendet)

//Angepasster Fremdcode (sehr kompliziert) (vgl. http://stackoverflow.com/questions/8315546/texturing-a-cylinder-in-three-js)
/*
 var coin_sides_geo = new THREE.CylinderGeometry( 2.2, 2.2, 1, 100, 100, true );
 var coin_cap_geo = new THREE.Geometry();     
 var r = 2.2;
 for (var i=0; i<100; i++) {
 var a = i * 1/100 * Math.PI * 2;
 var z = Math.sin(a);
 var x = Math.cos(a);
 var a1 = (i+1) * 1/100 * Math.PI * 2;
 var z1 = Math.sin(a1);
 var x1 = Math.cos(a1);
 coin_cap_geo.vertices.push(
 new THREE.Vertex(new THREE.Vector3(0, 0, 0)),
 new THREE.Vertex(new THREE.Vector3(x*r, 0, z*r)),
 new THREE.Vertex(new THREE.Vector3(x1*r, 0, z1*r)));
 coin_cap_geo.faceVertexUvs[0].push([for(var i=0; i< spielsteine.length; i++)
 {
 spielsteine[i].position.y=0;
 }
 new THREE.UV(0.5, 0.5),
 new THREE.UV(x/2+0.5, z/2+0.5),
 new THREE.UV(x1/2+0.5, z1/2+0.5)]);
 coin_cap_geo.faces.push(new THREE.Face3(i*3, i*3+1, i*3+2));    
 coin_cap_geo.computeFaceNormals();
 }      
 coin_sides_geo.computeFaceNormals();
 var coin_sides_texture = THREE.ImageUtils.loadTexture("./mats/muehlsteinseiteblendametweiss.png");
 var texture_spielsteinseite_bump = THREE.ImageUtils.loadTexture("./mats/muehlsteinseiteweiss_bump.png")
 var coin_cap_texture = THREE.ImageUtils.loadTexture("./mats/muehlsteinblendametweiss.png");
 if(intersects.length > 0 && inters
 var texture_spielstein_bump = THREE.ImageUtils.loadTexture("./mats/muehlsteinweiss_bump.png");      
 var coin_sides_mat = new THREE.MeshPhongMaterial({map:coin_sides_texture});
 coin_sides_mat.bumpMap = texture_spielsteinseite_bump;
 coin_sides_mat.bumpScale = 0.2;
 var coin_sides = new THREE.Mesh( coin_sides_geo, coin_sides_mat );
 
 var coin_cap_mat = new THREE.MeshPhongMaterial({map:coin_cap_texture});
 coin_cap_mat.bumpMap = texture_spielstein_bump;
 coin_cap_mat.bumpScale = 0.2;
 var coin_cap_top = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
 var coin_cap_bottom = new THREE.Mesh( coin_cap_geo, coin_cap_mat );
 coin_cap_top.position.y = 0.5;
 coin_cap_top.rotation.x = Math.PI;	 	  
 
 var coin = new THREE.Mesh();
 coin.add(coin_sides);
 coin.add(coin_cap_top);
 coin.add(coin_cap_bottom);*/

var weissesmaterial = new THREE.MeshPhongMaterial({
    // light
    specular: '#FFFFFF',
    // intermediate
    color: '#FAF4E3',
    // dark
    emissive: '#BABABA',
    shininess: 100
});

var schwarzesmaterial = new THREE.MeshPhongMaterial({
    // light
    specular: '#FFFFFF',
    // intermediate
    color: '#000000',
    // dark
    emissive: '#000000',
    shininess: 100
});

var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 1, 100, 100, false), weissesmaterial);
cylinder.overdraw = true;

var coin = cylinder;  //Sollten die schöneren Spielsteine verwendet werden, muss diese Zeile auskommentiert werden

var spielsteinkopie = coin.clone();
var speicherstein = null;
scene.add(spielsteinkopie);
var vectorinit = new THREE.Vector3(30, 0, 30);
spielsteinkopie.position.copy(vectorinit);
spielsteinkopie.visible = false;

var spielsteine = new Array();

for (var i = 0; i < 24; i++)
{
    spielsteine[i] = new Object();
    spielsteine[i] = coin.clone();
    spielsteine[i].visible = false;
    scene.add(spielsteine[i]);
    spielsteine[i]["farbe"] = "weiss";
    spielsteine[i]["istpermanent"] = false;
}

spielsteine[0].position = new THREE.Vector3(-15, 0, 15);
spielsteine[1].position = new THREE.Vector3(0, 0, 15);
spielsteine[2].position = new THREE.Vector3(15, 0, 15);
spielsteine[3].position = new THREE.Vector3(-10, 0, 10);
spielsteine[4].position = new THREE.Vector3(0, 0, 10);
spielsteine[5].position = new THREE.Vector3(10, 0, 10);
spielsteine[6].position = new THREE.Vector3(-5, 0, 5);
spielsteine[7].position = new THREE.Vector3(0, 0, 5);
spielsteine[8].position = new THREE.Vector3(5, 0, 5);
spielsteine[9].position = new THREE.Vector3(-15, 0, 0);
spielsteine[10].position = new THREE.Vector3(-10, 0, 0);
spielsteine[11].position = new THREE.Vector3(-5, 0, 0);
spielsteine[12].position = new THREE.Vector3(5, 0, 0);
spielsteine[13].position = new THREE.Vector3(10, 0, 0);
spielsteine[14].position = new THREE.Vector3(15, 0, 0);
spielsteine[15].position = new THREE.Vector3(-5, 0, -5);
spielsteine[16].position = new THREE.Vector3(0, 0, -5);
spielsteine[17].position = new THREE.Vector3(5, 0, -5);
spielsteine[18].position = new THREE.Vector3(-10, 0, -10);
spielsteine[19].position = new THREE.Vector3(0, 0, -10);
spielsteine[20].position = new THREE.Vector3(10, 0, -10);
spielsteine[21].position = new THREE.Vector3(-15, 0, -15);
spielsteine[22].position = new THREE.Vector3(0, 0, -15);
spielsteine[23].position = new THREE.Vector3(15, 0, -15);

var muehlen = new Array();
for (var i = 0; i <= 15; i++)
{
    muehlen[i] = new Object();
}
muehlen[0]["steine"] = new Array(spielsteine[0], spielsteine[1], spielsteine[2]);
muehlen[1]["steine"] = new Array(spielsteine[3], spielsteine[4], spielsteine[5]);
muehlen[2]["steine"] = new Array(spielsteine[6], spielsteine[7], spielsteine[8]);
muehlen[3]["steine"] = new Array(spielsteine[9], spielsteine[10], spielsteine[11]);
muehlen[4]["steine"] = new Array(spielsteine[12], spielsteine[13], spielsteine[14]);
muehlen[5]["steine"] = new Array(spielsteine[15], spielsteine[16], spielsteine[17]);
muehlen[6]["steine"] = new Array(spielsteine[18], spielsteine[19], spielsteine[20]);
muehlen[7]["steine"] = new Array(spielsteine[21], spielsteine[22], spielsteine[23]);
muehlen[8]["steine"] = new Array(spielsteine[0], spielsteine[9], spielsteine[21]);
muehlen[9]["steine"] = new Array(spielsteine[3], spielsteine[10], spielsteine[18]);
muehlen[10]["steine"] = new Array(spielsteine[6], spielsteine[11], spielsteine[15]);
muehlen[11]["steine"] = new Array(spielsteine[1], spielsteine[4], spielsteine[7]);
muehlen[12]["steine"] = new Array(spielsteine[16], spielsteine[19], spielsteine[22]);
muehlen[13]["steine"] = new Array(spielsteine[8], spielsteine[12], spielsteine[17]);
muehlen[14]["steine"] = new Array(spielsteine[5], spielsteine[13], spielsteine[20]);
muehlen[15]["steine"] = new Array(spielsteine[2], spielsteine[14], spielsteine[23]);

var zuege = new Array();
for (var i = 0; i <= 23; i++)
{
    zuege[i] = new Object();
}
zuege[0]["positionen"] = new Array(spielsteine[1], spielsteine[9]);
zuege[1]["positionen"] = new Array(spielsteine[0], spielsteine[2], spielsteine[4]);
zuege[2]["positionen"] = new Array(spielsteine[1], spielsteine[14]);
zuege[3]["positionen"] = new Array(spielsteine[4], spielsteine[10]);
zuege[4]["positionen"] = new Array(spielsteine[1], spielsteine[3], spielsteine[5], spielsteine[7]);
zuege[5]["positionen"] = new Array(spielsteine[4], spielsteine[13]);
zuege[6]["positionen"] = new Array(spielsteine[7], spielsteine[11]);
zuege[7]["positionen"] = new Array(spielsteine[4], spielsteine[6], spielsteine[8]);
zuege[8]["positionen"] = new Array(spielsteine[7], spielsteine[12]);
zuege[9]["positionen"] = new Array(spielsteine[0], spielsteine[10], spielsteine[21]);
zuege[10]["positionen"] = new Array(spielsteine[3], spielsteine[9], spielsteine[11], spielsteine[18]);
zuege[11]["positionen"] = new Array(spielsteine[6], spielsteine[10], spielsteine[15]);
zuege[12]["positionen"] = new Array(spielsteine[8], spielsteine[13], spielsteine[17]);
zuege[13]["positionen"] = new Array(spielsteine[5], spielsteine[12], spielsteine[14], spielsteine[20]);
zuege[14]["positionen"] = new Array(spielsteine[2], spielsteine[13], spielsteine[23]);
zuege[15]["positionen"] = new Array(spielsteine[11], spielsteine[16]);
zuege[16]["positionen"] = new Array(spielsteine[15], spielsteine[17], spielsteine[19]);
zuege[17]["positionen"] = new Array(spielsteine[12], spielsteine[16]);
zuege[18]["positionen"] = new Array(spielsteine[10], spielsteine[19]);
zuege[19]["positionen"] = new Array(spielsteine[16], spielsteine[18], spielsteine[20], spielsteine[22]);
zuege[20]["positionen"] = new Array(spielsteine[13], spielsteine[19]);
zuege[21]["positionen"] = new Array(spielsteine[9], spielsteine[22]);
zuege[22]["positionen"] = new Array(spielsteine[19], spielsteine[21], spielsteine[23]);
zuege[23]["positionen"] = new Array(spielsteine[14], spielsteine[22]);

var j = 0;
var theta = 0;
var radius = 55;
var geschwindigkeit = 0.1;
render();

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Neuspielen
 *	Diese Funktion setzt das Spiel auf den Anfangsstatus zurück.
 * Eingegebene Namen, Speicherstände und Kameraperspektive werden dabei nicht zurückgesetzt.
 */

function neuspielen()
{
    setzphaseweissvorbei = false;
    setzphaseschwarzvorbei = false;
    weissdarfspringen = false;
    schwarzdarfspringen = false;
    weissgesetzt = 0;
    schwarzgesetzt = 0;
    weissesteine = 0;
    schwarzesteine = 0;
    AktSpielzugtyp = "weisssetzen";
    letzterSpielzugOK = false;
    bewegterStein = null;
    speicherstein = null;
    ausgangsstein = null;
    OnMouseObject = null;
    ClickedObject = null;
    spielsteinkopie.position.copy(vectorinit);
    spielsteinkopie.visible = false;
    for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
    {
        spielsteine[i].visible = false;
        spielsteine[i]["farbe"] = "weiss";
        spielsteine[i].material = weissesmaterial;
        spielsteine[i]["istpermanent"] = false;
    }
    updateSpielzug();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Speichern
 * 
 * Diese Funktion speichert den aktuellen Spielstand im Local Storage.
 * Es werden Spielernamen und der aktuelle Spielstand(Steine auf Feld, verfügbare Steine, gesetzte Steien)
 * mit dem Datum als Schlüssel abgespeichert.
 */

function speichern()
{
    //Speichern über Index anstatt Datum wäre um einiges eleganter    	  
    var AktSpielstand = new Object();
    AktSpielstand["setzphaseweissvorbei"] = setzphaseweissvorbei;
    AktSpielstand["setzphaseschwarzvorbei"] = setzphaseschwarzvorbei;
    AktSpielstand["weissdarfspringen"] = weissdarfspringen;
    AktSpielstand["schwarzdarfspringen"] = schwarzdarfspringen;
    AktSpielstand["weissgesetzt"] = weissgesetzt;
    AktSpielstand["schwarzgesetzt"] = schwarzgesetzt;
    AktSpielstand["weissesteine"] = weissesteine;
    AktSpielstand["schwarzesteine"] = schwarzesteine;
    AktSpielstand["AktSpielzugtyp"] = AktSpielzugtyp;
    AktSpielstand["Spielsteine"] = spielsteine;
    AktSpielstand["weissname"] = weissname;
    AktSpielstand["schwarzname"] = schwarzname;

    AktSpielstand["Spielsteine"] = new Array();
    //Damit nicht zu viel Speicherplatz verbraten wird, werden nicht alle Attribute des spielsteinarrays gespeichert
    for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
    {
        AktSpielstand["Spielsteine"][i] = new Object();
        AktSpielstand["Spielsteine"][i]["farbe"] = spielsteine[i]["farbe"];
        AktSpielstand["Spielsteine"][i].visible = spielsteine[i].visible;
        AktSpielstand["Spielsteine"][i]["istpermanent"] = spielsteine[i]["istpermanent"];
    }
    //AktSpielstand["Datum"] =  new Date(); //total bledgsuffa
    //var datum = AktSpielstand["Datum"].format("d.m.Y h:i:s");
    var datum = new Date().format("d.m.Y h:i:s");
    localStorage.setItem(datum, JSON.stringify(AktSpielstand));
    alert("Spiel wurde gespeichert");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Laden
 * 
 * Diese Funktion öffnet einen Dialog, welcher alle gespeicherten Spielstände auflistet und eine
 * Lösch- sowie eine Ladeoption anbietet.
 */

function laden()
{
    var tabelleninhalt = "";

    for (var i = 0, laenge = localStorage.length; i < laenge; i++) {
        var key = new Object(localStorage.key(i));
        var Spiel = JSON.parse(localStorage[localStorage.key(i)]);

        tabelleninhalt += "<tr><td>" + key + ":&nbsp;" + Spiel["weissname"] + " vs. " + Spiel["schwarzname"] + "</td><td align=\"right\"><Button onclick=\"wirklichladen(" + i + ")\">Load</Button>&nbsp;<Button onclick=\"loeschen(" + i + ")\">X</Button></td></tr>";
    }
    document.getElementById("spielstandliste").innerHTML = tabelleninhalt;

    $(function () {
        $("#ladedialog").dialog({
            height: 500,
            width: 500,
            position: {my: "right+50%", at: "top+20%", of: top},
            /*buttons: {  //hätte mit Single-Item-Auswahlliste und Bestätigungsbutton sehr professionell gewirkt
             Ok: function() {
             $( this ).dialog( "close" );
             }
             },*/
            modal: true
        });
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Loeschen
 * 
 * Diese Funktion löscht einen ausgewählten Spielstand aus dem Local Storage 	  
 */

function loeschen(pos)
{
    var tabelleninhalt = "";
    var Spiel = localStorage.key(pos);
    localStorage.removeItem(Spiel);
    for (var i = 0, laenge = localStorage.length; i < laenge; i++) {
        var key = new Object(localStorage.key(i));
        var Spiel = JSON.parse(localStorage[localStorage.key(i)]);
        tabelleninhalt += "<tr><td>" + key + ":&nbsp;" + Spiel["weissname"] + " vs. " + Spiel["schwarzname"] + "</td><td align=\"right\"><Button onclick=\"wirklichladen(" + i + ")\">Load</Button>&nbsp;<Button onclick=\"loeschen(" + i + ")\">X</Button></td></tr>";
    }
    document.getElementById("spielstandliste").innerHTML = tabelleninhalt;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Wirklichladen
 * 
 * Diese Funktion setzt den Stand des aktuellen Spiels auf einen ausgewählten Spielstand. 	  
 */

function wirklichladen(pos)
{
    var Spiel = JSON.parse(localStorage[localStorage.key(pos)]);

    setzphaseweissvorbei = Spiel["setzphaseweissvorbei"];
    setzphaseschwarzvorbei = Spiel["setzphaseschwarzvorbei"];
    weissdarfspringen = Spiel["weissdarfspringen"];
    schwarzdarfspringen = Spiel ["schwarzdarfspringen"];
    weissgesetzt = Spiel["weissgesetzt"];
    schwarzgesetzt = Spiel["schwarzgesetzt"];
    weissesteine = Spiel["weissesteine"];
    schwarzesteine = Spiel["schwarzesteine"];
    AktSpielzugtyp = "Wartung"; //Spielzugtyp ausser Gefecht setzen, sodass die Events beim Laden nicht dazwischenpfuschen
    letzterSpielzugOK = false;
    bewegterStein = null;
    ausgangsstein = null;
    OnMouseObject = null;
    ClickedObject = null;
    spielsteinkopie.position.copy(vectorinit);
    spielsteinkopie.visible = false;

    for (var i = 0, laenge = Spiel["Spielsteine"].length; i < laenge; i++)
    {
        spielsteine[i]["istpermanent"] = Spiel["Spielsteine"][i]["istpermanent"];
        if (Spiel["Spielsteine"][i].visible == true)
        {
            spielsteine[i].visible = true;
        }
        else if (Spiel["Spielsteine"][i].visible == false)
        {
            spielsteine[i].visible = false;
        }
        spielsteine[i]["farbe"] = Spiel["Spielsteine"][i]["farbe"];
        if (spielsteine[i]["farbe"] == "weiss")
        {
            spielsteine[i].material = weissesmaterial;
        }
        else if (spielsteine[i]["farbe"] == "schwarz")
        {
            spielsteine[i].material = schwarzesmaterial;
        }
    }
    weissname = Spiel["weissname"];
    schwarzname = Spiel["schwarzname"];
    AktSpielzugtyp = Spiel["AktSpielzugtyp"]; //Spielzugtyp jetzt neu setzen
    updateSpielzug();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Render
 * 
 * Diese Funktion wird als Endlosschleife mehrmals in der Sekunde ausgeführt. Sie führt die Aktionen aus,
 * die ständig getätigt werden müssen.
 */

function render() {

    //Kameradrehung: (nicht mehr verwendbar)
    //camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );  
    //camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );

    mouse.x = (Mausx / window.innerWidth) * 2 - 1;
    mouse.y = -(Mausy / window.innerHeight) * 2 + 1;
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);
    reuseraycaster.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = reuseraycaster.intersectObjects(scene.children);

    if (AktSpielzugtyp == "kameradrehen")
    {
        theta = -((Mausx - onMouseDownPosition.x) * 0.5) + onMouseDownTheta;
        phi = ((Mausy - onMouseDownPosition.y) * 0.5) + onMouseDownPhi;
        phi = Math.min(180, Math.max(0, phi));
        camera.position.x = radious * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.position.y = radious * Math.sin(phi * Math.PI / 360);
        camera.position.z = radious * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        camera.updateMatrix();
    }
    else if (AktSpielzugtyp == "weisssetzen" || AktSpielzugtyp == "schwarzsetzen")
    {
        for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
        {
            if (spielsteine[i]["istpermanent"] != true)
            {
                spielsteine[i].visible = false;
            }
        }
        if (intersects.length > 0 && intersects[0].object.id != 7 && intersects[0].object["istpermanent"] == false)
        {
            if (AktSpielzugtyp == "weisssetzen")
            {
                //weissmalen(intersects[0].object);
                intersects[0].object.material = weissesmaterial;
                intersects[0].object["farbe"] = "weiss";
            }
            else if (AktSpielzugtyp == "schwarzsetzen")
            {
                //schwarzmalen(intersects[0].object);
                intersects[0].object.material = schwarzesmaterial;
                intersects[0].object["farbe"] = "schwarz";
            }
            intersects[0].object.visible = true;
        }
    }
    else if ((AktSpielzugtyp == "weissherausnehmen" || AktSpielzugtyp == "schwarzherausnehmen") && mousedown != true)
    {
        if ((intersects.length > 0 && intersects[0].object.id != 7 && intersects[0].object["istpermanent"] == true) || (intersects.length > 0 && intersects[0].object.position == spielsteinkopie.position))
        {
            if (AktSpielzugtyp == "weissherausnehmen" && istSchwarz(intersects[0].object) || AktSpielzugtyp == "schwarzherausnehmen" && istWeiss(intersects[0].object))
            { //prüfen, ob stein in mühle:
                var inmuehle = false;
                for (var i = 0, laenge = muehlen.length; i < laenge; i++)
                { //Mühlen mit selber Farbe:
                    if (muehlen[i]["steine"][0].material == intersects[0].object.material &&
                            muehlen[i]["steine"][0]["istpermanent"] == true &&
                            muehlen[i]["steine"][1].material == intersects[0].object.material &&
                            muehlen[i]["steine"][1]["istpermanent"] == true &&
                            muehlen[i]["steine"][2].material == intersects[0].object.material &&
                            muehlen[i]["steine"][2]["istpermanent"] == true)
                    {
                        if (muehlen[i]["steine"][0].position.x == intersects[0].object.position.x && muehlen[i]["steine"][0].position.z == intersects[0].object.position.z ||
                                muehlen[i]["steine"][1].position.x == intersects[0].object.position.x && muehlen[i]["steine"][1].position.z == intersects[0].object.position.z ||
                                muehlen[i]["steine"][2].position.x == intersects[0].object.position.x && muehlen[i]["steine"][2].position.z == intersects[0].object.position.z)
                        { //Der Stein ist in einer der Mühlen enthalten, Schleife kann dann verlassen werden:
                            inmuehle = true;
                            break;
                        }
                    }
                }

                if (intersects[0].object.position != spielsteinkopie.position) //Wenn der intersect ein anderer gleichfarbiger Stein, wie der vohrher ausgewählte ist, wobei der alte noch nicht wieder sichtbar ist:
                {
                    if (speicherstein != null && intersects[0].object.position != speicherstein.position)
                    {
                        //speicherstein["istpermanent"]=true;
                        speicherstein.visible = true;
                        speicherstein = null;
                        spielsteinkopie.visible = false;
                        spielsteinkopie.position = vectorinit;
                    }
                }

                if (inmuehle == false)
                {/*
                 if(intersects[0].object.position != spielsteinkopie.position) //Wenn der intersect ein anderer gleichfarbiger Stein, wie der vohrher ausgewählte ist, wobei der alte noch nicht wieder sichtbar ist:
                 {
                 if(speicherstein != null && intersects[0].object.position != speicherstein.position)
                 {
                 //speicherstein["istpermanent"]=true;
                 speicherstein.visible=true;
                 speicherstein=null;
                 }
                 }*/
                    if (AktSpielzugtyp == "weissherausnehmen")
                    {
                        spielsteinkopie.material = schwarzesmaterial;
                    }
                    else if (AktSpielzugtyp == "schwarzherausnehmen")
                    {
                        spielsteinkopie.material = weissesmaterial;
                    }
                    speicherstein = intersects[0].object;
                    intersects[0].object.visible = false;
                    spielsteinkopie.position.copy(intersects[0].object.position);
                    spielsteinkopie.position.y = 2;
                    spielsteinkopie.visible = true;
                }
            }
        }
        else
        {
            if (speicherstein != null)
            {
                speicherstein.visible = true;
            }
            //spielsteinkopie.position.copy(vectorinit);
            spielsteinkopie.visible = false;
        }
    }
    else if (AktSpielzugtyp == "weissziehen" || AktSpielzugtyp == "schwarzziehen")
    {
        if (mousedown != true)
        {

            if ((intersects.length > 0 && intersects[0].object.id != 7 && intersects[0].object["istpermanent"] == true) || (intersects.length > 0 && spielsteinkopie.visible == true && intersects[0].object.position == spielsteinkopie.position))
            {
                if (intersects[0].object.position != spielsteinkopie.position) //Wenn der intersect ein anderer Stein, wie der vohrher ausgewählte ist, wobei der alte noch nicht wieder sichtbar ist
                {
                    if (speicherstein != null && intersects[0].object.position != speicherstein.position)
                    {
                        speicherstein.visible = true;
                        speicherstein["istpermanent"] = true;
                        speicherstein = null;
                    }
                }

                if (AktSpielzugtyp == "weissziehen" && istWeiss(intersects[0].object) || AktSpielzugtyp == "schwarzziehen" && istSchwarz(intersects[0].object))
                {
                    if (AktSpielzugtyp == "weissziehen")
                    {
                        spielsteinkopie.material = weissesmaterial;
                    }
                    else if (AktSpielzugtyp == "schwarzziehen")
                    {
                        spielsteinkopie.material = schwarzesmaterial;
                    }
                    speicherstein = intersects[0].object;
                    intersects[0].object.visible = false;
                    spielsteinkopie.position.copy(intersects[0].object.position);
                    spielsteinkopie.position.y = 2;
                    spielsteinkopie.visible = true;
                }

                if (AktSpielzugtyp == "weissziehen" && istSchwarz(intersects[0].object) || AktSpielzugtyp == "schwarzziehen" && istWeiss(intersects[0].object))
                {
                    spielsteinkopie.visible = false;
                }
            }
            else
            {
                if (speicherstein != null)
                {
                    speicherstein.visible = true;
                    speicherstein["istpermanent"] = true;
                    speicherstein = null;
                }
                spielsteinkopie.position.copy(vectorinit);
                spielsteinkopie.visible = false;
            }
        }
        else if (mousedown == true)
        {
            intersects = reuseraycaster.intersectObject(mesh_spielbrett);

            if (intersects[0]) //brett wurde getroffen
            {
                spielsteinkopie.position.copy(intersects[0].point);
                spielsteinkopie.position.y = 2;
                intersects = reuseraycaster.intersectObjects(scene.children);
                if (intersects[1]) //Stein steht an möglicher Steinposition
                {
                    if (intersects[1].object.id != 7 && intersects[1].object["istpermanent"] == false && intersects[1].object.position != ausgangsstein.position) //Steinposition ist frei, evtl. noch weitere Unterscheidung nötig ob springen, oder nicht
                    {
                        var vglposition = new THREE.Vector3();
                        vglposition.getPositionFromMatrix(intersects[1].object.matrixWorld);
                        spielsteinkopie.position.copy(vglposition);
                        //letzterSpielzugOK=true; evtl schwerwiegende Veränderung aber absolut notwendig, weil sowas von falsch
                    }
                }
            }

        }
    }
    camera.lookAt(scene.position);
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}
;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * onWindowResize
 * 
 * Dieses Event wird ausgelöst, sobald die Fenstergröße des Browsers verändert wird. Es passt die Szene
 * und die Kamera an die veränderten Bedingungen an.
 */

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * onWindowResize
 * 
 * Dieses Event wird ausgelöst, sobald das Mausrad gerollt wird. Es passt die Szene
 * und die Kamera an die veränderten Bedingungen an.
 */

function onDocumentMouseWheel(event) {

    /*
     radious -= event.wheelDeltaY;
     camera.position.x = radious * Math.sin( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
     camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
     camera.position.z = radious * Math.cos( theta * Math.PI / 360 ) * Math.cos( phi * Math.PI / 360 );
     camera.updateMatrix();*/

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * onDocumentMouseMove
 * 
 * Dieses Event wird ausgelöst, sobald die Maus bewegt wird. Es speichert die aktuelle Mausposition in
 * globale Variablen, sodass diese in anderen Funktionen verwendet werden können.
 */

function onDocumentMouseMove(event) {
    event.preventDefault();
    Mausx = event.clientX;
    Mausy = event.clientY;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * onDocumentMouseDown
 * 
 * Dieses Event wird ausgelöst, sobald die Maus gedrückt wird. Sie führt die Aktionen aus, die bei gedrückter
 * Maustaste getätigt werden müssen.
 */

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector(vector, camera);
    reuseraycaster.set(camera.position, vector.sub(camera.position).normalize());
    var intersects = reuseraycaster.intersectObjects(scene.children);
    if (!(intersects.length > 0) || intersects[0].object.id == 7)
    {//Wenn kein Stein geklickt, also ins Nix geklickt oder Spielfeld ausgewählt:
        mousedown = true;
        if (AktSpielzugtyp != "kameradrehen")
        {
            SpeicherSpielzugtyp = AktSpielzugtyp;
        }
        AktSpielzugtyp = "kameradrehen";
        onMouseDownTheta = theta;
        onMouseDownPhi = phi;
        onMouseDownPosition.x = event.clientX;
        onMouseDownPosition.y = event.clientY;
    }
    else if (AktSpielzugtyp == "weisssetzen" || AktSpielzugtyp == "schwarzsetzen")
    {
        if (intersects.length > 0 && intersects[0].object.id != 7 && intersects[0].object["istpermanent"] == false)
        {
            letzterSpielzugOK = true;
            bewegterStein = intersects[0].object;
            intersects[0].object["istpermanent"] = true;

            if (AktSpielzugtyp == "weisssetzen")
            {
                intersects[0].object.material = weissesmaterial;
                intersects[0].object["farbe"] = "weiss";
            }
            else if (AktSpielzugtyp == "schwarzsetzen")
            {
                intersects[0].object.material = schwarzesmaterial;
                intersects[0].object["farbe"] = "schwarz";
            }
        }
    }
    else if (AktSpielzugtyp == "weissherausnehmen" || AktSpielzugtyp == "schwarzherausnehmen")
    {
        mousedown = true;
        if (intersects.length > 0 && intersects[0].object.id != 7 && intersects[0].object["istpermanent"] == true || (intersects.length > 0 && spielsteinkopie.visible == true && intersects[0].object.position == spielsteinkopie.position))
        {
            if (spielsteinkopie.position.y == 2 && spielsteinkopie.visible == true) //Pfuscher-Vergleich, funktioniert aber
            { //Man hätte auch mords aufwändig wieder alle Möglichen und Erlaubten Positionen durchloopen können
                //Wann passiert dieser if-Zweig? Dann, wenn ein von der Farbe her richtiger Stein geclickt wurde, der nicht in einer Mühle ist.	
                letzterSpielzugOK = true;
                //intersects[0].object.visible=false;		    			
                if (intersects[0].object.position == spielsteinkopie.position)
                {
                    for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
                    {
                        if (spielsteine[i].position.x == spielsteinkopie.position.x && spielsteine[i].position.z == spielsteinkopie.position.z)
                        {
                            spielsteine[i]["istpermanent"] = false;
                            break;
                        }
                    }
                }
                else if (intersects[0].object.position != spielsteinkopie.position)
                {
                    intersects[0].object.visible = false;
                    intersects[0].object["istpermanent"] = false;
                }
                spielsteinkopie.position = vectorinit;
                spielsteinkopie.visible = false;
                speicherstein = null;
            }
        }
    }
    else if (AktSpielzugtyp == "weissziehen" || AktSpielzugtyp == "schwarzziehen")
    {
        if (intersects.length > 0 && intersects[0].object.id != 7 && intersects[0].object["istpermanent"] == true && intersects[0].object.position.y == 2 || (intersects.length > 0 && spielsteinkopie.visible == true && intersects[0].object.position == spielsteinkopie.position))
        {//Möglicher Stein zum verschieben wurde angeklickt
            if ((AktSpielzugtyp == "weissziehen" && intersects[0].object.material == weissesmaterial) || (AktSpielzugtyp == "schwarzziehen" && intersects[0].object.material == schwarzesmaterial))
            {
                letzterSpielzugOK = true;
                if (intersects[0].object.position == spielsteinkopie.position)
                {
                    for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
                    {
                        if (spielsteine[i].position.x == spielsteinkopie.position.x && spielsteine[i].position.z == spielsteinkopie.position.z)
                        {
                            spielsteine[i]["istpermanent"] = false;
                            ausgangsstein = spielsteine[i];
                            break;
                        }
                    }
                }
                else if (intersects[0].object.position != spielsteinkopie.position)
                {
                    intersects[0].object.visible = false;
                    intersects[0].object["istpermanent"] = false;
                    ausgangsstein = intersects[0].object;
                }
                spielsteinkopie.visible = true;
                mousedown = true;
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * onDocumentMouseUp
 * 
 * Dieses Event wird ausgelöst, sobald die Maus geklickt wurde. Sie führt die Aktionen aus, die bei
 * vollendeten Mausklick getätigt werden müssen. 	  
 */

function onDocumentMouseUp(event) {
    event.preventDefault();

    if (AktSpielzugtyp == "kameradrehen")
    {
        console.log(SpeicherSpielzugtyp);
        AktSpielzugtyp = SpeicherSpielzugtyp;
        mousedown = false;
        return;
    }

    mousedown = false;

    //Schalter, der im Mousedown-Event gesetzt wird, einige ungültige Spielzüge können bereits in Mousedown festgestellt werden:
    if (letzterSpielzugOK != true)
    {
        return; //Wenn der Spielzug bereits hier als ungültig markiert ist, muss gleich abgebrochen werden
    }
    letzterSpielzugOK = false;

    //Update über alle auf dem Feld befindlichen Steine
    weissesteine = 0;
    schwarzesteine = 0;
    for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
    {
        if (spielsteine[i]["istpermanent"] == true)
        {
            if (spielsteine[i]["farbe"] == "weiss")
            {
                weissesteine++;
            }
            else if (spielsteine[i]["farbe"] == "schwarz")
            {
                schwarzesteine++;
            }
        }
    }
    //console.log(weissesteine +"/"+schwarzesteine);

    //Bei Weissziehen muss vor der Mühlenprüfung bei gültigem Zug die Variable "bewegterStein" gesetzt werden
    if (AktSpielzugtyp == "weissziehen" || AktSpielzugtyp == "schwarzziehen")
    {
        gefundenundok = false;
        for (var i = 0, laenge = spielsteine.length; i < laenge; i++) //Spielstein finden:
        {
            //Das ist der Richtige: (Daraus folgt auch: Spieler hat den Stein zumindest auf einer möglichen Position abgelegt)
            if (spielsteine[i].position.x == spielsteinkopie.position.x && spielsteine[i].position.y == spielsteinkopie.position.y && spielsteine[i].position.z == spielsteinkopie.position.z)
            {
                gefundenundok = true;
                if (AktSpielzugtyp == "weissziehen" && weissdarfspringen == true || AktSpielzugtyp == "schwarzziehen" && schwarzdarfspringen == true)
                {
                    spielsteine[i].visible = true;
                    spielsteine[i]["istpermanent"] = true;
                    bewegterStein = spielsteine[i];
                    if (AktSpielzugtyp == "weissziehen")
                    {
                        spielsteine[i].material = weissesmaterial;
                        spielsteine[i]["farbe"] = "weiss";
                    }
                    else if (AktSpielzugtyp = "schwarzziehen")
                    {
                        spielsteine[i].material = schwarzesmaterial;
                        spielsteine[i]["farbe"] = "schwarz";
                    }
                    speicherstein = null;
                }
                else //Hier muss zusätzlich geprüft werden, ob der Spielzug erlaubt war
                {
                    for (var j = 0, laenge2 = spielsteine.length; j < laenge2; j++) //Nr des Ausgangssteins finden:
                    {
                        //Das ist der Ausgangsstein:
                        if (ausgangsstein.position.x == spielsteine[j].position.x && ausgangsstein.position.y == spielsteine[j].position.y && ausgangsstein.position.z == spielsteine[j].position.z)
                        {
                            var ok = false;
                            for (var k = 0; k < zuege[j]["positionen"].length; k++) //Die möglichen Steine durchgehen, die von dieser Position aus erreichbar sind
                            {
                                //Wenn der abgelegte Stein darunter ist, ist der Spielzug OK:
                                if (zuege[j]["positionen"][k].position.x == spielsteinkopie.position.x && zuege[j]["positionen"][k].position.y == spielsteinkopie.position.y && zuege[j]["positionen"][k].position.z == spielsteinkopie.position.z)
                                {
                                    ok = true;
                                    spielsteine[i].visible = true;
                                    spielsteine[i]["istpermanent"] = true;
                                    bewegterStein = spielsteine[i];
                                    if (AktSpielzugtyp == "weissziehen")
                                    {
                                        spielsteine[i].material = weissesmaterial;
                                        spielsteine[i]["farbe"] = "weiss";
                                    }
                                    else if (AktSpielzugtyp = "schwarzziehen")
                                    {
                                        spielsteine[i].material = schwarzesmaterial;
                                        spielsteine[i]["farbe"] = "schwarz";
                                    }
                                    speicherstein = null;
                                    break;
                                }
                            }
                            if (ok == false)
                            {
                                gefundenundok = false;
                            }
                        }
                    }
                }
            }
        }
        if (gefundenundok == false) //Spieler hat den Stein irgendwo in der Gegend fallengelassen oder an eine ungültige Position geschoben, Spielzug zurücksetzen
        {
            ausgangsstein.visible = true;
            ausgangsstein["istpermanent"] = true;
            spielsteinkopie.visible = false;
            return; //Weiter darf sich nichts ändern
        }
    }

    //Prüfung, ob Bewegung möglich ist
    if ((AktSpielzugtyp == "weisssetzen" || AktSpielzugtyp == "weissziehen" || AktSpielzugtyp == "weissherausnehmen") && setzphaseschwarzvorbei == true && schwarzdarfspringen == false)
    {
        var steinesindallefest = true;
        for (var i = 0, laenge = spielsteine.length; i < laenge; i++) //Alle Spielsteine
        {
            if (spielsteine[i].material == schwarzesmaterial && spielsteine[i]["istpermanent"] == true) //Alle Spielsteine der Farbe, die gleich am Zug ist
            {
                for (var j = 0, laenge2 = zuege[i]["positionen"].length; j < laenge2; j++)  //Alle möglichen Positionen, wo einer dieser Steine hingehen könnte
                {
                    if (zuege[i]["positionen"][j]["istpermanent"] == false) //Eine mögliche Position neben einem dieser Steine ist frei
                    {
                        steinesindallefest = false;
                        break;
                    }
                }
            }
        }
        if (steinesindallefest == true)
        {
            AktSpielzugtyp = "weissgewinnt";
            updateSpielzug();
            return;
        }
    }
    else if ((AktSpielzugtyp == "schwarzsetzen" || AktSpielzugtyp == "schwarzziehen" || AktSpielzugtyp == "schwarzherausnehmen") && setzphaseweissvorbei == true && weissdarfspringen == false)
    {
        var steinesindallefest = true;
        for (var i = 0, laenge = spielsteine.length; i < laenge; i++) //Alle Spielsteine
        {
            if (spielsteine[i].material == weissesmaterial && spielsteine[i]["istpermanent"] == true) //Alle Spielsteine der Farbe, die gleich am Zug ist
            {
                for (var j = 0, laenge2 = zuege[i]["positionen"].length; j < laenge2; j++)  //Alle möglichen Positionen, wo einer dieser Steine hingehen könnte
                {
                    if (zuege[i]["positionen"][j]["istpermanent"] == false) //Eine mögliche Position neben einem dieser Steine ist frei
                    {
                        steinesindallefest = false;
                        break;
                    }
                }
            }
        }
        if (steinesindallefest == true)
        {
            AktSpielzugtyp = "schwarzgewinnt";
            updateSpielzug();
            return;
        }
    }
    //Prüfung Bewegung Ende


    //Prüfung, ob neue Mühle gebildet wurde
    if (AktSpielzugtyp == "weisssetzen" || AktSpielzugtyp == "schwarzsetzen" || AktSpielzugtyp == "weissziehen" || AktSpielzugtyp == "schwarzziehen") //Ob eiene Mühle gebildet wurde:
    {
        var neueMuehle = false;
        if (AktSpielzugtyp == "weisssetzen" || AktSpielzugtyp == "weissziehen")
        {
            for (var i = 0, laenge = muehlen.length; i < laenge && neueMuehle != true; i++)
            {
                if (istWeiss(muehlen[i]["steine"][0]) && muehlen[i]["steine"][0]["istpermanent"] == true && istWeiss(muehlen[i]["steine"][1]) && muehlen[i]["steine"][1]["istpermanent"] == true && istWeiss(muehlen[i]["steine"][2]) && muehlen[i]["steine"][2]["istpermanent"] == true)
                {
                    if (muehlen[i]["steine"][0] == bewegterStein || muehlen[i]["steine"][1] == bewegterStein || muehlen[i]["steine"][2] == bewegterStein)
                    {
                        neueMuehle = true;
                        break;
                    }
                }
            }
            if (neueMuehle == true)
            {
                if (AktSpielzugtyp == "weisssetzen")
                {
                    weissgesetzt++;

                    if (weissgesetzt == 9)
                    {
                        setzphaseweissvorbei = true;
                    }
                }

                //Bevor die Herausnehmen-Phase eingeleitet wird, muss noch geprüft werden, ob überhaupt Steine entfernt werden können:
                var festesteine = 0
                for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
                { //Für alle Steine:
                    if (spielsteine[i]["istpermanent"] == true && istSchwarz(spielsteine[i]))
                    { //Für alle gegnerischen Steine, die auf dem Feld sind:
                        var steinistfest = false
                        for (var j = 0, laenge2 = muehlen.length; j < laenge2; j++)
                        { //Für alle Mühlen
                            if (muehlen[j]["steine"][0].position == spielsteine[i].position || muehlen[j]["steine"][1].position == spielsteine[i].position || muehlen[j]["steine"][2].position == spielsteine[i].position)
                            { //Für alle Mühlen, zu denen ein gegnerischer Stein auf dem Brett gehört:
                                if (istSchwarz(muehlen[j]["steine"][0]) && muehlen[j]["steine"][0]["istpermanent"] == true && istSchwarz(muehlen[j]["steine"][1]) && muehlen[j]["steine"][1]["istpermanent"] == true && istSchwarz(muehlen[j]["steine"][2]) && muehlen[j]["steine"][2]["istpermanent"] == true)
                                { //Für alle aktuell bestehenden Mühlen, zu denen ein gegnerischer Stein auf dem Brett gehört
                                    steinistfest = true;
                                }
                            }
                        }
                        if (steinistfest == true)
                        {
                            festesteine++
                        }
                    }
                }
                if (festesteine == schwarzesteine) //Alle gegnerischen Steine sind fest, Kein Spielsteinentfernen möglich
                {
                    if (setzphaseschwarzvorbei == true)
                    {
                        AktSpielzugtyp = "schwarzziehen";
                        updateSpielzug();
                        return;
                    }
                    else if (setzphaseschwarzvorbei == false)
                    {
                        AktSpielzugtyp = "schwarzsetzen";
                        updateSpielzug();
                        return;
                    }
                }
                else if (festesteine != schwarzesteine)
                {
                    AktSpielzugtyp = "weissherausnehmen";
                    updateSpielzug();
                    return;
                }
            }
        }
        else if (AktSpielzugtyp == "schwarzsetzen" || AktSpielzugtyp == "schwarzziehen")
        {
            for (var i = 0, laenge = muehlen.length; i < laenge && neueMuehle != true; i++)
            {
                if (istSchwarz(muehlen[i]["steine"][0]) && muehlen[i]["steine"][0]["istpermanent"] == true && istSchwarz(muehlen[i]["steine"][1]) && muehlen[i]["steine"][1]["istpermanent"] == true && istSchwarz(muehlen[i]["steine"][2]) && muehlen[i]["steine"][2]["istpermanent"] == true)
                {
                    if (muehlen[i]["steine"][0] == bewegterStein || muehlen[i]["steine"][1] == bewegterStein || muehlen[i]["steine"][2] == bewegterStein)
                    {
                        neueMuehle = true;
                        break;
                    }
                }
            }
            if (neueMuehle == true)
            {
                if (AktSpielzugtyp == "schwarzsetzen")
                {
                    schwarzgesetzt++;

                    if (schwarzgesetzt == 9)
                    {
                        setzphaseschwarzvorbei = true;
                    }
                }

                //Bevor die Herausnehmen-Phase eingeleitet wird, muss noch geprüft werden, ob überhaupt Steine entfernt werden können:
                var festesteine = 0
                for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
                { //Für alle Steine:
                    if (spielsteine[i]["istpermanent"] == true && istWeiss(spielsteine[i]))
                    { //Für alle gegnerischen Steine, die auf dem Feld sind:
                        var steinistfest = false
                        for (var j = 0, laenge2 = muehlen.length; j < laenge2; j++)
                        { //Für alle Mühlen:
                            if (muehlen[j]["steine"][0].position == spielsteine[i].position || muehlen[j]["steine"][1].position == spielsteine[i].position || muehlen[j]["steine"][2].position == spielsteine[i].position)
                            { //Für alle Mühlen, zu denen ein gegnerischer Stein auf dem Brett gehört:
                                if (istWeiss(muehlen[j]["steine"][0]) && muehlen[j]["steine"][0]["istpermanent"] == true && istWeiss(muehlen[j]["steine"][1]) && muehlen[j]["steine"][1]["istpermanent"] == true && istWeiss(muehlen[j]["steine"][2]) && muehlen[j]["steine"][2]["istpermanent"] == true)
                                { //Für alle aktuell bestehenden Mühlen, zu denen ein gegnerischer Stein auf dem Brett gehört
                                    steinistfest = true;
                                }
                            }
                        }
                        if (steinistfest == true)
                        {
                            festesteine++
                        }
                    }
                }
                if (festesteine == weissesteine) //Alle gegnerischen Steine sind fest, Kein Spielsteinentfernen möglich
                {
                    if (setzphaseweissvorbei == true)
                    {
                        AktSpielzugtyp = "weissziehen";
                        updateSpielzug();
                        return;
                    }
                    else if (setzphaseweissvorbei == false)
                    {
                        AktSpielzugtyp = "weisssetzen";
                        updateSpielzug();
                        return;
                    }
                }
                else if (festesteine != weissesteine)
                {
                    AktSpielzugtyp = "schwarzherausnehmen";
                    updateSpielzug();
                    return;
                }
            }
        }
    }
    //Prüfung auf neue Mühle Ende

    if (AktSpielzugtyp == "weisssetzen" || AktSpielzugtyp == "schwarzsetzen") //Dieser Zweig wird ausgeführt, wenn der letzte Zug "Setzen" war und keine Mühle gebildet wurde
    {
        if (AktSpielzugtyp == "weisssetzen")
        {
            if (setzphaseschwarzvorbei == true)
            {
                AktSpielzugtyp = "schwarzziehen";
            }
            else if (setzphaseschwarzvorbei == false)
            {
                AktSpielzugtyp = "schwarzsetzen";
            }
            weissgesetzt++;

            if (weissgesetzt == 9)
            {
                setzphaseweissvorbei = true;
            }
        }
        else if (AktSpielzugtyp == "schwarzsetzen")
        {
            if (setzphaseweissvorbei == true)
            {
                AktSpielzugtyp = "weissziehen";
            }
            else if (setzphaseweissvorbei == false)
            {
                AktSpielzugtyp = "weisssetzen";
            }

            schwarzgesetzt++;

            if (schwarzgesetzt == 9)
            {
                setzphaseschwarzvorbei = true;
            }
        }

        if (AktSpielzugtyp == "weissziehen")
        {
            spielsteinkopie.material = weissesmaterial;
        }
        else if (AktSpielzugtyp == "schwarzziehen")
        {
            spielsteinkopie.material = schwarzesmaterial;
        }
    }
    else if (AktSpielzugtyp == "weissherausnehmen" || AktSpielzugtyp == "schwarzherausnehmen")
    {

        if (weissesteine == 2 && setzphaseweissvorbei == true) //Prüfen, ob Spielende erreicht wurde
        {
            AktSpielzugtyp = "schwarzgewinnt";
            updateSpielzug();
            return;
        }
        if (schwarzesteine == 2 && setzphaseschwarzvorbei == true)
        {
            AktSpielzugtyp = "weissgewinnt";
            updateSpielzug();
            return;
        }

        if (weissesteine == 3 && setzphaseweissvorbei == true) //Prüfen, ob Springphase für eine Seite beginnt
        {
            weissdarfspringen = true;
        }
        if (schwarzesteine == 3 && setzphaseschwarzvorbei == true)
        {
            schwarzdarfspringen = true;
        }

        if (AktSpielzugtyp == "weissherausnehmen")
        {
            if (setzphaseschwarzvorbei == true)
            {
                AktSpielzugtyp = "schwarzziehen";
            }
            else if (setzphaseschwarzvorbei == false)
            {
                AktSpielzugtyp = "schwarzsetzen";
            }
        }
        else if (AktSpielzugtyp == "schwarzherausnehmen")
        {
            if (setzphaseweissvorbei == true)
            {
                AktSpielzugtyp = "weissziehen";
            }
            else if (setzphaseweissvorbei == false)
            {
                AktSpielzugtyp = "weisssetzen";
            }
        }
    }
    else if (AktSpielzugtyp == "weissziehen" || AktSpielzugtyp == "schwarzziehen")
    {
        if (AktSpielzugtyp == "weissziehen")
        {
            if (setzphaseschwarzvorbei == true)
            {
                AktSpielzugtyp = "schwarzziehen";
            }
            else if (setzphasescharzvorbei == false)
            {
                AktSpielzugtyp = "schwarzsetzen";
            }
        }
        else if (AktSpielzugtyp = "schwarzziehen")
        {
            if (setzphaseweissvorbei == true)
            {
                AktSpielzugtyp = "weissziehen";
            }
            else if (setzphaseweissvorbei == false)
            {
                AktSpielzugtyp = "weisssetzen;"
            }

        }
        spielsteinkopie.position.copy(vectorinit);
        spielsteinkopie.visible = false;
    }
    updateSpielzug();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * schwarzmalen und weissmalen
 * 
 * Diese Funktionen hätten es ermöglicht Steine unkompliziert und einfach zu färben. 	  
 */

/*
 function schwarzmalen(obj)
 {
 obj.material = schwarzesmaterial;
 obj["farbe"]="schwarz";
 console.log("schwarzgemalt");
 }
 function weissmalen(obj)
 {
 obj.Material = weissesmaterial;
 obj["farbe"]="weiss";
 console.log("weissgemalt");
 
 }
 */

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * istSetzphase
 * 
 * Diese Funktionen gibt true zurück, sofern die Setzphasen beider Spieler noch nicht beendet sind. 
 * Ansonsten wird false zurückgegeben.
 */

function istSetzphase()
{
    if (setzphaseweissvorbei && setzphaseschwarzvorbei)
    {
        return false
    }
    return true;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * istWeiss
 * 
 * Diese Funktionen gibt true zurück, wenn ein übergebener Spielstein weiss ist. 
 * Ansonsten wird false zurückgegeben.
 */

function istWeiss(obj)
{
    if (obj["farbe"] == "weiss")
    {
        return true;
    }
    else if (obj["farbe"] == "schwarz")
    {
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * istSchwarz
 * 
 * Diese Funktionen gibt true zurück, wenn ein übergebener Spielstein schwarz ist. 
 * Ansonsten wird false zurückgegeben.
 */

function istSchwarz(obj)
{
    if (obj["farbe"] == "schwarz")
    {
        return true;
    }
    else if (obj["farbe"] == "weiss")
    {
        return false;
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Weisseingeben
 * 
 * Diese Funktionen öffnet einen Dialog, indem der Spieler seinen Namen eingeben kann.
 * Der Spieler ist von dann an unter dem neuen Namen bekannt. Dieser wird auch in den gespeicherten
 * Spielständen angeführt
 */

function Weisseingeben()
{
    var name = prompt("Enter Name for White:");

    if (name != null && name != "" && name != "null")
    {
        weissname = name;
        updateSpielzug();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Schwarzeingeben
 * 
 * Diese Funktionen öffnet einen Dialog, indem der Spieler seinen Namen eingeben kann.
 * Der Spieler ist von dann an unter dem neuen Namen bekannt. Dieser wird auch in den gespeicherten
 * Spielständen angeführt
 */

function Schwarzeingeben()
{
    var name = prompt("Enter Name for Black:");

    if (name != null && name != "" && name != "null")
    {
        schwarzname = name;
        updateSpielzug();
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * updateSpielzug
 * 
 * Diese Funktionen aktualisiert die Ausgaben am Bildschirm. Der Aktuelle Spielstand wird erneuert und 
 * die statistischen Angaben über die jeweiligen Spielsteinverhältnisse werden erneuert.
 */

function updateSpielzug()
{
    //Update über alle auf dem Feld befindlichen Steine
    weissesteine = 0;
    schwarzesteine = 0;
    for (var i = 0, laenge = spielsteine.length; i < laenge; i++)
    {
        if (spielsteine[i]["istpermanent"] == true)
        {
            if (spielsteine[i]["farbe"] == "weiss")
            {
                weissesteine++;
            }
            else if (spielsteine[i]["farbe"] == "schwarz")
            {
                schwarzesteine++;
            }
        }
    }

    var weisszusetzen = 0;
    var schwarzzusetzen = 0;
    var weissaufbrett = 0;
    var schwarzaufbrett = 0;
    var weissverloren = 0;
    var schwarzverloren = 0;

    weisszusetzen = 9 - weissgesetzt;
    schwarzzusetzen = 9 - schwarzgesetzt;

    weissaufbrett = weissesteine;
    schwarzaufbrett = schwarzesteine;

    weissverloren = 9 - weisszusetzen - weissaufbrett;
    schwarzverloren = 9 - schwarzzusetzen - schwarzaufbrett;

    document.getElementById("ubweiss").innerHTML = weissname;
    document.getElementById("ubschwarz").innerHTML = schwarzname;
    document.getElementById("weisszusetzen").innerHTML = "Stones left: " + weisszusetzen;
    document.getElementById("schwarzzusetzen").innerHTML = "Stones left: " + schwarzzusetzen;
    document.getElementById("weissaufbrett").innerHTML = "Stones on board: " + weissaufbrett;
    document.getElementById("schwarzaufbrett").innerHTML = "Stones on board: " + schwarzaufbrett;
    document.getElementById("weissverloren").innerHTML = "Stones lost: " + weissverloren;
    document.getElementById("schwarzverloren").innerHTML = "Stones lost: " + schwarzverloren;

    var titel = "";

    if (AktSpielzugtyp == "weisssetzen")
    {
        titel = weissname + " has to put stones";
    }
    else if (AktSpielzugtyp == "weissziehen")
    {
        if (weisszusetzen == 0 && weissaufbrett == 3)
        {
            titel = weissname + " can jump with stones"
        }
        else
        {
            titel = weissname + " can draw stones";
        }
    }
    else if (AktSpielzugtyp == "schwarzsetzen")
    {
        titel = schwarzname + " has to put stones";
    }
    else if (AktSpielzugtyp == "schwarzziehen")
    {
        if (schwarzzusetzen == 0 && schwarzaufbrett == 3)
        {
            titel = schwarzname + " can jump with stones"
        }
        else
        {
            titel = schwarzname + " can draw stones";
        }
    }
    else if (AktSpielzugtyp == "weissherausnehmen")
    {
        titel = weissname + " has to remove a black stone";
    }
    else if (AktSpielzugtyp == "schwarzherausnehmen")
    {
        titel = schwarzname + " has to remove a white stone";
    }
    else if (AktSpielzugtyp == "weissgewinnt")
    {
        titel = weissname + " has won";
    }
    else if (AktSpielzugtyp == "schwarzgewinnt")
    {
        titel = schwarzname + " has won";
    }

    document.getElementById("aktspielzugbezeichnung").innerHTML = titel;
}
