import {useState, useMemo, useRef, useEffect} from 'react';
import dataPoints from '../resource/dataPoints';
import './style.css';


export default function HomePage(){

  const [productToBeDisplayed, setProductToBeDisplayed] = useState(dataPoints);
  const [currentSortingOption, setCurrentSortingOption] = useState("For You");
  const [currentFilterOption, setCurrentFilterOption] = useState({category: "all", color: "all"});
  const allSortingOptions = ["low to high price", "high to low price", "For You"];
  const allFilterOptions = {
    category : ["all", "bottom","top", "western"], 
    color: ["all", "white","black","pink","brown","grey"]
  };

  let sortingOptions = useMemo(()=> {
    return allSortingOptions.map(eachSort => <option value = {eachSort}>{eachSort}</option>);
  }, [allSortingOptions]);

  let filterOptions = useMemo(()=> {
    let filtersArr = [];
    for(let key in allFilterOptions){
      filtersArr.push(
      <>
        <div>{key}</div>
        <select value = {currentFilterOption[key]} onChange ={event => {filterProduct(event,key)}}>{allFilterOptions[key].map(eachValue => {
          return <option value={eachValue}>{eachValue}</option>}
       )}</select>
      </> 
      )
    }
    return filtersArr;
  }, [allFilterOptions,currentFilterOption.category, currentFilterOption.color]);

  function filterProduct(event, filterType){
    let filterValue = event.target.value;
    let newFilter = {...currentFilterOption, [filterType]:filterValue};
    let dataSorting = [...dataPoints];
    for(let eachFilter in newFilter){
      if(newFilter[eachFilter] !== "all"){
        dataSorting = dataSorting.filter((eachProduct)=> {
          return (eachProduct[eachFilter] == [newFilter[eachFilter]])
        });
      }
    }
    setProductToBeDisplayed(dataSorting);
    setCurrentFilterOption(newFilter);
  }

  function sortTheProduct(sortingValue){
    let dataSorting = [...productToBeDisplayed];
    if(sortingValue == "low to high price"){
      for(let i=0; i<dataSorting.length-1; i++){
        for(let j=i+1; j<dataSorting.length; j++){
            if(Number(dataSorting[i].price) > Number(dataSorting[j].price)){
              var temp = dataSorting[j];
              dataSorting[j] = dataSorting[i];
              dataSorting[i] = temp;
            }
        }
      }
    }else if(sortingValue == "high to low price"){
        for(let i=0; i<dataSorting.length-1; i++){
          for(let j=i+1; j<dataSorting.length; j++){
              if(Number(dataSorting[i].price) < Number(dataSorting[j].price)){
                var temp = dataSorting[j];
                dataSorting[j] = dataSorting[i];
                dataSorting[i] = temp;
              }
          }
        }
    }
    setProductToBeDisplayed(dataSorting);
    setCurrentSortingOption(sortingValue);
  }

  return(
    <>  
    Sort: <select value={currentSortingOption} className = "sorting" onChange = { (event) => sortTheProduct(event.target.value)}>{sortingOptions}</select>

    Filter: {filterOptions}
    <div className = "allProduct">{
      productToBeDisplayed.map(
        (eachProduct) => {
          return(
            <div className = "eachProduct">
              <div className = "productImage">{eachProduct.name}({eachProduct.category})</div>
              <div className = "productDesc" style={{backgroundColor: eachProduct.color}}>{eachProduct.color} <br/> {eachProduct.currency + eachProduct.price}</div>
            </div>
          );
      })
    }
    </div>
    </>
  )
}