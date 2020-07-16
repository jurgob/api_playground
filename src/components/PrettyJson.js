import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
// import { github } from 'react-syntax-highlighter/styles/hljs/github';


const PrettyJson = ({ json }) => {
	const jsonString = typeof (json) === 'string'
		? json
		: JSON.stringify(json, null, "  ")

	return (
		<SyntaxHighlighter
			language='json'
		>
			{jsonString}
		</SyntaxHighlighter>
	)
}

export default PrettyJson;