import React from 'react';
import PrettyJson from './PrettyJson'
import axios from 'axios'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";

const MAIN_TEMPLATE = [
	{
		id: "CAT_FACTS",
		req: {
			method: "get",
			url: "https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2",
		}
	}
]


const eventWithContext = (event, context) => {

	console.log('context', context)

	function getObjectVal(objPath, obj) {
		return objPath.split('.')
			.reduce(function (object, property) {
				if (!object)
					return undefined;
				return object[property];
			}, obj);
	}


	const valueWithContext = (value, context) => {
		return value.replace(/{{(.*?)}}/g, function (match, context_path) {
			return getObjectVal(context_path, context)
		})
	}

	const _event = { ...event }
	Object.keys(_event.payload)
		.forEach((key) => {
			const value = _event.payload[key];
			_event.payload[key] = valueWithContext(value, context);
		})
	return _event;


}

class EventPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			history: []
		}
	}

	componentDidMount() {
		const events_template = MAIN_TEMPLATE
		// const events_template = TEMPLATE_2_REGISTRATION

		this.setEvents(JSON.stringify(events_template, '  ', '  '))

	}

	executeEvents = async () =>  {

		const executeEvent = async (event) => {

			
					const history = this.state.history
					const context = {
						responses: history.reduce((acc, cur) => {
							if (cur.response) {
								acc[cur.request.id] = cur.response
							}
							return acc
						}, {})
					}
					const newEvent = JSON.parse(JSON.stringify(event))
					console.log(`newEvent cane: `, newEvent)

					// newEvent.req = eventWithContext(newEvent.req, context)

					this.addHistoryEventRequest(event, newEvent)

					console.log(`newEvent`, newEvent)
					
					try {
						let res = await  axios(newEvent.req)
						this.addHistoryEventResponse(res.data)
					} catch(err){
						console.log(`err`, err)
						//this.addHistoryEventResponse(err.response.data)
					}
					
				


		}


		const events = this.getEvents(this.state)
		try {
			console.log('events String: ', events, typeof events)
			const eventsArray = JSON.parse(events)
			console.log('events ARRAY: ', eventsArray, typeof eventsArray)


			eventsArray.reduce((acc, evt) => {
				return acc.then(() => executeEvent(evt))

			}, Promise.resolve())
		} catch (e) {
			console.error(e)
		}



	}

	setEvents(events) {
		this.setState({ events })
	}
	getEvents() {
		return this.state.events
	}

	addHistoryEventRequest(event, newEvent) {
		this.setState({
			history: this.state.history.concat({
				original: event,
				request: newEvent,
				response: null
			})
		})
	}
	addHistoryEventResponse(response) {
		const prevHistory = [...this.state.history]
		const lastEvent = prevHistory.pop()
		lastEvent.response = response
		this.setState({
			history: prevHistory.concat(lastEvent)
		})
	}

	clear() {
		this.setState({ history: [] })
	}
	render() {
		const history = this.state.history;

		return (
			<div>
				<JsonEditor
					value={this.state.events}
					onChange={currentEvents => {
						this.setEvents(currentEvents)

					}}
				/>
				<button onClick={() => this.executeEvents()} >EXECUTE EVENTS</button>
				<button onClick={() => this.clear()} >CLEAR</button>
				<EventsHistory history={history} />
			</div>
		)
	}

}

const EventReqDisplay = ({ eventHistory }) => {
	const { original, request, response } = eventHistory

	return (<div>
		<div className="colLeft" style={{ float: "left", width: "33%" }} >
			{original && <PrettyJson json={original} />}
		</div>
		<div className="colMiddle" style={{ float: "left", width: "33%" }} >
			{request && <PrettyJson json={request} />}
		</div>
		<div className="colRight" style={{ float: "left", width: "33%" }} >
			{response && <PrettyJson json={response} />}
		</div>
		<div style={{ clear: "both" }} ></div>

	</div>)
}
const EventsHistory = ({ history = [] }) => {
	return (
		<div>
			{history.map((ev, idx) => {
				return (<div key={idx} >
					<EventReqDisplay eventHistory={ev} />
				</div>)
			})}
		</div>
	)
}


const JsonEditor = ({ value = "{}", onChange }) => {
	if (typeof window !== 'undefined') {
		const valueString = typeof value === "string" ? value : JSON.stringify(value, '  ', '  ')
		return (
			<span>
				<AceEditor
					mode="json"
					theme="github"
					name={Math.random() + ""}
					editorProps={{ $blockScrolling: true }}
					height="500px"
					width="1200px"
					value={valueString}
					onChange={onChange}
				/>
			</span>
		)
	}

	return null;

}

export default EventPanel
