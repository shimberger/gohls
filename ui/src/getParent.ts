import _ from "lodash";

function getParent(path) {
	const paths = path.split("/")
	return (paths.length >= 2) ? "/list/" + _.join(_.take(paths, paths.length - 1), "/") : "/list/"
}

export default getParent;
