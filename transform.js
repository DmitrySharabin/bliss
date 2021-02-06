/**
 * Simple HTML transformations, in HTML!
 * Author: Lea Verou
 */
import $, {$$} from "./src/_.js";

$.ready().then(() => {

var actions = ["before", "after", "start", "end", "around", "attr"];
var methods = {"end": "inside"};

actions.forEach(function(action) {
	var method = methods[action] || action;

	$$("template[data-" + action + "]").forEach(function(template) {
		var context = template.parentNode;
		var selector = template.getAttribute("data-" + action);

		$$(selector, context).forEach(function(element) {
			if (element.classList.contains("transform-ignore")) {
				return;
			}

			var clone = document.importNode(template.content, true);

			if (method == "attr" || method == "around") {
				var content = $$("content", clone);

				if (content.length > 0) {
					// Copy attributes from <content> onto target
					$$(content[0].attributes).forEach(function(attribute) {
						if (attribute.name != "select") {
							element.setAttribute(attribute.name, attribute.value);
						}
					});

					if (method == "around") {
						element?.before(clone);
						// TODO handle multiple <content> and <content select>
						content[0]?.before(element);
						content[0]?.remove();
					}

					return;
				}
			}

			$[method](clone, element);

			element.normalize();
		});
	});
});

});
