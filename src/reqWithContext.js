
export function getObjectVal(objPath, obj) {
	return objPath.split('.')
		.reduce(function (object, property) {
			if (!object)
				return undefined;
			return object[property];
		}, obj);
	}

const valueWithContext = (value, context) => {
		
		const value_result = value.replace(/{{(.*?)}}/g, function (match, context_path) {
			// console.log(`valueWithContext: match`, {match, context_path, context})
			return getObjectVal(context_path, context)
		})
		// console.log(`valueWithContext`, {value, value_result})
		return value_result
	}

const reqWithContext = (req, context) => {
	const _req = { ...req }
	Object.keys(_req)
		.filter(key => ["object", "string", "number"].includes(typeof _req[key]))
		.forEach((key) => {
			const value = _req[key];
			if(typeof value === "string")
				_req[key] = valueWithContext(value, context);
			else if(typeof value === "object")
				_req[key] = reqWithContext(value, context)
		})
	return _req;
}

export default reqWithContext;