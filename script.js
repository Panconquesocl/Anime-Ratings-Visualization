const dataset = "https://gist.githubusercontent.com/Panconquesocl/842625a36b6b7a4bff0f6109099ceb97/raw/531f28896dcd9174a9b7a6bf122d85308156f2a2/data.csv"
const dataset_score_prop = "https://gist.githubusercontent.com/Panconquesocl/2d030d75004ba77a3c3f4b27944fc1cd/raw/d053c8a6f41c1e4db43a214f7bed8837e538d07d/data_types_proportions.csv"


function Scatterplot(data, {
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/scatterplot
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    r = 1.8, // (fixed) radius of dots, in pixels
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = r * 2, // inset the default range, in pixels
    insetTop = inset, // inset the default y-range
    insetRight = inset, // inset the default x-range
    insetBottom = inset, // inset the default y-range
    insetLeft = inset, // inset the default x-range
    width = 800, // outer width, in pixels
    height = 500, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    fill = "none", // fill color for dots
    stroke = "currentColor", // stroke color for the dots
    strokeWidth = 2, // stroke width for dots
  } = {}) {
    // Compute values.
    
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
    
    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X).reverse();
    if (yDomain === undefined) yDomain = d3.extent(Y);
    console.log(xDomain, yDomain)
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 50, xFormat);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    colors = {
        Music: "#d53e4f",
        ONA: "#fc8d59",
        TV:"#fee08b",
        OVA:"#e6f598",
        Movie:"#99d594",
        Special:"#3288bd"
    };
  
    const svg = d3.create("svg")
        .attr("id", "v1")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;")
        .style("background", "rgb(221, 225, 235)")
        .style("border-radius", "5px")
        .style("position", "absolute")
        .style("top","10px")
        .style("left", "10px");

    const Tooltip = d3.select(".box")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("position", "absolute")
        .style("padding", "5px")
        .style("left", "1400px")
        .style("top", "1px")
        .style("width", "400px")
        .style("font-weight", "bold");
    
    svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", "40")
    .attr("y", "20")
    .attr("width", width -marginRight -marginLeft)
    .attr("height", height- marginTop - marginBottom);

    const contenedorEjeX = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", marginTop + marginBottom - height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
  
    const contenedorEjeY = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
  
    const contenedorPuntos = svg.append("g")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("clip-path","url(#clip)")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
        .attr("class", "circulito")
        .attr("cx", i => xScale(i.RANKING_POPULARIDAD))
        .attr("cy", i => yScale(i.PUNTAJE))
        .attr("r", r)
        .style("fill", i => colors[i.TIPO])
        .on("mouseover", (event, d) => {
            Tooltip
                .html(
                    `Anime: ${d.NOMBRE}<br>
                    Puntaje: ${d.PUNTAJE}<br>
                    Posicion en el ranking de popularidad: ${d.RANKING_POPULARIDAD}</br>
                    Posicion en el ranking de puntaje: ${d.RANKING_PUNTAJE}</br>

                     Has click en el circulo para mas informacion :)`
                     )
                .style("opacity", 1);
            const target = d3.select(event.currentTarget)
            .style("fill", "black");
            target.transition().duration(500).style("r", "3px").transition().duration(250).style("r", "1.8px")
        })
        .on("mouseleave", (event,d)=>{
            Tooltip
                .style("opacity", 0);
            const target = d3.select(event.currentTarget)
            .style("fill", i => colors[i.TIPO]).transition().duration(500)
            .style("r", "1.8px")
        })
        .on("click", (event,d) => {Tooltip
            .html(
                `Anime: ${d.NOMBRE}<br>
                 Puntaje: ${d.PUNTAJE}<br>
                 Posicion en el ranking de puntaje: ${d.RANKING_PUNTAJE}</br>
                 Posicion en el ranking de popularidad: ${d.RANKING_POPULARIDAD}</br>
                 Tipo: ${d.TIPO}<br>
                 Emision: ${d.EMISION}<br>
                 Estudio: ${d.ESTUDIO}<br>
                 Cantidad de episodios: ${d.NUMERO_DE_EPISODIOS}<br>
                 Generos: ${d.GENEROS}<br>
                 Temas: ${d.TEMAS}<br>
                 Demo: ${d.DEMOGRAFIA}`
                )
        .style("opacity", 1);
            d3.select(event.currentTarget).transition().duration(1000).ease(d3.easeBounce).style("r", "3px")
            })
        ;

    const funcionzoom = (event) => {
        const transform = event.transform;
        contenedorPuntos.attr("transform", transform);
        const escalaX2 = transform.rescaleX(xScale);
        const escalaY2 = transform.rescaleY(yScale);
        contenedorEjeX.call(xAxis.scale(escalaX2));
        contenedorEjeY.call(yAxis.scale(escalaY2))};

    const zoom = d3.zoom().extent([[0,0],[width,height],])
    .translateExtent([[0,0],[width,height],])
    .scaleExtent([1,10])
    .on("zoom", funcionzoom);
    svg.call(zoom);
    d3.select("#vis-1").node().appendChild(svg.node());

    
}

function filterbytv(datosantiguos) { 
    if (datosantiguos.TIPO == "TV"){return true}
    return false;}
function filterbyova(datosantiguos) { 
    if (datosantiguos.TIPO == "OVA"){return true}
    return false;}
function filterbymovie(datosantiguos) { 
    if (datosantiguos.TIPO == "Movie"){return true}
    return false;}
function filterbyspecial(datosantiguos) { 
    if (datosantiguos.TIPO == "Special"){return true}
    return false;}
function filterbymusic(datosantiguos) { 
    if (datosantiguos.TIPO == "Music"){return true}
    return false;}
function filterbyona(datosantiguos) { 
    if (datosantiguos.TIPO == "ONA"){return true}
    return false;}    

function updatevis1 (data, {
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/scatterplot
    x = ([x]) => x, // given d in data, returns the (quantitative) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    r = 1.8, // (fixed) radius of dots, in pixels
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    inset = r * 2, // inset the default range, in pixels
    insetTop = inset, // inset the default y-range
    insetRight = inset, // inset the default x-range
    insetBottom = inset, // inset the default y-range
    insetLeft = inset, // inset the default x-range
    width = 800, // outer width, in pixels
    height = 500, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft + insetLeft, width - marginRight - insetRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom - insetBottom, marginTop + insetTop], // [bottom, top]
    xLabel, // a label for the x-axis
    yLabel, // a label for the y-axis
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier string for the y-axis
    fill = "none", // fill color for dots
    stroke = "currentColor", // stroke color for the dots
    strokeWidth = 2, // stroke width for dots
  } = {}) {
    // Compute values.
    const X = d3.map(data, x);
    const Y = d3.map(data, y);
  
    // Compute default domains.
    if (xDomain === undefined) xDomain = d3.extent(X).reverse();
    if (yDomain === undefined) yDomain = d3.extent(Y);
  
    // Construct scales and axes.
    const xScale = xType(xDomain, xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).ticks(width / 50, xFormat);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    const colors = {
        Music: "#d53e4f",
        ONA: "#fc8d59",
        TV:"#fee08b",
        OVA:"#e6f598",
        Movie:"#99d594",
        Special:"#3288bd"
    };
  
    const svg = d3.create("svg")
        .attr("id", "v1")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;")
        .style("background", "rgb(221, 225, 235)")
        .style("border-radius", "5px")
        .style("position", "absolute")
        .style("top","10px")
        .style("left", "10px");;

    const Tooltip = d3.select(".box")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("position", "absolute")
        .style("padding", "5px")
        .style("left", "1400px")
        .style("top", "1px")
        .style("width", "400px")
        .style("font-weight", "bold");
    
    svg.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", "40")
    .attr("y", "20")
    .attr("width", width -marginRight -marginLeft)
    .attr("height", height- marginTop - marginBottom);

    const contenedorEjeX = svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("y2", marginTop + marginBottom - height)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("x", width)
            .attr("y", marginBottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(xLabel));
  
    const contenedorEjeY = svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1))
        .call(g => g.append("text")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));
  
  
    const contenedorPuntos = svg.append("g")
        .attr("fill", fill)
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("clip-path","url(#clip)")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
         .attr("class", "circulito")
        .attr("cx", i => xScale(i.RANKING_POPULARIDAD))
        .attr("cy", i => yScale(i.PUNTAJE))
        .attr("r", r)
        .style("fill", i => colors[i.TIPO])
        .on("mouseover", (event, d) => {
            Tooltip
                .html(
                    `Anime: ${d.NOMBRE}<br>
                    Puntaje: ${d.PUNTAJE}<br>
                    Posicion en el ranking de popularidad: ${d.RANKING_POPULARIDAD}</br>
                    Posicion en el ranking de puntaje: ${d.RANKING_PUNTAJE}</br>
                    

                     Has click en el circulo para mas informacion :)`
                     )
                .style("opacity", 1);
            const target = d3.select(event.currentTarget)
            .style("fill", "black");
            target.transition().duration(500).style("r", "3px").transition().duration(250).style("r", "1.8px")
        })
        .on("mouseleave", (event,d)=>{
            Tooltip
                .style("opacity", 0);
            const target = d3.select(event.currentTarget)
            .style("fill", i => colors[i.TIPO]).transition().duration(500)
            .style("r", "1.8px")
        })
        .on("click", (event,d) => {Tooltip
            .html(
                `Anime: ${d.NOMBRE}<br>
                 Puntaje: ${d.PUNTAJE}<br>
                 Posicion en el ranking de puntaje: ${d.RANKING_PUNTAJE}</br>
                 Posicion en el ranking de popularidad: ${d.RANKING_POPULARIDAD}</br>
                 Tipo: ${d.TIPO}<br>
                 Emision: ${d.EMISION}<br>
                 Estudio: ${d.ESTUDIO}<br>
                 Cantidad de episodios: ${d.NUMERO_DE_EPISODIOS}<br>
                 Generos: ${d.GENEROS}<br>
                 Temas: ${d.TEMAS}<br>
                 Demo: ${d.DEMOGRAFIA}`
                )
        .style("opacity", 1);
            d3.select(event.currentTarget).transition().duration(1000).ease(d3.easeBounce).style("r", "3px")
            })
        ;

    const funcionzoom = (event) => {
        const transform = event.transform;
        contenedorPuntos.attr("transform", transform);
        const escalaX2 = transform.rescaleX(xScale);
        const escalaY2 = transform.rescaleY(yScale);
        contenedorEjeX.call(xAxis.scale(escalaX2));
        contenedorEjeY.call(yAxis.scale(escalaY2))};

    const zoom = d3.zoom().extent([[0,0],[width,height],])
    .translateExtent([[0,0],[width,height],])
    .scaleExtent([1,10])
    .on("zoom", funcionzoom);
    svg.call(zoom);
    d3.select("#vis-1").node().appendChild(svg.node());

    
}
function PieChart(data, {
    // Copyright 2021 Observable, Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/pie-chart
    name = ([x]) => x,  // given d in data, returns the (ordinal) label
    value = ([, y]) => y, // given d in data, returns the (quantitative) value
    title, // given d in data, returns the title text
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
    outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
    labelRadius = (innerRadius * 0.4 + outerRadius * 0.8), // center radius of labels
    format = ",", // a format specifier for values (in the label)
    names, // array of names (the domain of the color scale)
    colors, // array of colors for names
    stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
    strokeWidth = 1, // width of stroke separating wedges
    strokeLinejoin = "round", // line join of stroke separating wedges
    padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
  } = {}) {
    // Compute values.
    const N = d3.map(data, name);
    const V = d3.map(data, value);
    const I = d3.range(N.length).filter(i => !isNaN(V[i]));
  
    // Unique the names.
    if (names === undefined) names = N;
    names = new d3.InternSet(names);
  
    // Chose a default color scheme based on cardinality.
    if (colors === undefined) colors = d3.schemeSpectral[names.size];
    if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
  
    // Construct scales.
    const color = d3.scaleOrdinal(names, colors);
    // Compute titles.
    if (title === undefined) {
      const formatValue = d3.format(format);
      title = i => `${N[i]}\n${formatValue(V[i])}`;
    } else {
      const O = d3.map(data, d => d);
      const T = title;
      title = i => T(O[i], i, data);
    }
  
    // Construct arcs.
    const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
    
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .style("background  ", "#eee")
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  
    svg.append("g")
        .attr("stroke", stroke)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-linejoin", strokeLinejoin)
      .selectAll("path")
      .data(arcs)
      .join("path")
        .attr("fill", d => color(N[d.data]))
        .attr("d", arc)
        .attr("class", "pedacito")
        .on("click", (event,d) => {
            const tipo = N[d.data]
            d3.csv(dataset, parsevis1).then(animes => {
            if (tipo == "TV"){
                const datos_nuevos = animes.filter(filterbytv);
                createupdatevis1(animes,datos_nuevos)}
            else if (tipo == "OVA"){
                const datos_nuevos = animes.filter(filterbyova);
                createupdatevis1(animes,datos_nuevos)}
            else if (tipo == "Movie"){
                const datos_nuevos = animes.filter(filterbymovie);
                createupdatevis1(animes,datos_nuevos)}
            else if (tipo == "Special"){
                const datos_nuevos = animes.filter(filterbyspecial);
                createupdatevis1(animes,datos_nuevos)}
            else if (tipo == "Music"){
                const datos_nuevos = animes.filter(filterbymusic);
                createupdatevis1(animes,datos_nuevos)}
            else if (tipo == "ONA"){{
                const datos_nuevos = animes.filter(filterbyona);
                createupdatevis1(animes,datos_nuevos)}}
            
        })})
      .append("title")
        .text(d => title(d.data))
        ;
  
    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
      .selectAll("text")
      .data(arcs)
      .join("text")
        .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .selectAll("tspan")
      .data(d => {
        const lines = `${title(d.data)}`.split(/\n/);
        return (d.endAngle - d.startAngle) > 0.45 ? lines : lines.slice(0, 1);
      })
      .join("tspan")
        .attr("x", 0)
        .attr("y", (_, i) => `${i * 1.1}em`)
        .attr("font-weight", (_, i) => i ? null : "bold")
        .text(d => d);
    
    svg.style("position", "absolute")
        .style("left", "1350px")
        .style("top", "300px");
    const DIV_VIS = d3.select("#vis-1");
    DIV_VIS.node().appendChild(Object.assign(svg.node(), {scales: {color}}));
}

function parsevis1(d){
    const fila_parseada = {
        NOMBRE : d.Name,	
        PUNTAJE :+ d.Score,	
        RANKING_POPULARIDAD : +d.Popularity_Rank,
        RANKING_PUNTAJE: +d.Score_Rank,
        TIPO: d.Type,
        EMISION: d.Air_Date,	
        ESTUDIO: d.Studio,	
        NUMERO_DE_EPISODIOS: +d.Num_of_episodes,	
        GENEROS: d.Genres,	
        TEMAS: d.Themes,	
        DEMOGRAFIA: d.Demographic,
    }
    return fila_parseada
};

function parsevis2(d){
    const fila_parseada = {
       TIPO: d.Tipo,
       CANTIDAD: +d.Valor,
    }
    console.log(fila_parseada)
    return fila_parseada
};

function createvis2(prop){
    const chart = PieChart(prop, {
        name: d => d.TIPO,
        value: d => d.CANTIDAD,
        width:550,
        height: 550,
      });
};
function createvis1(animes){
    d3.select("#v1").remove()
    const chart = Scatterplot(animes, {
        x: d => d.RANKING_POPULARIDAD,
        y: d => d.PUNTAJE,
        xLabel: "Posicion en el ranking de popularidad",
        yLabel: "Puntaje",
        stroke: "black",
        strokeWidth: 0.4,
        width: 1300,
        height: 800,
        fill: "steelblue",
        yDomain: [d3.max(animes, (d)=> d.PUNTAJE), d3.min(animes, (d) => d.PUNTAJE)].reverse()
     })
}
function createupdatevis1(old_data,animes){
    d3.select("#v1").remove()
    const chart = updatevis1(animes, {
        x: d => d.RANKING_POPULARIDAD,
        y: d => d.PUNTAJE,
        xLabel: "Posicion en el ranking de popularidad",
        yLabel: "Puntaje",
        stroke: "black",
        strokeWidth: 0.4,
        width: 1300,
        height: 800,
        fill: "steelblue",
        xDomain: [12164,1],
        yDomain: [d3.max(old_data, (d)=> d.PUNTAJE), d3.min(old_data, (d) => d.PUNTAJE)].reverse()
     })
}

d3.select("#volver").on("click", (event,d) => {window.location = "index.html"});
d3.select("#leeme")
    .on("mouseover", (event, d) => {d3.select("#infobox")
    .transition()
    .duration(1000)
    .style("width", "1300px")
    .style("height", "800px")})
    .on("mouseleave",(e,d) => {d3.select("#infobox")
    .transition()
    .duration(1000)
    .style("width", "10px")
    .style("height", "10px")})
    ;

d3.select("#infobox")
    .on("mouseover", (event, d) => {d3.select("#infobox")
    .transition()
    .duration(1000)
    .style("width", "1300px")
    .style("height", "800px")})
    .on("mouseleave",(e,d) => {d3.select("#infobox")
    .transition()
    .duration(1000)
    .style("width", "10px")
    .style("height", "10px")})
    ;    
d3.select("button").on("click", (event, d) => {d3.csv(dataset, parsevis1).then(animes => createvis1(animes));});
d3.csv(dataset, parsevis1).then(animes => createvis1(animes));
d3.csv(dataset_score_prop, parsevis2).then(datos => createvis2(datos));


