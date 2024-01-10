// STEP 1 - Include Dependencies
// Include react
import React from "react";

// Include the react-fusioncharts component
import ReactFC from "react-fusioncharts";

// Include the fusioncharts library
import FusionCharts from "fusioncharts";

// Include the chart type
import Chart from "fusioncharts/fusioncharts.charts";

// Include the theme as fusion
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.candy"; // theme yı burdan degisitiriyoruz

// Adding the chart and theme as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Chart, FusionTheme);

// STEP 3 - Creating the JSON object to store the chart configurations

const Doughnut2D = ({ data }) => {
  /* 
    NOTE :  bir array içinden eşsiz degerleri toplayarak bir objenin içine nasıl atarız
  */
  const mostUsed = data.reduce((total, item) => {
    const { language, stargazers_count: star } = item; // itemlar tektek geldi

    // console.log(language);
    if (!language) return total; // language null e eşitse hesablamaya katmıyoruz direkt total i dön diyoruz
    // (eger return total demezsek ilk nullde aşagıdaki kodlara geçmeyecek ve sistem çalışmyacak )
    if (!total[language]) {
      // total obje dondugu için array deki push methodu yerine bu sekilde kullanıyoruz.
       total[language] = { label: language, stars: star }; // Pie3D içinde bu sekilde kullanacagımızdan  bu sekilde yazıyoruz
    } else {
        total[language] = {
        ...total[language],
        stars: total[language].stars + star,
      };
    }
    return total;
  }, {}); // baslangıc degerini boş obje girdiğimiz için degerlerimiz objenin içinde olacak

  //  most star per language
  const mostPopuler = Object.values(mostUsed)
    .sort((a, b) => {
      
      return b.stars - a.stars;
    }).map((item) => {
      return {...item,value:item.stars}
    })
    .slice(0, 5);

    


  const chartConfigs = {
    type: "doughnut2d", // The chart type
    width: "400", // Width of the chart
    height: "400", // Height of the chart
    dataFormat: "json", // Data type
    dataSource: {
      // Chart Configuration
      chart: {
        caption: "Stars Per Language",
        theme: "candy",
        decimals: 0,
        doughnotRadius: "45%",
        showPercentValues: 0, // % ifadesini çıkartık,

        //  paletteColors: "#f0db4f"
      },
      // Chart Data
      data: mostPopuler,
    },
  };
  return <ReactFC {...chartConfigs} />;
};

export default Doughnut2D;
