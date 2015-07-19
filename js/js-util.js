/**
 * js-util.js
 * 
 * @auteur     marc laville - polinux
 * @Copyleft 2014-2015
 * @date       31/01/2014
 * @version    0.3
 * @revision   $5$
 *
 * @date revision   marc laville : 01/05/2014 : capitalize
 * @date revision   marc laville : 08/05/2014 : arrayRGB
 * @date revision   marc laville : 03/04/2015: toElement, toTimeString, toByteSizeString
 * @date revision   marc laville : 16/05/2015: render (templating)
 * @date revision   marc laville : 01/07/2015: pxUtil.draggable (dragging)
 *
 * Quelques additions utiles en Javascript
 *
 *
 * Licensed under the GPL license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

/*
  * Espace de nommage
  */
var pxUtil = { };

/**
 * Gère la sélection d'un element input
 * 
 * @param {HTMLInputElement} inputElt : le champ à sélectionner
 * 
 * @return {} Returns 
 */
pxUtil.select = function( inputElt ) { return inputElt.setSelectionRange(0, inputElt.value.length); }

// Selection d'un champ sur un click
pxUtil.selectOnClick = function( event ) { return pxUtil.select( event.currentTarget ); };
//           --------------------

pxUtil.draggable = function( node ) {

	var onEvtDragStart = function( event ) {

		event.dataTransfer.setData( 'position', JSON.stringify( { x: event.screenX, y: event.screenY } ) );
		event.dataTransfer.effectAllowed = 'move';
		// make it half transparent
		node.style.opacity = .6;
		node.style.top = [ node.style.top || event.screenY - window.scrollY, 'px' ].join('');

		return;
	},
	onEvtDragEnd  = function( event ) {
		var jsonData = event.dataTransfer.getData('position'),
			data = JSON.parse(jsonData),
			eltStyle = node.style;

		eltStyle.left = [ event.screenX - data.x + parseInt( '0' + eltStyle.left ), 'px' ].join('');
		eltStyle.top = [ Math.max( 0, event.screenY - data.y + parseInt( '0' + eltStyle.top ) ), 'px' ].join('');

		eltStyle.opacity = 1;

    return;
	};
	
	node.style.position = 'absolute';
	node.setAttribute( 'draggable', 'true' );
	node.addEventListener( 'dragstart', onEvtDragStart, false );
	node.addEventListener( 'dragend', onEvtDragEnd, false );

	return
}
// Selection d'un champ sur un click
pxUtil.selectOnClick = function( event ) { return pxUtil.select( event.currentTarget ); };
//           --------------------

/*
 * Surcharge des objets Javascript
 */
/*
  * Classique troncature des espaces de part et d'autre d'une chaine
  */
// Devenu obsolete : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Browser_compatibility
// String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, "");};
//                              -------
/**
 * Répétion d'une chaine
 * 
 * @param {Number} nb : le nombre de répétition
 * @return {String} La chaine répètée 
 */
String.prototype.repeat = String.prototype.repeat || function( nb ){
//                              ----------
  return (nb > 0) ? this + this.repeat( nb - 1 ) : '' ;
};
String.prototype.rpad = String.prototype.lpad || function( str, lg ){
//                              -------
  return (lg > 0) ? this.concat( str.repeat( lg ) ).slice( 0, lg ) : '' ;
};
String.prototype.lpad = String.prototype.lpad || function( str, lg ){
//                              -------
  return (lg > 0) ? str.repeat( lg ).concat(this).slice( -lg ) : '' ;
};

/**
 * Checks if the string starts with the given substring
 * @param  {String} strStartsWith   Substring to check starting with
 * @return {Boolean}    true if string starts with the given substring, false otherwise
 * @author Tomislav Capan
 */
String.prototype.startsWith = String.prototype.startsWith || function(strStartsWith) {
//                              ----------------
  return strStartsWith === this.substring(0, strStartsWith.length);
};

/**
 *  "rgb(25, 20, 240) =>["25", "20", "240"]
 * @param  none
 * @return {Array}    tableau de 3 chaines ou null si le format n'est pas valide
 */
String.prototype.arrayRGB = function() {
//                              --------------
  var match = /rgb\((\d{1,3}), (\d{1,3}), (\d{1,3})\)/.exec(this);
  
  if( match ) 
	match.shift();
  
  return match;
};

/**
 *  "25 1 -3"=>[25, 1, -3]
 * @param  none
 * @return {Array}    tableau d'entiers
 */
String.prototype.toIntArray = function() {
//                              ----------------
    return this.match(/\d+/g).map(function(i) { return +i; });
};
/**
 *
 * Creates and returns element from html string
 * Uses innerHTML to create an element
 *  
 * @param  aucun
 * @return {element}  
 */
String.prototype.toElement = function() {
//                               --------------
    var div = document.createElement('div');

	div.innerHTML = this;
	
	return div.removeChild(div.firstChild);
};


/**
 * Capitalise une chaine
 * @param  aucun
 * @return {String}    La chaine avec toutes les premières lettres en majuscule
 * ne fonctionne que sur les chaines ascii
 */
String.prototype.capitalize = function () {
//                              -----------------
    return this.toLowerCase().replace( /(^|\s)([a-z])/g, function(match) { return match.toUpperCase(); } );
};

/**
 * Utilise la chaîme comme template
 * @param  data
 * @return {String}    La chaine avec toutes les premières lettres en majuscule
 */
String.prototype.render = function(data) {
    return this.replace(/{{(.+?)}}/g, function (m, p1) {
        return data[p1]
    })
}

/**
 * Convertit un nombre de seconde en chaine hh:mm:ss
 * @param  aucun
 * @return {String}    La chaine "hh:mm:ss"
 */
Number.prototype.toTimeString = function() {
//                              --------------------
	var hh = Math.floor(this / 3600),
		mm = Math.floor((this - (hh * 3600)) / 60),
		ss = this - (hh * 3600) - (mm * 60),
		lpad0 = function(n) { return ("0" + n).slice(-2) };

	return [hh, mm, ss].map( lpad0 ).join(':');
};

/**
 * Convertit un nombre en taille en Byte, Kb, Mb ....
 * @param  {Number} precision   nombre de décimales (1 par défaut)
 * @return {String}    La chaine de type '1.5 Mb'
 */
Number.prototype.toByteSizeString = function(precision) {
//                              --------------------------
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
		i = (this > 0) ? parseInt( Math.floor(Math.log(this) / Math.log(1024)) ) : null;

	return (i == null) ? 'n/a' : [ (this / Math.pow(1024, i)).toFixed( precision || 2 ), sizes[i] ].join(' ');
};

/**
 * L'Objet Date support t'il la localisation ,
  * see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#Example:_Checking_for_support_for_locales_and_options_arguments
  * @return {Boolean}  
 */
Date.toLocaleDateStringSupportsLocales = function () {
    try {
        new Date().toLocaleDateString("i");
    } catch (e) {
        return e.name === "RangeError";
    }
    return false;
}

/**
 * L'Objet Date sait revoyer la liste des noms de mois
 * @param  {String} locales   Langage identifier ('fr', 'es','en' ...)
 * @param  {String} optMonth   'long', 'short', .... 
 * 			see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString#Example:_Using_options
 * @return {Array}   month name array
 * @author marc laville
 */
Date.monthNames = Date.monthNames || function( locales, optMonth ) {
//       ---------------
	var arrMonth = [],
		lang = Date.toLocaleDateStringSupportsLocales()  ? (locales || window.navigator.language) : window.navigator.language,
		indexMonth = 2; // Month position in the String returned to toLocaleString 
		
	switch( (lang.split('-'))[0] ) {
		case 'bg' : ;
		case 'en' : ;
		case 'ko' : indexMonth = 1;
			break;
		case 'es' : ;
		case 'pt' : ;
		case 'sv' : indexMonth = 3;
			break;
		default : ;
	}

    for( var dateRef = new Date(2001, 0, 10), m = 0, arr = [] ; m < 12 ; m++ ) {
	
		dateRef.setMonth(m);
		arr = dateRef.toLocaleDateString( lang, { month: optMonth || "long" } ).split(' ');
		arrMonth.push( arr[ arr.length > 1 ? indexMonth : 0 ].replace(/,$/g, "") );
	}
	
	return arrMonth;
}

/*
 * L'Objet Date sait revoyer la liste des noms de jour
 * locales n'est pas supporté par FireFox
 */
Date.dayNames = Date.dayNames || function( locales ) {
//       ---------------
	var arrDay = [],
		dateRef = new Date(),
        // Firefox don't support parametres, so we construct option to conform to Firefox format
        options = {weekday: "long", year: "numeric", month: "long", day: "numeric"},
		lang = Date.toLocaleDateStringSupportsLocales() ? (locales || window.navigator.language) : window.navigator.language,
		indexDay = 0; // Day position in the String returned to toLocaleString 
		
	switch( (lang.split('-'))[0] ) {
//		case 'bg' : ;
		case 'sq' : indexDay = 1;
			break ;
		case 'ko' : indexDay = 3;
			break ;
		default : 
	}

	dateRef.setDate( dateRef.getDate() - dateRef.getDay() ); // Now, dateRef.getDay() return 0
	for( var j = 0 ; j < 7 ; j++ ) {
		/* push le jour en lettre et passe au jour suivant */
		arrDay.push( dateRef.toLocaleString( lang, options).split(' ')[indexDay] );
		dateRef.setDate( dateRef.getDate() + 1);
	}
	
	return arrDay;
}

/**
 * Calcul le jour de Paques
 */
Date.easterDay = function( annee ) {
    var C = Math.floor(annee/100);
    var N = annee - 19*Math.floor(annee/19);
    var K = Math.floor((C - 17)/25);
    var I = C - Math.floor(C/4) - Math.floor((C - K)/3) + 19*N + 15;
    I = I - 30*Math.floor((I/30));
    I = I - Math.floor(I/28)*(1 - Math.floor(I/28)*Math.floor(29/(I + 1))*Math.floor((21 - N)/11));
    var J = annee + Math.floor(annee/4) + I + 2 - C + Math.floor(C/4);
    J = J - 7*Math.floor(J/7);
    var L = I - J;
    var M = 3 + Math.floor((L + 40)/44);
    var D = L + 28 - 31*Math.floor(M/4);

    return new Date( annee, M - 1 , D );
}
