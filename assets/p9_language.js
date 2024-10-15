  var langCodeList="Hindi,Tamil,Telugu,Malayalam,Punjabi,Bengali,Oriya,Gujarati,Kannada,Marathi,Urdu";
document.onreadystatechange = function () {

	var urlName = window.location.pathname;
	var langName = GetLanguage(GetSubDomain(window.location.hostname));

	GenerateDropDown();
}
function ChangeLanguage(dropMenu) {
var strLang = dropMenu.options[dropMenu.selectedIndex].value;
	if (strLang != 'english')
		RedurectUrl(strLang);
}


function RedurectUrl(strLang) {
    var newUrl = '';
    var strSegment = window.location.pathname;
    var strSubdomain = window.location.hostname.split(".");
    var curLang = strSubdomain[0];
var origHost = window.location.host;
    if (strSubdomain.length == 2) {
       origHost= (origHost [0] == '.') ? origHost .substr(1) : origHost ;
        newUrl = window.location.protocol + "//" + strLang.toString().toLowerCase() + "." + origHost + strSegment;
    } else if (strSubdomain.length > 2) {      
        if (langCodeList.toString().toLowerCase().indexOf(curLang.toString().toLowerCase()) > -1)
            origHost = window.location.host.replace(curLang, "");
        if (curLang.toString().toLowerCase() == "www")
            origHost = window.location.host.replace("www.", "");
        if (strLang == "English") {
            newUrl = window.location.protocol + "//" + origHost.substring(1) + strSegment;
        } else {
            origHost = (origHost [0] == '.') ? origHost .substr(1) : origHost ;
            newUrl = window.location.protocol + "//" + strLang.toString().toLowerCase() + "." + origHost + strSegment;
        }
    } else
        newUrl = window.location.protocol + '//' + window.location.host + strSegment;
    window.location = newUrl;
	Shopify.analytics.publish("language_selected", { preferred_language : strLang });
}


function GenerateDropDown() {
	var select = document.body;
	var options = ["English", "Hindi", "Bengali", "Telugu", "Kannada"];
	var langName;
	var strSubdomain = window.location.hostname.split(".");
	var curLang = strSubdomain[0];
	if(langCodeList.toString().toLowerCase().indexOf(curLang.toString().toLowerCase()) > -1 && curLang)
	langName=curLang;

	langCodeList = options;
	if (!document.getElementById("ddlLang")) {
		var ddl = document.createElement("select")
			ddl.id = "ddlLang";
		var langDom = document.getElementById("P9Lang")
			if (!langDom)
				document.body.prepend(ddl);
			else
				langDom.appendChild(ddl);
			for (var i = 0; i < options.length; i++) {
				var opt = options[i];
				var el = document.createElement("option");
				el.textContent = opt;
				el.value = opt;
				if (langName && opt.toString().toLowerCase() == langName.toString().toLowerCase())
					el.selected = true;
				document.getElementById("ddlLang").add(el);
			}

			document.getElementById("ddlLang").setAttribute("class", "p9langclass");
		document.getElementById("ddlLang").setAttribute("onchange", "ChangeLanguage(this)");
	}
}
function GetSubDomain(hostname) {
	var regexParse = new RegExp('[a-z\-0-9]{2,63}\.[a-z\.]{2,5}$');
	if (hostname) {
		var urlParts = regexParse.exec(hostname);
		return hostname.replace(urlParts[0], '').slice(0, -1);
	}
}
function GetLanguage(strLanguage) {
	if (!strLanguage)
		return strLanguage;

	var strLang;
	switch (strLanguage.toLowerCase()) {
	case "hindi":
		strLang = "Hindi";
		break;
	case "kannada":
		strLang = "Kannada";
		break;
	case "marathi":
		strLang = "Marathi";
		break;
	case "punjabi":
		strLang = "Punjabi";
		break;
	case "telugu":
		strLang = "Telugu";
		break;
	case "tamil":
		strLang = "Tamil";
		break;
	case "malayalam":
		strLang = "Malayalam";
		break;
	case "bengali":
		strLang = "Bengali";
		break;
	case "bangla":
		strLang = "Bangla";
		break;
	case "gujarati":
		strLang = "Gujarati";
		break;
	case "arabic":
		strLang = "Arabic";
		break;
	case "bhojpuri":
		strLang = "Bhojpuri";
		break;
	case "odia":
		strLang = "Odia";
		break;
	case "oriya":
		strLang = "Oriya";
		break;
	case "rajasthani":
		strLang = "Rajasthani";
		break;
	case "assamese":
		strLang = "Assamese";
		break;
	case "urdu":
		strLang = "Urdu";
		break;
	case "english":
		strLang = "en-in";
		break;

	default:
		break;
	}

	return strLang;
}
function Localize(strHtml, querystring) {

	var locText = '';

	var langName = "Hindi";

	try {
		if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else { // code for IE6, IE5
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		if (querystring != '') {
			querystring = "?page=" + querystring;
		}
		xmlhttp.open("POST", "/TranslateText.loc" + querystring, false);
		xmlhttp.setRequestHeader("Content-type", "text/html");

		xmlhttp.send(escape(strHtml));

		locText = unescape(xmlhttp.responseText);
	} catch (Exception) {
		locText = strHtml;
	}

	if (locText.length > 0)
		return locText;
	else
		return strHtml;
}
