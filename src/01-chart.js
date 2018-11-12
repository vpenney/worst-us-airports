import * as d3 from 'd3'
import * as topojson from 'topojson'

let margin = { top: 10, left: 10, right: 10, bottom: 10 }

let height = 400 - margin.top - margin.bottom
let width = 700 - margin.left - margin.right

let svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

let nyc = [-74, 40.71]
let sf = [-122, 37]
let yng = [-80.6792, 41.2608]
let mmh = [-118.8378, 37.6242]
let hya = [-70.2803, 41.6694]

let projection = d3.geoAlbersUsa()
// let graticule = d3.geoGraticule()

let path = d3.geoPath().projection(projection)


d3.json(require('./data/us_states.topojson')).then(ready)
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  console.log(json.objects)
  // Convert to geojson
  let states = topojson.feature(json, json.objects.us_states)
  projection.fitSize([width, height], states)

  svg
    .selectAll('.states')
    .data(states.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'darkgrey')


  d3.select('#step-yng').on('stepin', () => {
    console.log('I stepped into Ohio')

  svg
    .selectAll('.airports')
    .data(yng)
    .enter()
    .append('circle')
    .attr('d', path)
    .attr('class', 'airports')
    .attr('r', 5)
    .attr(
      'transform',
      d => `translate(${projection([-80.6792, 41.2608])})`
    )
    .attr('fill', 'maroon')
    .attr('opacity', 0.6)

  // svg
  //     .transition()
  //     .attr(
  //     "transform","translate(" + [-74, 40.71] + ")scale(" + 4 + ")"
  //  )
  })


  d3.select('#step-reset').on('stepin', () => {
    console.log('Reset map')

  // Remove any markers
  svg
    .selectAll('.airports')
    .remove()

  // Reset zoom
  svg
  .transition()
  .duration(750)
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  })

  // Remove YNG marker
  d3.select('#step-reset-yng').on('stepin', () => {
    console.log('Reset map')
  svg
    .selectAll('.airports')
    .remove()

  svg
  .transition()
  .duration(750)
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

})


  // Add a step for Mammoth's airport
  d3.select('#step-mmh').on('stepin', () => {
    console.log('Stepped into CA')

  svg
      .transition()
      .attr(
      "transform","translate(" + [-74, 40.71] + ")scale(" + 4 + ")"
   )

  // Add MMH marker
  svg
    .selectAll('.airports')
    .data(mmh)
    .enter()
    .append('circle')
    .attr('d', path)
    .attr('class', 'airports')
    .attr('r', 5)
    .attr(
      'transform',
      d => `translate(${projection(mmh)})`
    )
    .attr('fill', 'maroon')

})

  // Remove MMH marker
  d3.select('#step-reset-mmh').on('stepin', () => {
    console.log('Reset map')
  svg
    .selectAll('.airports')
    .remove()

  svg
  .transition()
  .duration(750)
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

})

  // Add a step for HYA
  d3.select('#step-hya').on('stepin', () => {
    console.log('Stepped into HYA')

  svg
      .transition()
      .attr(
      "transform","translate(" + [-74, 40.71] + ")scale(" + 4 + ")"
   )

  // Add HYA marker
  svg
    .selectAll('.airports')
    .data(hya)
    .enter()
    .append('circle')
    .attr('d', path)
    .attr('class', 'airports')
    .attr('r', 5)
    .attr(
      'transform',
      d => `translate(${projection(hya)})`
    )
    .attr('fill', 'maroon')

})

  // Remove HYA marker
  d3.select('#step-reset-hya').on('stepin', () => {
    console.log('Reset map')
  svg
    .selectAll('.airports')
    .remove()

  svg
  .transition()
  .duration(750)
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

})

}
