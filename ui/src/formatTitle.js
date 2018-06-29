import _ from "lodash";

function formatTitle(title) {
	return title
		.replace(/\.(mp4|flv|mv4|wmv|mpg|avi)/g, ' ')
		.replace(/([a-z0-9])([A-Z])([a-z0-9])/g, (match, m1, m2, m3) => `${m1} ${m2}${m3}`)
		.replace(/([a-z0-9])([A-Z])([A-Z0-9])/g, (match, m1, m2, m3) => `${m1} ${m2} ${m3}`)
		.replace(/\./g, ' ')
		.replace(/\-/g, ' ')
		.replace(/_/g, ' ')
		.split(" ").map(str => _.truncate(str, {
			'length': 15
		})).join(' ');
}

export default formatTitle;
