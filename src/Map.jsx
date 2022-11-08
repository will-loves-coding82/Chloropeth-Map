import React from "react";
import * as d3 from 'd3';
import * as topojson from "topojson-client";
import "./Loader.css"
import "./Map.css"
import { rgb } from "d3";

const colorScale = d3.scaleThreshold().domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8)).range([
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618"
  ]);



let prevColor = "";

class Map extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loading: false,
            county:"",
            state:"",
            education:""
        }
        this.drawMap = this.drawMap.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        

    }
    componentDidMount(){
        this.drawMap();
    }

    updateInfo(education, county){

        this.setState({"loading": false})
        //console.log(education[0])
        
        var path = d3.geoPath();
        var svg = d3.select('svg')
        var body = d3.select("#map-cont")

        var tooltip = body
        .append("div")
        .attr("class", "tooltip")
        .style('opacity', 0)
        //set to empty text
        .html(()=> "")

        svg
        .append('g')
        .attr('class', 'counties')
        .selectAll('path')
    
        // provide the topo.json dataset for data() method
        .data(topojson.feature(county, county.objects.counties).features)
        .enter()
        .append('path')
    
        // parameter d is the topological representation of a county in our dataset
        .attr("data-fips", function(d) {return d.id})
        .attr("data-education", d => {

                // we want to filter and create a new array by searching 
                // through the topo data and assigning a county
                // its education level based on this callback function
                let newArr = education.filter( obj => {
                    //console.log("fitering")
                    return obj.fips === d.id})
                
                // newArr should only contain the topo object that represents this county
                if(newArr[0]) {
                    //console.log("created new g tag for county: " + newArr[0].area_name);
                    return newArr[0].bachelorsOrHigher;
                };
                console.log("not done")
            })
            
            // define the value of its path

            .attr('d', path)
            .attr("fill", function(d) {

                // find county
                let result = education.filter( obj => {
                    return obj.fips === d.id;
                } )

                // determine color of this county based on its bachelors data
                if (result[0]){
                    return colorScale(result[0].bachelorsOrHigher) 
                }
            })
            
            .on("mouseover", function(event, d){
                console.log("performed " + event)
                let curr = d3.select(this);
                prevColor = curr.fill;
                curr.style("fill", rgb(150, 200, 70))

                tooltip
                .style("opacity", 0.75)

                .style('left', event.pageX + 10 + 'px')
                .style('top', event.pageY - 28 + 'px')
                .text(function() {
                    let result = education.filter( obj => {
                        return obj.fips === d.id;
                    } )
                    console.log(
                        result[0].area_name 
                    + ", " + result[0].state + ": " 
                    + result[0].bachelorsOrHigher + "%"
                    )
                    return result[0].area_name 
                    + ", " + result[0].state + ": " 
                    + result[0].bachelorsOrHigher + "%"
                })


            })
            .on("mouseout", function(event, d){
                console.log("mouseout")
                d3.select(this).style("fill", prevColor)
                tooltip.style("opacity", 0)
            })

            console.log("done");

        };
    

    drawMap() {
        this.setState({"loading": true})
        console.log("drawing map");
        const education_file = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"
        const county_file = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"

        // promise code taken from freecodecamp snippet 
        Promise.all([d3.json(education_file), 
        d3.json(county_file)])
        .then((data) => 
        this.updateInfo(data[0], data[1])).catch((err) => console.log(err));
    }

 

    render() {
        // <img id = "map" src= "https://upload.wikimedia.org/wikipedia/commons/5/59/Usa_counties_large.svg" alt = "SVG of USA"></img>
        if(this.state.loading === true ){
            console.log("loading")
            return (
                <>
                <div id = "ld-container">
                <div className="lds-roller">
                    <div></div><div></div><div></div><div>
                    </div><div></div><div></div><div>
                    </div><div></div>

                </div>

                </div>
                <h1 id = "wait">Retrieving Data</h1>

                </>
                
                

            )
        }

        else{

        return(
            <>
            <script src="https://unpkg.com/topojson@3"></script>
     

                <div id = "legend" ></div>
                <div id = "map-cont"><svg id = "map" ></svg></div>
                <div id = "source">Source: USDA Economic Research Service</div>
            
            </>
               
        )
        }
        
    }

}

export default Map;