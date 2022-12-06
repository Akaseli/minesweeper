import { useEffect, useState } from "react";
import miina from "./mine.png"
import { lautaTieto } from "./interfaces/lautaTieto";
import { Ruudukko } from "./components/ruudukko";

//Generoi pelilaudan halutuilla arvoilla
function generoiMiinat(x: number, y: number, miinat: number):lautaTieto[][] {
  let board: lautaTieto[][] = []

  for (let i = 0; i < x; i++) {
    let rivi: lautaTieto[] = []
    for (let j = 0; j < y; j++) {
      rivi.push({ numero: 0, liputettu: false, paljastettu: false })
    }
    board.push(rivi)
  }

  //Aseta miinat
  let asetetut = 0
  while (asetetut < miinat) {
    let xM = Math.floor(Math.random() * (x))
    let yM = Math.floor(Math.random() * (y))

    if (board[xM][yM].numero == 0) {
      board[xM][yM].numero = 9
      asetetut++;
    }
  }

  //Laskenaapurit
  let suunnat = [
    [0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, -1], [-1, 1]
  ]

  board.forEach((rivi, index) => {
    rivi.forEach((solu, index2) => {
      let naapurit = 0


      if (board[index][index2].numero != 9) {
        suunnat.forEach((suunta) => {
          let xLook: number = index + suunta[0]
          let yLook: number = index2 + suunta[1]

          if (xLook >= 0 && xLook <= x - 1 && yLook >= 0 && yLook <= y - 1) {
            if (board[index + suunta[0]][index2 + suunta[1]].numero == 9) {
              naapurit += 1
            }
          }
        })

        solu.numero = naapurit
      }
    })
  })

  return board
}

function App() {
  const [peliLauta, paivitaLauta] = useState<lautaTieto[][]>([])
  const [solujaJaljella, paivitaSolut] = useState(0)
  const [liputettuja, paivitaLiputetut] = useState(0)
  const [vaikeustaso, vaihdaTaso] = useState<0 | 1 | 2>(0)
  const [peli, paivitaPeli] = useState(true)


  const koot = [
    [9, 9, 10],
    [16, 16, 40],
    [30, 16, 99]
  ]


  /*
    0 HELPPO = 9x9 - 10 miinaa
    1 KESKIVTASO = 16x16 - 40 miinaa
    2 VAIKEA = 30x16 - 99 miinaa
  */

  //Ladatessa sivuston generoi helpon pelin
  useEffect(() => {
    paivitaLauta(generoiMiinat(9, 9, 10))
    paivitaSolut(9*9)
    paivitaLiputetut(0)
    vaihdaTaso(0)
    paivitaPeli(true)
  }, [])

  //Tarkistaa onko peli päättynyt
  useEffect(() => {
    if(solujaJaljella == koot[vaikeustaso][2]){
      paivitaPeli(false)
    }
  }, [solujaJaljella])

  //Document title
  useEffect(() => {
    if(!peli){
      document.title = "Miinaharava"
    }
    else{
      document.title = "Miinaharava | " + liputettuja + "/" + koot[vaikeustaso][2] 
    }
    
  }, [peli, liputettuja, vaikeustaso])

  //Paljastaa ruudun ja tekee tarvittavat seuraavat toimet
  const paljastaRuutu = (x: number, y:number) => {
    let lauta:lautaTieto[][] = [...peliLauta]

    if(lauta[x][y].paljastettu) return;
    

    lauta[x][y].paljastettu = true
    paivitaSolut(vanhatSolut => vanhatSolut -1)

    //Tyhjä ruutu -> paljasta naapurit
    if(lauta[x][y].numero == 0){
      paivitaLauta(lauta)
      paljastaNaapurit(x, y)
    }
    //Miina ruutu -> häviö ja kaikki näkyviin
    else if(lauta[x][y].numero == 9){
      paivitaPeli(false)
      paljastaKaikki()
    }
    //Muu -> numero ruutu, ei jatko toimenpiteitä
    else{
      paivitaLauta(lauta)
    }
  }

  //Paljastaa koko laudan
  const paljastaKaikki = () =>{
    let lauta:lautaTieto[][] = [...peliLauta]

    lauta.forEach((x, index) => {
      x.forEach((y, index2) => {
        lauta[index][index2].paljastettu = true
      })
    })
    paivitaLauta(lauta)
  }

  //Paljastaa vierekkäiset ruudut.
  const paljastaNaapurit= (x: number, y: number) => {
    const suunnat = [[1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]

    let lauta:lautaTieto[][] = [...peliLauta]
    
    suunnat.forEach((suunta) => {
      let naapuriX = x + suunta[0]
      let naapuriY = y + suunta[1]

      if(naapuriX >= 0 && naapuriY >=0
        && naapuriX < koot[vaikeustaso][0] && naapuriY < koot[vaikeustaso][1]
        && lauta[naapuriX][naapuriY].numero != 9
        && !lauta[naapuriX][naapuriY].paljastettu
        && !lauta[naapuriX][naapuriY].liputettu
      ){
        return paljastaRuutu(naapuriX, naapuriY)
      }
    })
  }

  //Kun käyttäjä painaa hiiren oikeaa
  const liputa = (x:number, y:number) => {
    let lauta = [...peliLauta]
    
    lauta[x][y].liputettu = !lauta[x][y].liputettu

    if(lauta[x][y].liputettu){
      paivitaLiputetut(liputettuja + 1)
    }
    else{
      paivitaLiputetut(liputettuja - 1)
    }

    paivitaLauta(lauta)
  }

  //Otsikko teksti
  const peliTeksti = () => {
    if(!peli && solujaJaljella == koot[vaikeustaso][2]){
      return <h2>Voitit pelin!</h2>
    }
    else if(!peli){
      return <h2>Hävisit pelin!</h2>
    }
    else{
      return <h2>Miinaharava</h2>
    }
    
  }

  return (
    <div id='app'>
      <div id='header'>
        {peliTeksti()}
        <button onClick={() => {
          paivitaLauta(generoiMiinat(9, 9, 10))
          paivitaSolut(9*9)
          paivitaLiputetut(0)
          vaihdaTaso(0)
          paivitaPeli(true)
        }}>Helppo</button>
        <button onClick={() => {
          paivitaLauta(generoiMiinat(16, 16, 40))
          paivitaSolut(16*16)
          vaihdaTaso(1)
          paivitaLiputetut(0)
          paivitaPeli(true)
        }}>Keskitaso</button>
        <button onClick={() => {
          paivitaLauta(generoiMiinat(16, 32, 99))
          paivitaSolut(30*16)
          vaihdaTaso(2)
          paivitaLiputetut(0)
          paivitaPeli(true)
        }}>Vaikea</button>
        
        <p>{"Miinoja: " + (koot[vaikeustaso][2] - liputettuja)}</p>
      </div>
      

      <div id="peli">
        <Ruudukko peliLauta={peliLauta} onLeftClick={paljastaRuutu} onRightClick={liputa}/>
      </div>
    </div>
  );
}

export default App;