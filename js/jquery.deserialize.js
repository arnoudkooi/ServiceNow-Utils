/**
 * Copyright (C) 2017 Kyle Florence
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * @website https://github.com/kflorence/jquery-deserialize/
 * @version 1.3.7
 *
 * Dual licensed under the MIT and GPLv2 licenses.
 */
(function ( factory ) {
    if ( typeof module === 'object' && module.exports ) {
        // Node/CommonJS
        module.exports = factory( require( 'jquery' ) );
    } else {
        // Browser globals
        factory( window.jQuery );
    }
} (function( jQuery ) {

var push = Array.prototype.push,
    rcheck = /^(?:radio|checkbox)$/i,
    rplus = /\+/g,
    rselect = /^(?:option|select-one|select-multiple)$/i,
    rvalue = /^(?:button|color|date|datetime|datetime-local|email|hidden|month|number|password|range|reset|search|submit|tel|text|textarea|time|url|week)$/i;

function getElements( elements, filter ) {
    return elements.map(function() {
            return this.elements ? jQuery.makeArray( this.elements ) : this;
        }).filter( filter || ":input:not(:disabled)" ).get();
}

function getElementsByName( elements ) {
    var current,
        elementsByName = {};

    jQuery.each( elements, function( i, element ) {
        current = elementsByName[ element.name ];
        if ( current === undefined ) {
            elementsByName[ element.name ] = [];
        }
        elementsByName[ element.name ].push( element );
    });

    return elementsByName;
}

jQuery.fn.deserialize = function( data, options ) {
    var current, element, elements, elementsForName, i, j, k, key, len, length, name, nameIndex, optionsAndInputs,
		property, type, value,
		change = jQuery.noop,
		complete = jQuery.noop,
		names = {},
        normalized = [];

	options = options || {};

	// Backwards compatible with old arguments: data, callback
	if ( jQuery.isFunction( options ) ) {
		complete = options;

	} else {
		change = jQuery.isFunction( options.change ) ? options.change : change;
		complete = jQuery.isFunction( options.complete ) ? options.complete : complete;
	}

	elements = getElements( this, options.filter );

    if ( !data || !elements.length ) {
        return this;
    }

    if ( jQuery.isArray( data ) ) {
        normalized = data;

    } else if ( jQuery.isPlainObject( data ) ) {
        for ( key in data ) {
            jQuery.isArray( value = data[ key ] ) ?
                push.apply( normalized, jQuery.map( value, function( v ) {
                    return { name: key, value: v };
                })) : push.call( normalized, { name: key, value: value } );
        }

    } else if ( typeof data === "string" ) {
        var parts;

        data = data.split( "&" );

        for ( i = 0, length = data.length; i < length; i++ ) {
            parts =  data[ i ].split( "=" );
            push.call( normalized, {
                name: decodeURIComponent( parts[ 0 ].replace( rplus, "%20" ) ),
                value: decodeURIComponent( parts[ 1 ].replace( rplus, "%20" ) )
            });
        }
    }

    if ( !( length = normalized.length ) ) {
        return this;
    }

    elements = getElementsByName( elements );

    for ( i = 0; i < length; i++ ) {
        current = normalized[ i ];

        name = current.name;
        value = current.value;

        elementsForName = elements[ name ];
        if ( !elementsForName || elementsForName.length === 0 ) {
            continue;
        }

        // Keep track of parameters that are named the same for array handling.
        if ( names[ name ] === undefined ) {
            names[ name ] = 0;
        }
        nameIndex = names[ name ]++;

        // Handle the simple case of inputs that take a simple value.
        //
        // Possible arrays are handled by fetching the element that corresponds
        // to the index of the current name.
        if ( elementsForName[ nameIndex ] ) {
            element = elementsForName[ nameIndex ];
            type = ( element.type || element.nodeName ).toLowerCase();
            if ( rvalue.test( type ) ) {
                change.call( element, ( element.value = value ) );

                // Skip further processing for this simple case.
                continue;
            }
        }

        // Handle more complex cases involving select menus, checkboxes, or radios.
        for ( j = 0, len = elementsForName.length; j < len; j++) {
            element = elementsForName[ j ];
            type = ( element.type || element.nodeName ).toLowerCase();
            property = null;

            if ( rcheck.test( type ) ) {
                property = "checked";

            } else if ( rselect.test( type ) ) {
                property = "selected";

            }

            if ( property ) {
                // Flatten all of the inputs (radios & checkboxes) and options
                // (under select menus), so all of them can be treated in a
                // standard way.
                optionsAndInputs = [];
                if ( element.options ) {
                    for ( k = 0; k < element.options.length; k++ ) {
                        optionsAndInputs.push( element.options[ k ] );
                    }

                } else {
                    optionsAndInputs.push(element);
                }

                for ( k = 0; k < optionsAndInputs.length; k++ ) {
                    current = optionsAndInputs[ k ];
                    if ( current.value == value ) {
                        change.call( current, ( current[ property ] = true ) && value );
                    }
                }
            }
        }
    }

    complete.call( this );

    return this;
};

}));
