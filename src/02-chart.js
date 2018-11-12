import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 10, left: 10, right: 10, bottom: 10 }

let height = 400 - margin.top - margin.bottom

let width = 700 - margin.left - margin.right

let svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let colorScale = d3
  .scaleSequential(d3.interpolateYlOrRd)
  .clamp(true)

let radiusScale = d3
  .scaleLinear()
  .range([1.5, 3])
  // .clamp(true)

let projection = d3.geoAlbersUsa()
let graticule = d3.geoGraticule()

let path = d3.geoPath().projection(projection)

Promise.all([
  d3.json(require('./data/us_states.topojson')),
  d3.csv(require('./data/departure_locations_2018.csv'))
]).then(ready)




function ready([json, datapoints]) {
  console.log(json)
  console.log(datapoints)


  // Convert to geojson
  let states = topojson.feature(json, json.objects.us_states)
  projection.fitSize([width, height], states)

  let delays = datapoints.map(d => d.delay_minutes)
  let flights = datapoints.map(d => d.sum_flights)

  // Set colorScale domain based on max delay time
  colorScale.domain(delays)

  // Set radiusScale domain based on number of flights
  radiusScale.domain(flights)

  // Here are some states
  svg
    .selectAll('.states')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'darkgrey')

  d3.select('#step-map-airports').on('stepin', () => {
    console.log('Generate those airports!')
  svg
    .selectAll('.airports')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('d', path)
    .attr('class', 'airports')
    .attr('r', d => radiusScale(d.sum_flights))
    .attr(
      'transform',
      d => `translate(${projection([-d.Longitude, d.Latitude])})`
    )
    // .attr('fill', 'white')
    .attr('fill', d => colorScale(d.delay_minutes))
    .attr('opacity', 0.5)
})

  d3.select('#step-filter-airports').on('stepin', () => {
    console.log('Filter those airports!')

    // I only want big airports
    var filtered = datapoints.filter(d => {
      return d.sum_flights < 2000
    })

    console.log(filtered)

    // var bigAirports = filtered.map(d => d.city)
    // yPositionScale.domain(cityNames)

    svg
      .select('airports')
      .transition(1000)

    var circles = svg.selectAll('.airports').data(filtered)
    circles.exit().remove()

  })

  d3.select('#step-largest-airports').on('stepin', () => {
    console.log('Try that shit the other way!')

    // I only want big airports
    var largest_airports = datapoints.filter(d => {
      return d.sum_flights > 100000
    })

    console.log(largest_airports)

    svg
      .select('airports')
      .transition()

    var tiny_airports = svg.selectAll('.airports').data(datapoints)
    tiny_airports.exit().remove()

    // svg
    //   .selectAll('airports')
    //   .data(largest_airports)
    //   .enter()
    //   .append('circle')
    //   .attr('d', path)
    //   .attr('class', 'airports')
    //   .attr('r', d => radiusScale(d.sum_flights))
    //   .attr(
    //     'transform',
    //     d => `translate(${projection([-d.Longitude, d.Latitude])})`
    //   )
    //   .attr('fill', d => colorScale(d.delay_minutes))
    //   .attr('opacity', 0.5)

  })

}
