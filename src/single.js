/**
 * single.js
 * A user-friendly replacement for select boxes (based on multi.js by Fabian Lindfors : https://github.com/Fabianlindfors/multi.js)
 *
 * Author: Spotlab
 * License: MIT
 */
var single = (function() {
    var disabled_limit = false; // This will prevent to reset the "disabled" because of the limit at every click

    // Helper function to trigger an event on an element
    var trigger_event = function(type, el) {
        var e = document.createEvent("HTMLEvents");
        e.initEvent( type, false, true );
        el.dispatchEvent( e );
    };

    // Toggles the target option on the select
    var toggle_option = function (select, event) {
        var option = select.options[event.target.getAttribute("single-index")];

        if (option.disabled) {
          return;
        }

        option.selected = !option.selected;

        for (var i = 0; i < select.options.length; i++) {
            var opt = select.options[i];

            if (opt.getAttribute("data-origin-disabled") === "false") {
                opt.removeAttribute("disabled");
            }
        }

        trigger_event("change", select);
    };

    // Refreshes an already constructed single.js instance
    var refresh_select = function(select, settings) {

        // Clear columns
        select.wrapper.selected.innerHTML = "";
        select.wrapper.non_selected.innerHTML = "";

        // Add headers to columns
        if (settings.non_selected_header && settings.selected_header) {
            var non_selected_header = document.createElement("div");
            var selected_header = document.createElement("div");

            non_selected_header.className = "header";
            selected_header.className = "header";

            non_selected_header.innerText = settings.non_selected_header;
            selected_header.innerText = settings.selected_header;

            select.wrapper.non_selected.appendChild(non_selected_header);
            select.wrapper.selected.appendChild(selected_header);
        }

        // Get search value
        if ( select.wrapper.search ) {
            var query = select.wrapper.search.value;
        }

        // Current group
        var item_group = null;
        var current_optgroup = null;

        // Loop over select options and add to the non-selected and selected columns
        for (var i = 0; i < select.options.length; i++) {

            var option = select.options[i];
            var value = option.value;
            var label = option.textContent || option.innerText;
            var row = document.createElement("a");

            row.tabIndex = 0;
            row.className = "item";
            row.innerText = label;
            row.setAttribute("role", "button");
            row.setAttribute("data-value", value);
            row.setAttribute("single-index", i);

            if (option.disabled) {
                row.className += " disabled";
            }

            // Add row to selected column if option selected
            if (option.selected) {
                row.className += " selected";
                var clone = row.cloneNode(true);
                select.wrapper.selected.appendChild(clone);
            }

            var matchingOption = !query || (query && label.toLowerCase().indexOf(query.toLowerCase()) > -1);

            // Create group if entering a new optgroup
            if (option.parentNode.nodeName == "OPTGROUP" && option.parentNode != current_optgroup) {
                current_optgroup = option.parentNode;
                item_group = document.createElement("div");
                item_group.className = "item-group";

                // add group only if not query or matching option found in group 
                if (matchingOption) {

                    if (option.parentNode.label) {
                        var groupLabel = document.createElement("span");
                        groupLabel.innerHTML = option.parentNode.label;
                        groupLabel.className = "group-label";
                        item_group.appendChild(groupLabel);
                    }

                    select.wrapper.non_selected.appendChild(item_group);
                }
            }

            // Clear group if not inside optgroup
            if (option.parentNode == select) {
                item_group = null;
                current_optgroup = null;
            }

            // Apply search filtering
            if (matchingOption) {
                // Append to group if one exists, else just append to wrapper
                if (item_group != null) {
                    item_group.appendChild(row);
                } else {
                    select.wrapper.non_selected.appendChild(row);
                }
            }
        }
    };


    // Intializes and constructs an single.js instance
    var init = function( select, settings ) {

        /**
         * Set up settings (optional parameter) and its default values
         *
         * Default values:
         * enable_search : true
         * search_placeholder : "Search..."
         */
        settings = typeof settings !== "undefined" ? settings : {};

        settings["enable_search"] =
          typeof settings["enable_search"] !== "undefined"
            ? settings["enable_search"]
            : true;
        settings["search_placeholder"] =
          typeof settings["search_placeholder"] !== "undefined"
            ? settings["search_placeholder"]
            : "Search...";
        settings["non_selected_header"] =
          typeof settings["non_selected_header"] !== "undefined"
            ? settings["non_selected_header"]
            : null;
        settings["selected_header"] =
          typeof settings["selected_header"] !== "undefined"
            ? settings["selected_header"]
            : null;

        // Check if already initalized
        if ( select.dataset.singlejs != null ) {
            return;
        }

        // Make sure element is select
        if ( select.nodeName != "SELECT") {
            return;
        }

        // Hide select
        select.style.display = "none";
        select.setAttribute("data-singlejs", true );

        // Start constructing selector
        var wrapper = document.createElement("div");
        wrapper.className = "single-wrapper";

        // Add search bar
        if (settings.enable_search) {
            var search = document.createElement("input");
            search.className = "search-input";
            search.type = "text";
            search.setAttribute("placeholder", settings.search_placeholder);

            search.addEventListener("input", function() {
            refresh_select(select, settings);
            });

            wrapper.appendChild(search);
            wrapper.search = search;
        }

        // Add columns for selected and non-selected
        var non_selected = document.createElement("div");
        non_selected.className = "non-selected-wrapper";

        var selected = document.createElement("div");
        selected.className = "selected-wrapper";

        // Add click handler to toggle the selected status
        wrapper.addEventListener("click", function (event) {
            if (event.target.getAttribute("single-index")) {
                toggle_option(select, event);
            }
        });

        // Add keyboard handler to toggle the selected status
        wrapper.addEventListener("keypress", function (event) {

            var is_action_key = event.keyCode === 32 || event.keyCode === 13;
            var is_option = event.target.getAttribute("single-index");

            if (is_option && is_action_key) {
                // Prevent the default action to stop scrolling when space is pressed
                event.preventDefault();
                toggle_option(select, event, settings);
            }
        });

        wrapper.appendChild(non_selected);
        wrapper.appendChild(selected);

        wrapper.non_selected = non_selected;
        wrapper.selected = selected;
        
        select.wrapper = wrapper;

        // Add single.js wrapper after select element
        select.parentNode.insertBefore(wrapper, select.nextSibling);

        // Get default value
        if (select.value !== null) {
            selectedValue = select.value;
        }

        // Initialize selector with values from select element
        refresh_select(select, settings);

        // Refresh selector when select values change
        select.addEventListener("change", function() {
            refresh_select(select, settings);
        });
    };

    return init;
}());


// Add jQuery wrapper if jQuery is present
if (typeof jQuery !== "undefined") {
    (function($) {

        $.fn.single = function( settings ) {

            settings = typeof settings !== "undefined" ? settings : {};

            return this.each( function() {
                var $select = $(this);
                single( $select.get(0), settings );
            });
        }

    })(jQuery);
}
