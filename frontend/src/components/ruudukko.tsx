import React from 'react'
import miina from "../mine.png"
import { lautaTieto } from "../interfaces/lautaTieto";

interface Props {
    peliLauta: lautaTieto[][],
    onLeftClick(arg0: number, arg1: number): void,
    onRightClick(arg0: number, arg1: number): void,
}

export const Ruudukko: React.FC<Props> = ({peliLauta, onLeftClick, onRightClick}) => {
    const numeroElement = (numero:number) => {
        if(numero == 9){
          return <img src={miina}></img>
        }
        else if(numero == 0){
          return <p></p>
        }
        else if(numero == 1){
          return <p style={{color: "blue"}}>1</p>
        }
        else if(numero == 2){
          return <p style={{color: "green"}}>2</p>
        }
        else if(numero == 3){
          return <p style={{color: "red"}}>3</p>
        }
        else if(numero == 4){
          return <p style={{color: "darkblue"}}>4</p>
        }
        else if(numero == 5){
          return <p style={{color: "darkred"}}>5</p>
        }
        else if(numero == 6){
          return <p style={{color: "cyan"}}>6</p>
        }
        else if(numero == 7){
          return <p style={{color: "black"}}>7</p>
        }
        else if(numero == 8){
          return <p style={{color: "grey"}}>8</p>
        }
      }
    
      const rivit = peliLauta.map((rivi, index) => {
        let content = rivi.map((solu, index2) => {
          return (
            <td 
              key={index.toString() + "." + index2.toString()}
              className = {solu.paljastettu? "avoin" : "suljettu"}
              onClick={(e) => {
                //Left click
                onLeftClick(index, index2)
              }}
              onContextMenu={(e) => {
                //Right click
                e.preventDefault()
    
                onRightClick(index, index2)
              }}
            >
              {solu.paljastettu ? numeroElement(solu.numero) : solu.liputettu ? <p className="lippu">🚩</p>: ""}
            </td>
          );
        })
    
        return (
          <tr key={index}>
            {content}
          </tr>
        );
      })

    return(
        <table>
            <tbody>
                {rivit}
            </tbody>
        </table>
    );
}