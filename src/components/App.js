import React from 'react';
import Spinner from './spinner';
import {VictoryChart, VictoryZoomContainer, VictoryLine, VictoryTheme, VictoryLegend, VictoryScatter, VictoryTooltip} from 'victory';
import axios from 'axios';

class App extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			height: window.innerHeight, 
			width: window.innerWidth,
			loading: true,
			EUR_USD: {},
			EUR_BTC: {},
			EUR_ILS: {},
		};
		this.updateDimensions = this.updateDimensions.bind(this);
	}

	handleZoom(domain) {
		this.setState({selectedDomain: domain});
	}

	toChartData(data) {
		return data.map(item=> {
			return {x:new Date(item.time_created), y:parseFloat(item.rate)}
		})
	}

	getRates (currencyPair) {
		axios.get("http://localhost:5000/api/rates/")
		.then(res => {
			console.log(res)
			const EUR_BTC_obj = {data: this.toChartData(res.data["EUR/BTC"]) }
			const EUR_USD_obj = {data: this.toChartData(res.data["EUR/USD"]) }
			const EUR_ILS_obj = {data: this.toChartData(res.data["EUR/ILS"]) }
			this.setState({EUR_BTC: EUR_BTC_obj, EUR_USD: EUR_USD_obj, EUR_ILS: EUR_ILS_obj, loading: false})
		})
		.catch(err => console.log(err))
	}

	handleBrush(domain) {
		this.setState({zoomDomain: domain});
	}

	updateDimensions () {
		this.setState({
			height: window.innerHeight, 
			width: window.innerWidth
		})
	} 

	componentDidMount () {
		window.addEventListener("resize", this.updateDimensions);
		this.getRates()
	}

	render() {
		return this.state.loading ? 
		<Spinner/> :
		(
			<div>
				<VictoryChart 
					width={this.state.width - 50} 
					height={this.state.height - 150} 
					scale={{x: "time"}}
					theme={VictoryTheme.material}
					containerComponent={
						<VictoryZoomContainer/>
					}
				>

				<VictoryLegend 
					x={125}
					orientation="horizontal"
					gutter={20}
					y={5}
					style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
					data={[
						{ name: "EUR/BTC", symbol: { fill: "#8BC34A" } },
						{ name: "EUR/USD", symbol: { fill: "#ff6347" } },
						{ name: "EUR/ILS", symbol: { fill: "#006064" } }
					]}
				/>

				<VictoryLine
					style={{
						data: {stroke: "#ff6347"}
					}}
					data={this.state.EUR_USD.data}
				/>
				<VictoryScatter
					style={{ data: {fill: "#ff6347"}, labels: {fill: "#ff6347"} }}
					size={3}
					data={this.state.EUR_USD.data}
					labels={(d) => d.y}
					labelComponent={<VictoryTooltip/>}
				/>

				<VictoryLine
					style={{
						data: {stroke: "#8BC34A"}
					}}
					data={this.state.EUR_BTC.data}
				/>
				<VictoryScatter
					style={{ data: {fill: "#8BC34A"}, labels: {fill: "#8BC34A"} }}
					size={3}
					data={this.state.EUR_BTC.data}
					labels={(d) => d.y}
    				labelComponent={<VictoryTooltip/>}
				/>

				<VictoryLine
					style={{
						data: {stroke: "#006064"}
					}}
					data={this.state.EUR_ILS.data}
				/>
				<VictoryScatter
					style={{ data: {fill: "#006064"}, labels: {fill: "#006064"} }}
					size={3}
					data={this.state.EUR_ILS.data}
					labels={(d) => d.y}
    				labelComponent={<VictoryTooltip/>}
				/>
		  </VictoryChart>
	  </div>
	);
  }
}

export default App;

