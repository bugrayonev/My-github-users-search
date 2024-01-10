import React from "react";
import styled from "styled-components";
import { useGlobalGithub } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { repos } = useGlobalGithub();


  /* 
    NOTE :  bir array içinden eşsiz degerleri toplayarak bir objenin içine nasıl atarız
  */
  let languages = repos.reduce((total, item) => {
    const { language } = item; // itemlar tektek geldi
    // console.log(language);
    if (!language) return total; // language null e eşitse hesablamaya katmıyoruz direkt total i dön diyoruz
    // (eger return total demezsek ilk nullde aşagıdaki kodlara geçmeyecek ve sistem çalışmyacak )
    if (!total[language]) {
      // total obje dondugu için array deki push methodu yerine bu sekilde kullanıyoruz.
      // total[language] = 1; // orjinal kod // Obje nin içinde deger yoksa ekle
      total[language] = { label: language, value: 1 }; // Pie3D içinde bu sekilde kullanacagımızdan  bu sekilde yazıyoruz
    } else {
      // total[language] = total[language] + 1;  // orjinal kod // Obje nin içinde deger varsa bir artır
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
      };
    }

    return total;
  }, {}); // baslangıc degerini boş obje girdiğimiz için degerlerimiz objenin içinde olacak

  languages = Object.values(languages); // Objeyi array e ceviriyoruz
  languages.sort((a, b) => {
    // buyukten kucuge sıralacagız
    return b.value - a.value;
  });
  languages.slice(0, 5); // en yuksek 5 degeri sergileceğiz
  



        // STARS FORKS
 let {stars,forks} = repos.reduce((total,item)=> {
  const {stargazers_count,name,forks} = item;
  total.stars[stargazers_count] = {label:name,value:stargazers_count} // bu formata çevirdik ==> 59: {label: 'js-cart-setup', value: 59}
  total.forks[forks] = {label:name,value:forks}
  return total
 },{
  stars:{},forks:{}

 })
//console.log(stars); // 59: {label: 'js-cart-setup', value: 59}


// stars = Object.values(stars) // butun objeler bir arrayin içine girdi
// stars = Object.values(stars).slice(-5) // son 5 degeri aldık
 stars = Object.values(stars).slice(-5).reverse(); // küçükten büyüğe idi şimdi büyükten kucuge sıralandı
 forks = Object.values(forks).slice(-5).reverse(); // küçükten büyüğe idi şimdi büyükten kucuge sıralandı







  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData}/>; */}
        <Pie3D data={languages} />
       
        <Column3D data={stars}/>
        <Doughnut2D data={repos}/>
        <Bar3D data={forks}/>
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
