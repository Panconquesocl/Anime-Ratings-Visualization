const texto1 = d3.select(".texto").select("p").style("opacity", 0);
const texto2 = d3.select(".texto2").select("p").style("opacity", 0);
const box1 = d3.select(".container1")
    .on("click", (event,d) => {window.location = "Visualizacion.html"})
    .on("mouseover", (e,d) => {texto1.transition().duration(500).style("opacity",1)})
    .on("mouseleave", (e,d)=>{texto1.style("opacity", 0);});
const box2 = d3.select("#informe").on("click", (event,d) => {window.location = "Informe.html"}).on("mouseover", (e,d) => {texto2.transition().duration(500).style("opacity",1)}).on("mouseleave", (e,d)=>{texto2.style("opacity", 0);});;


